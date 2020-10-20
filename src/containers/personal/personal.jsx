import React,{Component} from 'react'
import {Result,List,WhiteSpace,Button, Modal} from 'antd-mobile'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {resetUser} from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief
class Personal extends Component{
    logOut = () => {
        Modal.alert('退出','确定退出登录吗?',[
            {
                text:'取消'
            },
            {
                text:'确定',
                onPress:()=>{
                    Cookies.remove('userid')
                    this.props.resetUser()
                }
            }
        ])
    }
    render(){
        const {username,type,avatar,cli,router,state} = this.props.user
        return (
            <div style={{marginBottom:50,marginTop:50}}>
                <Result 
                img={<img src={require(`../../assets/images/${avatar}.png`)} style={{width:50}} alt="avatar"/>} 
                title={username}
                message={type}/>

                <List renderHeader={()=>'相关信息'}>
                    <Item multipleLine>
                        <Brief>cli:{cli}</Brief>
                        <Brief>router:{router}</Brief>
                        <Brief>state:{state}</Brief>
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button type="warning" onClick={this.logOut}>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {resetUser}
)(Personal)