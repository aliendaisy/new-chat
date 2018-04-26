/**
 * Created by yulingjie on 17/7/17.
 */
import React, {Component} from 'react'
import '../../css/public.css';
import '../../css/coupon.css';
import {Header,Footer} from './public';
import {Tabs} from 'antd-mobile/lib';
import PropTypes from 'prop-types';
import moment from 'moment'; //时间格式化

import { connect } from 'react-redux';
import {CHANGE_COUPON} from  '../action/orderAction';

//可用card
class UsingCardItem extends Component{
	constructor(props) {
		super(props);
		this._handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.props.clickActive(this.props.value);
	}
	render() {
		return(
			<div className={"cardCoupon " + this.props.ifUsed}>
				<div className="cardLeft cardLeftUsing left">
					<div className="cardCash left">
						<p><span>¥{this.props.cashBg}.</span><span>{this.props.cashSm}</span></p>
						<p>{this.props.cashFit}</p>
					</div>
				</div>
				<div className="cardRight cardRightUsing left" onClick={this._handleClick} value={this.props.value}>
					<div className="cardContent left">
						<p>{this.props.cashFor}</p>
						<div>{this.props.cashRange}</div>
						<p>{this.props.cashStart}至{this.props.cashEnd}</p>
					</div>
					<div className="cardFont left">
						<p className={"iconfont " + this.props.isChoose}></p>
					</div>
				</div>
			</div>
		)
	}
}
//可使用
class UsingCard extends Component{
	static defaultProps = {
		ifUsed: 'UsingCard'
	};
	constructor(props) {
		super(props);
		this._handleClick = this.handleClick.bind(this);
		this._chooseNone = this.chooseNone.bind(this);
	}
	//点击事件
	handleClick(e) {
		this.props.getNewCoupon(this.props.data[e].amount / 1000,this.props.data[e]._id,true);
	}
	//点击不使用代金券
	chooseNone() {
		this.props.getNewCoupon(0,'',false);
	}
	render(){
		return(
			<div className="cardCon">
				<div className={this.props.data.length === 0 ? 'hide' : 'show'}>
					{this.props.data.map((res,i) => {
						let active = 'false';
						var cashFit;
						if(res._id === this.props.couponId) {
							active = 'true';
						}
						//显示判断
						if(res.type === '无门槛'){
							cashFit = res.type
						}else if(res.type === '满减'){
							cashFit = '满' + res.minumum / 1000 + "减"
						}
						return(
							<UsingCardItem ifUsed={this.props.ifUsed}
							               cashBg={res.amount / 1000}
							               cashSm={'00'}
							               cashFit={cashFit}
							               cashFor={res.name}
							               cashRange={'适用范围：' + res.range.join(',')}
							               cashStart={moment(res.starttime).format('YYYY-MM-DD')}
							               cashEnd={moment(res.endtime).format('YYYY-MM-DD')}
							               isChoose={active === 'true' ? 'icon-using' : ''}
							               clickActive={this._handleClick}
							               value={i}
							               key={i}/>
						)
					})}
					<div className="nonUse" onClick={this._chooseNone}>
						<p className="left">有钱任性,不使用代金券</p>
						<p className={!this.props.valid ? 'iconfont left icon-using' : 'iconfont left'}></p>
					</div>

				</div>
				<div className={this.props.data.length === 0 ? 'show' : 'hide'}>
					<div className="noOrder whiteBack">
						<img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_coupon.png" alt="noOrder"/>
						<p>您没有可使用的代金券</p>
					</div>
				</div>
			</div>
		)
	}
}
//不能使用
class UselessCard extends Component{
	static defaultProps = {
		ifUsed: 'UsedCard'
	};
	constructor(props) {
		super(props);
		this._handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		//不做任何操作,不然会报错
	}
	render(){
		return(
			<div className="cardCon">
				<div className={this.props.data.length === 0 ? 'hide' : 'show'}>
					{this.props.data.map((res, i) => {
						var cashFit;
						if(res.type === '无门槛'){
							cashFit = res.type
						}else if(res.type === '满减'){
							cashFit = '满' + res.minumum / 1000 + "减"
						}
						return(
							<UsingCardItem ifUsed={this.props.ifUsed}
							               cashBg={res.amount / 1000}
							               cashSm={'00'}
							               cashFit={cashFit}
							               cashFor={res.name}
							               cashRange={'适用范围：' + res.range.join(',')}
							               cashStart={moment(res.starttime).format('YYYY-MM-DD')}
							               cashEnd={moment(res.endtime).format('YYYY-MM-DD')}
							               isChoose={''}
							               clickActive={this._handleClick}
							               value={i}
							               key={i}/>
						)
					})}
				</div>
				<div className={this.props.data.length === 0 ? 'show' : 'hide'}>
					<div className="noOrder whiteBack">
						<img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_coupon.png" alt="noOrder"/>
						<p>您没有不能使用的代金券</p>
					</div>
				</div>
			</div>
		)
	}
}

export class UsingCoupon extends Component{
	constructor(props) {
		super(props);
		this._handleTabClick = this.handleTabClick.bind(this);
		this._back = this.back.bind(this);
		this._handleClick = this.handleClick.bind(this); //确定点击

		this.state = {
			activeTab: '0',
			footerShow: 'show',
			amount: this.props.toOrder.coupon.amount,
			id: this.props.toOrder.coupon.id,
			valid: this.props.toOrder.coupon.valid
		};
	}
	//点击Tab
	handleTabClick(key) {
		this.setState({activeTab: key});
		if(key === '1') {
			this.setState({footerShow: 'hide'});
		}else{
			this.setState({footerShow: 'show'});
		}
	}

	//返回
	back() {
		this.context.router.history.goBack();
	}
	changeCoupon(a,b,c) {
		console.log(a,b,c)
		this.setState({
			amount: a,
			id: b,
			valid: c
		});
	}
	//点击确定
	handleClick() {
		this.props.handleCoupon(this.state.amount,this.state.id,this.state.valid); //SELECT_COUPON的派发事件
		this.context.router.history.push({
			pathname: '/placeOrder'
		});
	}

	render() {
		return(
			<div className="coupon">
				<div className="topCon">
					<Header name="现金券" onClick={this._back}/>
					<Tabs defaultActiveKey={this.state.activeTab}
					      onTabClick={this._handleTabClick}
					      swipeable={false}>
						<Tabs.TabPane tab={'可使用'} key="0">
							<UsingCard data={this.props.couponList.canUseList}
							           couponId={this.state.id}
							           valid={this.state.valid}
							           getNewCoupon={this.changeCoupon.bind(this)}
							/>
						</Tabs.TabPane>
						<Tabs.TabPane tab={'不能使用'} key="1">
							<UselessCard data={this.props.couponList.unCanUseList}/>
						</Tabs.TabPane>
					</Tabs>
				</div>
				<div className={this.state.footerShow} onClick={this._handleClick}>
					<Footer footerBtn="确定"/>
				</div>
			</div>
		)
	}
}

UsingCoupon.contextTypes = {
	router: PropTypes.object
};

//传过来的值,props指向了state.toOrder
const mapStateToProps = (state, props) => {
	console.log('state', state)
	return {couponList: state.couponList,toOrder: state.toOrder};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleCoupon:(amount,id,valid) => {
		dispatch(CHANGE_COUPON(amount,id,valid))
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(UsingCoupon)
