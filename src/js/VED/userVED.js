import React, {Component} from "react";
import '../css/font-awesome.min.css';
import {
    Radio,
    Modal,
    Card,
    Form,
    Input,
    Select,
} from "antd";
import $ from 'jquery';
import '../css/billVED.css';
import global from '../Global';
import {message} from "antd/lib/index";

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
        // console.log(this.props.dataSource);
        $.post(global.userInfo,
            {"userId": this.props.dataSource.code},
            (json) => {
                let child = [];
                let label;
                for (let i in json) {
                    switch (i) {
                        case 'code':
                            label = '用户编号';
                            break;
                        case 'address':
                            label = '用户地址';
                            break;
                        case 'birthday':
                            label = '出生日期';
                            break;
                        case 'name':
                            label = '用户名称';
                            break;
                        case 'phone':
                            label = '用户电话';
                            break;
                        case 'role':
                            label = '用户类别';
                            break;
                        case 'sex':
                            label = '用户性别';
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
                title={'查看用户'}
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
            address: null,
            birthday: null,
            name: null,
            phone: null,
            role: null,
            sex: null,
            password: null,
        };
    }

    autoSaveData = (target) => {
        switch (target.id) {
            case '用户编号':
                this.values.code = target.value;
                break;
            case '用户地址':
                this.values.address = target.value;
                break;
            case '出生日期':
                this.values.birthday = target.value;
                break;
            case '用户名称':
                this.values.name = target.value;
                break;
            case '用户电话':
                this.values.phone = target.value;
                break;
            case '用户类别':
                this.values.role = target.value;
                break;
            case '用户性别':
                this.values.sex = target.value;
                break;
            case '用户密码':
                this.values.password = target.value;
                break;

        }
        console.log(this.values)
    };

    fetchData = (code) => {
        // TODO: 接入账单详情查询API
        $.post(global.userInfo,
            {"userId": this.props.dataSource.code},
            (json) => {
                let child = [];
                let label;
                for (let i in json) {
                    switch (i) {
                        case 'code':
                            label = '用户编号';
                            break;
                        case 'address':
                            label = '用户地址';
                            break;
                        case 'birthday':
                            label = '出生日期';
                            break;
                        case 'name':
                            label = '用户名称';
                            break;
                        case 'phone':
                            label = '用户电话';
                            break;
                        case 'role':
                            label = '用户类别';
                            break;
                        case 'sex':
                            label = '用户性别';
                            break;
                        default:
                            break;
                    }
                    let childComponent;
                    if (i === 'sex') {
                        childComponent = (
                            <Select
                                onChange={value => this.autoSaveData({id: '用户性别', value: value})}
                                defaultValue={json[i]}>
                                <Option key={'男'}>男</Option>
                                <Option key={'女'}>女</Option>
                            </Select>
                        );
                    } else if (i === 'role') {
                        childComponent = (
                            <Select
                                onChange={value => this.autoSaveData({id: '用户类别', value: value})}
                                defaultValue={json[i]}>
                                <Option key={'管理员'}>管理员</Option>
                                <Option key={'经理'}>经理</Option>
                                <Option key={'普通用户'}>普通用户</Option>
                            </Select>
                        );
                    } else {
                        childComponent = <Input id={label} onChange={e => this.autoSaveData(e.target)}
                                                defaultValue={json[i]}/>;
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
                    address: json['address'],
                    birthday: json['birthday'],
                    name: json['name'],
                    phone: json['phone'],
                    role: json['role'],
                    sex: json['sex']
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
        $.post(global.updateUser,
            {
                'userId': this.values.code,
                'userAddress': this.values.address,
                'userDateBirth': new Date().toLocaleDateString().replace(/\//g, '-'),
                'userName': this.values.name,
                'userTel': this.values.phone,
                'roleName': this.values.role,
                'userSex': this.values.sex,
            },
            (data) => {
                if (data != null && data.code === '200') {
                    message.success('编辑保存成功！');
                    this.props.show(false);
                    this.props.refresh();
                } else {
                    message.error('编辑保存失败');
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
            address: null,
            birthday: null,
            name: null,
            phone: null,
            role: null,
            sex: null,
            password: null
        };
    }

    autoSaveData = (target) => {
        switch (target.id) {
            case '用户编号':
                this.values.code = target.value;
                break;
            case '用户地址':
                this.values.address = target.value;
                break;
            case '出生日期':
                this.values.birthday = target.value;
                break;
            case '用户名称':
                this.values.name = target.value;
                break;
            case '用户电话':
                this.values.phone = target.value;
                break;
            case '用户类别':
                this.values.role = target.value;
                break;
            case '用户性别':
                this.values.sex = target.value;
                break;
            case '用户密码':
                this.values.password = target.value;
                break;
        }
        console.log(this.values)
    };


    submit = () => {
        this.setState({confirmLoading: true});
        // TODO: 账单编辑提交API接入
        $.post(global.addUser,
            {
                'userId': this.values.code,
                'userName': this.values.name,
                'userPassword': this.values.password,
                'userSex': this.values.sex,
                'userDateBirth': this.values.birthday,
                'userTel': this.values.phone,
                'userAddress': this.values.address,
                'roleName': this.values.role,
            },
            (data) => {
                // TODO: 编辑API无效
                if (data != null && data.code === '200') {
                    message.success('添加用户成功！');
                    this.props.show(false);
                    this.props.refresh();
                } else {
                    message.error('添加用户失败');
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
                <Card>
                    <Form>
                        <Item key={'用户编号'}>
                            <label htmlFor="">用户编号</label>
                            <Input id={'用户编号'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'用户地址'}>
                            <label htmlFor="">用户地址</label>
                            <Input id={'用户地址'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'出生日期'}>
                            <label htmlFor="">出生日期</label>
                            <Input id={'出生日期'} onChange={e => this.autoSaveData(e.target)} placeholder={'必须为：yyyy-mm-dd格式'}/>
                        </Item>
                        <Item key={'用户名称'}>
                            <label htmlFor="">用户名称</label>
                            <Input id={'用户名称'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'用户密码'}>
                            <label htmlFor="">用户密码</label>
                            <Input id={'用户密码'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'用户电话'}>
                            <label htmlFor="">用户电话</label>
                            <Input id={'用户电话'} onChange={e => this.autoSaveData(e.target)}/>
                        </Item>
                        <Item key={'用户类别'}>
                            <label htmlFor="">用户类别</label>
                            <Select
                                onChange={value => this.autoSaveData({id: '用户类别', value: value})}>
                                <Option key={'管理员'}>管理员</Option>
                                <Option key={'经理'}>经理</Option>
                                <Option key={'普通用户'}>普通用户</Option>
                            </Select>
                        </Item>
                        <Item key={'用户性别'}>
                            <label htmlFor="">用户性别</label>
                            <Select
                                onChange={value => this.autoSaveData({id: '用户性别', value: value})}>
                                <Option key={'男'}>男</Option>
                                <Option key={'女'}>女</Option>
                            </Select>
                        </Item>
                    </Form>
                </Card>
            </Modal>
        );
    }
}