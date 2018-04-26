import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/purse.css';
import {Header,RightFont,Footer,fetchJson} from './public';
import { Toast } from 'antd-mobile/lib';
import PropTypes from 'prop-types';

//充值盒子
class Recharge extends Component{
    constructor(props){
        super(props);
        this._handle = this.handle.bind(this);
    }
    //传递函数与参数
    handle(){
        this.props.handle(this.props.value,this.props.price,this.props.give)
    }
    render(){
        return(
            <div className={"rechargeBox left " + this.props.bacColor}
                 onClick={this._handle}
                 value={this.props.value}>
                {this.props.price}
                <div className={"rechargeSon " + this.props.status}>
                    {this.props.give}
                </div>
            </div>
        )
    }
}
//钱包主页面
export default class Purse extends Component{
    constructor(props){
        super(props);
        this.handle = this.handle.bind(this);
        this._handlePay = this.handlePay.bind(this);
        this._purseBack = this.purseBack.bind(this);
	    this.priceArr = [
		    {
			    price: '100',
			    give: '0'
		    },
		    {
			    price: '200',
			    give: '10'
		    },
		    {
			    price: '400',
			    give: '40'
		    },
		    {
			    price: '1000',
			    give: '150'
		    },
		    {
			    price: '2000',
			    give: '400'
		    },
		    {
			    price: '5000',
			    give: '1000'
		    }
	    ]; //充值数据

	    this.state = {
            index: 0, //索引
            _price: this.priceArr[0].price, //默认金额
            _give: this.priceArr[0].give, //默认金额
	        capital:'', //本金
	        givesMount:'', //赠金
	        allAccount:'', //总金额整数
	        spotTwo:'' //总金额小数点后两位
        };
    }
    //Recharge组件的点击事件 从子组件传值
    handle(e,a,b){
        //参数a代表本金，b代表赠金
        if(this.state.index !== e){
            this.setState({
                index: e,
                _price: a,
                _give: b
            });
        }
    }
    //返回
    purseBack(){
        let comefrom = this.context.router.history.location.comefrom;
        if(comefrom == 'personCenter/purse/rechargeHttp'){
            this.context.router.history.push({
                pathname: '/personCenter',
                comefrom:'rechargeHttp'
            });
        } else if(comefrom == 'home/purse/rechargeHttp'){
            this.context.router.history.push({
                pathname: '/wxReactHome',
                comefrom:'rechargeHttp'
            });
        } else if(comefrom == 'personCenter/purse/bill'){
            this.context.router.history.push({
                pathname: 'personCenter',
                comefrom:'bill'
            });
        }else if(comefrom == 'home/purse/bill'){
            this.context.router.history.push({
                pathname: '/wxReactHome',
                comefrom:'bill'
            });
        }else if(comefrom == '/wxReactHome' || comefrom == 'personCenter'){
            this.context.router.history.push({
                pathname: comefrom
            });
        }
    }
    //点击支付
    handlePay(){
        //点击支付调用微信支付接口
        let self = this;
        let Cprice = parseFloat(this.state._price) * 1000;
        let url = window.location.href;
        let g_nonceStr = "";
        let g_timestamp = "";
        let g_signature = "";
        fetchJson('/getwxconfig',{url:url},function(data){
            console.log('获取微信配置数据:',data);
            g_nonceStr = data.nonce_str;
            g_timestamp = data.time_stamp;
            g_signature = data.sign_pay;
            window.wx.config({
                debug: false,
                appId: data.appid,
                timestamp: g_timestamp,
                nonceStr: g_nonceStr,
                signature: g_signature,
                jsApiList: ['chooseWXPay']
            });
        });
        window.wx.ready(() => {
            fetchJson('/owner/initwxrecharge',{ownerid:localStorage.getItem("ownerid"),ammount:Cprice},function(msg){
                if(msg.message === 'success' ){
                    window.wx.chooseWXPay({
                        timestamp: msg.data.timeStamp,
                        nonceStr: msg.data.nonceStr,
                        package: msg.data.package,
                        signType: 'MD5',
                        paySign: msg.data.paySign,
                        success: function (res) {
                            fetchJson('/checkwxpayrsult',{prepayid:msg.data.package},function (msg) {
                                fetchJson('/getPerAppUserInfo', {ownerid:localStorage.getItem("ownerid")}, (msg) => {
                                    let capital = (msg.data.changeaccount / 1000).toFixed(2);
                                    let givesMount = (msg.data.giftaccount / 1000).toFixed(2);
                                    let allAccount = ((msg.data.changeaccount + msg.data.giftaccount) / 1000).toFixed(2);
                                    let spotTwo = allAccount.split('.')[1];
                                    self.setState({
                                        spotTwo: spotTwo,
                                        capital: capital,
                                        givesMount: givesMount,
                                        allAccount: parseInt(allAccount)
                                    });
                                });
                            });
                        },
                        cancel: function(error) {
                            Toast.info('您已取消支付!', 1);
                        }
                    });
                }else{
                    //钱包充值失败
                    fetchJson('/owner/wxrechargefailed',{ownerid:localStorage.getItem("ownerid")},function(msg){
                        Toast.info('钱包充值失败', 1)
                    });
                }
            });
        })

    }
    componentWillMount(){
	    var self = this;
	    //先判断是否是业主
	    //fetchJson('/getOwnerByOpenid',{},function(msg) {
		 //   if (msg.message === 'success' && msg.data && msg.data.role === '业主') {
			    fetchJson('/getPerAppUserInfo',{ownerid:localStorage.getItem("ownerid")},function (msg) {
				    //获取余额
				    let capital = (msg.data.changeaccount / 1000).toFixed(2);
				    let givesMount =(msg.data.giftaccount / 1000).toFixed(2);
				    let allAccount = ((msg.data.changeaccount + msg.data.giftaccount) / 1000).toFixed(2);
				    let spotTwo = allAccount.split('.')[1];
				    self.setState({
					    spotTwo: spotTwo,
					    capital: capital,
					    givesMount: givesMount,
					    allAccount: parseInt(allAccount)
				    });
			    });

    }
    render(){
        return(
            <div className="topCon purseCon">
                <Header name="钱包" onClick={this._purseBack}/>
                <div>
                    <div className="purseTop">
                        <div className="orderInfoCon fontPad">
                            <div className="orderInfoConLeft">余额(元)</div>
                                <div className="orderInfoConRight" onClick={() => {
                                let comefrom = this.context.router.history.location.comefrom;
                                    if(comefrom == '/wxReactHome' || comefrom == 'home/purse/rechargeHttp' || comefrom == 'home/purse/bill' ){
                                        this.context.router.history.push({
                                            pathname: 'bill',
                                            comefrom:'home/purse'
                                        });
                                    }else if(comefrom == 'personCenter' || comefrom == 'personCenter/purse/rechargeHttp' || comefrom == 'personCenter/purse/bill' ){
                                        this.context.router.history.push({
                                            pathname: 'bill',
                                            comefrom:'personCenter/purse'
                                        });
                                    }
                                }}>账单</div>
                        </div>
                        <div className="displayFlex">
                            <div className="displayFlexLeft">
                                ¥{this.state.allAccount}
                                <span>.{this.state.spotTwo}</span>
                            </div>
                            <div className="displayFlexRight">
                                <div>本金: ¥{this.state.capital}</div>
                                <div>赠金: ¥{this.state.givesMount}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="purseBox">
                    <div className="purseInner">
                        {this.priceArr.map((res,i) =>{
	                        let status = 'hide';
	                        let bacColor = 'purseWhite';
                            //第一个没有赠
                            if(i === 0){
	                            status='hide';
                            }else {
	                            status='show';
                            }
                            //判断点击事件
                            if (i === this.state.index){
	                            bacColor='purseBlue';
                            }
                            return(
                                <Recharge price={res.price + '元'}
                                          give={'赠' + res.give + '元'}
                                          status={status}
                                          key={i}
                                          value={i}
                                          handle={this.handle}
                                          bacColor={bacColor}/>
                            )
                        })}
                     </div>
                </div>
                <div className="innerWhite distance ">
                    <div className="orderTypeCon clearLine">
                        <div className="purseAll">实际到账：
                            <span>¥{parseFloat((this.priceArr[this.state.index].price)*1+(this.priceArr[this.state.index].give)*1)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="agreeMent">
                    点击充值代表您已同意
                    <a onClick={() => {
                                    let comefrom = this.context.router.history.location.comefrom;
                                    if(comefrom == '/wxReactHome' || comefrom == 'home/purse/bill' || comefrom == 'home/purse/rechargeHttp'){
                                        this.context.router.history.push({
                                            pathname: 'rechargeHttp',
                                            comefrom:'home/purse'
                                        });
                                    }else if(comefrom == 'personCenter' || comefrom == 'personCenter/purse/bill' || comefrom == 'personCenter/purse/rechargeHttp'){
                                        this.context.router.history.push({
                                            pathname: 'rechargeHttp',
                                            comefrom:'personCenter/purse'
                                        });
                                    }
                    }}>《充值提现协议》</a>
                </div>
                <Footer footerBtn="充值" onClick={this._handlePay}/>
            </div>
        )
    }
}
Purse.contextTypes = {
    router: PropTypes.object
};
