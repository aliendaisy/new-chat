/**
 * Created by yulingjie on 17/8/16.
 */
import React, { Component } from 'react'
import '../../css/public.css'
import '../../css/allOrder.css'
import {OrderInfo,OrderType,RightFont,Discount,FontOrder} from './public'
import moment from 'moment'; //时间格式化
//待付款主页面
export class WaitPay extends Component {
	constructor(props) {
		super(props);
		this._pay = this.pay.bind(this);
		this._handleCancel = this.handleCancel.bind(this);
	}
	//指向父组件,传点击是第几项
	pay(e) {
		this.props.getIdForPay(e.target.value);
	}
	//指向父组件,传点击是第几项
	handleCancel(e) {
		this.props.getIdForCancel(e.target.value);
	}
	render(){
		return(
			<div style={{background: '#f4f4f4'}}>
				{this.props.data.map((res,i) => {
					let type = '';
					let price = '';
					let con = '';
					if(typeof (res.orderContent) != 'undefined') {
						type = res.orderContent.orderWay;
						price = res.orderContent.unitPrice / 1000;
						con = res.orderContent.subhead;
					}else{
						type = '月订';
						price = res.price / 1000;
						con = res.type
					}
					return(
						<div key={i} className="dispatchQuerySon">
							<FontOrder left={"订单编号："+ res.orderid}
							           date={moment(res.time).format('YYYY-MM-DD HH:mm:ss')}/>
							<div className="bacColor1">
								<OrderInfo imgSrc={res.imgUrl}
								           type={type}
								           price={price}
								           status={res.status}
								           con={con}/>
							</div>
							<div className="innerWhite">
								<div className="orderTypeCon">
									<OrderType startDate={moment(res.distTime).format('YYYY-MM-DD')}
									           sendsType={res.style}
									           times={res.snum / res.num}
									           show={'showInline'}/>
								</div>
								{/*<Discount discount="促销搭配" discountFont="现代牧业鲜奶125ml"/>*/}
								<div className={res.giftType === '无' ? 'hide' : 'show'}>
									<Discount discount="赠品" discountFont={res.giftType}/>
								</div>
								{/*<div className={!res.orderContent.voucherPrice ? 'hide' : 'show'}>
								 <Discount discount="代金券抵扣" discountFont={'-¥ ' + res.orderContent.voucherPrice}/>
								 </div>*/}
								<div className="orderTypeCon">
									<RightFont price={"¥" + res.price / 1000}/>
								</div>
								<div className="allOrderBtnCon">
									<button className="btnOther btnBlue2 right"
									        onClick={this._pay}
									        value={res.orderid}>付款</button>
									<button className="btnOther btnBlue1 right"
									        onClick={this._handleCancel}
									        value={res.orderid}>取消</button>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		)
	}
}
