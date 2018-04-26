/**
 * Created by qm on 2017/7/5.
 */
import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import {PickerView} from 'antd-mobile/lib';
import moment from 'moment';
import 'whatwg-fetch';
//导航
export class Header extends Component {
    render() {
        return(
            <nav className="navHeader">
                <div className="headerLeft left" onClick={this.props.onClick}>
                    <span className="iconfont icon-fanhui iconSm colorGrey"></span>
                </div>
                <div className="headerRight left">
                    <span>{this.props.name}</span>
                </div>
            </nav>
        )
    }
}
//没返回头的头部
export class NoBackHeader extends Component{
	render() {
		return(
			<nav className="navHeader">
				<div style={{lineHeight: '40px',fontSize: '17px'}}>
					<span>{this.props.name}</span>
				</div>
			</nav>
		)
	}
}
//进入下个页面组件 >
export class RowInto extends Component {
    render() {
        return(
            <div className="rowIntoCon borderPad" onClick={this.props.onClick}>
                <div className="rowIntoConLeft">{this.props.name}</div>
                <div className="rowIntoConRight">
                    <span>{this.props.content}</span>
                    <i className="iconfont icon-jinru"></i>
                </div>
            </div>
        )
    }
}

//文字左右
export class TwoFont extends Component{
    render() {
        return(
            <div className="twoFontCon fontPad">
                <div className="orderInfoConLeft">{this.props.left}</div>
                <div className="orderInfoConRight">{this.props.date}</div>
            </div>
        )

    }
}

//右边文字
export class RightFont extends Component{
    render() {
        return(
            <div className="RightFont">
                <div className="orderInfoConLeft">{this.props.left}</div>
                <div className="orderInfoConAll">
                    合计：<span className="statusColor">{this.props.price}</span>
                </div>
            </div>
        )
    }
}

//订购文字一标题
export class OrderType extends Component{
    render(){
        return(
            <span className="orderRow">
                <span>配送方式:</span><span>{this.props.startDate}</span><span>起送 </span>
                <span>{this.props.sendsType} </span>
                <span className={this.props.show}>
	                <span>共</span><span className="red">{this.props.times}</span><span>次</span>
                </span>
            </span>
        )
    }
}
//订购文字二标题
export class OrderTypeTwo extends Component{
	render(){
		return(
			<span className="orderRow">
                <span>配送状态:共</span><span className="red">{this.props.times}</span><span>次, </span>
                <span>已完成</span><span className="red">{this.props.finishTime}</span><span>次, </span>
                <span>剩余</span><span className="red">{this.props.leftTime}</span><span>次</span>
            </span>
		)
	}
}

