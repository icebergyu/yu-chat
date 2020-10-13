import React, {
    Component
} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import VueInfo from '../vue-info/vue-info'
import ReactInfo from '../react-info/react-info'
import {getRedirectTo} from '../../utils/index'
class Main extends Component {
    componentDidMount(){
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if(userid && !_id){
            // 发送异步请求,获取user
            console.log('发送请求,获取user')
        }
    }
    render() {
        // 读取cookie中的userid
        const userid = Cookies.get('userid')
        // 如果没有，重定向到login
        if(!userid){
            return <Redirect to='/login'/>
        }
        // 如果有读取redux中的user状态
        const {user} = this.props
        // 如果user没有_id,返回null(不作任何显示)
        if(!user._id){
            return null
        }else{
            // 如果user有_id,显示对应界面
            // 如果请求根路径,根据user的type和user来计算出一个重定向的路由路径，并自动重定向
            let path = this.props.location.pathname
            if(path==='/'){
                path = getRedirectTo(user.type,user.avatar)
                return <Redirect to={path}/>
            }
        }
        
        return (<div>
            <Switch>
                <Route path='/vueinfo' component={VueInfo}/>
                <Route path='/reactinfo' component={ReactInfo}/>
            </Switch>
        </div>)
    }
}
export default connect(
    state=>({user:state.user})
)(Main)

/**
 * 1.实现自动登录:
 *  1).登录过，但还没有登录(redux管理的user中没有_id)，发请求获取对应的user,暂时不作任何显示
 *  2).如果cookie中没有userid,自动进入登录界面
 * 2.如果已经登录，如果请求根路径:
 *  根据user的type和user来计算出一个重定向的路由路径，并自动重定向
 */