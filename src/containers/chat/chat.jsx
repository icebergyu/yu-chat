import React, { Component } from 'react'
import { NavBar, InputItem, List, Grid, Icon } from 'antd-mobile'
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux'
import { sendMsg, readMsg } from '../../redux/actions'

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
        // 发请求更新未读消息数
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
    }
    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentWillUnmount() {
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
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
        const targetAvatar = users[targetId].avatar
        const targetIcon = targetAvatar ? require(`../../assets/images/${targetAvatar}.png`) : null
        return (
            <div id='chat-page'>
                <NavBar
                    icon={<Icon type='left' />}
                    onLeftClick={() => { this.props.history.goBack() }}
                    className='sticky-header'>{users[targetId].username}</NavBar>
                <List style={{ marginTop: 50, marginBottom: 50 }}>
                    <QueueAnim type='left' delay={100}>
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
                    </QueueAnim>
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
    { sendMsg, readMsg }
)(Chat)