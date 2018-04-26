import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/orderSuccess.css';
import {NoBackHeader,SuccessSign,GreyBtn,TwoFont,fetchJson} from './public';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import { connect } from 'react-redux';
import store from '../store/store';
import {TO_ALL_ORDER} from '../action/orderAction';

//订购成功主页面
class OrderSuccess extends Component {
	constructor(props) {
		super(props);
	}
    render(){
        return(
            <div className="orderSuccessCon">
                <NoBackHeader name="支付"/>
                <div className="innerWhite topCon">
                    <div className="successBox">
                        <SuccessSign success="订购成功"/>
                    </div>
                    <div className="successInfo">
                        <div className="successSon">
                            <TwoFont left="订购内容:" date={this.props.toOrder.SelectGood.homeTitle}/>
                            <TwoFont left="订购数量:" date={this.props.toOrder.snum}/>
                            <TwoFont left="订购方式:" date={this.props.toOrder.orderType}/>
	                        {/*<TwoFont left="促销搭配:" date={allData.match}/>*/}
                            <TwoFont left="配送方式:" date={this.props.toOrder.styleType}/>
                            <TwoFont left="配送日期:" date={moment(this.props.toOrder.sendDate).format('YYYY-MM-DD')}/>
                        </div>
                    </div>
                    <div className="successSon distance">

                        <GreyBtn greyBtn="查看订单" onClick={() => {
                            var self = this;
                            let owner = store.getState().owner;
                            let status = '配送中';
                            //获取订单
                            fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: status},function(msg) {
                                store.dispatch(TO_ALL_ORDER(msg.data,status,'1'))
                                self.context.router.history.push({
                                    pathname: '/allOrder',
                                    comefrom:'orderSuccess'
                                });
                            });
                        }}/>
                        <div className="right">
                            <Link to="/wxReactHome">
                                <GreyBtn greyBtn="返回首页"/>
                            </Link>
                        </div>
                    </div>
                    <div className="successSon distance shareBox">
                        <span className="iconfont icon-fenxiang"></span>
                        <span className="shareFont">觉得不错,快点击右上角分享</span>
                    </div>
                </div>
            </div>
        )
    }
}
OrderSuccess.contextTypes = {
	router: PropTypes.object
};
const mapStateToProps = (state, props) => {
    console.log('orderSuccess', state.toOrder)
    return {toOrder:state.toOrder};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    // handleStyle:(style) => {
    //     dispatch(SELECT_STYLE_TYPE(style))
    // },
    // handleDate:(date) => {
    //     dispatch(SELECT_SEND_DATE(date))
    // },
    //
    // handleReceiveOrderId:(orderid) => {
    //     dispatch(RECEIVE_ORDER_ID(orderid))
    // },

});

export default connect(mapStateToProps, mapDispatchToProps)(OrderSuccess)

