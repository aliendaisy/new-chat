import React, { Component } from 'react'
import '../../css/iconfont.css'
import '../../css/public.css'
import '../../css/tab.css'
import '../../css/allOrder.css'
import {Header,Modal,fetchJson,getGoodsData,getDefaultData} from './public'
import {WaitPay} from './waitPayList'
import {Send} from './sendList'
import {Finish} from './finishList'
import {RenewModal} from './renewModal'
import {Tabs,Toast} from 'antd-mobile/lib'
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import {NUM_ADD,NUM_REDUCE,SELECT_SUBSCIBE_STYLE,TO_ALL_ORDER,RENEW_ORDER,TO_PLACE_ORDER,TO_CHANGE_ORDER,
	INIT_ADDR, DELERE_ORDER, CANCEL_DELERE_ORDER,CONFIRM_DELERE_ORDER,TO_RE_PAY_ORDER,SELECT_DISPAPCH_ORDER,INIT_ALL_ORDER}
	from '../action/orderAction';
import store from '../store/store';



//全部订单
export class AllOrder extends Component{
    constructor(props){
        super(props);
        this.goodsData = getGoodsData().goodsData; //获取从public export出来的变量
        this.orderType = getDefaultData().orderType;
        this.styleType = getDefaultData().styleType;
        this.arr = ['待付款订单','配送中订单','已完成订单'];
        this._back = this.back.bind(this); //返回
        //Tab切换,antd方法
        this._handleTabClick = this.handleTabClick.bind(this);
        //未付款订单
        this._getIdForCancel = this.cancelShow.bind(this); //调出取消模态框
        this._cancelClick = this.cancelClick.bind(this); //取消按钮,取消操作
        this._deleteOrder = this.deleteOrder.bind(this); //确定按钮,删除订单
        this._getIdForPay = this.pay.bind(this); //付款
        //配送中,已完成订单(再来一单在render中已绑定,因为带参数)
        this._Hide = this.Hide.bind(this);
        this.state = {
            activeTab: this.props.orderList.tabIndex,
	        status: 'hide',//取消模态框显示状态
            renewStatus: false, //再来一单模态框显示状态
        }
    }
	//返回
	back() {
		let comefrom = this.context.router.history.location.comefrom;
		console.log("comefrom", comefrom);

		if(comefrom == 'orderSuccess' || comefrom == 'confirmPay'){
			this.context.router.history.push({
				pathname:'/wxReactHome'
			});
		}else{
			this.context.router.history.goBack();
		}

	}
	handleTabClick(key,status) {
		let self = this;
		let owner = store.getState().owner;
		switch(key) {
			case '0':
				status = '待支付';
				//fetchJson('/owner/dellWaitPayOrder',{mobile:owner.mobile},(msg) => {return;});
				break;
			case '1':
				status = '配送中';
				break;
			case '2':
				status = '已完成';
		}
		this.setState({activeTab: key});
		self.props.initOrderList();
		fetchJson('/owner/getMilkOrderByStatus',{mobile:owner.mobile,status: status},(msg) => {
			self.props.getAllList(msg.data,status,key)
		});
	}

	//确认付款,从子组件中拿取orderid数据
	pay(e) {
    	let self = this;

        store.dispatch(TO_RE_PAY_ORDER(e))
        self.context.router.history.push({
            pathname: '/confirmPay',
            comefrom:'placeOrder'
        });
	}
	//调出取消付款模态框,从子组件中拿取orderid数据
	cancelShow(e){
        this.props.delereOrder(e);
		this.setState({
			orderId: e,
			status: 'show'
		});
	}
	//模态框取消按钮
	cancelClick(){
        this.props.cancelDelereOrder()
		this.setState({
			status: 'hide'
		});

	}
	//模态框确认按钮,调取删除订单接口
	deleteOrder() {
		fetchJson('/owner/cancelNewXdmyMilkOrder',{orderid: this.state.orderId,ownerid:localStorage.getItem("ownerid")},(msg) => {
			console.log(msg)
			//删除订单并刷新页面数据
            this.props.confirmDeleteOrder();
            Toast.info('成功取消订单!', 1);
            this.setState({
                status: 'hide'
            });
		});
	}

