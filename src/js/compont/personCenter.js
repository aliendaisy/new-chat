/**
 * Created by qm on 2017/7/7.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/personCenter.css';
import {NoBackHeader,RowInto,fetchJson} from './public';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile/lib';
import URI from 'urijs';

import { connect } from 'react-redux';
import {TO_ALL_ORDER,INTO_COUPON,INIT_ADDR} from '../action/orderAction';
import store from '../store/store';


function generateGetCodeUrl(redirectURL) {
    return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
        .addQuery("appid", "wxa852b4d1234384dc")
        .addQuery("redirect_uri", redirectURL)
        .addQuery("response_type", "code")
        .addQuery("scope", "snsapi_base")
        .hash("wechat_redirect")
        .toString();
}

//个人中心头
class PersonHeader extends Component {
    render() {
        return(
            <div className="personHeaderCon">
                <div className="headerImg">
                    <img src={this.props.imgSrc} alt=""/>
                </div>
                <div className="headerInfo">
                    <div>{this.props.phone}</div>
                    <div>{this.props.weChatName}</div>
                </div>
            </div>
        )
    }
}

//代金券和钱包金额
class PersonModule extends Component {
    render() {
        return(
            <div className="moduleCon">
                <div className="moduleLeft">
                    <div className="moduleLeftTop" onClick={this.props.clickCoupon}>
                        <span>{this.props.num}</span>
                        <span>张</span>
                    </div>
                    <div>代金券</div>
                </div>
                <div className="moduleRight">
                    <div className="moduleRightTop" onClick={this.props.onClick}>
                        <span>{this.props.price}</span>
                        <span>元</span>
                    </div>
                    <div>钱包余额</div>
                </div>
            </div>
        )
    }
}

//个人中心主页面
export class PersonCenter extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            nickName:'',//昵称
            headPic:'',//头像
            capital:'',//本金
            givesMount:'',//赠金
            allAccount:'',//总金额整数
            spotTwo:'',//总金额小数点后两位
            canUseData: [],//可使用
            overData: [],//已过期
            noUseData: []//已使用
        };
        this._intoPurse = this.intoPurse.bind(this);//进入钱包
        this._intoCoupon = this.intoCoupon.bind(this);//进入代金券
    }
    //进入钱包
    intoPurse(){
        this.context.router.history.push({
            pathname: '/purse',
	        comefrom: 'personCenter'
        });
    }
    //进入代金券
    intoCoupon(){
        //代金券种类
        var allCoupon = {};
        allCoupon.canUseData = this.state.canUseData;//可使用
        allCoupon.overData = this.state.overData;//已过期
        allCoupon.noUseData = this.state.noUseData;//已经使用

        this.props.intoCoupon(allCoupon);
        this.context.router.history.push({
            pathname: '/coupon'
        });
    }
    componentWillMount(){
        var self = this;
        let openid = localStorage.getItem('openid');
        if(!openid){
            const uri = new URI(document.location.href);
            const query = uri.query(true);
            const {code} = query;
            if(code){
                fetchJson('/getAccessCode',{code: code},(msg) => {
                    if(msg.message === 'success'){
                        localStorage.setItem("openid", msg.data);
                    }else{
                        Toast.info(msg.message)
                    }
                });
            }else{
	            document.location = generateGetCodeUrl(document.location.href);
            }
        }else {
	        let owner = store.getState().owner;
	        fetchJson('/getOwnerByOpenid',{openid: owner.openid},(msg) => {
		        if (msg.message === 'success') {
			        if (msg.data.docs && msg.data.docs.role === '业主') {
				        localStorage.setItem("mobile", msg.data.sessions.mobile);
				        localStorage.setItem("ownerid", msg.data.sessions.ownerid);
						let mobile = msg.data.sessions.mobile;
				        let ownerid = msg.data.sessions.ownerid;
				        //获取微信用户个人信息
				        fetchJson('/getUserWxInfo',{openid: owner.openid},function(msg){
					        if(msg.message === 'success'){
						        self.setState({
							        nickName:msg.data.nickname,
							        headPic:msg.data.headimgurl
						        });
						        //获取代金券数据
						        fetchJson('/owner/getVoucherByMobile',{mobile: mobile},function(msg){
							        //self.props.initPersoncenter(msg.data)
							        if (msg.message === 'success'){
								        var Adata = msg.data;
								        for(var i = 0;i < Adata.length;i ++){
									        if(Adata[i].status === '已过期'){
										        (self.state.overData).push(Adata[i])
									        }else if(Adata[i].status === '已使用'){
										        (self.state.noUseData).push(Adata[i])
									        }else if(Adata[i].status === '可使用'){
										        (self.state.canUseData).push(Adata[i])
									        }
								        }
								        self.setState({
									        canUseData: self.state.canUseData,
									        overData: self.state.overData,
									        noUseData: self.state.noUseData
								        });
							        }
						        });
						        //获取业主个人信息
						        fetchJson('/getPerAppUserInfo',{ownerid: ownerid},function (msg) {
							        if(msg.data && msg.message === 'success'){
								        self.mobile = msg.data.mobile;
								        self.myInfoData = msg.data;

								        //获取余额
								        let allAccount = parseFloat(msg.data.changeaccount + msg.data.giftaccount) / 1000;
								        let spotTwo = allAccount.toFixed(2).split('.')[1];
								        self.setState({
									        spotTwo: spotTwo,
									        allAccount: parseInt(allAccount)
								        });
								        self.props.getInitAddr(self.myInfoData);
							        }
						        });
					        }
				        });
			        }else{
				        self.context.router.history.push({
					        pathname: '/ownerLogin',
					        comefrom:'personCenter'
				        });
			        }
		        }
	        });
        }
    }
	clickTo(status,index) {
		let self = this;
		let owner = store.getState().owner;
		fetchJson('/getOwnerByOpenid',{openid: owner.openid},(msg) => {
			if (msg.message === 'success') {
				if (msg.data.docs && msg.data.docs.role === '业主') {
					//获取订单
					fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: status},(msg) => {
						self.props.toAllOrder(msg.data,status,index);
						self.context.router.history.push({
							pathname: '/allOrder'
						});
					});
				}else{
					self.context.router.history.push({
						pathname: '/ownerLogin'
					});
				}
			}
		});
	}
    render() {
        return (
            <div className="topCon personCenter">
                <NoBackHeader name="个人中心"/>
                <div>
                    <PersonHeader imgSrc={this.state.headPic}
                                  phone={this.mobile}
                                  weChatName={this.state.nickName}/>
                    <PersonModule num={this.state.canUseData.length}
                                  onClick={this._intoPurse}
                                  clickCoupon={this._intoCoupon}
                                  price={`¥${this.state.allAccount}.${this.state.spotTwo}`}/>
                    <div className="personCenterSection">
                        {/*Link传值*/}
	                    <div onClick={this.clickTo.bind(this,'待支付','0')}>
	                        <RowInto name="我的订单" content="查看全部订单"/>
	                    </div>
                        <div className="threeIconCon">
	                        <div className="rowIntoCon">
		                        <div className="iconLeft">
			                        <div onClick={this.clickTo.bind(this,'待支付','0')}>
				                        <div><i className="iconfont icon-fukuan iconMd"></i></div>
				                        <div>待付款</div>
			                        </div>
		                        </div>
		                        <div className="iconLeft">
			                        <div onClick={this.clickTo.bind(this,'配送中','1')}>
				                        <div><i className="iconfont icon-huojian iconMd"></i></div>
				                        <div>派送中</div>
			                        </div>
		                        </div>
		                        <div className="iconLeft1">
			                        <div onClick={this.clickTo.bind(this,'已完成','2')}>
				                        <div><i className="iconfont icon-niunai iconMd"></i></div>
				                        <div>已完成</div>
			                        </div>
		                        </div>
	                        </div>
                        </div>
                    </div>
                    <div className="personCenterSection">
                        <div className="borderLine" onClick={()=>{
	                        //this.props.getInitAddr(this.myInfoData)
	                        if(this.myInfoData.milkAddress.length === 0 && this.myInfoData.Address.length === 0){
	                            this.context.router.history.push({
	                                pathname:'addAddr',
	                                comefrom:'personCenter'
	                            })
	                        }else{
	                             this.context.router.history.push({
	                                pathname:'dispatchAddr',
	                                comefrom:'personCenter'
	                            })
	                        }
                        }}>
                            {/*<Link to={{pathname: this.state.addrPath,comefrom: 'personCenter'}}>
                                <RowInto name="收货地址管理" />
                            </Link>*/}
                            <RowInto name="收货地址管理" />
                        </div>
                        <Link to="/feedBack">
                            <div className="borderLine">
                                <RowInto name="建议与反馈" />
                            </div>
                        </Link>
                        <Link to="/help">
                            <div className="borderLine">
                                <RowInto name="帮助中心"/>
                            </div>
                        </Link>
                        {/*<RowInto name="退出登录" onClick={() => {
                            localStorage.clear();
                            Toast.info('退出登录成功!',1);
                        }}/>*/}
                    </div>
                </div>
            </div>
        );
    }
}
PersonCenter.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = (state, props) => {
	console.log('personCenter' ,state)
	return {owner:state.owner};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	toAllOrder:(allList,status,tabIndex) => {
		dispatch(TO_ALL_ORDER(allList,status,tabIndex))
	},
    intoCoupon:(couponData) => {
        dispatch(INTO_COUPON(couponData))
    },
    getInitAddr:(ownerInfo) => {
        dispatch(INIT_ADDR(ownerInfo));
    }


});

export default connect(mapStateToProps, mapDispatchToProps)(PersonCenter)
