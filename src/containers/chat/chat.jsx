import React, { Component } from 'react'
import { NavBar, InputItem, List } from 'antd-mobile'
import { connect } from 'react-redux'
import { sendMsg } from '../../redux/actions'

const Item = List.Item
class Chat extends Component {
    state = {
        content: ''
    }
    handleSend = () => {
        // 收集数据
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        // 发送请求
        if (content) {
            this.props.sendMsg({ from, to, content })
        }
        this.setState({ content: '' })
    }
    render() {
        return (
            <div id='chat-page'>
                <NavBar>aa</NavBar>
                <List>
                    <Item thumb={require('../../assets/images/头像1.png')}>你好</Item>

                    <Item thumb={require('../../assets/images/头像1.png')}>hello</Item>

                    <Item className='chat-me' extra='我'>giao</Item>

                    <Item className='chat-me' extra='我'>giao~~</Item>

                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        onChange={val => this.setState({ content: val })}
                        placeholder='请输入'
                        value={this.state.content}
                        extra={<span onClick={this.handleSend}>发送</span>} />
                </div>
            </div >
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { sendMsg }
)(Chat)