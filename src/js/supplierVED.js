import React, {Component} from "react";
import '../css/font-awesome.min.css';
import {
    Radio,
    Modal,
    Card,
    Form,
    Input,
    Select,
    message
} from "antd";
import $ from 'jquery';
import '../css/billVED.css';
import global from '../Global';

const {Meta} = Card;
const {Item} = Form;
const {Option} = Select;
const {Group} = Radio;

export class DetailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            child: null
        };
    }

    fetchData = (code) => {
        // TODO: 接入账单详情查询API
        $.post(global.supplierInfo,
            {"supplierId": this.props.dataSource.supplierId},
            (json) => {
                let child = [];
                let label;
                for (let i in json) {
                    switch (i) {
                        case 'code':
                            label = '供应商编码';
                            break;
                        case 'contact':
                            label = '联系人';
                            break;
                        case 'descirption':
                            label = '描述';
                            break;
                        case 'fax':
                            label = '传真';
                            break;
                        case 'phone':
                            label = '联系电话';
                            break;
                        case 'supplierName':
                            label = '供应商名称';
                            break;
                        default:
                            break;
                    }
                    child.push(<Meta key={label} title={label} description={<p>&emsp;{json[i]}</p>}/>);
                }
                this.setState({child: child, loading: false});
            });
    };

    componentDidMount() {
        this.fetchData(this.props.dataSource.code);
    }

    render() {
        return (
            <Modal
                title={'查看账单'}
                visible={this.props.isShow}
                onOk={() => this.props.show(false)}
                onCancel={() => this.props.show(false)}
            >
                <Card loading={this.state.loading}>
                    {this.state.child}
                </Card>
            </Modal>
        );
    }
}

export class EditView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            child: null,
            confirmLoading: false
        };
        this.values = {
            code: null,
            contact: null,
            descirption: null,
            fax: null,
            phone: null,
            supplierName: null,
            address: null
        };
    }

    autoSaveData = (target) => {
        switch (target.id) {
            case '供应商编码':
                this.values.code = target.value;
                break;
            case '联系人':
                this.values.contact = target.value;
                break;
            case '描述':
                this.values.descirption = target.value;
                break;
            case '传真':
                this.values.fax = target.value;
                break;
            case '联系电话':
                this.values.phone = target.value;
                break;
            case '供应商名称':
                this.values.supplierName = target.value;
                break;
            case '联系地址':
                this.values.address = target.value;
        }
        console.log(this.values)
    };

    fetchData = (code) => {
        // TODO: 接入账单详情查询API
        $.post(global.supplierInfo,
            {"supplierId": this.props.dataSource.supplierId},
            (json) => {
                let child = [];
                let label;
                for (let i in json) {
                    switch (i) {
                        case 'code':
                            label = '供应商编码';
                            break;
                        case 'contact':
                            label = '联系人';
                            break;
                        case 'descirption':
                            label = '描述';
                            break;
                        case 'fax':
                            label = '传真';
                            break;
                        case 'phone':
                            label = '联系电话';
                            break;
                        case 'supplierName':
                            label = '供应商名称';
                            break;
                        default:
                            break;
                    }
                    let childComponent = <Input id={label} onChange={e => this.autoSaveData(e.target)}
                                                defaultValue={json[i]}/>;
                    child.push(
                        <Item key={label}>
                            <label htmlFor="">{label}</label>
                            {childComponent}
                        </Item>
                    );
                }
                this.values = {
                    code: json['code'],
                    contact: json['contact'],
                    descirption: json['descirption'],
                    fax: json['fax'],
                    phone: json['phone'],
                    supplierName: json['supplierName'],
                };
                this.setState({
                    child: child,
                    loading: false,
                });
            });
    };

    componentDidMount() {
        this.fetchData(this.props.dataSource.code);
    }

    submit = () => {
        this.setState({confirmLoading: true});
        // TODO: 账单编辑提交API接入
        $.post(global.updateSupplier,
            {
                'supplierId': this.values.code,
                'supplierName': this.values.supplierName,
                'supplierContact': this.values.contact,
                'supplierTel': this.values.phone,
                'supplierAddress': this.values.address,
                'supplierFax': this.values.fax,
                'supplierDescription': this.values.descirption,
                // 'supplierCreateDate': new Date().toLocaleDateString().replace(/\//g, '-')
            },
            (data) => {
                // TODO: 编辑API无效
                if (data != null && data.code === '200') {
                    message.success('编辑保存成功！');
                    this.props.refresh();
                    this.props.show(false);
                } else {
                    message.error('编辑失败');
                    this.setState({confirmLoading: false})
                }
            }
        );

    };

    render() {
        return (
            <Modal
                title={'编辑账单'}
                visible={this.props.isShow}
                confirmLoading={this.state.confirmLoading}
                onOk={this.submit}
                onCancel={() => this.props.show(false)}
            >
                <Card loading={this.state.loading}>
                    <Form>
                        {this.state.child}
                        <Item key={'联系地址'}>
                            <label htmlFor="">联系地址</label>
                            <Input id={'联系地址'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                    </Form>
                </Card>
            </Modal>
        );
    }
}

