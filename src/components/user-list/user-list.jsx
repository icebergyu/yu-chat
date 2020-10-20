import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {WingBlank,WhiteSpace,Card} from 'antd-mobile'
const Header = Card.Header
const Body = Card.Body
class UserList extends Component{
    static propTypes = {
        userList:PropTypes.array.isRequired 
    }
    render(){
        const {userList} = this.props
        return (
            <WingBlank style={{marginBottom:50,marginTop:50}}>
                {userList.map(user=>(
                    <div key={user._id}>
                        <WhiteSpace/>
                        <Card>
                            <Header thumb={require(`../../assets/images/${user.avatar}.png`)}
                            thumbStyle={{width:50}}
                            extra={user.username}/>
                            <Body>
                                <div>cli:{user.cli}</div>
                                <div>router:{user.router}</div>
                                <div>state:{user.state}</div>
                            </Body>
                        </Card>
                    </div>
                ))}
                
            </WingBlank>
        )
    }
}
export default UserList
