/**
 * Created by xm on 2017/7/15.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/login.css';
import {Header} from './public';
import {Link} from 'react-router-dom'


export default class Login extends Component {
    render() {
        return(
            <div className="loginCon">
                <Header name="现代牧业"/>
                <div className="loginConMain topCon">
                    <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_signup.png" alt=""/>
                    <div className="loginConMainSon">
                        <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_logo.png" alt=""/>
                        <input type="number" placeholder="手机号" className="iCodeInput" />
                        <div className="iCodeCon">
                            <input type="number"/>
                            <button>获取验证码</button>
                        </div>
                        <div className="btnCon">
                            <button>快递员</button>
                            <button>管家</button>
                        </div>
                        <button className="loginBtn">登&nbsp;&nbsp;&nbsp;录</button>

                    </div>

                </div>
                <div className="loginBottom">
                    注册手机号即同意
                    <a>《智取管家协议》</a>
                </div>
                <div className="loginFooter">
                    <Link to="/ownerLogin">
                        返回业主登录
                    </Link>
                </div>
            </div>
        )
    }
}