//订单信息
export class OrderInfo extends Component{
    render(){
        return(
            <div className="orderInfoCon">
                <div className="orderInfoSon">
                    <div className="orderInfoImg"><img src={this.props.imgSrc} alt=""/></div>
                    <div className="orderInfoMain">
                        <div className="orderInfoFirst fontSize">
                            <div className="orderInfoFirstFont">{this.props.con}</div>
                            <div className="orderInfoPrice">¥ {this.props.price}</div>
                        </div>
                        <div className="orderInfoFirst">
                            <div className="orderInfoFirstFont orderInfoType">
	                            订购方式: {this.props.type}
                            </div>
                            <div className="orderInfoPrice statusColor fontSize">
	                            {this.props.status}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//红色重点字和文字
export class Discount extends Component {
    render(){
        return(
            <div className="discount">
                <span className="discountBtn">{this.props.discount}</span>
                <span className="discountFont">{this.props.discountFont}</span>
            </div>
        )
    }
}

//订单编号
export class FontOrder extends Component{
    render() {
        return(
            <div className="fontOrder fontColor">
                <div className="fontOrderLeft">{this.props.left}</div>
                <div className="fontOrderRight">{this.props.date}</div>
            </div>
        )
    }
}

//地址
export class OrderAddr extends Component {
    render() {
        return(
            <div className="orderAddrCon" onClick={this.props.onClick}>
                <div className="orderAddrSon">
                    <span className="receiver">{this.props.name}</span>
                    <span className="receiverPhone">{this.props.phone}</span>
                </div>
                <div className="orderAddrRow">
                    <div className="orderAddrPic">
                        <i className="iconfont icon-dizhi iconSm"></i>
                    </div>
                    <div className="orderAddrFont">
                        {this.props.addr}
                    </div>
                    <div className="orderAddrInto">
                        <i className="iconfont icon-jinru iconNone"></i>
                    </div>
                </div>
            </div>
        )
    }
}

//绿色 成功组件
export class SuccessSign extends Component {
    render(){
        return(
            <div className="successCon">
                <i className="iconfont icon-using iconLg"></i>
                <span className="successFont">{this.props.success}</span>
            </div>
        )

    }
}

//灰色按钮
export class GreyBtn extends Component {
    render(){
        return(
            <button className="greyBtn" onClick={this.props.onClick}>{this.props.greyBtn}</button>
        )

    }
}

//底部按钮
export class Footer extends Component {
    render(){
        return(
            <button className="footerBtn"
                    onClick={this.props.onClick}>{this.props.footerBtn}</button>
        )

    }
}

//模态框
export class Modal extends Component {
    render(){
        return(
	        <div className={"tipModalCon " + this.props.status}>
	            <div className="tipModal">
	                <h5>{this.props.header}</h5>
	                <p>{this.props.tip}</p>
	                <p className="red">{this.props.type}</p>
	                <p className="red">{this.props.price}</p>
	                <p className="red">{this.props.time}</p>
	                <div className="FlexCon tipBtnCon">
	                    <div className="FlexSon" onClick={this.props._cancelClick}>{this.props.left}</div>
	                    <div className="FlexSon" onClick={this.props._confirmClick}>{this.props.right}</div>
	                </div>
	            </div>
		        <div className="tipOpacity" onClick={this.props._cancelClick}></div>
	        </div>
        )
    }
}

//滑动选择器
export class PickerItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//选择器
			value: null
		};
		//选择器
		this._onChange = this.onChange.bind(this);
	}
	//选择器
	onChange(value) {
		this.setState({
			value
		});
		this.props.getValue(value);
	}
    render(){
        return(
            <div className="pickerItemCon">
                <div className={"pickerModal animated " + this.props.ifShow}>
                    <div className="pickModalHeader">
                        <div className="left" onClick={this.props.hideModal}>取消</div>
                        <div className="right" onClick={this.props.sureModal}>确定</div>
                    </div>
	                <PickerView onChange={this._onChange}
	                            value={this.state.value}
	                            data={this.props.data}
	                            cascade={false}/>
                </div>
	            <div className="tipOpacity" onClick={this.props.hideModal}></div>
            </div>
        )
    }
}

//fetch通信  POST通信
export function fetchJson(url,params,cb){
    let myHeaders = new Headers({"Content-Type": "application/json"});
    let headerUrl = 'http://www.i-xiaoqu.com/wxAccount';
    let allUrl = headerUrl + url;
    fetch(allUrl,{
        method: 'post',
        headers: myHeaders,
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({params})
    }).then(res => {
        res.json().then(function(data){
            return cb(data);
        });
    }).catch(err => {
        console.log(err);
    });
}

//fetch通信 get
export function fetchJsonGet(url,params,cb){
    let myHeaders = new Headers({"Content-Type": "application/json"});
    let headerUrl = 'http://www.i-xiaoqu.com/wxAccount';
    let allUrl = headerUrl + url;
    fetch(allUrl,{
        method: 'get',
        headers: myHeaders,
        mode: 'cors'
    }).then(res => {
        res.json().then(function(data){
            return cb(data);
        });
    }).catch(err => {
        console.log(err);
    });
}

