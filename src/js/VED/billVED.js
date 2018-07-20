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
        $.post(global.orderInfo,
            {"orderId": this.props.dataSource.code},
            (json) => {
                let child = [];
                let label;
                for (let i in json) {
                    switch (i) {
                        case 'code':
                            label = '订单编号';
                            break;
                        case 'productName':
                            label = '商品名称';
                            break;
                        case 'unit':
                            label = '商品单位';
                            break;
                        case 'number':
                            label = '商品数量';
                            break;
                        case 'totalAmount':
                            label = '总金额';
                            break;
                        case 'supplierName':
                            label = '供应商';
                            break;
                        case 'ispayment':
                            label = json[i];
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
            name: null,
            unit: null,
            amount: null,
            sum: null,
            supplier: null,
            payment: null,
        };
        this.supplierMap = {};
    }

    autoSaveData = (target) => {
        switch (target.id) {
            case '订单编号':
                this.values.code = target.value;
                break;
            case '商品名称':
                this.values.name = target.value;
                break;
            case '商品单位':
                this.values.unit = target.value;
                break;
            case '商品数量':
                this.values.amount = target.value;
                break;
            case '总金额':
                this.values.sum = target.value;
                break;
            case '供应商':
                this.values.supplier = target.value;
                break;
            case '是否付款':
                this.values.payment = target.value;
                break;
        }
    };

    getSuppliers = () => {
        $.get(global.findAllSupplier, (data) => {
            for (let i in data) {
                let obj = data[i];
                this.supplierMap[obj.supplierName] = obj.supplierId;
            }
        });
    };

    fetchData = (code) => {
        // TODO: 接入账单详情查询API
        $.post(global.orderInfo,
            {"orderId": this.props.dataSource.code},
            (json) => {
                let child = [];
                let label;
                for (let i in json) {
                    switch (i) {
                        case 'code':
                            label = '订单编号';
                            break;
                        case 'productName':
                            label = '商品名称';
                            break;
                        case 'unit':
                            label = '商品单位';
                            break;
                        case 'number':
                            label = '商品数量';
                            break;
                        case 'totalAmount':
                            label = '总金额';
                            break;
                        case 'supplierName':
                            label = '供应商';
                            break;
                        case 'ispayment':
                            label = '是否付款';
                            break;
                    }
                    let childComponent;
                    if (i === 'ispayment') {
                        childComponent = (
                            <Select onChange={value => this.autoSaveData({id: '是否付款', value: value})}
                                    defaultValue={json[i]}>
                                <Option key={'已付款'}>已付款</Option>
                                <Option key={'未付款'}>未付款</Option>
                            </Select>
                        );
                    } else {
                        childComponent =
                            <Input id={label} onChange={e => this.autoSaveData(e.target)} defaultValue={json[i]}/>;
                    }
                    child.push(
                        <Item key={label}>
                            <label htmlFor="">{label}</label>
                            {childComponent}
                        </Item>
                    );
                }
                this.values = {
                    code: json['code'],
                    name: json['productName'],
                    unit: json['unit'],
                    amount: json['number'],
                    sum: json['totalAmount'],
                    supplier: json['supplierName'],
                    payment: json['ispayment']
                };
                this.setState({
                    child: child,
                    loading: false,
                });
            });
        this.getSuppliers();
    };

    componentDidMount() {
        this.fetchData(this.props.dataSource.code);
    }

    submit = () => {
        this.setState({confirmLoading: true});
        $.post(global.updateOrder,
            {
                'orderId': this.values.code,
                'productName': this.values.name,
                'productUnit': this.values.unit,
                'productNumber': this.values.amount,
                'totalAmount': this.values.sum,
                'suppliersId': this.supplierMap[this.values.supplier],
                'ispayment': this.values.payment,
            },
            (data) => {
                if (data != null && data.code === '200') {
                    message.success('修改保存成功！');
                    this.props.show(false);
                    this.props.refresh();
                } else {
                    message.error('保存失败，请重试！');
                }
                this.setState({confirmLoading: false})
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
            child: null,
            confirmLoading: false,
            supplierList: []
        };
        this.values = {
            code: null,
            name: null,
            unit: null,
            amount: null,
            sum: null,
            supplier: null,
            payment: null,
        };
        this.supplierMap = {};
        fetch(global.findAllSupplier, {
            method: 'GET', // or 'PUT'
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        })
            .then(data => data.json())
            .then(json => {
                let supplierList = [];
                for (let i in json) {
                    let obj = json[i];
                    this.supplierMap[obj.supplierName] = obj.supplierId;
                    supplierList.push(<Option key={obj.supplierId}>{obj.supplierName}</Option>)
                }
                this.setState({supplierList: supplierList});
            })
    }

    autoSaveData = (target) => {
        switch (target.id) {
            case '订单编号':
                this.values.code = target.value;
                break;
            case '商品名称':
                this.values.name = target.value;
                break;
            case '商品单位':
                this.values.unit = target.value;
                break;
            case '商品数量':
                this.values.amount = target.value;
                break;
            case '总金额':
                this.values.sum = target.value;
                break;
            case '供应商':
                this.values.supplier = target.value;
                break;
            case '是否付款':
                this.values.payment = target.value;
                break;
        }
    };

    submit = () => {
        this.setState({confirmLoading: true});
        // TODO: 账单编辑提交API接入
        $.post(global.addOrder,
            {
                'orderId': this.values.code,
                'productName': this.values.name,
                'productUnit': this.values.unit,
                'productNumber': this.values.amount,
                'totalAmount': this.values.sum,
                'suppliersId': this.values.supplier,
                'ispayment': this.values.payment,
                'orderCreateDate': new Date().toLocaleDateString().replace(/\//g, '-')
            },
            (data) => {
                if (data != null && data.code === '200') {
                    message.success('新的账单添加成功！');
                    this.props.show(false);
                    this.refresh();
                } else {
                    message.error('添加失败，服务器返回：' + data);
                }
                this.setState({confirmLoading: false})
            }
        );
    };

    render() {
        return (
            <Modal
                title={'添加账单'}
                visible={this.props.isShow}
                confirmLoading={this.state.confirmLoading}
                onOk={this.submit}
                onCancel={() => this.props.show(false)}
            >
                <Card>
                    <Form>
                        <Item key={'订单编号'}>
                            <label htmlFor="">{'订单编号'}</label>
                            <Input id={'订单编号'} key={'订单编号'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'商品名称'}>
                            <label htmlFor="">{'商品名称'}</label>
                            <Input id={'商品名称'} key={'商品名称'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'商品单位'}>
                            <label htmlFor="">{'商品单位'}</label>
                            <Input id={'商品单位'} key={'商品单位'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'商品数量'}>
                            <label htmlFor="">{'商品数量'}</label>
                            <Input id={'商品数量'} key={'商品数量'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'总金额'}>
                            <label htmlFor="">{'总金额'}</label>
                            <Input id={'总金额'} key={'总金额'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'供应商'}>
                            <label htmlFor="">{'供应商'}</label>
                            <Select id={'供应商'} key={'供应商'}
                                    onChange={value => this.autoSaveData({id: '供应商', value: value})}>
                                {this.state.supplierList}
                            </Select>
                        </Item>
                        <Item key={'是否付款'}>
                            <label htmlFor="">{'是否付款'}</label>
                            <br/>
                            <Group onChange={e => this.autoSaveData({id: '是否付款', value: e.target.value})}>
                                <Radio value={'已付款'}>已付款</Radio>
                                <Radio value={'未付款'}>未付款</Radio>
                            </Group>
                        </Item>
                    </Form>
                </Card>
            </Modal>
        );
    }
}