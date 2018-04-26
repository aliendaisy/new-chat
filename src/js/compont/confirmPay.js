/**
 * Created by qm on 2017/7/11.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/confirmPay.css';
import {Header,TwoFont,Footer,fetchJson} from './public';
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile/lib';
import store from '../store/store';
import {TO_ALL_ORDER,CANCEL_PAY} from '../action/orderAction';
import { connect } from 'react-redux';
import {WX_PAY,PURSE_PAY} from '../constant/payModel'

//确认支付页
 class ConfirmPay extends Component {
    constructor(props,context){
        super(props,context);
        this._confirmPay = this.confirmPay.bind(this);
        this._back = this.back.bind(this);
    }
    //确认支付
    confirmPay(){
        var self = this;
	    var owner = store.getState().owner;
	    if(this.props.toOrder.payInfo.payModel === PURSE_PAY){
            fetchJson('/owner/payNewXdmyMilkForAccount',{
                ownerid: owner.ownerid,
                orderid: self.props.toOrder.payInfo.orderid
            },function(msg){
                if(msg.message === 'success'){
                    self.context.router.history.push({
                        pathname: '/orderSuccess',
                        query: {
                            data: self.data,
                            payInfo: self.payInfo
                        }
                    });
                }else{
                    Toast.info('钱包支付失败!',1);
                }
            });
        }else{
			let url = window.location.href;
		    let g_nonceStr = "";
		    let g_timestamp = "";
		    let g_signature = "";
		    fetchJson('/getwxconfig',{url:url},function(data){
			    console.log('获取微信配置数据:',data);
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
				    fetchJson('/owner/payNewXdmyMilk',{
					    ownerid: owner.ownerid,
					    mode: 'wxJsPay',
					    orderid: self.props.toOrder.payInfo.orderid
				    },(msg) => {
					    if(msg.message === 'success') {
						    window.wx.chooseWXPay({
							    timestamp: msg.data.timeStamp,
							    nonceStr: msg.data.nonceStr,
							    package: msg.data.package,
							    signType: 'MD5',
							    paySign: msg.data.paySign,
							    success: function (res) {
								    fetchJson('/checkwxpayrsult',{prepayid:msg.data.package},function (msg) {
									    self.context.router.history.push({
										    pathname:'/orderSuccess'
									    });
								    });
							    },
							    fail: function(res) {
								    alert(res.errMsg)
							    },
							    cancel: function (error) {
								    fetchJson('/owner/cancelPayNewXdmyMilk',{prepayid:msg.data.package},function (msg) {
									    if(msg.message === 'success'){
										    let owner = store.getState().owner;
										    let status = '待支付';
										    fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: status},(msg) => {
											    store.dispatch(TO_ALL_ORDER(msg.data,status,'0'));
											    self.context.router.history.push({
												    pathname: '/allOrder',
												    comefrom: 'confirmPay'
											    });
										    });
									    }else{
										    Toast.info('取消订单失败',1);
									    }
								    });
							    }
						    });
					    }else{
						    Toast.info(msg.message)
					    }
				    });
			    });
		    });
        }
    }
	back() {
		var self = this;
		var owner = store.getState().owner;
		var status = '待支付';
		//获取订单
		fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: status},(msg) => {
			self.props.getAllList(msg.data,status,'0');
			store.dispatch(CANCEL_PAY);
			self.context.router.history.push({
				pathname: '/allOrder',
				comefrom: 'confirmPay'
			});
		});
	}
    render() {
        return(
            <div className="topCon">
                <Header name="支付" onClick={this._back}/>
                <div className="confirmPayCon">
                    <div className="confirmMoney">
                        <p>实际支付：</p>
                        ¥{parseInt(this.props.toOrder.payInfo.needPay)}
	                    <span>.{this.props.toOrder.payInfo.needPay.toFixed(2).split('.')[1]}</span>
                    </div>
                    <div className="successSon">
                        <div className="confirmPrice">
                            <TwoFont left="订单金额:" date={"¥ " + this.props.toOrder.payInfo.orderPrice.toFixed(2)}/>
                        </div>
                        <div className="confirmDiscount">
                            <TwoFont left="代金券优惠:" date={"-¥" + this.props.toOrder.payInfo.couponMoney.toFixed(2)}/>
                            <TwoFont left="钱包余额支付:" date={"¥" + this.props.toOrder.payInfo.pursePayAccount.toFixed(2)}/>
                            <TwoFont left="微信支付:"
                                     date={"¥" + this.props.toOrder.payInfo.wxPayAccount.toFixed(2)}/>
                        </div>
                    </div>
                </div>
                <Footer footerBtn="确认支付" onClick={this._confirmPay}/>
            </div>
        )
    }
}

ConfirmPay.contextTypes = {
    router: PropTypes.object
};

//传过来的值,props指向了state.toOrder
const mapStateToProps = (state, props) => {
    console.log('ConfirmPay', state)
    return {toOrder:state,owner:state.owner};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	getAllList:(allList,status,tabIndex) => {
		dispatch(TO_ALL_ORDER(allList,status,tabIndex))
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPay)

