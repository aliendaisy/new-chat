/**
 * Created by yulingjie on 17/7/14.
 */
import React,{Component} from 'react'
import '../../css/public.css';
import '../../css/coupon.css';
import {Header} from './public';
import {Tabs} from 'antd-mobile/lib';
import PropTypes from 'prop-types';
import moment from 'moment'; //时间格式化

import { connect } from 'react-redux';

//card组件
class UnUsedCardItem extends Component{
	render() {
		return(
			<div className={"cardCoupon " + this.props.ifUsed}>
				<div className="cardLeft left">
					<div className="cardCash left">
						<p><span>¥{this.props.cashBg}.</span><span>{this.props.cashSm}</span></p>
						<p>{this.props.cashFit}</p>
					</div>
					<div className="cardContent left">
						<p>{this.props.cashFor}</p>
						<div>{this.props.cashRange}</div>
						<p>{this.props.cashStart}至{this.props.cashEnd}</p>
					</div>
				</div>
				<div className="cardRight left" onClick={this.props.linkToBuy}>
					<p>{this.props.use}</p>
				</div>
			</div>
		)
	}
}

//可使用页面
export class UnUsedCard extends Component{
	static defaultProps = {
		ifUsed: 'UnUsedCard'
	};
	constructor(props) {
		super(props);
		this._handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		//context router 跳转
		this.context.router.history.push({
			pathname: '/wxReactHome',
			comefrom: 'coupon'
		});
	}
	render() {
		return(
			<div className="cardCon">
				<div className={this.props.data.length === 0 || this.props.data === [] ? 'hide' : 'show'}>
					{this.props.data.map((res, i) => {
						let cashFit;
						if(res.type === '无门槛'){
							cashFit = res.type
						}else if(res.type === '满减'){
							cashFit = '满' + res.minumum / 1000 + "减"
						}
						return(
							<UnUsedCardItem ifUsed={this.props.ifUsed}
							                cashBg={res.amount / 1000}
							                cashSm={'00'}
							                cashFit={cashFit}
							                cashFor={res.name}
							                cashRange={'适用范围：' + res.range.join(',')}
							                cashStart={moment(res.starttime).format('YYYY-MM-DD')}
							                cashEnd={moment(res.endtime).format('YYYY-MM-DD')}
							                use={res.status}
							                linkToBuy={this._handleClick}
							                key={i}/>
						)
					})}
				</div>
				<div className={this.props.data.length === 0 || this.props.data === [] ? 'show' : 'hide'}>
					<div className="noOrder whiteBack">
						<img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_coupon.png" alt="noCoupon"/>
						<p>您没有可使用的代金券</p>
					</div>
				</div>
			</div>
		)
	}
}
//一定要定义
UnUsedCard.contextTypes = {
	router: PropTypes.object
};
//已使用页面
export class UsedCard extends Component{
	static defaultProps = {
		ifUsed: 'UsedCard'
	};
	render() {
		return(
			<div className="cardCon">
				<div className={this.props.data.length === 0 || this.props.data === [] ? 'hide' : 'show'}>
					{this.props.data.map((res, i) => {
						let cashFit;
						if(res.type === '无门槛'){
							cashFit = res.type
						}else if(res.type === '满减'){
							cashFit = '满' + res.minumum / 1000 + "减"
						}
						return(
							<UnUsedCardItem ifUsed={this.props.ifUsed}
							                cashBg={res.amount / 1000}
							                cashSm={'00'}
							                cashFit={cashFit}
							                cashFor={res.name}
							                cashRange={'适用范围：' + res.range.join(',')}
							                cashStart={moment(res.starttime).format('YYYY-MM-DD')}
							                cashEnd={moment(res.endtime).format('YYYY-MM-DD')}
							                use={res.status}
							                key={i}/>
						)
					})}
				</div>
				<div className={this.props.data.length === 0 || this.props.data === [] ? 'show' : 'hide'}>
					<div className="noOrder whiteBack">
						<img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_coupon.png" alt="noOrder"/>
						<p>您已经没有此类代金券</p>
					</div>
				</div>
			</div>
		)
	}
}

//切换页面
class ChangeTab extends Component{
	render(){
		let index = this.props.index;
		switch (index){
			case 1:
				return <UsedCard data={this.props.noUseData}/>;
			case 2:
				return <UsedCard data={this.props.overData}/>;
			default:
				return <UnUsedCard data={this.props.canUseData}/>;
		}
	}
}
//代金券总页面
export class Coupon extends Component{
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '0'
		};
		this.arr = ['可使用','已使用','已过期'];
		this._callback = this.callback.bind(this);
		this._handleTabClick = this.handleTabClick.bind(this);
		this._couponBack = this.couponBack.bind(this);//导航返回
	}
	callback(key) {
		//console.log('onChange', key);
	}
	handleTabClick(key) {
		//console.log('onChange', key);
	}
	//导航返回
	couponBack(){
		this.context.router.history.goBack()
	}
	render() {
		console.log('++++++++++',this.props.couponData.canUseData)
		return(
			<div className="coupon">
				<div className="topCon">
					<Header name="现金券" onClick={this._couponBack}/>
					<Tabs defaultActiveKey={this.state.activeTab}
					      onChange={this._callback}
					      onTabClick={this._handleTabClick}
					      swipeable={false}>
						{this.arr.map((res, i) => {
							return (
								<Tabs.TabPane tab={res} key={i}>
									<ChangeTab index={i}
									           canUseData={this.props.couponData.canUseData}
									           overData={this.props.couponData.overData}
									           noUseData={this.props.couponData.noUseData}/>
								</Tabs.TabPane>
							)
						})}
					</Tabs>
				</div>
			</div>
		)
	}
}
Coupon.contextTypes = {
	router: PropTypes.object
};

//传过来的值,props指向了state.toOrder
const mapStateToProps = (state, props) => {
	console.log('coupon', state.couponData)
	return {couponData:state.couponData};
};

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Coupon)
