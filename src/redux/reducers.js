import { combineReducers } from 'redux'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RECEIVE_USER_LIST,
    RESET_USER,
    RECEIVE_MSG,
    RECEIVE_MSG_LIST,
    MSG_READ
} from './action-types'
import { getRedirectTo } from '../utils/index'
const initUser = {
    username: '',
    type: '',
    msg: '',
    redirectTo: ''
}

function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            const { type, avatar } = action.data
            return { ...action.data, redirectTo: getRedirectTo(type, avatar) }
        case ERROR_MSG:
            return { ...state, msg: action.data }
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return { ...initUser, msg: action.data }
        default:
            return state
    }
}

const initUserList = []

function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

const initChat = {
    users: {}, //userid  {username,avatar}
    chatMsgs: [],// 当前用户所有相关的msg数组
    unReadCount: 0 // 总的未读消息数
}
function chat(state = initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST:
            const { users, chatMsgs, userid } = action.data
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((total, msg) => { return total + (!msg.read && msg.to === userid ? 1 : 0) }, 0)
            }
        case RECEIVE_MSG:
            const { chatMsg, isToMe } = action.data
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read && isToMe ? 1 : 0)
            }
        case MSG_READ:
            const { from, to, count } = action.data
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if (msg.from === from && msg.to === to) {
                        return { ...msg, read: true }
                    } else {
                        return msg
                    }
                }),
                unReadCount: state.unReadCount - count
            }
        default:
            return state
    }
}
export default combineReducers({
    user,
    userList,
    chat
})