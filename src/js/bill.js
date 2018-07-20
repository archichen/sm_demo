import React, {Component} from "react";
import '../App.css';
import '../css/font-awesome.min.css';
import $ from 'jquery';
import { DetailView, EditView, AddView } from './billVED';
import global from '../Global';
import {
    Layout,
    Modal,
    Avatar,
    Row,
    Col,
    Table,
    Input,
    Select,
    Button,
} from "antd";
import {message} from "antd/lib/index";

const {Content, Header} = Layout;
const {Option} = Select;
const {Column} = Table;
const {confirm} = Modal;

export default class Bill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false,
            supplierList: [],
            detailViewDataSource: null,
            editViewDataSource: null,
            isShowDetailView: false,
            isShowEditView: false,
            isShowAddView: false,
            currentSupplier: null,
        };
        this.dataSourceStore = null;
        this.dataSourceStore2 = null;
    }

    componentDidMount() {
        this.props.onRef(this);
        this.fetchData();
    }

    fetchData = () => {
        // 账单列表查询AP接入
        this.setState({loading: true});
        fetch(global.findAllOrder,
            {
                method: 'GET', // or 'PUT'
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(data => data.json())
            .then(json => {
                console.log(json)
                // TODO: 修复多个同名供应商时存在Option的key相同问题
                let supplierList = [];
                let hasSuppliers = [];
                let tableRowArr = [];
                for (let i in json) {
                    let billItemObj = json[i];
                    if (hasSuppliers.indexOf(billItemObj.supplierName) === -1){
                        supplierList.push(<Option key={billItemObj.supplierName}>{billItemObj.supplierName}</Option>);
                        hasSuppliers.push(billItemObj.supplierName);
                    }
                    tableRowArr.push({
                        key: i,
                        code: billItemObj.code,
                        name: billItemObj.productName,
                        suppliers: billItemObj.supplierName,
                        sum: billItemObj.totalAmount,
                        payment: billItemObj.ispayment,
                        time: billItemObj.createTime
                    });
                }
                this.dataSourceStore = tableRowArr;
                this.dataSourceStore2 = tableRowArr;
                this.setState({
                    loading: false,
                    dataSource: tableRowArr,
                    supplierList: supplierList
                });
            });
    };

    showDetailView = (trigger) => {
        this.setState({isShowDetailView: trigger});
    };

    showEditlView = (trigger) => {
        this.setState({isShowEditView: trigger});
    };

    showAddView = (trigger) => {
        this.setState({isShowAddView: trigger});
    };

    onSupplierChanged = (value) => {
        if (value == -1) { // 选择显示全部供应商
            this.setState({
                dataSource: this.dataSourceStore,
            });
            this.dataSourceStore2 = this.dataSourceStore;
        } else {
            let filterDataSource = [];
            for (let data in this.dataSourceStore) {
                if (this.dataSourceStore[data].suppliers === value) {
                    filterDataSource.push(this.dataSourceStore[data]);
                }
            }
            this.setState({
                dataSource: filterDataSource
            });
            this.dataSourceStore2 = filterDataSource;
        }
    };

    onSearchInputChanged = (value) => {
        let filterDataSource = [];
        if (value === '') {
            this.setState({dataSource: this.dataSourceStore2});
        } else {
            for (let data in this.state.dataSource) {
                let tmpData = this.state.dataSource[data];
                if (tmpData.name.indexOf(value) !== -1) {
                    filterDataSource.push(tmpData);
                }
            }
            if (filterDataSource.length === 0) {
                filterDataSource = this.state.dataSource.slice();
            }
            this.setState({dataSource: filterDataSource});
        }
    };

    confirmDelete = (record) => {
        confirm({
            title: '删除确认',
            content: '是否删除商品编号：' + record.code + '的商品？',
            onOk: () =>
                new Promise((resolve, reject) => {
                    // TODO: 账单删除API接入
                    $.post(global.deleteOrder,
                        {
                            'orderId': record.code
                        },
                        (data)=>{
                            if (data != null && data.code === '200') {
                                message.success('删除成功！');
                                this.fetchData();
                                resolve();
                            } else {
                                message.error('删除失败');
                                reject();
                            }
                        });
                }).catch(() => console.log('Oops errors!'))
            ,
            onCancel: () => {
                console.log('cancel')
            }
        });
    };

    render() {
        return (
            <Layout className={'rightPanel'}>
                <Header className={'searchBar'}>
                    <Row>
                        <Col span={20} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Select onChange={(value)=>this.onSupplierChanged(value)} defaultValue={'选择供应商'}>
                                <Option key={-1}>全部供应商</Option>
                                {this.state.supplierList}
                            </Select>
                            <Input onChange={({target:{value}})=>{this.onSearchInputChanged(value)}} style={{maxWidth: '200px'}} placeholder={'请输入商品名称'}/>
                        </Col>
                        <Col span={4}>
                            <Avatar style={{marginRight: '10px'}}
                                    src='https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=595771669,2766471337&fm=27&gp=0.jpg'/>
                            <span>{global.user.roleName}</span>
                        </Col>
                    </Row>
                </Header>
                <Content style={{marginTop: '5px'}}>
                    <Table style={{background: 'white'}}
                           dataSource={this.state.dataSource}
                           loading={this.state.loading}
                    >
                        <Column
                            title={'账单编码'}
                            dataIndex={'code'}
                            key={'code'}
                        />
                        <Column
                            title={'商品名称'}
                            dataIndex={'name'}
                            key={'name'}
                        />
                        <Column
                            title={'供应商'}
                            dataIndex={'suppliers'}
                            key={'suppliers'}
                        />
                        <Column
                            title={'账单金额'}
                            dataIndex={'sum'}
                            key={'sum'}
                        />
                        <Column
                            title={'是否付款'}
                            dataIndex={'payment'}
                            key={'payment'}
                        />
                        <Column
                            title={'创建时间'}
                            dataIndex={'time'}
                            key={'time'}
                        />
                        <Column
                            title={<Button onClick={this.showAddView} type={'primary'} icon={'plus-circle-o'}>添加账单</Button>}
                            key={'action'}
                            render={(record) => {
                                return (
                                    <Button.Group>
                                        <Button onClick={() => {
                                            this.setState({detailViewDataSource: record});
                                            this.showDetailView(true);
                                        }} icon={'eye-o'}/>
                                        <Button onClick={() => {
                                            this.setState({editViewDataSource: record});
                                            this.showEditlView(true);
                                        }} icon={'edit'}/>
                                        <Button onClick={() => {
                                            this.confirmDelete(record)
                                        }} type={'danger'} icon={'delete'}/>
                                    </Button.Group>
                                );
                            }
                            }
                        />
                    </Table>
                </Content>
                {this.state.isShowDetailView && <DetailView dataSource={this.state.detailViewDataSource} isShow={this.state.isShowDetailView} show={this.showDetailView}/>}
                {this.state.isShowEditView && <EditView refresh={this.fetchData} dataSource={this.state.editViewDataSource} isShow={this.state.isShowEditView} show={this.showEditlView}/>}
                {this.state.isShowAddView && <AddView refresh={this.fetchData} isShow={this.state.isShowAddView} show={this.showAddView}/>}
            </Layout>
        );
    }
}