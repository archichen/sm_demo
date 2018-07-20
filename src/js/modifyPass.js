import React, {Component} from 'react';
import {Form, Icon, Input, Button, Layout, Steps, Modal, Row, Col, Carousel, Alert } from 'antd';
import $ from 'jquery';
import global from '../Global';

const FormItem = Form.Item;
const {Content, Header} = Layout;
const Step = Steps.Step;

class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            loading: false
        };
        this.values = {
            oldPassword: null,
            newPassword: null,
            repeatPassword: null,
        };
    }

    stepTo = (stepNumber) => {
        this.CarouselRef.goTo(stepNumber);
        this.setState({
            currentStep: stepNumber
        });
    };

    render() {
        return (
            <Layout>
                <Content style={{background: 'white', padding: '5px', margin: '5px'}}>
                    <Row>
                        <Col span={4}/>
                        <Col span={16}>
                            <Steps current={this.state.currentStep} style={{marginTop: '50px'}}>
                                <Step onClick={()=>{
                                    this.stepTo(0);
                                }} title="第一步" description="输入你的原始密码"/>
                                <Step onClick={()=>{
                                    this.stepTo(1);
                                }}  title="第二步" description="输入新的密码"/>
                                <Step onClick={()=>{
                                    this.stepTo(2);
                                }}  title="第三步" description="重复输入的密码"/>
                                <Step onClick={()=>{
                                    this.stepTo(3);
                                }}  title="第四步" description="确认修改"/>
                                <Step onClick={()=>{
                                    this.stepTo(4);
                                }}  title="第五步" description="修改完成！"/>
                            </Steps>
                        </Col>
                        <Col span={4}/>
                    </Row>
                    <Row>
                        <Col span={7}/>
                        <Col span={10} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Form style={{width: '300px', marginTop: '100px'}} onSubmit={this.handleSubmit}
                                  className="login-form">
                                <Carousel ref={(ref)=>this.CarouselRef = ref} dots={false}>
                                    <FormItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <label htmlFor="">输入你的原始密码：</label>
                                            <Input onChange={e=>this.values.oldPassword = e.target.value} prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                   placeholder="原始密码"/>
                                        <Row style={{marginTop: '25px'}}>
                                            <Col span={6}/>
                                            <Col span={12} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Button style={{display: 'inline-block'}} type={'primary'}
                                                        shape="circle"
                                                        icon={'arrow-right'} size={'large'}
                                                        onClick={()=>{
                                                            if (this.values.oldPassword == null || this.values.oldPassword === '') {
                                                                Modal.error({
                                                                    title: 'Oops~',
                                                                    content: '大兄弟，可不能啥都不填啊'
                                                                });
                                                            }  else {
                                                                this.stepTo(1);
                                                            }
                                                        }}
                                                />
                                            </Col>
                                            <Col span={6}/>
                                        </Row>
                                    </FormItem>
                                    <FormItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <label htmlFor="">输入新的密码：</label>
                                            <Input onChange={e=>this.values.newPassword = e.target.value} prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                   type="password"
                                                   placeholder="新密码"/>
                                        <Row style={{marginTop: '25px'}}>
                                            <Col span={6}/>
                                            <Col span={12} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Button style={{display: 'inline-block'}} type={'primary'}
                                                        shape="circle"
                                                        icon={'arrow-right'} size={'large'}
                                                        onClick={()=>{
                                                            if (this.values.newPassword == null || this.values.newPassword === '') {
                                                                Modal.error({
                                                                    title: 'Oops~',
                                                                    content: '写点啥吧~'
                                                                });
                                                            }  else {
                                                                this.stepTo(2);
                                                            }
                                                        }}
                                                />
                                            </Col>
                                            <Col span={6}/>
                                        </Row>
                                    </FormItem>
                                    <FormItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <label htmlFor="">重复输入的密码：</label>
                                            <Input onChange={e=>this.values.repeatPassword = e.target.value} prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                   type="password"
                                                   placeholder="重复密码"/>
                                        <Row style={{marginTop: '25px'}}>
                                            <Col span={6}/>
                                            <Col span={12} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Button style={{display: 'inline-block'}} type={'primary'}
                                                        shape="circle"
                                                        icon={'arrow-right'} size={'large'}
                                                        onClick={()=>{
                                                            if (this.values.repeatPassword == null || this.values.repeatPassword === '') {
                                                                Modal.error({
                                                                    title: 'Oops~',
                                                                    content: '不填不给你过！'
                                                                });
                                                            }  else if (this.values.repeatPassword !== this.values.newPassword) {
                                                                Modal.error({
                                                                    title: 'Oops~',
                                                                    content: '两次输入的密码不一致，检查后重新输入。'
                                                                });
                                                            } else {
                                                                this.stepTo(3);
                                                            }
                                                        }}
                                                />
                                            </Col>
                                            <Col span={6}/>
                                        </Row>
                                    </FormItem>
                                    <FormItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <label htmlFor="">确定修改密码吗？</label>
                                        <br/>
                                        <Button type="primary" htmlType="submit" className="login-form-button"
                                                onClick={()=>{
                                                    $.post(global.changePassword,
                                                        {
                                                            userId: global.user.userId,
                                                            password: this.values.newPassword
                                                        },
                                                        (data)=>{
                                                            if (data != null && data.code === '200') {
                                                                this.stepTo(4);
                                                            } else {
                                                                Modal.error({
                                                                    title: 'Oops~',
                                                                    content: '发生了一点错误：' + data
                                                                });
                                                            }
                                                        });
                                                }}>
                                            嗯呐
                                        </Button>
                                    </FormItem>
                                    <FormItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <Alert message="修改成功！" type="success" />
                                    </FormItem>
                                </Carousel>
                            </Form>
                        </Col>
                        <Col span={7}/>
                    </Row>
                </Content>
            </Layout>
        );
    }
}

const ModifyPass = Form.create()(NormalLoginForm);
export {
    ModifyPass
}