import React, {
    Component
} from 'react'
import { NavBar } from 'antd-mobile'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import VueInfo from '../vue-info/vue-info'
import ReactInfo from '../react-info/react-info'
import VueUser from '../vue-user/vue-user'
import ReactUser from '../react-user/react-user'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

import { getRedirectTo } from '../../utils/index'
import { getUser } from '../../redux/actions'

class Main extends Component {
    navList = [
        {
            path: '/vue',
            component: VueUser,
            title: 'Vue用户列表',
            icon: 'vue',
            text: 'Vue'
        },
        {
            path: '/react',
            component: ReactUser,
            title: 'React用户列表',
            icon: 'react',
            text: 'React'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人'
        }
    ]

    componentDidMount() {
        const userid = Cookies.get('userid')
        const { _id } = this.props.user
        if (userid && !_id) {
            // 发送异步请求,获取user
            // console.log('发送请求,获取user')
            this.props.getUser()
        }
    }
    render() {
        // 读取cookie中的userid
        const userid = Cookies.get('userid')
        // 如果没有，重定向到login
        if (!userid) {
            return <Redirect to='/login' />
        }
        // 如果有读取redux中的user状态
        const { user, unReadCount } = this.props
        // 如果user没有_id,返回null(不作任何显示)
        if (!user._id) {
            return null
        } else {
            // 如果user有_id,显示对应界面
            // 如果请求根路径,根据user的type和user来计算出一个重定向的路由路径，并自动重定向
            let path = this.props.location.pathname
            if (path === '/') {
                path = getRedirectTo(user.type, user.avatar)
                return <Redirect to={path} />
            }
        }

        const { navList } = this
        const path = this.props.location.pathname
        const currentNav = navList.find(nav => nav.path === path)
        if (currentNav) {
            if (user.type === 'vue') {
                navList[0].hide = true
            } else {
                navList[1].hide = true
            }
        }
        return (<div>
            {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
            <Switch>
                {navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component} />)}
                <Route path='/vueinfo' component={VueInfo} />
                <Route path='/reactinfo' component={ReactInfo} />
                <Route path='/chat/:userid' component={Chat} />

                <Route component={NotFound} />
            </Switch>
            {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount} /> : null}
        </div>)
    }
}
export default connect(
    state => ({ user: state.user, unReadCount: state.chat.unReadCount }),
    { getUser }
)(Main)

/**
 * 1.实现自动登录:
 *  1).登录过，但还没有登录(redux管理的user中没有_id)，发请求获取对应的user,暂时不作任何显示
 *  2).如果cookie中没有userid,自动进入登录界面
 * 2.如果已经登录，如果请求根路径:
 *  根据user的type和user来计算出一个重定向的路由路径，并自动重定向
 */