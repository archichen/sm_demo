import React, {Component} from "react";
import '../App.css';
import '../css/font-awesome.min.css';
import $ from 'jquery';
import { DetailView, EditView, AddView } from './userVED';
import global from '../Global';
import {
    message,
    Layout,
    Modal,
    Avatar,
    Row,
    Col,
    Table,
    Input,
    Button,
} from "antd";

const {Content, Header} = Layout;
const {Column} = Table;
const {confirm} = Modal;

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false,
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
        fetch(global.findAllUser,
            {
                method: 'GET', // or 'PUT'
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(data => data.json())
            .then(json => {
                let tableRowArr = [];
                for (let i in json) {
                    let userObj = json[i];
                    tableRowArr.push({
                        key: i,
                        code: userObj.code,
                        name: userObj.name,
                        age: userObj.age,
                        sex: userObj.sex,
                        phone: userObj.phone,
                        role: userObj.role
                    });
                }
                this.dataSourceStore = tableRowArr;
                this.dataSourceStore2 = tableRowArr;
                this.setState({
                    loading: false,
                    dataSource: tableRowArr,
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
            content: '是否删除用户：' + record.name + '，编号：' + record.code + '的用户？',
            onOk: () =>
                new Promise((resolve, reject) => {
                    // TODO: 账单删除API接入
                    $.post(global.deleteUser,
                        {
                            'userId': record.code
                        },
                        (data)=>{
                            if (data != null && data.code === '200') {
                                message.success('删除成功！');
                                this.fetchData();
                                resolve()
                            } else {
                                message.error('删除失败');
                                reject()
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
                            <Input onChange={({target:{value}})=>{this.onSearchInputChanged(value)}} style={{maxWidth: '200px'}} placeholder={'请输入用户名称'}/>
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
                            title={'用户编码'}
                            dataIndex={'code'}
                            key={'code'}
                        />
                        <Column
                            title={'用户名称'}
                            dataIndex={'name'}
                            key={'name'}
                        />
                        <Column
                            title={'性别'}
                            dataIndex={'sex'}
                            key={'sex'}
                        />
                        <Column
                            title={'年龄'}
                            dataIndex={'age'}
                            key={'age'}
                        />
                        <Column
                            title={'电话'}
                            dataIndex={'phone'}
                            key={'phone'}
                        />
                        <Column
                            title={'用户类型'}
                            dataIndex={'role'}
                            key={'role'}
                        />
                        <Column
                            title={<Button onClick={this.showAddView} type={'primary'} icon={'plus-circle-o'}>添加用户</Button>}
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
