/**
 * 包含n个接口请求的模块
 */
import ajax from './ajax'
export const reqRegister = (user)=>ajax('/register',user,'POST')

export const reqLogin = ({username,password})=>ajax('/login',{username,password},'POST')

export const reqUpdateUser = (user)=>ajax('/update',user,'POST')

export const reqUser = ()=>ajax('/user')

export const reqUserList = (type)=>ajax('userlist',{type})
