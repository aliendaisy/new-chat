/**
 * Created by Administrator on 2017/8/14 0014.
 */
import {getSendDateList} from '../compont/public'

/*num: this.data.num, //订购份数
 typeIndex: this.orderType.indexOf(this.data.type),
 type: this.orderType[this.orderType.indexOf(this.data.type)], //订购类型
 amount: this.data.amount, //订购总价
 price: this.data.price, //订购原价
 disPrice: this.data.disPrice, //订购折扣价
 allNum: this.data.allNum, //总订购次数
 giftType: this.data.giftType,
 giftSnum: this.data.giftSnum,
 giftNum: this.data.giftNum
 */

export const orderDefault = {
    num:1,
    typeIndex:0,
    amount:0,
	amountOut:0,
    price:0,
    disPrice:0,
    //allNum:0,
    giftType:'无',
    giftSnum:0,
    giftNum:0,
    orderType:'月订',
    snum:0,
    znum:0,

	styleType: '三天一送',
	sendDate: getSendDateList()[0],
	coupon: {id:'',amount:0,valid:false},

    mobile:'',
    name:'',
    addr:'',



}

export const ownerDefault = {
    isRgiste:"N",
    isExsitOpenid:"N",
    mobile:"",
    openid:"",
    ownerid:"",
    milkAddress:[],
    Address:[]
}

export const defaultPayInfo = {
    orderPrice:0,
    couponMoney:0,
    needPay:0,
};