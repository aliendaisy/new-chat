/**
 * Created by yulingjie on 17/7/13.
 */
import React,{Component} from 'react'
import {Header} from './public';
import '../../css/public.css';
import '../../css/logistics.css';
import {Calender,Sending} from './logistics';
import {Accordion} from 'antd-mobile/lib';
import PropTypes from 'prop-types';
import moment from 'moment';
import UnSend from './unSend';
import ChangeSend from './changeSend';
import PauseSend from './pauseSend';

import { connect } from 'react-redux';

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
export class AllSend extends Component{
	constructor(props) {
		super(props);
		this.state = {
			sonShow: <UnSend/>,
			sendShow: false
		};

		this._back = this.back.bind(this);
		this._clickShowStatus = this.clickShowStatus.bind(this);
	}
	componentWillMount() {
		//生成年份数组
		this.yearArray = [];
		for(var i = 0;i < this.props.monthArray.length;i ++) {
			if(this.yearArray.indexOf(this.props.monthArray[i].year) < 0) {
				this.yearArray.push(this.props.monthArray[i].year);
			}
		}
		//获取默认展开的index(string类型)
		let todayYear = new Date().getFullYear();
		let todayMonth = new Date().getMonth() + 1;
		this.props.monthArray.map((res,i) => {
			if(res.year === todayYear && res.month === todayMonth) {
				this.defaultIndex = i.toString(); //默认展开的index
			}
		});
		console.log(this.props.monthArray)
	}
	back() {
		this.context.router.history.goBack();
	}
	//切换检测状态内容
	clickShowStatus(e) {
		this.setState({sendShow: true}); //显示检测状态栏
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
	hideSend() {
		this.setState({
			sendShow: false
		});
	}
	render() {
		return(
			<div className="topCon">
				<Header name="配送记录" onClick={this._back}/>
				{this.yearArray.map((msg,j) => {
					return(
						<div key={j}>
							<div className="subHeader">
								{`${msg}年`}
							</div>
							<Accordion defaultActiveKey={this.defaultIndex}
							           className="my-accordion">
								{
									this.props.monthArray.map((res, i) => {
										if(res.year === msg) {
											return(
												<Accordion.Panel header={res.monthName} key={i}>
													<Calender
														arr={res.monthData}
														_handleClick={this._clickShowStatus}
														statusShow={'hide'}
													/>
												</Accordion.Panel>
											)
										}
									})
								}
							</Accordion>
						</div>
					)
				})}
				{(() => {
					if(this.state.sendShow) {
						return(
							<div className="tipModalCon">
								<div className="forSend">
									{this.state.sonShow}
								</div>
								<div className="renewOpacity" onClick={this.hideSend.bind(this)}></div>
							</div>
						)
					}
				})()}
			</div>
		)
	}
}
AllSend.contextTypes = {
	router: PropTypes.object
};

const mapStateToProps = (state, props) => {
	console.log('Logistics', state.monthArray)
	return {monthArray: state.monthArray};
};

export default connect(mapStateToProps)(AllSend);
