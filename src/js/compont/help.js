/**
 * Created by qm on 2017/8/12.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import {Header,RowInto} from './public';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

export default class Help extends Component {
    constructor(props){
        super(props);
        this._helpBack = this.helpBack.bind(this)
    }
    helpBack(){
        this.context.router.history.push({
            pathname:'/personCenter',
            comefrom:'help'
        })
    }
    render(){
        return(
            <div className="topCon">
                <Header name="帮助中心" onClick={this._helpBack}/>
                <div className="helpCon">
                    <Link to={{pathname: '/userRegHttp',query:{httpComeFrom: 'help'}}}>
                        <div className="borderLine">
                            <RowInto name="用户注册协议" />
                        </div>
                    </Link>
                    <Link to={{pathname: '/rechargeHttp',query:{purseComeFrom: 'help'}}}>
                        <div className="borderLine">
                            <RowInto name="充值协议" />
                        </div>
                    </Link>
                    <Link to="/serviceHttp">
                        <RowInto name="服务协议"/>
                    </Link>

                </div>
            </div>
        )
    }
}
//Help组件跳转定义
Help.contextTypes = {
    router: PropTypes.object
};
