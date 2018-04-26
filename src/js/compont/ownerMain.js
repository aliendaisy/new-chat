/**
 * Created by qm on 17/6/30.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/ownerMain.css';
import {Header,Discount,fetchJson,getDefaultData} from './public';
import {Carousel} from 'antd-mobile/lib';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {NUM_ADD,NUM_REDUCE,BACK_TO_HOME,SELECT_SUBSCIBE_STYLE,TO_PLACE_ORDER,INIT_ADDR} from  '../action/orderAction';

import NumChanageFun from "./numChanage";
import SubscribeStyle from "./subscribeStyle";
import store from '../store/store';
import Footer from "./foot"

//文字还有价格
class PicFont extends Component {
    render(){
        return(
            <div className="picContain">
                <div className="imgFont">
                    <span>{this.props.orderTitle}</span>
                </div>
                <div className="imgFontPrice">
	                <div className="price left">
		                <span>¥ </span><span>{this.props.disPrice}</span>
	                </div>
	                <div className={"priceDisable left " + this.props.showOriginalPrice}>
		                <span>¥ </span><span>{this.props.price}</span>
	                </div>
                </div>
            </div>
        )
    }
}
//服务
class Service extends Component {
    render(){
        return(
            <div className="serviceDisplay">
                <i className="iconfont icon-dui"></i>
                <span className="fontSizeEleven">{this.props.service}</span>
            </div>
        )

    }
}

//主页面
export class OwnerMain extends Component {
    constructor(props,context) {
	    super(props,context);
	    this.state = {
		    sliderData: [this.props.SelectGood.carousel1,this.props.SelectGood.carousel2]
	    };
        this.orderType = getDefaultData().orderType;
        this.numForOrder = getDefaultData().numForOrder;
	    this.standOrderType = getDefaultData().StandOrderType;
	    this._handleClick = this.handleClick.bind(this);
	    //this._toPlaceOrder = this.toPlaceOrder.bind(this);
    }

    //导航跳转点击事件
    handleClick(){
        this.props.backToHome();
		this.context.router.history.goBack();
    }

	//toPlaceOrder(self) {
	//    self = this;
	//    let owner = store.getState().owner;
	//    if (owner.isRgiste === "Y"){
     //       fetchJson('/owner/getVoucherByMobile',{mobile:owner.mobile},function(msg) {
     //           self.context.router.history.push({
     //               pathname: '/placeOrder',
     //               comefrom:'ownerMain'
     //           });
     //           self.props.toPlaceOrder(msg.data)
     //       });
     //   }else {
     //       self.context.router.history.push({
     //           pathname: '/ownerLogin',
     //           comefrom:'ownerMain'
     //       });
     //   }
	//}
	//订购按钮
	order() {
		let self = this;
		let owner = store.getState().owner;
		fetchJson('/getOwnerByOpenid',{openid: owner.openid},(msg) => {
			if (msg.message === 'success') {
				if (msg.data.docs && msg.data.docs.role === '业主') {
					fetchJson('/owner/getVoucherByMobile',{mobile:owner.mobile},function(msg) {
						self.props.toPlaceOrder(msg.data);
						fetchJson('/getPerAppUserInfo',{ownerid:owner.ownerid},function(ownerInfo) {
							self.props.getInitAddr(ownerInfo.data);
							self.context.router.history.push({
								pathname: '/placeOrder',
								comefrom: 'ownerMain'
							});
						});
					});
				}else{
					self.context.router.history.push({
						pathname: '/ownerLogin',
						comefrom:'ownerMain'
					});
				}
			}else{
				alert(msg.message);
			}
		});
	}
    render(){
	    //优惠
	    let discount = false;
	    let discountContent = "";
	    //let addNum = 0;
	    let gift = false;
	    let giftContent = "";
	    this.standOrderType.map((item) => {
		    if (item.type === this.props.orderType){
			    if(item.num < this.props.snum){
				    discount = true;
				    discountContent = `加送${this.props.snum - item.num}瓶${this.props.SelectGood.note}`;
				    //addNum = this.props.snum - item.num;
			    }else {
				    discount = false;
			    }
		    }
	    });
	    //赠品
	    if (this.props.giftType === "无"){
		    gift = false;
	    }else {
		    gift = true;
		    if(this.props.giftType.indexOf('酸奶8盒装') >= 0) {
			    giftContent = `共赠送${this.props.giftType}${this.props.giftSnum*this.props.num}份,配送${this.props.giftSnum}次`
		    }else{
			    giftContent = `共赠送${this.props.giftType}${this.props.giftSnum*this.props.num}瓶,配送${this.props.giftSnum}瓶`
		    }
	    }
	    //判断蔬菜
	    if (this.props.SelectGood.orderTitle.indexOf('蔬菜') >= 0) {
		    this.vegeShow = true;
	    }else{
		    this.vegeShow = false;
	    }

	    return(
           <div className="topCon">
               <Header name={this.vegeShow ? "赏味其鲜" : "现代牧业"} onClick={this._handleClick}/>
               <div className="ownerMain">
	               <Carousel className="my-carousel"
	                         autoplay
	                         infinite
	                         selectedIndex={0}
	                         swipeSpeed={50}
	                         dotStyle={{background: '#ccc'}}
	                         dotActiveStyle={{background: '#fff'}}>
		               {this.state.sliderData.map((res,i) => (
			               <img
				               src={res}
				               alt=""
				               key={i}
				               onLoad={() => {
				                  // fire window resize event to change height
				                  window.dispatchEvent(new Event('resize'));
				               }}
			               />
		               ))}
	               </Carousel>
                   <PicFont orderTitle={this.props.SelectGood.orderTitle}
                            showOriginalPrice={this.props.price === this.props.disPrice ? 'hide' : 'showInline'}
                            price={this.props.price}
                            disPrice={this.props.disPrice}/>
                   <div className="innerCon">
	                   <div className={discount === true ? 'show' : 'hide'}>
		                   <Discount discount="优惠" discountFont={discountContent}/>
	                   </div>
	                   <div className={gift === true ? 'show' : 'hide'}>
		                   <Discount discount="赠品" discountFont={giftContent}/>
	                   </div>
                       <Service service={this.vegeShow ? "快递免邮" : "免费安装奶箱"}/>
                       <Service service={this.vegeShow ? "坏单包退" : "免费配送到户"}/>
                   </div>
                   <div className="innerConWhite">
                       <div className="orderTypeCon">
                           <span className="orderRow">订购数量</span>
                           <div className="right">
							   <NumChanageFun reduce={this.props.reduce}
							                  add={this.props.add}
							                  defaultNum={this.props.num}/>
						   </div>
                       </div>
                       <div className={this.vegeShow ? "hide" : "orderTypeCon"}>
	                       <span className="orderRow">订购方式</span>
	                       <div className="threeBtn">
                               <SubscribeStyle style={this.props.orderType}
                                               arr={this.orderType}
                                               handleStyle={this.props.handleStyle}/>
                           </div>
                       </div>
                       {
                           //促销搭配
                           /*  <div className="orderTypeCon clearLine">
                           <OrderType orderNum="促销搭配"/>
                           <div className="threeBtn">
                                <button className="btnOther btnBlue" >现代牧业酸奶100g ¥3</button>
                                <button className="btnOther btnBlue" >现代牧业鲜奶125ml ¥3</button>
                           </div>
                       </div>*/}
                       <div className="ownerFooter">
                           <div className="left">
	                           {this.vegeShow ? `配送5次 每次${this.props.num}份` : `配送${this.props.snum}次 每次${this.props.num}份`}
                           </div>
                           <div className="right">
                               合计: <span className="red">¥ </span><span className="red">{(this.props.amount).toFixed(2)}</span>
                           </div>
                       </div>
                   </div>
	               <div className={this.vegeShow ? "detailImg" : "hide"}>
		               <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/vegeDetail.jpg" alt=""/>
	               </div>
	               <div className="bottomPadding"></div>
               </div>
               <Footer
	               footerBtn="立即订购"
                   onClick={this.order.bind(this)}
               />
           </div>
       )
    }
}

//OwnerMain组件跳转定义
OwnerMain.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = (state, props) => {
    return state.toOrder;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    reduce: () => {
        dispatch(NUM_REDUCE)
    },
    add:() => {
        dispatch(NUM_ADD)
	},
    backToHome:() => {
        dispatch(BACK_TO_HOME)
    },
    handleStyle:(style) => {
    	dispatch(SELECT_SUBSCIBE_STYLE(style))
	},
    toPlaceOrder:(couponList) => {
        dispatch(TO_PLACE_ORDER(couponList));
    },

    getInitAddr:(ownerInfo) => {
        dispatch(INIT_ADDR(ownerInfo));
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(OwnerMain)
