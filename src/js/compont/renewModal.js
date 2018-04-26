/**
 * Created by yulingjie on 17/8/15.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import {Discount,getDefaultData} from './public';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NumChanageFun from "./numChanage";
import SubscribeStyle from "./subscribeStyle";


//模态框
export class RenewModal extends Component {
	constructor(props) {
		super(props);
		this.standOrderType = getDefaultData().StandOrderType;
		this.orderType = getDefaultData().orderType;
	}
	render(){
		//优惠
		let discount = false;
		let discountContent = "";
		//let addNum = 0;
		let gift = false;
		let giftContent = "";
		this.standOrderType.map((item) => {
			if (item.type === this.props.toOrder.orderType){
				if(item.num < this.props.toOrder.snum){
					discount = true;
					discountContent = `加送${this.props.toOrder.snum - item.num}瓶${this.props.toOrder.SelectGood.note}`;
					//addNum = this.props.snum - item.num;
				}else {
					discount = false;
				}
			}
		});
		//赠品
		if (this.props.toOrder.giftType === "无"){
			gift = false;
		}else {
			gift = true;
			if(this.props.giftType.indexOf('酸奶8盒装') >= 0) {
				giftContent =
					`共赠送${this.props.toOrder.giftType}${this.props.toOrder.giftSnum*this.props.toOrder.num}份,配送${this.props.toOrder.giftSnum}份`
			}else{
				giftContent =
					`共赠送${this.props.toOrder.giftType}${this.props.toOrder.giftSnum*this.props.toOrder.num}瓶,配送${this.props.toOrder.giftSnum}瓶`
			}
		}

		//判断蔬菜
		if (this.props.toOrder.SelectGood.orderTitle.indexOf('蔬菜') >= 0) {
			this.vegeShow = true;
		}else{
			this.vegeShow = false;
		}

		return(
			<div className="renewModal">
				<div className={'modalCon animated ' + this.props.animateStatus}>
					<div className="modalSon">
						<div className="modalHeader">
							<div>
								{this.props.toOrder.SelectGood.orderTitle}
							</div>
							<div>
								<i className="iconfont icon-chahao iconSm colorGrey" onClick={this.props.Hide}></i>
							</div>
						</div>
						<div className="modalPrice">
							<span className="price">{'¥ ' + this.props.toOrder.disPrice}</span>
							<span className={this.props.toOrder.disPrice === this.props.toOrder.price
							? 'priceDisable hide' : 'priceDisable showInline'}>
								{'¥ ' + this.props.toOrder.price}
							</span>
						</div>
						<div className={discount === true ? 'show' : 'hide'}>
							<Discount discount="优惠" discountFont={discountContent}/>
						</div>
						<div className={gift === true ? 'show' : 'hide'}>
							<Discount discount="赠品" discountFont={giftContent}/>
						</div>
						<div className="orderTypeCon">
							<span className="orderRow">订购份数</span>
							<div className="right">
								{/*<NumChange valueFinal={this._valueFinal} defaultNum={this.props.num}/>*/}
								<NumChanageFun reduce={this.props.reduce}
								               add={this.props.add}
								               defaultNum={this.props.toOrder.num}/>
							</div>
						</div>
						<div className={this.vegeShow ? "hide" : "orderTypeCon"}>
							<span className="orderRow">订购方式</span>
							<div className="threeBtn">
								<SubscribeStyle style={this.props.toOrder.orderType}
								                arr={this.orderType}
								                handleStyle={this.props.handleStyle}/>
							</div>
						</div>
						<div className="ownerFooter" style={{fontSize: '14px'}}>
							配送{this.props.toOrder.snum}次 每次{this.props.toOrder.num}份
						</div>
						{/*<div className="orderTypeCon clearLine">
						 <OrderType sendsType="促销搭配"/>
						 <div className="threeBtn">
						 <button className="btnOther btnBlue" >现代牧业酸奶100g ¥3</button>
						 <button className="btnOther btnBlue" >现代牧业鲜奶125ml ¥3</button>
						 </div>
						 </div>*/}
					</div>
					<div className="modalFooter">
						<div className="modalFooterLeft">合计: <span className="red">¥{this.props.toOrder.amount}</span></div>
						<div className="modalFooterRight" onClick={this.props.sureRenewOrder}>
							<button>立即续订</button>
						</div>
					</div>
				</div>
				<div className="renewOpacity" onClick={this.props.renewOtherClick}></div>
			</div>
		)
	}
}
//一定要定义
RenewModal.contextTypes = {
	router: PropTypes.object
};

const mapStateToProps = (state, props) => {

};

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(RenewModal)
