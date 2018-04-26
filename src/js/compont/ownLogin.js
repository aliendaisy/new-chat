/**
 * Created by xm on 2017/7/15.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/login.css';
import {NoBackHeader,fetchJson} from './public';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile/lib';
import {Link} from 'react-router-dom';
import Header from './header'

import store from '../store/store';
import { connect } from 'react-redux';
import {REGISTER_INFO,TO_PLACE_ORDER,INIT_ADDR} from '../action/orderAction';

//业主登录页
export class OwnerLogin extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            mobile:'',
            icode:'',
            icodeColor:'icodeBlue',
            liked: true,
            count: 60,
            disabledClick:false
        };
        this._inputChange = this.inputChange.bind(this);
        this._handleLogin = this.handleLogin.bind(this);
        this._requireIcode = this.requireIcode.bind(this);
        this._inputIcode = this.inputIcode.bind(this);
    }

    //验证码change事件
    inputIcode(e){
        this.setState({
            icode:e.target.value
        })
    }
    //手机号码change事件
    inputChange(e){
        this.setState({
            mobile:e.target.value
        })
    }
    //获取验证码
    requireIcode(){
        let phone = this.state.mobile;
        var self = this;
        var regex = /^((\+)?86|((\+)?86)?)0?1[3578]\d{9}$/;//手机号码正则表达式
        //react使用正则表达式变量的test方法进行校验
        if (regex.test(phone)) {
            //获取验证码
            fetchJson('/makeidentifycode',{mobile:phone},function(msg){
                console.log('ownLogin页面获取验证码打印信息:',msg);
                if(msg.message === 'success'){
                    if(self.state.liked){
                        self.timer = setInterval(function () {
                            var count = self.state.count;
                            self.state.liked = false;
                            count -= 1;
                            if (count < 1) {
                                self.setState({
                                    liked: true,
                                    icodeColor: 'icodeBlue',
                                    disabledClick:false

                                });
                                count = 60;
                                clearInterval(self.timer);
                            }else{
                                self.setState({
                                    icodeColor:'icodeGrey',
                                    disabledClick:true
                                });
                            }
                            self.setState({
                                count: count
                            });
                        }.bind(self), 1000);
                    }
                }else{
                    Toast.info('获取验证码失败',1)
                }
            });
        }else if(phone === '') {
            Toast.info('手机号码不能为空!',1);
        }else{
            Toast.info('请输入正确的手机号码!',1);
        }
    }
    //登录注册点击事件
    handleLogin(){
        var self = this;
        clearInterval(self.timer);
        let phone = this.state.mobile;
        let zIcode = this.state.icode;
        if(phone === ''|| zIcode === ''){
            Toast.info('手机号码或验证码不能为空!',1);
        }else{
            //验证验证码
            fetchJson('/verifyidentifycode',{mobile:phone,icode:zIcode},function(msg){
                if(msg.message === 'success'){
                    //注册
                    let openid = localStorage.getItem("openid");
	                fetchJson('/owner/registOwner',{openid:openid,mobile:phone,icode:zIcode},function(msg){
                        console.log('注册',msg)
                        if(msg.message === 'success'){
                            localStorage.setItem("ownerid", msg.data.sessions.ownerid);
                            localStorage.setItem("mobile", msg.data.sessions.mobile);
                            localStorage.setItem("isRgiste", 'Y');
                            //let owner = store.getState().owner;
                            store.dispatch(REGISTER_INFO(msg.data.sessions));

                            //注册成功后跳转到之前想要跳转的页面
                            let comefrom = self.context.router.history.location.comefrom;
                            if(comefrom === 'ownerMain') {
	                            //获取地址.代金券信息
	                            fetchJson('/owner/getVoucherByMobile',{mobile:msg.data.sessions.mobile},function(res) {
		                            self.props.toPlaceOrder(res.data);
		                            fetchJson('/getPerAppUserInfo',{ownerid:msg.data.sessions.ownerid},function(ownerInfo) {
			                            self.props.getInitAddr(ownerInfo.data);
			                            self.context.router.history.push({
				                            pathname: '/placeOrder',
				                            comefrom: 'ownerLogin'
			                            });
		                            });
	                            });
                            }else{
                                 self.context.router.history.push({
                                     pathname: comefrom,
                                     comefrom:'/wxReactHome'
                                 });
                            }
                        }else {
                            Toast.info(msg.message);
                        }
                    });
                }else{
                    Toast.info('输入的验证码不正确！')
                }
            });
        }
    }

    render() {
        let comefrom = this.context.router.history.location.comefrom;
        let header = "";
        if (comefrom === "personCenter" || comefrom === "purse"){
            header = <NoBackHeader name="现代牧业"/>
        }else {
            header = <Header name="现代牧业" onClick={() => {
            let comefrom = this.context.router.history.location.comefrom;
            if(comefrom == 'userRegHttp'){
                this.context.router.history.push({
                pathname: '/wxReactHome'
            })
            }else{
                this.context.router.history.goBack()
            }
            }}/>
        }

        var text = this.state.liked ? '获取验证码' : this.state.count + '秒后重发';

        return(
            <div className="loginCon">
	            {header}
                <div className="loginConMain topCon">
                    <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_signup.png"
                         alt=""
                         className="loginConMainImg"/>
                    <div className="loginConMainSon">
                        <div>
                            <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_logo.png" alt=""/>
                            <span className="loginSonInfo">首次注册用户送<span>5</span>元代金券</span>
                        </div>
                        <input
	                        type="number"
                            placeholder="手机号"
                            className="iCodeInput"
                            onChange={this._inputChange}
                            value={this.state.mobile}
                        />
                        <div className="iCodeCon">
                            <input type="number" value={this.state.icode} onChange={this._inputIcode}/>
                            <button onClick={this._requireIcode}
                                    className={this.state.icodeColor}
                                    disabled={this.state.disabledClick}>
	                            {text}
                            </button>
                        </div>
                        <button className="loginBtn" onClick={this._handleLogin}>登&nbsp;&nbsp;&nbsp;录</button>
                    </div>
                </div>
                <div className="loginBottom">
                    注册手机号即同意
                    <Link to={{pathname: '/userRegHttp',comefrom: 'ownerLogin'}}>
                        《用户注册协议》
                    </Link>
                </div>
                {/*<div className="loginFooter">
                    <Link to="/login">
                        非业主端登录
                    </Link>
                </div>*/}
            </div>
        )
    }
}
//OwnerLogin组件跳转定义
OwnerLogin.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = (state, props) => {
    return state.toOrder;
};

const mapDispatchToProps = (dispatch, ownProps) => ({

    toPlaceOrder:(couponList) => {
        dispatch(TO_PLACE_ORDER(couponList));
    },
    getInitAddr:(ownerInfo) => {
        dispatch(INIT_ADDR(ownerInfo));
    }

});
export default connect(mapStateToProps, mapDispatchToProps)(OwnerLogin)
