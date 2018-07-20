import React, {Component} from "react";
import './App.css';
import './css/font-awesome.min.css';
import logo from './assets/logo.png';
import {
    Layout,
    Menu,
    Icon,
    Cascader,
    Avatar,
    Row,
    Col,
    Table,
    Input,
    Select
} from "antd";
import {ModifyPass} from './js/modifyPass';
import Bill from './js/bill';
import Supplier from './js/supplier';
import User from './js/user';
import {Login} from './js/login';
import global from "./Global";
const {Content, Header, Sider} = Layout;
const {Item, Divider, ItemGroup} = Menu;
const {Option} = Select;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: <Bill setDetailViewDataSource={this.setDetailViewDataSource} onRef={this.refBill}/>,
            showLogin: true,
            isLogin: false,
            userRole: 'admin',
            showDetailView: false,
            showEditView: false,
            showDeleteView: false,
        };
    }

    loadPage = (page) => {
        switch (page) {
            case 'bill':
                this.loadBill();
                break;
            case 'supplier':
                this.loadSupplier();
                break;
            case 'user':
                this.loadUser();
                break;
            case 'modifyPass':
                this.loadModifyPass();
                break;
        }
    };

    loadModifyPass = () => {
        this.setState({
            currentPage: <ModifyPass />
        });
    };

    loadBill = () => {
        this.setState({
            currentPage: <Bill onRef={this.refBill}/>
        });
        this.bill && this.bill.fetchData();
    };

    loadSupplier = () => {
        this.setState({
            currentPage: <Supplier onRef={this.refSupplier}/>
        });
        this.supplier && this.supplier.fetchData();
    };

    loadUser = () => {
        this.setState({
            currentPage: <User onRef={this.refUser}/>
        });
        this.user && this.user.fetchData();
    };

    refBill = (ref) => {
        this.bill = ref;
    };

    refSupplier = (ref) => {
        this.supplier = ref;
    };

    refUser = (ref) => {
        this.user = ref;
    };

    showLoginFunc = () => {
        this.setState({showLogin: false, isLogin: true});
    };

    goToLogin =() => {
        this.setState({showLogin: true, isLogin: false});
    };

    render() {
        let component;
        let menus = [];
        let billItem = <Item key={'0'} onClick={()=>this.loadPage('bill')}><Icon type="book"/>账单管理</Item>;
        let supplierItem = <Item key={'1'} onClick={()=>this.loadPage('supplier')}><Icon type="solution"/>供应商管理</Item>;
        let userItem = <Item key={'2'} onClick={()=>this.loadPage('user')}><Icon type="user"/>用户管理</Item>
        if (this.state.isLogin) {
            switch (global.user.roleName) {
                case '经理':
                    menus.push(billItem, supplierItem);
                    break;
                case '管理员':
                    menus.push(billItem, supplierItem, userItem);
                    break;
                case '普通用户':
                    menus.push(billItem);
                    break;
            }
        }
        const main = (
            <Layout className={'container'}>
                <Sider style={{background: 'white'}}>
                    <Header className={'logoArea'}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <img src={logo} className={'logo'} alt=""/>
                            <span>SBSM</span>
                        </div>
                    </Header>
                    <Menu defaultSelectedKeys={['0']}>
                        {menus}
                        <Divider/>
                        <ItemGroup title={'Security'}>
                            <Item key={'3'} onClick={()=>this.loadPage('modifyPass')}><Icon type="key"/>密码修改</Item>
                            <Item key={'4'} className={'logout'} onClick={()=>{
                                this.setState({showLogin: true, isLogin: false})
                            }}><Icon type="logout"/>退出系统</Item>
                        </ItemGroup>
                    </Menu>
                </Sider>
                {this.state.currentPage}
            </Layout>
        );
        const login = <Login showLogin={this.showLoginFunc}/>;
        if (this.state.showLogin) {
            component = login;
        } else {
            component = main
        }
        if (!this.state.isLogin) {
            component = login;
        }
        return (
            <div className={'container'}>
                {component}
            </div>
        );
    }
}

export default App;
