import React,{Component} from 'react'
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'
export default class AvatarSelector extends Component{
    static propTypes = {
        setAvatar:PropTypes.func.isRequired
    }
    state = {
        icon:null
    }
    constructor(props){
        super(props)
        this.avatarList = Array.from(new Array(20)).map((item,index)=>({
            icon:require(`./images/${index+1}.png`),
            text:`头像${index+1}`
        }))
    }

    handleClick = ({text,icon})=>{
        this.setState({icon})
        this.props.setAvatar(text)
    }
    render(){
        const {icon} = this.state
        const listHeader = icon ? (<div>已选择头像:<img alt="头像" src={icon} style={{width:'30px'}}/></div>) : '请选择头像'
        return (
            <List renderHeader={()=>listHeader}>
                <Grid onClick={this.handleClick} data={this.avatarList} columnNum={5}></Grid>
            </List>
        )
    }
}