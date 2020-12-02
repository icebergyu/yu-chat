import io from 'socket.io-client'
import { reqRegister, reqLogin, reqUpdateUser, reqUser, reqUserList, reqChatMsgList, reqReadMsg } from '../api/index'
import { AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG, RECEIVE_MSG_LIST, MSG_READ } from './action-types'

//授权同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
//错误提示同步action
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg })
//接收用户的同步action
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
//重置用户的同步action
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
//接收用户列表的同步action
export const receiveUserList = (userList) => ({ type: RECEIVE_USER_LIST, data: userList })
//接收一个消息的同步action
const receiveMsg = (chatMsg, isToMe) => ({ type: RECEIVE_MSG, data: { chatMsg, isToMe } })
//接收消息列表的同步action
const receiveMsgList = ({ users, chatMsgs, userid }) => ({ type: RECEIVE_MSG_LIST, data: { users, chatMsgs, userid } })
//读取消息的同步action
const msgRead = ({ count, from, to }) => ({ type: MSG_READ, data: { count, from, to } })

function initIO(dispatch, userid) {
    if (!io.socket) {
        io.socket = io('ws://localhost:5000')
        io.socket.on('receiveMsg', function (chatMsg) {
            console.log('客户端接收服务器发送的消息', chatMsg)
            if (userid === chatMsg.from || userid === chatMsg.to) {
                dispatch(receiveMsg(chatMsg, userid === chatMsg.to))
            }
        })
    }
}

// 获取消息列表
async function getMsgList(dispatch, userid) {
    initIO(dispatch, userid)
    const response = await reqChatMsgList()
    const result = response.data
    if (result.code === 0) {
        const { users, chatMsgs } = result.data
        dispatch(receiveMsgList({ users, chatMsgs, userid }))
    }
}

// 发送消息的异步action
export const sendMsg = ({ from, to, content }) => {
    return dispatch => {
        console.log('客户端向服务器发送消息', { from, to, content })
        // 发消息
        io.socket.emit('sendMsg', { from, to, content })
    }
}

// 读取消息的异步action
export const readMsg = (from, to) => {
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        if (result.code === 0) {
            const count = result.data
            dispatch(msgRead({ count, from, to }))
        }
    }
}

//注册异步action
export const register = (user) => {
    const { username, password, confirm, type } = user
    //表单前台验证
    if (!username) {
        return errorMsg('用户名不能为空！')
    } else if (password !== confirm) {
        return errorMsg('两次密码不一致！')
    }

    //表单数据合法，返回一个发ajax请求的异步action函数 
    return async dispatch => {
        const response = await reqRegister({ username, password, type })
        console.log(response)
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

//登录异步action
export const login = (user) => {
    const { username, password } = user
    //表单前台验证
    if (!username) {
        return errorMsg('用户名不能为空！')
    } else if (!password) {
        return errorMsg('密码不能为空！')
    }
    return async dispatch => {
        const response = await reqLogin(user)
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

//更新异步action
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdateUser(user)
        const result = response.data
        if (result.code === 0) {
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户异步action
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户列表的异步action
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type)
        const result = response.data
        if (result.code === 0) {
            dispatch(receiveUserList(result.data))
        }
    }
}

