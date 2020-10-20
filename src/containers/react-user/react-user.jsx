import React,{Component} from 'react'
import {connect} from 'react-redux'
import {getUserList} from '../../redux/actions'
import UserList from '../../components/user-list/user-list'
class ReactUser extends Component{
    componentDidMount(){
        this.props.getUserList('react')
    }
    render(){
        return (
            <UserList userList={this.props.userList}></UserList>
        )
    }
}
export default connect(
    state=>({userList:state.userList}),
    {getUserList}
)(ReactUser)