//商品数组
export function getGoodsData() {
	//最大的数组
	var goodsData = [
		{
			homeTitle: '现代牧业鲜牛奶1L装',
			homeSubTitle: '纯真鲜活，全程冷链配送',
			orderTitle: '现代牧业鲜牛奶1L装订购套餐 当天生产 当天冷链配送',
			typeData: [],
			note: '鲜奶1L装',
			imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_danai.png",
			carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/1_1.png",
			carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/1_2.png"
		},{
			homeTitle: '现代牧业原味酸奶100g*8',
			homeSubTitle: '添加双岐菌，全程冷链配送',
			orderTitle: '现代牧业原味酸奶100g*8订购套餐 添加双岐菌 全程冷链配送',
			typeData: [],
			note: '酸奶8盒装',
			imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_suannai.png",
			carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/yogurt_1.png",
			carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/yogurt_2.png"
		},{
			homeTitle: '现代牧业鲜牛奶250ml装',
			homeSubTitle: '纯真鲜活，全程冷链',
			orderTitle: '现代牧业鲜牛奶250ml*3订购套餐 当天生产 当天冷链配送',
			typeData: [],
			note: '鲜奶250ml*3装',
			imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_xiaonai.png",
			carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/250_1.png",
			carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/250_2.png"
		},{
			homeTitle: '农夫山泉橙汁950ml装',
			homeSubTitle: '100%鲜果冷压榨，全程冷链配送',
			orderTitle: '农夫山泉橙汁950ml装订购套餐 100%鲜果冷压榨 全程冷链配送',
			typeData: [],
			note: '橙汁950ml装',
			imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_juice950.png",
			carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/950_1.png",
			carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/950_2.png"
		},{
			homeTitle: '农夫山泉橙汁330ml装',
			homeSubTitle: '100%鲜果冷压榨，全程冷链配送',
			orderTitle: '农夫山泉橙汁330ml*3订购套餐 100%鲜果冷压榨 全程冷链配送',
			typeData: [],
			note: '橙汁330ml*3装',
			imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_juice330.png",
			carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/330_1.png",
			carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/330_2.png"
		},{
            homeTitle: '现代牧业蓝莓味酸奶100g*8',
            homeSubTitle: '添加双岐菌，全程冷链配送',
            orderTitle: '现代牧业蓝莓味酸奶100g*8订购套餐 添加双岐菌 全程冷链配送',
            typeData: [],
            note: '蓝莓味酸奶8盒装',
            imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/blueberry.png",
            carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/blueberry_1.png",
            carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/blueberry_2.png"
        },{
			homeTitle: '有机蔬菜礼盒',
			homeSubTitle: '月订菜卡',
			orderTitle: '【嘉兴有机蔬菜】新鲜有机时蔬 随机搭配 3kg 月订 全程冷链配送 放心安心',
			typeData: [],
			note: '有机蔬菜',
			imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_vegetable.png",
			carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/vegetables_1.png",
			carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/vegetables_2.png"
		}
	];

	//获取后台配置信息,写在父组件中,防止重复调用
	fetchJson('/getXdmyMilkInfoLists',{},(msg) => {
		for(var i = 0;i < msg.data.length;i ++) {
			switch (msg.data[i].name) {
				case '鲜奶1L装':
					goodsData[0].typeData.push(msg.data[i]);
					break;
				case '酸奶8盒装':
					goodsData[1].typeData.push(msg.data[i]);
					break;
				case '鲜奶250ml*3装':
					goodsData[2].typeData.push(msg.data[i]);
					break;
				case '橙汁950ml装':
					goodsData[3].typeData.push(msg.data[i]);
					break;
				case '橙汁330ml*3装':
					goodsData[4].typeData.push(msg.data[i]);
                    break;
                case '蓝莓味酸奶8盒装':
                    goodsData[5].typeData.push(msg.data[i]);
	                break;
				case '有机蔬菜':
					goodsData[6].typeData.push(msg.data[i]);
			}
		}
	});
	return {goodsData};
}
export function getDefaultData() {
	let orderType = ['月订','季度订','半年订','年订'];
	let styleType = ['三天一送','六天一送'];
	let numForOrder = [10,30,60,120];
    let StandOrderType = [
	    {type:"月订",num:10},
        {type:"季度订",num:30},
        {type:"半年订",num:60},
        {type:"年订",num:120}];
	return {orderType,styleType,numForOrder,StandOrderType}
}

