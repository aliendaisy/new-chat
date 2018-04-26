import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/placeOrder.css';
import {Header,OrderInfo,fetchJson,getDefaultData,getSendDateList} from './public';
//import PicAddr from "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_address.png";

import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile/lib';

import { connect } from 'react-redux';
import {SELECT_STYLE_TYPE,SELECT_SEND_DATE,RECEIVE_ORDER_ID} from  '../action/orderAction';
import SubscribeStyle from "./subscribeStyle";
import Footer from "./foot";
import OrderAddr from './orderAddr';

//确定下单主页面
export class PlaceOrder extends Component {
    constructor(props){
        super(props);
	    this._handleClick = this.handleClick.bind(this);
	    this._toConfirmPay = this.toConfirmPay.bind(this); //跳转至支付
	    this._toUsingCoupon = this.toUsingCoupon.bind(this); //跳转至代金券
	    this.styleTypeList = getDefaultData().styleType;
    }

	//返回点击,判断进入时是哪个页面,分别传参
	handleClick(){
        let comefrom = this.context.router.history.location.comefrom;
		if (comefrom === 'ownerLogin'){
            this.context.router.history.push({
                pathname:'/ownerMain',
				comefrom:"placeOrder"
			})
		}else {
            this.context.router.history.goBack();
		}
	}
	//跳转至usingCoupon页面并传值
	toUsingCoupon() {
		this.context.router.history.push({
			pathname: '/usingCoupon',
		});
	}
	//点击下单跳转到支付页面
	toConfirmPay(self) {
		self = this;
		let voucherPrice = 0;
        let voucherId = '';
        let Rbuild;
        let Runit;
        let Rroom;
        let price = this.props.num * this.props.disPrice;
        if (this.props.coupon.valid){
        	voucherId = this.props.coupon.id;
        	voucherPrice = this.props.coupon.amount;
            price = price - this.props.coupon.amount;
		}
        if(parseInt(this.props.build<=9 ) && parseInt(this.props.build>=0)){
            Rbuild = '0'+parseInt(this.props.build)
        }else{
            Rbuild = parseInt(this.props.build);
        }

        if(parseInt(this.props.unit<=9 ) && parseInt(this.props.unit>=0)){
            Runit = '0'+parseInt(this.props.unit)
        }else{
            Runit = parseInt(this.props.unit);
        }

        if(parseInt(this.props.room<=9 ) && parseInt(this.props.room>=0)){
            Rroom = '0'+parseInt(this.props.room)
        }else{
            Rroom = parseInt(this.props.room);
        }
		let info = {
            mobile:localStorage.getItem('mobile'),
            name:this.props.name,
            detail:this.props.detail,
            communityName:this.props.community,
            district:this.props.district,
            park:this.props.park,
            build:Rbuild,
            unit:Runit,
            room:Rroom
		};
        let order = {
            type:this.props.SelectGood.note,//存订单时的牛奶种类
            snum:this.props.snum * this.props.num,//总量
            num:this.props.num,//份数
            unitPrice:this.props.disPrice * 1000,
            originalUnitPrice:this.props.originalPrice * 1000,
            subhead:this.props.SelectGood.orderTitle,
            orderWay:this.props.orderType,
            voucherPrice:voucherPrice * 1000,
            voucherId:voucherId,
            price:price * 1000,
            distTime:this.props.sendDate,
            style:this.props.styleType,
            imgUrl:this.props.SelectGood.imgLogo,
            giftType:this.props.giftType,
            giftSnum:this.props.giftSnum*this.props.num,
            giftNum:this.props.giftNum*this.props.num,
            znum:this.props.znum,
            note:this.props.note
		}

		console.log("info", info, "order",order);
        if(!this.props.detail){
            Toast.info('您还没有地址，请添加您的地址', 1.5);
            return;
        }else{
            fetchJson('/owner/submitNewXdmyMilkOrder',{info:info, order:order},function (msg) {
                console.log("msg",msg);
                if(msg.message === 'success'){
                    let orderId = msg.data.order.orderid;
                    let orderPrice= msg.data.order.price / 1000;
                    self.props.handleReceiveOrderId(orderId);
                    self.context.router.history.push({
                        pathname: '/confirmPay',
                        comefrom:'placeOrder'
                    });
                }else {
                    Toast.info(msg.message)
                }
            });
        }
	}
    render(){
        let addrShow;
		if (!this.props.detail){
			addrShow = <OrderAddr addr="新增收货地址" onClick={()=>{
                this.context.router.history.push({
                    pathname: '/addAddr',
                    comefrom: "placeOrder"
                });
				}
            }/>
		}else {
            addrShow = <OrderAddr name={this.props.name} phone={this.props.mobile} addr={this.props.detail} onClick={() => {
                this.context.router.history.push({
                    pathname: '/dispatchAddr',
                    comefrom: "placeOrder"
                });
			}}/>
		}
	    //判断蔬菜
	    if (this.props.SelectGood.orderTitle.indexOf('蔬菜') >= 0) {
		    this.vegeShow = true;
	    }else{
		    this.vegeShow = false;
	    }
        return(
            <div className="placeOrderCon">
                <Header name={this.vegeShow ? "赏味其鲜" : "现代牧业"} onClick={this._handleClick}/>
                <div className="topCon">
	                <div className="PicAddrCon">
						{addrShow}
	                    <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_address.png" alt=""/>
                    </div>

	                <div className="bacColor distance">
                        <OrderInfo imgSrc={this.props.SelectGood.imgLogo}
                                   type={this.props.orderType}
                                   price={this.props.disPrice}
                                   status="等待付款"
                                   con={this.props.SelectGood.orderTitle}/>
                    </div>
                    <div className="innerConNone">
                        <div className="orderTypeCon">
	                        <span className="orderRow">配送方式</span>
	                        <div className="orderDispatch">
		                        <SubscribeStyle style={this.props.styleType}
		                                        arr={this.styleTypeList}
		                                        handleStyle={this.props.handleStyle}/>
	                        </div>
                        </div>
                        <div className="orderTypeCon">
	                        <span className="orderRow">起送日期</span>
	                        {/*<div className={this.vegeShow ? "hide" : "threeBtn"}>*/}
	                        <div className="threeBtn">
		                        <SubscribeStyle style={this.props.sendDate}
		                                        arr={getSendDateList()}
		                                        handleStyle={this.props.handleDate}/>
                            </div>
	                        {/*<span className={this.vegeShow ? "dateRight" : "hide"}>{getSendDateList()[0]}</span>*/}
                        </div>

                        {/*<div className="orderTypeCon">
                            <OrderType orderNum="促销搭配"/>
                            <div className="orderDispatch">
                                <span className="rightGrey">现代牧业酸奶100g ¥3</span>
                            </div>
                        </div>*/}
                        <div className="orderTypeCon clearLine">
	                        <span className="orderRow">代金券代扣</span>
                            <div className="orderDispatch" onClick={this._toUsingCoupon}>
                                <span className="red couponMoney">
	                                <span className={this.props.coupon.valid ? 'showInline' : 'hide'}>
		                                - ¥{this.props.coupon.amount}&nbsp;
	                                </span>
	                                <span className={!this.props.coupon.valid ? 'showInline' : 'hide'}
	                                      style={{fontSize: '13px'}}>
		                                不使用代金券
	                                </span>
                                </span>
                                <i className="iconfont icon-arrowdown"></i>
                            </div>
                        </div>
                    </div>
                    <div className="allMoney">
                        合计<span> ¥{this.props.amountOut}</span>
                    </div>
                    <div className="placeOrderBottomPadding"></div>
                </div>
	            <Footer footerBtn="确认下单" onClick={this._toConfirmPay}/>
            </div>
        )
    }
}
//PlaceOrder组件跳转定义
PlaceOrder.contextTypes = {
    router: PropTypes.object
};

//传过来的值,props指向了state.toOrder
const mapStateToProps = (state, props) => {
	console.log('placeOrder', state.toOrder)
	return state.toOrder;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleStyle:(style) => {
		dispatch(SELECT_STYLE_TYPE(style))
	},
	handleDate:(date) => {
		dispatch(SELECT_SEND_DATE(date))
	},

    handleReceiveOrderId:(orderid) => {
        dispatch(RECEIVE_ORDER_ID(orderid))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrder)
