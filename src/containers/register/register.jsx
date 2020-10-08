import React, {
    Component
} from 'react'
import {NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {register} from '../../redux/actions'
import Logo from '../../components/logo/logo'

const ListItem = List.Item
class Register extends Component {
    state = {
        username:'',
        password:'',
        confirm:'',
        type:'react',
    }

    register = ()=>{
        //console.log(this.state)
        this.props.register(this.state)
    }

    handleChange = (key,val)=>{
        this.setState({
            [key]:val
        })
    }

    toLogin = ()=>{
        this.props.history.replace('/login')
    }
    render() {
        const {type} = this.state
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
                    <InputItem type="password" onChange={val=>{this.handleChange('confirm',val)}}>确认密码:</InputItem>
                </List>
                <ListItem>
                    <span>类型:</span>
                    &nbsp;&nbsp;&nbsp;
                    <Radio checked={type==='react'} onChange={()=>{this.handleChange('type','react')}}>React</Radio>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Radio checked={type==='vue'} onChange={()=>{this.handleChange('type','vue')}}>Vue</Radio>
                </ListItem>
                <WhiteSpace></WhiteSpace>
                <Button type="primary" onClick={this.register}>注册</Button>
                <WhiteSpace></WhiteSpace>
                <Button onClick={this.toLogin}>已有账户</Button>
            </WingBlank>
        </div>
    }
}
export default connect(
    state=>({user:state.user}),
    {register}
)(Register)