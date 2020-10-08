import React, {
    Component
} from 'react'
import {NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {login} from '../../redux/actions'
import Logo from '../../components/logo/logo'
class Login extends Component {
    state = {
        username:'',
        password:''
    }

    login = ()=>{
        //console.log(this.state)
        this.props.login(this.state)
    }

    handleChange = (key,val)=>{
        this.setState({
            [key]:val
        })
    }

    toRegister = ()=>{
        this.props.history.replace('/register')
    }
    render() {
        const {msg,redirectTo} = this.props.user
        //如果有重定向地址
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return <div>
            <NavBar>语&nbsp;聊</NavBar>
            <Logo/>
            <WingBlank>
                <List>
                    {msg?<div className="error-msg">{msg}</div>:null}
                    <InputItem placeholder="请输入用户名" onChange={val=>{this.handleChange('username',val)}}>用户名:</InputItem>
                    <InputItem placeholder="请输入密码" type="password" onChange={val=>{this.handleChange('password',val)}}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                </List>
                <WhiteSpace></WhiteSpace>
                <Button type="primary" onClick={this.login}>登录</Button>
                <WhiteSpace></WhiteSpace>
                <Button onClick={this.toRegister}>还没有账户</Button>
            </WingBlank>
        </div>
    }
}
export default connect(
    state=>({user:state.user}),
    {login}
)(Login)