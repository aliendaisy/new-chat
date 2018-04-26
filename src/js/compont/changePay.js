/**
 * Created by yulingjie on 17/8/11.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/confirmPay.css';
import {Header,TwoFont,Footer,fetchJson} from './public';
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile/lib';

import { connect } from 'react-redux';
import {DELETE_CHANGE_PAY,TO_ALL_ORDER} from '../action/orderAction';
import store from '../store/store';
import {WX_PAY,PURSE_PAY} from '../constant/payModel'

//确认支付页
export class ChangePay extends Component {
	constructor(props){
		super(props);
		this._back = this.back.bind(this);
		this._changePay = this.changePay.bind(this);
	}
	//返回
	back() {
		//返回allOrder
		this.props.deleteInfo(); //清除payInfo
		this.context.router.history.goBack();
	}
	//确认支付
	changePay(){
		var self = this;
		var owner = store.getState().owner;
		//如果钱包钱足够支付订单调用钱包支付接口 否则调用牛奶支付接口
		if(this.props.changePayModel === PURSE_PAY){
			fetchJson('/owner/payXdmyMilkTransferForAccount',{
				ownerid: owner.ownerid,
				orderid: self.props.orderid
			},msg => {
				fetchJson('/owner/updateXdmyMilkDistOrder',{
					flowid: self.props.flowid,
					order: self.props.order
				},(msg) => {
					Toast.info('支付成功!',2);
					self.timer = setTimeout(() => {
						fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: '配送中'},(msg) => {
							self.props.toAllOrder(msg.data,'配送中','1');
							self.context.router.history.push({
								pathname: '/allOrder'
							});
						});
					},2000);
				});
			})
		}else{
			//获取微信信息
			let url = window.location.href;
			let g_nonceStr = "";
			let g_timestamp = "";
			let g_signature = "";
			fetchJson('/getwxconfig',{url:url},function(data){
				g_nonceStr = data.nonce_str;
				g_timestamp = data.time_stamp;
				g_signature = data.sign_pay;
				window.wx.config({
					debug: false,
					appId: data.appid,
					timestamp: g_timestamp,
					nonceStr: g_nonceStr,
					signature: g_signature,
					jsApiList: ['chooseWXPay']
				});
				window.wx.ready(() => {
					fetchJson('/owner/payXdmyMilkTransfer',{
						ownerid: owner.ownerid,
						mode: 'wxJsPay',
						orderid: self.props.orderid
					},(msg) => {
						window.wx.chooseWXPay({
							timestamp: msg.data.timeStamp,
							nonceStr: msg.data.nonceStr,
							package: msg.data.package,
							signType: 'MD5',
							paySign: msg.data.paySign,
							success: function (res) {
								fetchJson('/checkwxpayrsult',{prepayid:msg.data.package},(msg) => {
									fetchJson('/owner/updateXdmyMilkDistOrder',{
										flowid: self.props.flowid,
										order: self.props.order
									},(msg) => {
										fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: '配送中'},(msg) => {
											self.props.toAllOrder(msg.data,'配送中','1');
											self.context.router.history.push({
												pathname: '/allOrder',
											});
										});
									});
								});
							},
							cancel: function (error) {
								Toast.info('调单失败!',1.5);
								self.timer = setTimeout(function() {
									fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: '配送中'},(msg) => {
										self.props.toAllOrder(msg.data,'配送中','1');
										self.context.router.history.push({
											pathname: '/allOrder'
										});
									});
								},1500);
							}
						});
					});
				});
			});
		}
	}
	render() {
		return(
			<div className="topCon">
				<Header name="支付" onClick={this._back}/>
				<div className="confirmPayCon">
					<div className="confirmMoney">
						<p>实际支付：</p>
						¥{(this.props.changeMoney).toFixed(2).split('.')[0]}
						<span>.{(this.props.changeMoney).toFixed(2).split('.')[1]}</span>
					</div>
					<div className="successSon">
						<div className="confirmPrice">
							<TwoFont left="补差金额:" date={`¥${(this.props.changeMoney).toFixed(2)}`}/>
						</div>
						<div className="confirmDiscount">
							<TwoFont left="钱包余额支付:" date={`¥${(this.props.pursePayChange).toFixed(2)}`}/>
							<TwoFont left="微信支付:"
							         date={`¥${(this.props.wxPayChange).toFixed(2)}`}/>
						</div>
					</div>
				</div>
				<Footer footerBtn="确认支付" onClick={this._changePay}/>
			</div>
		)
	}
}
ChangePay.contextTypes = {
	router: PropTypes.object
};

const mapStateToProps = (state, props) => {
	console.log('changeOrder', state)
	return state.changePayInfo;
}
const mapDispatchToProps = (dispatch, ownProps) => ({
	deleteInfo:() => {
		dispatch(DELETE_CHANGE_PAY)
	},
	toAllOrder:(allList,status,tabIndex) => {
		dispatch(TO_ALL_ORDER(allList,status,tabIndex))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePay)