//配送日计算
export function getSendDateList() {
	//获取起送日期选择列表
	let oneDayTime = 24 * 60 * 60 * 1000;
	let todayTime = new Date().getTime();
	let baseDay = new Date(2017, 7, 1); //2017年8月1日
	let baseTime = new Date(baseDay).getTime();
	let minusTime = todayTime - baseTime;
	var dateArr = [];
	//当今天与基准配送日差值大于等于0时执行,让基准值大于今日
	do{
		baseTime += 3 * oneDayTime;
		minusTime = todayTime - baseTime;
	}while(minusTime >= 0);

	//循环push到数组中传给placeOrder
	for(var i = 0;i < 4;) {
		//预留一天时间,push前判断是否小于一天
		if(baseTime - todayTime < 15 * 1000 * 60 * 60) {
			baseTime += 3 * oneDayTime;
		}
		dateArr.push(moment(new Date(baseTime)).format('YYYY-MM-DD'));
		baseTime += 3 * oneDayTime;
		i ++;
	}
	//此时拿到了真正的dateArr
	return dateArr;
}

export const goodList = [
    {
        homeTitle: '现代牧业鲜牛奶1L装',
        homeSubTitle: '纯真鲜活，全程冷链配送',
        orderTitle: '现代牧业鲜牛奶1L装订购套餐 当天生产 当天冷链配送',
        typeData: [],
        note: '鲜奶1L装',
        imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_danai.png",
        carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/1_1.png",
        carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/1_2.png"
    },{
        homeTitle: '现代牧业原味酸奶100g*8',
        homeSubTitle: '添加双岐菌，全程冷链配送',
        orderTitle: '现代牧业原味酸奶100g*8订购套餐 添加双岐菌 全程冷链配送',
        typeData: [],
        note: '酸奶8盒装',
        imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_suannai.png",
        carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/yogurt_1.png",
        carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/yogurt_2.png"
    },{
        homeTitle: '现代牧业鲜牛奶250ml装',
        homeSubTitle: '纯真鲜活，全程冷链',
        orderTitle: '现代牧业鲜牛奶250ml*3订购套餐 当天生产 当天冷链配送',
        typeData: [],
        note: '鲜奶250ml*3装',
        imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_xiaonai.png",
        carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/250_1.png",
        carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/250_2.png"
    },{
        homeTitle: '农夫山泉橙汁950ml装',
        homeSubTitle: '100%鲜果冷压榨，全程冷链配送',
        orderTitle: '农夫山泉橙汁950ml装订购套餐 100%鲜果冷压榨 全程冷链配送',
        typeData: [],
        note: '橙汁950ml装',
        imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_juice950.png",
        carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/950_1.png",
        carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/950_2.png"
    },{
        homeTitle: '农夫山泉橙汁330ml装',
        homeSubTitle: '100%鲜果冷压榨，全程冷链配送',
        orderTitle: '农夫山泉橙汁330ml*3订购套餐 100%鲜果冷压榨 全程冷链配送',
        typeData: [],
        note: '橙汁330ml*3装',
        imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_juice330.png",
        carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/330_1.png",
        carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/330_2.png"
    },{
        homeTitle: '现代牧业蓝莓味酸奶100g*8',
        homeSubTitle: '添加双岐菌，全程冷链配送',
        orderTitle: '现代牧业蓝莓味酸奶100g*8订购套餐 添加双岐菌 全程冷链配送',
        typeData: [],
        note: '蓝莓味酸奶8盒装',
        imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/blueberry.png",
        carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/blueberry_1.png",
        carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/blueberry_2.png"
    },{
		homeTitle: '有机蔬菜礼盒',
		homeSubTitle: '月订菜卡',
		orderTitle: '【嘉兴有机蔬菜】新鲜有机时蔬 随机搭配 3kg 月订 全程冷链配送 放心安心',
		typeData: [],
		note: '有机蔬菜',
		imgLogo: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_vegetable.png",
		carousel1: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/vegetables_1.png",
		carousel2: "http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/vegetables_2.png"
	}
];
