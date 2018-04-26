import React from 'react';
import ReactDOM from 'react-dom';
import Home from './js/compont/home';//主页
import PersonCenter from './js/compont/personCenter';//个人中心页
import Purse from './js/compont/purse';//钱包页

import Logistics from './js/compont/logistics';//查看物流页
import AllSend from './js/compont/allSend';//配送记录页
import Coupon from './js/compont/coupon';//优惠券
import UsingCoupon from './js/compont/usingCoupon';//可使用的优惠券

import DispatchAddr from './js/compont/dispatchAddr';//配送地址页
import OwnerMain from './js/compont/ownerMain';//牛奶详情页
import PlaceOrder from './js/compont/placeOrder';//立即购买页
import AllOrder from './js/compont/allOrder';//订单页
import SubmitSuccess from './js/compont/submitSuccess';//提交成功页
import OrderSuccess from './js/compont/orderSuccess';//支付成功页
import ConfirmPay from './js/compont/confirmPay';//确认支付页
import Bill from './js/compont/bill';//账单页
import RenewOrder from './js/compont/renewOrder';//续订页
import Login from './js/compont/login';//登录
import OwnerLogin from './js/compont/ownLogin';//业主登录
import DispatchQuery from './js/compont/dispatchQuery';//配送查询
import ChangeOrder from './js/compont/changeOrder';//申请改单
import Feedback from './js/compont/feedback';//建议与反馈
import AddAddr from './js/compont/addAddr';//添加地址
import ChangePay from './js/compont/changePay';//调单补差
import Help from './js/compont/help';//帮助中心
import UserRegHttp from './js/compont/userRegHttp';//用户注册协议
import RechargeHttp from './js/compont/rechargeHttp';//充值协议
import ServiceHttp from './js/compont/serviceHttp';//服务协议
import store from './js/store/store';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import { Provider } from 'react-redux'

export class Root extends React.Component{
    render(){
        return(
            //路由
            <Router>
	            <Switch>

                    <Route  path="/wxReactHome" exact component={Home}></Route>

		            <Route path="/personCenter" component={PersonCenter} ></Route>

		            <Route path="/purse" component={Purse}></Route>

		            <Route path="/dispatchAddr" component={DispatchAddr}></Route>

		            <Route path="/logistics" component={Logistics}></Route>
		            <Route path="/allSend" component={AllSend}></Route>
		            <Route path="/coupon" component={Coupon}></Route>
		            <Route path="/usingCoupon" component={UsingCoupon}></Route>

		            <Route path="/ownerMain" component={OwnerMain}></Route>

		            <Route path="/placeOrder" component={PlaceOrder}></Route>

		            <Route path="/allOrder" component={AllOrder}></Route>

		            <Route path="/submitSuccess" component={SubmitSuccess}></Route>

		            <Route path="/orderSuccess" component={OrderSuccess}></Route>

		            <Route path="/confirmPay" component={ConfirmPay}></Route>

		            <Route path="/bill" component={Bill}></Route>

		            <Route path="/renewOrder" component={RenewOrder}></Route>

		            <Route path="/login" component={Login}></Route>

		            <Route path="/ownerLogin" component={OwnerLogin}></Route>

		            <Route path="/dispatchQuery" component={DispatchQuery}></Route>

		            <Route path="/changeOrder" component={ChangeOrder}></Route>

		            <Route path="/feedback" component={Feedback}></Route>

		            <Route path="/addAddr" component={AddAddr}></Route>

		            <Route path="/changePay" component={ChangePay}></Route>

                    <Route path="/help" component={Help}></Route>

                    <Route path="/userRegHttp" component={UserRegHttp}></Route>

                    <Route path="/rechargeHttp" component={RechargeHttp}></Route>

                    <Route path="/serviceHttp" component={ServiceHttp}></Route>

                </Switch>

            </Router>
        )
    }
}

const root = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Root/>
    </Provider>,root
);



/*个人中心*/
//<Route path="/personCenter" component={PersonCenter}>
//	<Route path="/coupon" component={Coupon}/>
//	<Route path="/purse" component={Purse}>
//		<Route path="/bill" component={Bill}/>
//	</Route>
//	<Route path="/allOrder" component={AllOrder}>
//		<Route path="/changeOrder" component={ChangeOrder}>
//			<Route path="/changePay" component={ChangePay}/>
//		</Route>
//		<Route path="/logistics" component={Logistics}>
//			<Route path="/allSend" component={AllSend}/>
//		</Route>
//		<Route path="/placeOrder" component={PlaceOrder}>
//			<Route path="/dispatchAddr" component={DispatchAddr}>
//				<Route path="/addAddr" component={AddAddr}/>
//			</Route>
//			<Route path="usingCoupon" component={UsingCoupon}/>
//			<Route path="confirmPay" component={ConfirmPay}>
//				<Route path="orderSuccess" component={OrderSuccess}/>
//			</Route>
//		</Route>
//	</Route>
//	<Route path="/dispatchAddr" component={DispatchAddr}>
//		<Route path="/addAddr" component={AddAddr}/>
//	</Route>
//	<Route path="/feedback" component={Feedback}>
//		<Route path="submitSuccess" component={SubmitSuccess}/>
//	</Route>
//	<Route path="/help" component={Help}>
//		<Route path="/userRegHttp" component={UserRegHttp}/>
//		<Route path="/rechargeHttp" component={RechargeHttp}/>
//		<Route path="/serviceHttp" component={ServiceHttp}/>
//	</Route>
//</Route>

/*主页*/
//<Route path="/" component={Home}>
//	<Route path="/dispatchQuery" component={DispatchQuery}>
//		<Route path="/logistics" component={Logistics}>
//			<Route path="/allSend" component={AllSend}/>
//		</Route>
//	</Route>
//	<Route path="/purse" component={Purse}>
//		<Route path="/bill" component={Bill}/>
//	</Route>
//	<Route path="/renewOrder" component={RenewOrder}>
//		<Route path="/placeOrder" component={PlaceOrder}>
//			<Route path="/dispatchAddr" component={DispatchAddr}>
//				<Route path="/addAddr" component={AddAddr}/>
//			</Route>
//			<Route path="/usingCoupon" component={UsingCoupon}/>
//			<Route path="/confirmPay" component={ConfirmPay}>
//				<Route path="/orderSuccess" component={OrderSuccess}/>
//			</Route>
//		</Route>
//	</Route>
//	<Route path="/ownerMain" component={OwnerMain}>
//		<Route path="/placeOrder" component={PlaceOrder}>
//			<Route path="/dispatchAddr" component={DispatchAddr}>
//				<Route path="/addAddr" component={AddAddr}/>
//			</Route>
//			<Route path="/usingCoupon" component={UsingCoupon}/>
//			<Route path="/confirmPay" component={ConfirmPay}>
//				<Route path="/orderSuccess" component={OrderSuccess}/>
//			</Route>
//		</Route>
//	</Route>
//</Route>
