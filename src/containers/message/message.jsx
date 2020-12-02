import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief

/**
 * 对chatMsgs按照chat_id进行分组
 *  1.{chat_id:lastMsg}
 *  2.按照create_time降序
 */
function getLastMsgs(chatMsgs, userid) {
    const lastMsgObjs = {}
    chatMsgs.forEach(function (msg) {
        if (msg.to === userid && !msg.read) {
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }

        const { chat_id, create_time } = msg
        const currentLastMsg = lastMsgObjs[chat_id]
        if (!currentLastMsg) {
            lastMsgObjs[chat_id] = msg
        } else {
            const unReadCount = currentLastMsg.unReadCount + msg.unReadCount
            if (currentLastMsg.create_time < create_time) {
                lastMsgObjs[chat_id] = msg
            }
            lastMsgObjs[chat_id].unReadCount = unReadCount
        }
    })
    const lastMsgs = Object.values(lastMsgObjs)
    lastMsgs.sort((m1, m2) => {
        return m2.create_time - m1.create_time
    })
    return lastMsgs
}
class Message extends Component {
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        const lastMsgs = getLastMsgs(chatMsgs, user._id)
        console.log(lastMsgs)
        return (
            <List style={{ marginTop: 50, marginBottom: 50 }}>
                {
                    lastMsgs.map(msg => {
                        const targetUserId = msg.to === user._id ? msg.from : msg.to
                        const targetUser = users[targetUserId]
                        return (<Item key={msg._id}
                            extra={<Badge text={msg.unReadCount} />}
                            thumb={targetUser.avatar ? require(`../../assets/images/${targetUser.avatar}.png`) : null}
                            arrow='horizontal'
                            onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                        >
                            {msg.content}
                            <Brief>{targetUser.username}</Brief>
                        </Item>)
                    })
                }
            </List>
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }),
    {}
)(Message)