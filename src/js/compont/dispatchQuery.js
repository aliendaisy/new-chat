/**
 * Created by qm on 2017/7/17.
 */
import React, {Component} from 'react'
import {Header,OrderInfo,RightFont,OrderType,OrderTypeTwo} from './public';
import '../../css/public.css';
import '../../css/dispatchQuery.css';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import {CANCEL_DISPAPCH_ORDER,SELECT_DISPAPCH_ORDER} from '../action/orderAction'

//配送查询页
class DispatchQuery extends Component {
	constructor(props) {
		super(props);
		this._back = this.back.bind(this);
	}
	back() {
		this.props.dispatchGoBack();
        this.context.router.history.goBack()
	}
	//跳至查看物流
	toLogistic(index) {
		this.props.selectDispatchOrder(this.props.list,index);
		this.context.router.history.push({
			pathname: '/logistics'
		});
	}
    render(){
        return(
            <div className="topCon dispatchQuery">
                <Header name="配送查询" onClick={this._back}/>
				<div className={this.props.list.length === 0 ? 'hide' : 'show'}>
                	{this.props.list.map((res, i) => {
		                let logisticInfo = '';
		                let today = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); //先把今天减少一天
		                let nextSend = [];
		                if(res.status === '已完成') {
			                logisticInfo = '所有配送已完成';
		                }else{
			                if(res.distLogistics.length === 0 || !res.distLogistics) {
				                logisticInfo = '等待下次配送'
			                }else{
				                res.distLogistics.map((msg) => {
					                if(new Date(msg.sendTime) > today) {
						                nextSend.push(msg); //push大于today的日期,由于上面减了一天,所以如果是送奶日则包括今天,状态是最新的
					                }
				                });
				                if(nextSend[0].status === '暂停') {
					                logisticInfo = '暂停配送中';
				                }else{
					                if(nextSend[0].logistics.length === 0) {
						                logisticInfo = '等待下次配送'
					                }else{
						                let logLength = nextSend[0].logistics.length;
						                logisticInfo = nextSend[0].logistics[logLength - 1].status;
					                }
				                }
			                }
		                }
						return(
							//this.toLogistic.bind(this,i)绑定了i,获取到了index值
							<div className="dispatchQuerySon" key={i} onClick={this.toLogistic.bind(this,i)}>
								<div className="topFont">
									<div className="left">
										<span className="spot"></span>
										<span>{logisticInfo}</span>
									</div>
									<div className="right">
										<span>{moment(res.time).format('YYYY-MM-DD HH:mm:ss')}</span>
									</div>
								</div>
								<OrderInfo imgSrc={res.imgUrl}
										   type={typeof(res.orderContent) ==
										   "undefined" ? "月订" : res.orderContent.orderWay}
										   price={typeof(res.orderContent)==
										   "undefined" ? res.price/1000 : res.orderContent.unitPrice / 1000}
										   status={res.status}
										   con={typeof(res.orderContent) ==
										   "undefined" ? res.type : res.orderContent.subhead}/>
								<div className="labelCon">
									<div className="labelRes">
										<OrderType startDate={moment(res.distTime).format('YYYY-MM-DD')}
												   sendsType={res.style}
												   times={res.snum / res.num}
												   show={'hide'}/>
									</div>
									<div className="labelRes labelResLast">
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
				                                     'labelRes show' : 'labelRes hide'}>
														<p className="orderRow">业主于{this.changeMsgTime}改单:</p>
														<p className="red" style={{fontSize: '12px'}}>{this.changeMsg}</p>
														<p className="red" style={{fontSize: '12px'}}>{this.priceMsg}</p>
													</div>
												);
											}
										})
									}
									<div className="labelRes">
										<RightFont price={"¥" + (res.price + (res.diffPrice ? res.diffPrice : 0)) / 1000}/>
									</div>
								</div>
							</div>
						)
					})}
				</div>
				<div className={this.props.list.length === 0 ? 'show' : 'hide'}>
					<div className="noOrder">
						<img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_order.png" alt="noOrder"/>
						<p>您还没有相关订单</p>
					</div>
				</div>
            </div>
        )
    }
}
DispatchQuery.contextTypes = {
	router: PropTypes.object
};

//传过来的值,props指向了state.toOrder
const mapStateToProps = (state, props) => {
    console.log('DispatchQuery', state)
    return state.dispatchOrder;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    dispatchGoBack:() => {
        dispatch(CANCEL_DISPAPCH_ORDER);
    },
    selectDispatchOrder:(list,index) => {
        dispatch(SELECT_DISPAPCH_ORDER(list,index));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DispatchQuery)
