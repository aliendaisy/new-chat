/**
 * Created by qm on 2017/7/17.
 */
import React, {Component} from 'react'
import {Header,OrderAddr,Footer,Modal,fetchJson,getGoodsData,getDefaultData} from './public';
import '../../css/animate.css';
import '../../css/dayPicker.css'; //由于antd和daypciker冲突,需自己调好样式引入
import '../../css/public.css';
import '../../css/changeOrder.css';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile/lib';
import DayPicker,{ LocaleUtils } from 'react-day-picker';
import moment from 'moment';

import { connect } from 'react-redux';
import {TO_ALL_ORDER,TO_CHANGE_PAY} from '../action/orderAction';
import store from '../store/store';

//年月中文
function formatMonthTitle(d, locale) {
	return `${d.getFullYear()}年${d.getMonth() + 1}月`
}
//星期中文
function formatWeekdayShort(i, locale) {
	var weekday = ['日','一','二','三','四','五','六'];
	return weekday[i];
}

//申请改单主页面
export class ChangeOrder extends Component {
    constructor(props){
        super(props);
	    this._back = this.back.bind(this); //返回
	    this._fixType = this.fixType.bind(this); //修改品种
        this._fixDate = this.fixDate.bind(this); //修改日期
	    this._hideModal = this.hideModal.bind(this); //隐藏模态框
	    this._hideCalendar = this.hideCalendar.bind(this); //隐藏日历

	    this._handleFixed = this.handleFixed.bind(this); //确认修改
        this._handleBlock = this.handleBlock.bind(this);
        this._handleConfirm = this.handleConfirm.bind(this); //确认改单
	    this._cancelClick = this.cancelClick.bind(this); //确认信息弹框取消按钮
	    this._sureToChange = this.sureToChange.bind(this); //确认信息弹框确认按钮

	    this.goodsData = getGoodsData().goodsData;
	    this.orderType = getDefaultData().orderType;
        this.state = {
	        showCalendar: false, //日历显示
	        selectedDay: [new Date(moment(this.props.sendTime))], //默认的选择日期
	        sendTime: moment(this.props.sendTime).format('YYYY-MM-DD'), //下次配送日期显示在页面中

	        showModal: false, //修改品种模态框显示
	        animateClass: 'slideInUp',
	        showDiff: false, //是否显示补差或多退信息
	        more: false, //显示多退
	        index: 0, //初始化模态框第一项选中
	        title: this.props.orderContent.subhead, //模态框中初始第一项的标题
	        unitPrice: this.props.orderContent.originalUnitPrice / (this.props.snum / this.props.num), //模态框中初始第一项的单价
	        milkName: this.props.orderContent.subhead, //品种名称
	        otherTypes: [], //其他种类
	        priceDiff: 0, //补差的值
	        modalStatus: 'hide' //模态框显示与否
        }
    }

