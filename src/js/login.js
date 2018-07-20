import React, {Component} from 'react';
import {Form, Icon, Input, Button, Card, Radio, message} from 'antd';
import '../css/login.css';
import $ from 'jquery';
import global from '../Global';

const FormItem = Form.Item;
const {Button:RadioButton, Group:RadioGroup} = Radio;
export class LoginForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        // 接入登录api
        this.props.form.validateFields((err, value) => {
            if (!err) {
                $.post(global.login,
                    {
                        userName: value.userName,
                        password: value.password
                    },
                    (data)=>{
                        if (data['userId'] != null)  {
                            global.user = data;
                            this.props.showLogin(false);
                        } else {
                            message.error('登录失败，错误码：' + JSON.stringify(data));
                        }
                    });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={'login-container'}>
                <Card className={'login-card'} title={'SBMS后台登录'}>
                    <Form onSubmit={this.handleSubmit} className={'form'}>
                        <FormItem>
                            {
                                getFieldDecorator('userName', {
                                    rules: [{required: true, message: '请输入用户名'}]
                                })(
                                    <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           placeholder={'输入用户名'}/>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入密码'}]
                                })(
                                    <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           type="password"
                                           placeholder="Password"/>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="loginBtn">
                                确认
                            </Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
}

export const Login = Form.create()(LoginForm);