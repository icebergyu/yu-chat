import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {NavBar,InputItem,Button} from 'antd-mobile'
import AvatarSelector from '../../components/avatar-selector/avatar-selector'
import { updateUser } from '../../redux/actions'
class ReactInfo extends Component{
    state={
        avatar:'',
        cli:'',
        router:'',
        state:''
    }
    setAvatar = (avatar)=>{
        this.setState({
            avatar
        })
    }
    handleChange = (key,val)=>{
        this.setState({
            [key]:val
        })
    }
    save = ()=>{
        this.props.updateUser(this.state)
    }
    render(){
        const {avatar,type} = this.props.user
        //信息已经完善
        if(avatar){
            const path = type==='vue'?'/vue':'/react'
            return <Redirect to={path}/>
        }
        return (
            <div>
                <NavBar>React-Info</NavBar>
                <AvatarSelector setAvatar = {this.setAvatar}></AvatarSelector>
                <InputItem placeholder="脚手架">cli:</InputItem>
                <InputItem placeholder="路由">router:</InputItem>
                <InputItem placeholder="状态管理">state:</InputItem>
                <Button onClick={this.save} type="primary" size="small" inline style={{width:'50%',marginTop:'20px', marginLeft:'50%',transform:'translateX(-50%)'}}>保&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {updateUser}
)(ReactInfo)