	componentWillMount() {
		//获取起送日期选择列表
		let oneDayTime = 24 * 60 * 60 * 1000;
		let todayTime = new Date().getTime();
		let baseDay = new Date(2017, 7, 1); //2017年8月1日
		let baseTime = new Date(baseDay).getTime();
		let minusTime = todayTime - baseTime;
		//当今天与基准配送日差值大于等于0时执行,让基准值大于今日
		do{
			baseTime += 3 * oneDayTime;
			minusTime = todayTime - baseTime;
		}while(minusTime >= 0);

		//let y = new Date(this.props.sendTime).getFullYear();
		//let m = new Date(this.props.sendTime).getMonth();
		//let d = new Date(this.props.sendTime).getDate();
		let y = new Date(baseTime).getFullYear();
		let m = new Date(baseTime).getMonth();
		let d = new Date(baseTime).getDate();
		let startDay = new Date(y,m,d); //0点
		let startDayTime = startDay.getTime();

		let endDayTime = startDayTime + 60 * oneDayTime;
		let endDay = new Date(endDayTime);

		let startMonth = new Date(startDay.getFullYear(),startDay.getMonth(),1); //开始配送日所在月的第一天
		let endMonth = new Date(endDay.getFullYear(),endDay.getMonth() + 1,0,23,59,59); //结束月的最后一天(0表示前一个月最后一天)

		//获取下次配送日起的总共60天
		let specialDays = [];
		//if(this.props.style === '三天一送') {
			for(let specialDay = startDay;specialDay <= endDay;) {
				specialDays.push(specialDay);
				specialDay = new Date(specialDay.getTime() + 3 * oneDayTime);
			}
		//}else{
		//	for(let specialDay = startDay;specialDay <= endDay;) {
		//		specialDays.push(specialDay);
		//		specialDay = new Date(specialDay.getTime() + 6 * oneDayTime);
		//	}
		//}

		//获取起始月第一天到结束月最后一天的数组
		let allDays = [];
		for(var date = startMonth;date < endMonth;) {
			allDays.push(date);
			date = new Date(date.getTime() + oneDayTime);
		}
		//获取不能点击日期的数组
		let temp = []; //定义一个临时数组
		let tempArray = []; //最后输出的数组
		//先循环小的数组,把里面的值放入temp,并定义为true
		for(var i = 0;i < specialDays.length;i ++) {
			temp[specialDays[i]] = true;
		}
		//再循环大数组,若temp里大数组的值不存在,则,把他push到输出的数组tempArray中(即不能选的日期)
		for(var j = 0;j < allDays.length;j ++) {
			if(!temp[allDays[j]]) {
				tempArray.push(allDays[j]);
			}
		}

		let st = new Date(this.state.sendTime);
		this.startTime = new Date(st.getFullYear(),st.getMonth(),st.getDate()).getTime(); //0时
		this.todayTime = todayTime;

		this.stMonth = new Date(st.getFullYear(),st.getMonth(),1); //起始月
		this.startMonth = startMonth; //起始月
		this.endMonth = endMonth; //结束月
		this.disabledDays = tempArray; //不能选择的日期数组
	}
	//跳转返回
	back(){
		//context router 跳转
		this.context.router.history.goBack();
	}
    //牛奶品种修改 点击出现模态框(没有数据传递,可以不用redux)
    fixType() {
	    //如果未修改过type
	    if(this.props.canChangeType) {
		    //每次点击需要置空
		    this.state.otherTypes = [];
		    //从原始数组中根据条件创建新数组
		    //后台配置数据可能不按月.季.半年.年顺序,需要判断过再赋值
		    this.goodsData.map((res) => {
			    //排除蔬菜调单
			    if(res.note !== '有机蔬菜') {
				    //循环获取当前订奶方式的一瓶的价钱,用来计算差价
				    res.typeData.map((msg,i) => {
					    //循环获取当前订购方式下的值,需要拿一份的单价
					    res.typeData.map((data,j) => {
						    if(this.props.orderContent.orderWay === data.orderType) {
							    if(this.orderType[0] === msg.orderType) {
								    if(res.orderTitle !== this.state.milkName) {
									    this.state.otherTypes.push({
										    orderTitle: res.orderTitle,
										    imgUrl: res.imgLogo,
										    orderType: this.props.orderContent.orderWay,
										    type: res.note,
										    unitPrice: res.typeData[j].price, //该订购方式下的折扣后单价
										    originalUnitPrice: res.typeData[j].originalPrice, //该订购方式下的原单价
										    price: res.typeData[i].originalPrice / 10 //不同种类的单瓶价
									    });
								    }
								    //相同的一项置顶显示
								    else{
									    this.state.otherTypes.unshift({
										    orderTitle: res.orderTitle,
										    imgUrl: res.imgLogo,
										    orderType: this.props.orderContent.orderWay,
										    type: res.note,
										    unitPrice: res.typeData[j].price, //该订购方式下的折扣后单价
										    originalUnitPrice: res.typeData[j].originalPrice, //该订购方式下的原单价
										    price: res.typeData[i].originalPrice / 10 //不同种类的单瓶价
									    });
								    }
							    }
						    }
					    });
				    });
			    }
		    });
		    console.log(this.state.otherTypes);
		    //show Modal
		    if(!this.state.showModal) {
			    this.setState({
				    showModal: true,
				    animateClass: 'slideInUp'
			    });
		    }
	    }else{
		    Toast.info('您已修改过一次牛奶品种,无法修改!',2)
	    }
    }
	//模态框点击消失
	hideModal(){
		this.setState({animateClass: 'slideOutDown'});
		this.timer = setTimeout(function() {
			this.setState({
				showModal: false,
				index: 0 //每次关闭模态框后需要重置默认第一项
			})
		}.bind(this), 300);
	}
    //模态框中每一项的点击事件
    handleBlock(e,title,price) {
        console.log(e,title,price)
        //e为索引值,title为title值,price为每个种类每瓶的单价
        if(this.state.index !== e){
            this.setState({
                index: e,
	            title: title,
	            unitPrice: price
            });
        }
    }
    //确认修改
    handleFixed(){
	    let xnum = 0;
	    //如果加送次数小于剩余配送次数,则获取调单需要的配送次数,否则为0
	    if(this.props.znum <= this.props.snum - this.props.rnum) {
		    xnum = this.props.snum - this.props.rnum - this.props.znum;
	    }else{
		    xnum = 0;
	    }
	    //获取差价(可能为0)
	    let priceDiff = ((this.props.orderContent.originalUnitPrice / ((this.props.snum - this.props.znum) / this.props.num)
	    - this.state.unitPrice) * xnum / 1000).toFixed(2);
	    this.setState({
		    showModal: false,
		    milkName: this.state.title,
		    index: 0 //每次关闭模态框后需要重置默认第一项
	    });
	    if(priceDiff > 0) {
		    this.setState({
			    priceDiff: priceDiff,
			    showDiff: true,
			    more: true
		    });
	    }else if(priceDiff < 0) {
		    this.setState({
			    priceDiff: priceDiff,
			    showDiff: true,
			    more: false
		    });
	    }else{
		    this.setState({
			    showDiff: false,
			    more: false
		    });
	    }
    }
	//牛奶修改日期
	fixDate() {
		this.setState({
			showCalendar: true
		});
	}
	//隐藏日历
	hideCalendar() {
		this.setState({
			showCalendar: false
		});
	}
	//DayPicker选择日期
	handleDayClick = (day, {disabled, selected}) => {
		if(disabled) {
			return;
		}
		this.setState({
			selectedDay: day,
			sendTime: moment(day).format('YYYY-MM-DD')
		});
		this.timerCalendar = setTimeout(function() {
			this.setState({
				showCalendar: false
			})
		}.bind(this), 300);
	};
    //确认改单
	handleConfirm() {
		//如果有改动则调取接口
		if(this.state.milkName !== this.props.orderContent.subhead ||
			this.state.sendTime !== moment(this.props.sendTime).format('YYYY-MM-DD')) {
			//如果调单时间离配送日小于一天,不能调单日期
			if(this.startTime - this.todayTime >= 15 * 60 * 60 * 1000) {
				//如果往前调,也需要判断
				if(new Date(this.state.sendTime).getTime() - this.todayTime >= 23 * 60 * 60 * 1000) {
					if(this.state.otherTypes.length > 0) {
						//获取修改后的品种在数组中的位置
						this.state.otherTypes.map((msg,i) => {
							if(this.state.milkName === msg.orderTitle) {
								this.indexChange = i;
							}
						});
						this.newType = this.state.otherTypes[this.indexChange].type;
					}else{
						this.newType = this.props.type;
					}
					//调出Modal
					this.setState({
						modalStatus: 'show'
					});
				}else{
					Toast.info('下次配送订单已生成,请重新选择日期!',3);
				}
			}else{
				Toast.info('下次配送订单已生成,请于配送完成后调单!',3);
			}
		}else{
			Toast.info('您并未修改任何内容',1);
		}
	}
	//Modal取消
	cancelClick() {
		this.setState({
			modalStatus: 'hide'
		});
	}
	//Modal确认
	sureToChange() {
		if(this.state.priceDiff !== 0) {
			//改单下单接口
			fetchJson('/owner/applyXdmyMilkTransfer',{
				order: {
					amount: Math.abs(this.state.priceDiff * 1000)
				}
			},(msg) => {
				//此处的orderid和_id不同于该订单
				let orderid = msg.data.orderid;
				//多退,调取钱包接口
				if(this.state.priceDiff > 0) {
					fetchJson('/owner/findAndupdateOwnerAccount',{
						ownerid: localStorage.getItem("ownerid"),
						ammount: this.state.priceDiff * 1000,
						type: '多退'
					},(msg) => {
						//以上都成功则进入改单成功
						fetchJson('/owner/updateXdmyMilkDistOrder',{
							flowid: this.props._id,
							order: {
								type: this.state.otherTypes[this.indexChange].type,
								imgUrl: this.state.otherTypes[this.indexChange].imgUrl,
								unitPrice: this.state.otherTypes[this.indexChange].unitPrice,
								originalUnitPrice: this.state.otherTypes[this.indexChange].originalUnitPrice,
								subhead: this.state.otherTypes[this.indexChange].orderTitle,
								sendTime: this.state.sendTime,
								diffPrice: - this.state.priceDiff * 1000
							}
						},(msg) => {
							if(msg.message === 'success') {
								this.setState({
									modalStatus: 'hide'
								});
								Toast.info('调单成功!',1.5);
								let self = this;
								let owner = store.getState().owner;
								fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: '配送中'},(msg) => {
									self.props.toAllOrder(msg.data,'配送中','1');
									self.context.router.history.push({
										pathname: '/allOrder'
									});
								});
							}
						});
					});
				}
				//少补,调取补差价的下单接口
				else if(this.state.priceDiff < 0) {
					let order = {
						type: this.state.otherTypes[this.indexChange].type,
						imgUrl: this.state.otherTypes[this.indexChange].imgUrl,
						unitPrice: this.state.otherTypes[this.indexChange].unitPrice,
						originalUnitPrice: this.state.otherTypes[this.indexChange].originalUnitPrice,
						subhead: this.state.otherTypes[this.indexChange].orderTitle,
						sendTime: this.state.sendTime,
						diffPrice: - this.state.priceDiff * 1000
					};
					this.props.toChangePay(orderid,this.props._id,order);

					this.context.router.history.push({
						pathname: '/changePay'
					});
				}
			});
		}//如果只改日期,只需调用update接口
		else{
			fetchJson('/owner/updateXdmyMilkDistOrder',{
				flowid: this.props._id,
				order: {
					sendTime: this.state.sendTime
				}
			},(msg) => {
				let self = this;
				let owner = store.getState().owner;
				fetchJson('/owner/getMilkOrderByStatus',{mobile: owner.mobile,status: '配送中'},(msg) => {
					self.props.toAllOrder(msg.data,'配送中','1');
					self.context.router.history.push({
						pathname: '/allOrder'
					});
				});
			});
		}
    }
    render(){
	    let type = this.newType !== this.props.type ? `${this.props.type}改为${this.newType}` : '';
	    var price;
	    if(this.state.priceDiff > 0) {
		    price = `系统将退¥${this.state.priceDiff}至您账户`
	    }else if(this.state.priceDiff < 0) {
		    price = `您需要补差价¥${-this.state.priceDiff}`
	    }else{
		    price = '';
	    }
	    let time = this.state.sendTime !== moment(this.props.sendTime).format('YYYY-MM-DD') ?
		    `下次配送日${moment(this.props.sendTime).format('YYYY-MM-DD')}改为${this.state.sendTime}` : '';
        return(
            <div className="topCon changeOrder">
                <Header name="申请改单" onClick={this._back}/>
                <div>
                    <div className="PicAddrCon">
                        <OrderAddr name={'收货人:' + this.props.name}
                                   phone={this.props.mobile}
                                   addr={this.props.detail}/>
                        <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_address.png" alt=""/>
                    </div>
	                <div className="infoTop">
		                <p>订购方式: {this.props.type}</p>
		                <p>
			                已配送<span className="red">{this.props.rnum / this.props.num}</span>次
			                剩余<span className="red">{(this.props.snum - this.props.rnum) / this.props.num}</span>次
		                </p>
	                </div>
                    <div className="changeOrderSection">
                        <div>
                            <p>修改品种</p>
                            <div className="flexBox">
                                <div className="flexLeft">
                                    <p>{this.state.milkName}</p>
	                                <p className={this.state.showDiff ? 'redShow' : 'hide'} style={{fontSize:
                                     '13px'}}>
	                                    <span className={this.state.more ? 'show' : 'hide'}>
		                                    系统将退 ¥{this.state.priceDiff} 至您钱包账户,稍后请到钱包查看
	                                    </span>
	                                    <span className={this.state.more ? 'hide' : 'show'}>
		                                    您需要补差 ¥{-this.state.priceDiff}
	                                    </span>
                                    </p>
                                </div>
                                <div className="flexRight" onClick={this._fixType}>
                                    <i className="iconfont icon-arrowdown"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>重新配送日期</p>
                            <div className="flexBox">
                                <div className="flexLeft">{this.state.sendTime}</div>
                                <div className="flexRight" onClick={this._fixDate}>
                                    <i className="iconfont icon-arrowdown"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
	            <div className="infoBottom">
		            <p>如有疑问或更多需求,详请咨询 <a href="tel:400-049-4478">400-049-4478</a></p>
	            </div>
                <Footer footerBtn="确认改单" onClick={this._handleConfirm}/>
	            <Modal status={this.state.modalStatus}
	                   header="请核对改单信息:"
	                   left="取消"
	                   right="确定"
	                   _cancelClick={this._cancelClick}
		               type={type}
		               price={price}
		               time={time}
	                   _confirmClick={this._sureToChange}
	            />
                {/*显示隐藏修改品种模态框*/}
                {(() => {
	                if(this.state.showModal){
	                    return(
	                    //修改品种模态框
	                        <div className="tipModalCon">
	                            <div className={'milkTypeModal animated ' + this.state.animateClass}>
                                    <div className="milkTypeHeader">
                                        <p>修改品种</p>
                                    </div>
		                            <div className="milkTypeModalSon">
	                                    {this.state.otherTypes.map((res,i) =>{
	                                        let status = 'true';
	                                        if (i === this.state.index){
	                                            status = 'false';
	                                        }
	                                        return(
	                                            <Block value={i}
	                                                   handle={this._handleBlock} //子组件传来的点击事件
	                                                   imgSrc={res.imgUrl}
	                                                   price={res.price}
	                                                   title={res.orderTitle}
	                                                   orderType={res.orderType}
	                                                   key={i}
	                                                   ss={status}/>
	                                        )
	                                    })}
	                                </div>
	                                <button onClick={this._handleFixed}>确认修改</button>
	                            </div>
	                            <div className="renewOpacity" onClick={this._hideModal}></div>
                            </div>
                        )
	                }
	                if(this.state.showCalendar) {
	                    return(
	                        <div className="tipModalCon">
	                            <div className="calendarForChange">
	                                <DayPicker
	                                    enableOutsideDays
	                                    fixedWeeks
	                                    month={this.stMonth}
                                        fromMonth={this.startMonth}
                                        toMonth={this.endMonth}
	                                    selectedDays={this.state.selectedDay}
	                                    disabledDays={this.disabledDays}
                                        onDayClick={this.handleDayClick}
                                        localeUtils={{...LocaleUtils, formatMonthTitle, formatWeekdayShort}}
	                                />
	                            </div>
	                            <div className="renewOpacity" onClick={this._hideCalendar}></div>
	                        </div>
	                    )
	                }
                })()}
            </div>
        )
    }
}

//续订订单信息页
class Block extends Component {
    constructor(props) {
        super(props);
        this._onClick = this.onClick.bind(this);
    }
    onClick() {
        //子组件传递参数给父组件
        this.props.handle(this.props.value,this.props.title,this.props.price);
    }
    render(){
        return(
            <div onClick={this._onClick}
                 value={this.props.value}
                 className={this.props.ss === 'true' ? 'bacWhite' : 'bacBlue'}>
	            <div className="changeLeft">
		            <img src={this.props.imgSrc} alt=""/>
	            </div>
	            <div className="changeRight">
		            {this.props.title}
	            </div>
            </div>
        )
    }
}
//一定要定义
ChangeOrder.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = (state, props) => {
	console.log('changeOrder', state)
	return state.toChangeOrder;
}
const mapDispatchToProps = (dispatch, ownProps) => ({
	toAllOrder:(allList,status,tabIndex) => {
		dispatch(TO_ALL_ORDER(allList,status,tabIndex))
	},
	toChangePay:(orderid,flowid,order) => {
		dispatch(TO_CHANGE_PAY(orderid,flowid,order))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangeOrder)

