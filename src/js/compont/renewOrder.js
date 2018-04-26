/**
 * Created by qm on 2017/7/14.
 */
import React, { Component } from 'react'
import '../../css/public.css';
import '../../css/renewOrder.css';
import {Header,OrderInfo,OrderType,OrderTypeTwo,RightFont,Discount,FontOrder,fetchJson} from './public';
import {RenewModal} from './renewModal';
import PropTypes from 'prop-types';
import moment from 'moment';


import { connect } from 'react-redux';
import {NUM_ADD,NUM_REDUCE,SELECT_SUBSCIBE_STYLE,RENEW_ORDER,TO_PLACE_ORDER,INIT_ADDR} from  '../action/orderAction';
import store from '../store/store';


//续订订单主页面
export class RenewOrder extends Component {
    constructor(props) {
        super(props);
	    this._handleRenew = this.handleRenew.bind(this);
        this._back = this.back.bind(this);
        this._Hide = this.Hide.bind(this);
        this.state ={
            modalClass: false
        };
    }
    back(){
        //context router 跳转返回首页
	    this.context.router.history.goBack();
    }
    //点击再来一单事件
    handleRenew(e) {
	    //每次点击再来一单时需要置空数组,不然typeData会储存所有点击过的数据
	    //this.setState({typeData: []});
	    let index = e.target.value;
	    //setState方法调用时会重新渲染页面,如果放在异步请求外面,渲染完成时可能异步请求的数据没到位,会报错
	    this.setState({
		    modalClass: true,
		    animateStatus: 'slideInUp'
	    });

	    this.props.renewOrderClick(this.props.orderList.renewList,index);
    }
    //点击隐藏 通过组件传过来的事件
    Hide() {
	    this.setState({animateStatus: 'slideOutDown'});
  	    //模态框需要延迟消失
  	    this.timer = setTimeout(function() {
  			this.setState({
  				modalClass: false
			  });
	    }.bind(this), 300);
    }
	sureRenewOrder() {
		let self = this;
		let owner = store.getState().owner;

		fetchJson('/owner/getVoucherByMobile',{mobile:owner.mobile},function(msg) {
			self.props.toPlaceOrder(msg.data);
			fetchJson('/getPerAppUserInfo',{ownerid:owner.ownerid},function(ownerInfo) {
				self.props.getInitAddr(ownerInfo.data);
				self.context.router.history.push({
					pathname: '/placeOrder',
					comefrom: 'allOrder'
				});
			});
		});
	}
    render(){
	    return(
            <div className="topCon renewOrderCon">
				<Header name="订单续订" onClick={this._back}/>
	            <div className={this.props.orderList.renewList.length === 0 ? 'hide' : 'show'}>
		            {this.props.orderList.renewList.map((res,i) => {
			            //新老订单显示处理
			            let type = '';
			            let price = 0;
			            let contain = '';
			            if(typeof (res.orderContent) == 'undefined') {
				            type = '月订';
				            price = res.price / 1000;
				            contain = res.type;
			            }else {
                             type = res.orderContent.orderWay;
                             price = res.orderContent.unitPrice / 1000;
                             contain = res.orderContent.subhead;
						}
			            return(
				            <div key={i} className="dispatchQuerySon">

					            <div>
						            <FontOrder left={"订单编号：" + res.orderid}
						                       date={moment(res.time).format('YYYY-MM-DD HH:mm:ss')}/>
						            <div className="bacColor1">
							            <OrderInfo imgSrc={res.imgUrl}
							                       type={type}
							                       price={price}
							                       status={res.status}
							                       con={contain}/>
						            </div>
						            <div className="innerWhite">
							            <div className="orderTypeCon">
								            <OrderType startDate={moment(res.distTime).format('YYYY-MM-DD')}
								                       sendsType={res.style}
								                       times={res.snum / res.num}
								                       show={'hide'}/>
							            </div>
							            {/*<Discount discount="促销搭配" discountFont="现代牧业鲜奶125ml"/>*/}
							            <div className={res.giftType === '无' ? 'hide' : 'show'}>
								            <Discount discount="赠品" discountFont={res.giftType}/>
							            </div>
							            <div className="orderTypeCon">
								            <OrderTypeTwo times={res.snum / res.num}
								                          finishTime={res.rnum / res.num}
								                          leftTime={(res.snum - res.rnum) / res.num}/>
								            <div>
	                                        <span className="orderRow">
		                                        下次配送日期: {moment(res.sendTime).format('YYYY-MM-DD')}
	                                        </span>
								            </div>
							            </div>
							            {
								            res.history.map((msg,j) => {
									            if(msg.msgType === '业主调单') {
										            //每次循环都置空数值,不然会重复return显示内容
										            this.changeMsg = '';
										            this.priceMsg = '';
										            this.changeMsgTime = moment(msg.time).format('YYYY-MM-DD');
										            let newArray = msg.msg.split(';');
										            newArray.map((e) => {
											            if(e.indexOf('牛奶品种') >= 0) {
												            this.changeMsg = e; //拿到牛奶品种修改的信息
											            }
											            if(e.indexOf('差价') >= 0) {
												            this.priceMsg = e; //拿到牛奶差价信息
											            }
										            });
										            //每单对应不同的调单信息
										            return(
											            <div key={j}
											                 className={this.changeMsg ?
				                                    'orderTypeCon show' : 'orderTypeCon hide'}>
												            <p className="orderRow">业主于{this.changeMsgTime}改单:</p>
												            <p className="red" style={{fontSize: '12px'}}>{this.changeMsg}</p>
												            <p className="red" style={{fontSize: '12px'}}>{this.priceMsg}</p>
											            </div>
										            );
									            }
								            })
							            }
							            <div className="orderTypeCon">
								            <RightFont price={"¥" + (res.price + (res.diffPrice ? res.diffPrice : 0)) / 1000}/>
							            </div>

							            <div className="renewCon">
								            <button className="btnOther btnBlue2" onClick={this._handleRenew} value={i}>
									            再来一单
								            </button>
							            </div>
						            </div>
					            </div>
				            </div>
			            )
		            })}
		            {/*必须放在循环外面,不然只要页面渲染,this.state.data重新获取,RenewModal就会重复渲染data数据的次数*/}
		            {(() => {
			            if(this.state.modalClass){
				            return <RenewModal Hide={this._Hide}
				                               animateStatus={this.state.animateStatus}
				                               renewOtherClick={this._Hide}
				                               toOrder={this.props.toOrder}

				                               reduce={this.props.reduce}
				                               add={this.props.add}
				                               handleStyle={this.props.handleStyle}
				                               sureRenewOrder={this.sureRenewOrder.bind(this)}
				            />
			            }
		            })()}
	            </div>
	            <div className={this.props.orderList.renewList.length === 0 ? 'show' : 'hide'}>
		            <div className="noOrder">
			            <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_order.png" alt="noOrder"/>
			            <p>您还没有相关订单</p>
		            </div>
	            </div>

            </div>
        )
    }
}
//一定要定义
RenewOrder.contextTypes = {
	router: PropTypes.object
};

const mapStateToProps = (state, props) => {
	console.log('renewList' ,state)
	return {orderList: state.orderList,toOrder: state.toOrder};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	reduce: () => {
		dispatch(NUM_REDUCE)
	},
	add:() => {
		dispatch(NUM_ADD)
	},
	handleStyle:(style) => {
		dispatch(SELECT_SUBSCIBE_STYLE(style))
	},
	renewOrderClick:(list,index) => {
		dispatch(RENEW_ORDER(list,index))
	},
	toPlaceOrder:(couponList) => {
		dispatch(TO_PLACE_ORDER(couponList));
	},
	getInitAddr:(ownerInfo) => {
		dispatch(INIT_ADDR(ownerInfo));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(RenewOrder)


