/**
 * Created by yulingjie on 17/7/11.
 */
import React, {Component} from 'react'
import {Header,OrderInfo,RowInto,OrderType,OrderTypeTwo} from './public';
import '../../css/public.css';
import '../../css/logistics.css';
import '../../css/icomoon.css';
import PropTypes from 'prop-types';
import moment from 'moment';
import UnSend from './unSend';
import ChangeSend from './changeSend';
import PauseSend from './pauseSend';

import { connect } from 'react-redux';
import {TO_ALL_SEND} from '../action/orderAction';


//const sendArr = [
//	{
//		status: '奶箱已回收,奶箱实时温度4`C',
//		date: '2017-07-14 08:55:22'
//	},{
//		status: '奶箱已回收,奶箱实时温度5`C',
//		date: '2017-07-14 08:55:52'
//	},{
//		status: '奶箱已回收,奶箱实时温度3`C',
//		date: '2017-07-14 09:55:32'
//	},{
//		status: '奶箱已回收,奶箱实时温度2`C',
//		date: '2017-07-14 10:55:22'
//	}
//];

//配送日历
class CalenderItem extends Component{
	constructor(props) {
		super(props);
		this._handleClick = this.handleClick.bind(this);
	}
	//点击时绑定事件,并获得this.props.value值(根据父组件循环取得)
	handleClick() {
		this.props.showStatus(this.props.value);
	}
    render() {
        return(
            <li className="calender" onClick={this._handleClick} value={this.props.value}>
                <div className={"logStatus iconfont " + this.props.sendStatus}></div>
	            <div className={"iconfont icon-error icon-badge " + this.props.iconShow}></div>
                <div className="smFont">{this.props.sendDate}</div>
            </li>
        )
    }
}
//日历循环和点击检测状态
export class Calender extends Component{
	constructor(props) {
		super(props);
		this._forStatus = this.forStatus.bind(this);
		this._forSwitch = this.forSwitch.bind(this);
	}
	//根据状态切换图片样式
	forStatus(ev) {
		if(ev === '已配送') {
			return 'icon-over';
		}else if(ev === '正在配送') {
			return 'icon-sending';
		}else{
			return 'icon-undo';
		}
	}
	//根据状态加上调单的图片样式
	forSwitch(ev) {
		if(ev === '已调单' || ev === '暂停') {
			return 'show';
		}else{
			return 'hide';
		}
	}
	render() {
		return(
			<div>
				<ul className="whiteBack">
					{this.props.arr.map((res, i) => {
						return(
							//此处sendStatus传给子组件的是props.sendStatus
							<CalenderItem sendStatus={this._forStatus(res.status)}
							              iconShow={this._forSwitch(res.status)}
							              value={{status: res.status,index: i,result: res}}
							              sendDate={res.time}
							              key={i}
							              showStatus={this.props._handleClick}/>

						)
					})}
				</ul>
				<div className="whiteBack marginT">
					<div className={"labelCon " + this.props.statusShow}>
						<div className="labelRes labelResLast">检测状态</div>
						{this.props.sonShow}
					</div>
				</div>
			</div>
		)
	}
}

