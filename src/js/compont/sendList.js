/**
 * Created by yulingjie on 17/8/16.
 */
import React, { Component } from 'react'
import '../../css/public.css'
import '../../css/allOrder.css'
import {OrderInfo,OrderType,OrderTypeTwo,RightFont,Discount,FontOrder} from './public'
import moment from 'moment'; //时间格式化

//派送中主页面
export class Send extends Component {
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
							<FontOrder left={"订单编号：" + res.orderid}
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
	                                        下次配送日期:
	                                        <span className="red">
	                                            {moment(res.sendTime).format('YYYY-MM-DD')}
	                                        </span>
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
								<div className="allOrderBtnCon">
									<button className="btnOther btnBlue2 right"
									        onClick={this.props._renewClick}
									        value={i}>
										再来一单
									</button>
									<button className="btnOther btnBlue1 right"
									        onClick={this.props._sendView}
									        value={i}>
										查看物流
									</button>
									<button className="btnOther btnBlue1 right"
									        onClick={this.props._changeOrder}
									        value={i}>
										申请调单
									</button>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		)
	}
}
