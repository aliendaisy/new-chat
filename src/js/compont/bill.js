/**
 * Created by qm on 2017/7/12.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/bill.css';
import {Header,fetchJson} from './public';
//import weChatPay from "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_pay.png";
//import shou from "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_shou.png";
import moment from 'moment'; //时间格式化
import PropTypes from 'prop-types';

//账单主页
export default class Bill extends Component {
    constructor(props){
        super(props);
        this.state = {
            billData:[]
        };
        this._billBack = this.billBack.bind(this);//导航返回
    }
    //渲染
    componentWillMount(){
        var self = this;
        fetchJson('/owner/getOwnerBillsInfo',{ownerid:localStorage.getItem("ownerid")},function(msg){
            self.setState({
                billData:msg.data.history
            });
            var billData = self.state.billData;
            for(var i=0;i<billData.length;i++){
                if(billData[i].paytype == '微信充值' || billData[i].paytype == '现代牧业牛奶调单多退'){
                    billData[i].imgSrc = "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_shou.png";
                }else{
                    billData[i].imgSrc = "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_pay.png";
                }
            }
            //需要重新渲染一下
            self.setState({
                billData:billData
            });
        });

    }
    //导航返回
    billBack(){
        let comefrom = this.context.router.history.location.comefrom;
        if(comefrom == 'home/purse'){
            this.context.router.history.push({
                pathname: '/purse',
                comefrom: 'home/purse/bill'
            });
        }else if(comefrom == 'personCenter/purse'){
            this.context.router.history.push({
                pathname: '/purse',
                comefrom: 'personCenter/purse/bill'
            });
        }

    }
    render() {
        return(
            <div className="topCon">
                    <Header name="账单" onClick={this._billBack}/>
                    <div className="billCon">
                        {this.state.billData.map((res, i) => {
                            return (
                                <div className="orderInfoCon" key={i}>
                                    <div className="orderInfoSon">
                                        <div className="orderInfoImg"><img src={res.imgSrc} alt="pic"/></div>
                                        <div className="orderInfoMain">
                                            <div className="orderInfoFirst fontSize">
                                                <div className="orderInfoFirstFont">{res.paytype}</div>
                                                <div className="orderInfoPrice">¥ {(res.ammount / 1000).toFixed(2)}</div>
                                            </div>
                                            <div className="orderInfoFirst">
                                                <div className="orderInfoFirstFont orderInfoType">
                                                   {moment(res.time).format('YYYY-MM-DD HH:mm:ss')}
                                                </div>
                                                <div className="orderInfoPrice statusColor fontSize">
                                                    {res.paymode}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className={this.state.billData.length === 0 ? 'show' : 'hide'}>
                            <div className="noOrder">
                                <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_no_order.png" alt="noOrder"/>
                                <p>您还没有相关账单</p>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

Bill.contextTypes = {
    router: PropTypes.object
};
