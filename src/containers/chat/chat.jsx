import React, { Component } from 'react'
import { NavBar, InputItem, List, Grid, Icon } from 'antd-mobile'
import { connect } from 'react-redux'
import { sendMsg } from '../../redux/actions'

const Item = List.Item
class Chat extends Component {
    state = {
        content: '',
        isShow: false
    }

    constructor(props) {
        super(props)
        const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '☺️', '😊', '😇',
            '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝',
            '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟',
            '😕', '🙁', '☹️', '😣', '😖']

        this.emojis = emojis.map(emoji => ({ text: emoji }))
    }
    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight)
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
        this.setState({ content: '', isShow: false })
    }
    toggelShow = () => {
        const isShow = !this.state.isShow
        this.setState({
            isShow
        })
        if (isShow) {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        // 对chatMsgs过滤
        const meId = user._id
        if (!users[meId]) {
            return null
        }
        const targetId = this.props.match.params.userid
        const chatId = [meId, targetId].sort().join('_')
        const msgs = chatMsgs.filter(msg => { return msg.chat_id === chatId })
        const targetHeader = users[targetId].header
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null
        return (
            <div id='chat-page'>
                <NavBar
                    icon={<Icon type='left' />}
                    onLeftClick={() => { this.props.history.goBack() }}
                    className='sticky-header'>{users[targetId].username}</NavBar>
                <List style={{ marginTop: 50, marginBottom: 50 }}>
                    {msgs.map(msg => {
                        if (msg.from === targetId) {
                            return (
                                <Item key={msg._id} thumb={targetIcon}>{msg.content}</Item>
                            )
                        } else {
                            return (
                                <Item key={msg._id} className='chat-me' extra='我'>{msg.content}</Item>
                            )
                        }
                    })}
                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        onChange={val => this.setState({ content: val })}
                        onFocus={() => { this.setState({ isShow: false }) }}
                        placeholder='请输入'
                        value={this.state.content}
                        extra={<span>
                            <span onClick={this.toggelShow}>😀</span>
                            <span onClick={this.handleSend}>发送</span>
                        </span>} />

                    {this.state.isShow ?
                        <Grid
                            data={this.emojis}
                            columnNum={8}
                            carouselMaxRow={4}
                            isCarousel={true}
                            onClick={(item) => { this.setState({ content: this.state.content + item.text }) }}
                        /> : null}

                </div>
            </div >
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }),
    { sendMsg }
)(Chat)