//配送中的物流信息/配送完成
export class Sending extends Component{
	render() {
		return(
			<ul className="packageDetail">
				{this.props.data.reverse().map((res, i) => {
					return(
						<SendingSon sendingStatus={res.status}
						            sendingTime={moment(res.time).format('YYYY-MM-DD')}
						            key={i}
						/>
					)
				})}
			</ul>
		)
	}
}
//配送中的物流信息子组件
class SendingSon extends Component{
	render() {
		return(
			<li>
				<p className="sendingTitle">{this.props.sendingStatus}</p>
				<p className="sendingTime">{this.props.sendingTime}</p>
			</li>
		)
	}
}
//查看物流页面
export class Logistics extends Component{
	constructor(props) {
		super(props);
		this.state = {
			statusShow: 'hide',
			sonShow: <UnSend/>
		};
		this._back = this.back.bind(this);
		this._toAllSend = this.toAllSend.bind(this);
		this._clickShowStatus = this.clickShowStatus.bind(this);
	}
	componentWillMount() {
		let todayTime = moment(new Date()).format('YYYY-MM-DD'); //今天的日期
		let allLogistics = []; //所有配送日
		let oneDay = 60 * 60 * 24 * 1000;
		let varies = this.props.style == '三天一送' ? 3 : 6;
		let leftTimes = (this.props.snum - this.props.rnum) / this.props.num;
		let sendDate = moment(this.props.sendTime).format('YYYY-MM-DD');

		let monthArray = []; //按月分的配送日

		let thisMonth = []; //当月配送日
		let todayYear = new Date(todayTime).getFullYear();
		let todayMonth = new Date(todayTime).getMonth() + 1;

		//如果是老订单
		if(!this.props.distLogistics || this.props.distLogistics.length === 0) {
			//先遍历history数组,查看送奶纪录,push到需要的数组中;
			this.props.history.map((res) => {
				if(res.msg && res.msg.indexOf('次送奶') >= 0) {
					allLogistics.push({
						time: moment(res.time).format('YYYY-MM-DD'),
						status: '已配送',
						transfer: [], //调单信息
						logistics: [] //物流信息
					});
				}
			});
			//如果还有剩余次数
			if(leftTimes > 0) {
				//如果今日是送奶日
				if(sendDate === todayTime) {
					allLogistics.push({
						time: sendDate,
						status: '正在配送'
					});
					//push剩余未配送日
					for(var j = 0;j < leftTimes - 1;) {
						allLogistics.push({
							time: sendDate,
							status: '未配送'
						});
						sendDate = moment(new Date(sendDate).getTime() + varies * oneDay).format('YYYY-MM-DD');
						j ++;
					}
				}
				//今日不是送奶日,直接push未配送日
				else{
					for(var i = 0;i < leftTimes;) {
						allLogistics.push({
							time: sendDate,
							status: '未配送'
						});
						sendDate = moment(new Date(sendDate).getTime() + varies * oneDay).format('YYYY-MM-DD');
						i ++;
					}
				}
			}
		}else{
			this.props.distLogistics.map((res) => {
				if(res.status !== '暂停'){
					allLogistics.push({
						time: moment(res.sendTime).format('YYYY-MM-DD'),
						status: res.status,
						_id: res._id,
						transfer: res.transfer, //调单信息
						logistics: res.logistics //物流信息
					});
				}
			});
		}

		//获取按月份排布的数据数组
		let firstItem = new Date(allLogistics[0].time);
		let lastItem = new Date(allLogistics[allLogistics.length - 1].time);
		let firstYear = firstItem.getFullYear();
		let firstMonth = firstItem.getMonth() + 1;
		let lastYear = lastItem.getFullYear();
		let lastMonth = lastItem.getMonth() + 1;
		//生成按月份的array树
		let num = lastMonth + 12 * (lastYear - firstYear) - firstMonth + 1; //总共的月份数
		let year = firstYear;
		let month = firstMonth;

		for(var k = 0;k < num;) {
			monthArray.push({
				year: year,
				month: month,
				monthName: `${year}年${month}月`,
				monthData: []
			});

			month ++;
			if(month > 12) {
				year ++;
				month = 1;
			}
			k ++;
		}
		//在所有日期中遍历
		allLogistics.map((res) => {
			//获得所有time的年份和月份
			let matchYear = new Date(res.time).getFullYear();
			let matchMonth = new Date(res.time).getMonth() + 1;
			//遍历monthArray
			monthArray.map((msg) => {
				//如果遍历的项年月匹配,则push到monthData中,这样最终的配送日期数据数组monthArray就生成了
				if(matchYear === msg.year && matchMonth === msg.month) {
					msg.monthData.push(res);
				}
			});
		});
		//生成当月数据
		monthArray.map((res,i) => {
			if(res.year === todayYear && res.month === todayMonth) {
				thisMonth = res.monthData;
			}
		});
		this.thisMonth = thisMonth;
		this.monthArray = monthArray;
	}
	//跳转至所有配送纪录页
	toAllSend() {
		this.props.getMonthArray(this.monthArray);
		this.context.router.history.push({
			pathname: '/allSend'
		});
	}
	//返回dispatchQuery
	back() {
		this.context.router.history.goBack();
	}
	//切换检测状态内容
	clickShowStatus(e) {
		//将子组件中点击获得的值传给父组件,用来判断(这里的e相当于子组件中的props.value)
		this.setState({statusShow: 'show'}); //显示检测状态栏
		if(e.status === '未配送') {
			this.setState({
				sonShow: <UnSend/>
			});
		}else if(e.status === '已调单') {
			this.setState({
				sonShow: <ChangeSend content={e.result.transfer[0].logMsg}
				                     time={moment(e.result.transfer[0].time).format('YYYY-MM-DD')}
				/>
			});
		//}else if(e.status === '暂停') {
		//	this.setState({
		//		sonShow: <PauseSend/>
		//	})
		}else{
			let logisticList = [];
			if(e.result.logistics.length === 0 || !e.result.logistics) {
				logisticList.unshift('本次配送已完成');
			}else{
				e.result.logistics.map((res) => {
					logisticList.unshift(res);
				});
			}
			this.setState({
				sonShow: <Sending data={logisticList}/>
			});
		}
	}
	render() {
		//处理老订单
		let subhead = '';
		let orderWay = '';
		let price = '';
		if(typeof(this.props.orderContent) === "undefined") {
			subhead = this.props.type;
			orderWay = '月订';
			price = this.props.price / 1000;

		}else{
			subhead = this.props.orderContent.subhead;
			orderWay = this.props.orderContent.orderWay;
			price = this.props.orderContent.unitPrice / 1000;
		}
        return(
            <div className="topCon">
	            <Header name="查看物流" onClick={this._back}/>
	            <div className="topFont">
	                <div className="left">订单编号: {this.props.orderid}</div>
	                <div className="right">{moment(this.props.time).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
                <OrderInfo imgSrc={this.props.imgUrl}
                           con={subhead}
                           type={orderWay}
                           price={price}
                           status={this.props.status}/>
	            <div className="labelCon">
		            <div className="labelRes">
			            <OrderType startDate={moment(this.props.distTime).format('YYYY-MM-DD')}
			                       sendsType={this.props.style}
			                       times={this.props.snum / this.props.num}
			                       show={'hide'}/>
		            </div>
		            <div className="labelRes labelResLast">
			            <OrderTypeTwo times={this.props.snum / this.props.num}
			                          finishTime={this.props.rnum / this.props.num}
			                          leftTime={(this.props.snum - this.props.rnum) / this.props.num}/>
			            <div>
				            <span className="orderRow">
					            下次配送日期: {moment(this.props.sendTime).format('YYYY-MM-DD')}
				            </span>
			            </div>
		            </div>
	            </div>
	            <div className="whiteBack marginT">
		            <div onClick={this._toAllSend}>
			            <RowInto name="配送状态" content="查看配送记录"/>
		            </div>
	            </div>
	            <Calender arr={this.thisMonth}
		                  _handleClick={this._clickShowStatus}
		                  sonShow={this.state.sonShow}
		                  statusShow={this.state.statusShow}
	            />
            </div>
        )
    }
}
Logistics.contextTypes = {
	router: PropTypes.object
};

const mapStateToProps = (state, props) => {
    console.log('Logistics', state.logistics)
    //return {dispatchOneOrder:state.dispatchOrder.list[state.dispatchOrder.selectIndex]};
	return state.logistics;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    getMonthArray:(sendData) => {
	    dispatch(TO_ALL_SEND(sendData))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Logistics);