	//match参数要写在前面,match对应调用时bind的值(可复用)
	renewClick(e) {
		let index = e.target.value;
		this.props.renewOrderClick(this.props.orderList.allList,index);

		this.setState({
			renewStatus: true,
			animateStatus: 'slideInUp'
		});
	}
    //再来一单模态框隐藏
	Hide() {
		this.setState({animateStatus: 'slideOutDown'});
		//模态框需要延迟消失
		this.timer = setTimeout(function() {
			this.setState({
				renewStatus: false
			});
		}.bind(this), 300);
	}
	//申请调单跳转
	changeOrder(e) {
		let index = e.target.value;
		this.props.toChangeOrder(index);
		if(this.props.orderList.allList[index].orderContent) {
			if(this.props.orderList.allList[index].orderContent.subhead.indexOf('蔬菜') < 0) {
				this.context.router.history.push({
					pathname: '/changeOrder'
				});
			}else{
				Toast.info('蔬菜类暂不支持调单', 1.5);
			}
		}else{
			Toast.info('通过公众号下单才可申请调单',1.5);
		}
	}
	//查看物流
	sendView(e) {
		let index = e.target.value;
		this.props.selectDispatchOrder(this.props.orderList.allList,index);
		if(this.props.orderList.allList[index].orderContent) {
			this.context.router.history.push({
				pathname: '/logistics'
			});
		}else{
			Toast.info('通过公众号下单才可查看物流',1.5);
		}
	}
	//立即续订按钮跳转下单页面
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
    render() {
        return (
            <div className="topCon allOrder">
                <Header name='订单' onClick={this._back}/>
	            <div className="tabCon">
		            <Tabs defaultActiveKey={this.state.activeTab}
		                  onTabClick={this._handleTabClick}
		                  swipeable={false}
		            >
			            <Tabs.TabPane tab={this.arr[0]} key="0">
				            <div className={this.props.orderList.allList.length === 0 ? 'hide' : 'show'}>
					            <WaitPay
						            data={this.props.orderList.allList}
						            getIdForPay={this._getIdForPay}
			                        getIdForCancel={this._getIdForCancel}
					            />
				            </div>
				            <div className={this.props.orderList.allList.length === 0 ? 'show' : 'hide'}>
					            <div className="noOrder">
						            <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_order.png" alt="noOrder"/>
						            <p>您还没有相关订单</p>
					            </div>
				            </div>
			            </Tabs.TabPane>
			            <Tabs.TabPane tab={this.arr[1]} key="1">
				            <div className={this.props.orderList.allList.length === 0 ? 'hide' : 'show'}>
					            <Send
						            data={this.props.orderList.allList}
				                    _renewClick={this.renewClick.bind(this)}
				                    _changeOrder={this.changeOrder.bind(this)}
				                    _sendView={this.sendView.bind(this)}
					            />
				            </div>
				            <div className={this.props.orderList.allList.length === 0 ? 'show' : 'hide'}>
					            <div className="noOrder">
						            <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_order.png" alt="noOrder"/>
						            <p>您还没有相关订单</p>
					            </div>
				            </div>
			            </Tabs.TabPane>
			            <Tabs.TabPane tab={this.arr[2]} key="2">
				            <div className={this.props.orderList.allList.length === 0 ? 'hide' : 'show'}>
					            <Finish
						            data={this.props.orderList.allList}
				                    _renewClick={this.renewClick.bind(this)}
				                    _sendView={this.sendView.bind(this)}
					            />
				            </div>
				            <div className={this.props.orderList.allList.length === 0 ? 'show' : 'hide'}>
					            <div className="noOrder">
						            <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_order.png" alt="noOrder"/>
						            <p>您还没有相关订单</p>
					            </div>
				            </div>
			            </Tabs.TabPane>
		            </Tabs>
	            </div>
	            <Modal status={this.state.status}
	                   header="提示"
	                   left="取消"
	                   right="确定"
	                   _cancelClick={this._cancelClick}
	                   tip='确认取消付款?'
	                   _confirmClick={this._deleteOrder}
	            />
	            {(() => {
		            if(this.state.renewStatus){
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
        );
    }
}
AllOrder.contextTypes = {
	router: PropTypes.object
};

const mapStateToProps = (state, props) => {
	console.log('allOrder', state)
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
	getAllList:(allList,status,tabIndex) => {
		dispatch(TO_ALL_ORDER(allList,status,tabIndex))
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
	toChangeOrder:(orderIndex) => {
		dispatch(TO_CHANGE_ORDER(orderIndex))
	},
	delereOrder:(orderid) => {
		dispatch(DELERE_ORDER(orderid))
	},
	cancelDelereOrder:() => {
		dispatch(CANCEL_DELERE_ORDER)
	},
	confirmDeleteOrder:() => {
		dispatch(CONFIRM_DELERE_ORDER)
	},
	selectDispatchOrder:(list,index) => {
		dispatch(SELECT_DISPAPCH_ORDER(list,index));
	},
    initOrderList:() => {
		dispatch(INIT_ALL_ORDER)
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(AllOrder)