export class AddView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            child: null,
            confirmLoading: false
        };
        this.values = {
            code: null,
            contact: null,
            descirption: null,
            fax: null,
            phone: null,
            supplierName: null,
            address: null
        };
    }

    autoSaveData = (target) => {
        switch (target.id) {
            case '供应商编码':
                this.values.code = target.value;
                break;
            case '联系人':
                this.values.contact = target.value;
                break;
            case '描述':
                this.values.descirption = target.value;
                break;
            case '传真':
                this.values.fax = target.value;
                break;
            case '联系电话':
                this.values.phone = target.value;
                break;
            case '供应商名称':
                this.values.supplierName = target.value;
                break;
            case '联系地址':
                this.values.address = target.value;
        }
        console.log(this.values)
    };

    submit = () => {
        this.setState({confirmLoading: true});
        // TODO: 账单编辑提交API接入
        $.post(global.addSupplier,
            {
                'supplierId': this.values.code,
                'supplierName': this.values.supplierName,
                'supplierContact': this.values.contact,
                'supplierTel': this.values.phone,
                'supplierAddress': this.values.address,
                'supplierFax': this.values.fax,
                'supplierDescription': this.values.descirption,
                'supplierCreateDate': new Date().toLocaleDateString().replace(/\//g, '-')
            },
            (data) => {
                // TODO: 编辑API无效
                if (data != null && data.code === '200') {
                    message.success('供应商添加成功！');
                    this.props.show(false);
                    this.props.refresh();
                } else {
                    message.error('供应商添加失败');
                    this.setState({confirmLoading: false})
                }
            }
        );
        this.props.show(false);
        this.setState({confirmLoading: false})
    };

    render() {
        return (
            <Modal
                title={'编辑账单'}
                visible={this.props.isShow}
                confirmLoading={this.state.confirmLoading}
                onOk={this.submit}
                onCancel={() => this.props.show(false)}
            >
                <Card>
                    <Form>
                        <Item key={'供应商编码'}>
                            <label htmlFor="">供应商编码</label>
                            <Input id={'供应商编码'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'联系人'}>
                            <label htmlFor="">联系人</label>
                            <Input id={'联系人'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'描述'}>
                            <label htmlFor="">描述</label>
                            <Input id={'描述'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'传真'}>
                            <label htmlFor="">传真</label>
                            <Input id={'传真'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'联系电话'}>
                            <label htmlFor="">联系电话</label>
                            <Input id={'联系电话'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'供应商名称'}>
                            <label htmlFor="">供应商名称</label>
                            <Input id={'供应商名称'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'联系地址'}>
                            <label htmlFor="">联系地址</label>
                            <Input id={'联系地址'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                    </Form>
                </Card>
            </Modal>
        );
    }
}