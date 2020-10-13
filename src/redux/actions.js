import {reqRegister,reqLogin,reqUpdateUser} from '../api/index'
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER} from './action-types'

//授权同步action
const authSuccess = (user) => ({type:AUTH_SUCCESS,data:user})
//错误提示同步action
const errorMsg = (msg)=>({type:ERROR_MSG,data:msg})
//接收用户的同步action
const receiveUser = (user)=>({type:RECEIVE_USER,data:user})
//重置用户的同步action
const resetUser = (msg)=>({type:RESET_USER,data:msg})

//注册异步action
export const register = (user)=>{
    const {username,password,confirm,type} = user
    //表单前台验证
    if(!username){
        return errorMsg('用户名不能为空！')
    }else if(password !== confirm){
        return errorMsg('两次密码不一致！')
    }

    //表单数据合法，返回一个发ajax请求的异步action函数 
    return async dispatch =>{
        const response = await reqRegister({username,password,type})
        console.log(response)
        const result = response.data
        if(result.code === 0){
            dispatch(authSuccess(result.data))
        }else{
            dispatch(errorMsg(result.msg))
        }
    }
}

//登录异步action
export const login = (user)=>{
    const {username,password} = user
    //表单前台验证
    if(!username){
        return errorMsg('用户名不能为空！')
    }else if(!password){
        return errorMsg('密码不能为空！')
    }
    return async dispatch =>{
        const response = await reqLogin(user)
        const result = response.data
        if(result.code === 0){
            dispatch(authSuccess(result.data))
        }else{
            dispatch(errorMsg(result.msg))
        }
    }
}

//更新异步action
export const updateUser = (user)=>{
    return async dispatch=>{
        const response = await reqUpdateUser(user)
        const result = response.data
        if(result.code===0){
            dispatch(receiveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}