/**
 * Created by Administrator on 2017/8/13 0013.
 */
import {getGoodsData} from '../compont/public';
import moment from 'moment';
// import Immutable from 'immutable';
import {orderDefault,ownerDefault} from '../constant/order';
import {PURSE_PAY,WX_PAY,WX_PURSE_PAY} from '../constant/payModel'

var goodsData = getGoodsData();

//localStorage.setItem("openid","oCWLqtwV5LTPBHwAfTdkrrpVbWQk");

let openid = localStorage.getItem('openid');
let ownerid = localStorage.getItem('ownerid');
let mobile = localStorage.getItem('mobile');

var owner = ownerDefault;


if (!!openid){
    if(openid === 'oCWLqtwV5LTPBHwAfTdkrrpVbWQk') {
        localStorage.clear();
    }else{
        owner.openid = openid;
        owner.isExsitOpenid = 'Y';
    }
}

if (ownerid && mobile){
    owner.ownerid = ownerid;
    owner.mobile = mobile;
    owner.isRgiste = 'Y';
}

var toOrder = orderDefault;

const toOrderReducer = (state={toOrder:toOrder, goodsDataList:goodsData,owner:owner}, action) => {

     console.log('toOrderReducer in was called with args',state,action);

    let outPara = {};
    let owner = {};
    let toOrder ={};
    let orderList = {};
    let index = 0xff;
    let payInfo = {};
    let dispatchOrder = {};

    switch (action.type){

        case "Select":
            //state.toOrder.comefrom = action.comefrom;
            state.toOrder.SelectGood = state.goodsDataList.goodsData[action.SelectIndex];
            state.toOrder.num = 1;
            state.toOrder.orderType = "月订";
            //state.toOrder.discount = false;
            state.toOrder.znum = 0;

            //价格
            state.toOrder.SelectGood.typeData.map((item) => {
	             if(item.orderType === state.toOrder.orderType){
	                state.toOrder = {...state.toOrder,...item};
	                state.toOrder.originalPrice = item.originalPrice / 1000;
	             }
            });

            // state.toOrder.price = state.toOrder.
            state.toOrder.disPrice = state.toOrder.price / 1000; //原价
            state.toOrder.price = state.toOrder.originalPrice; //折扣价
            state.toOrder.amount = state.toOrder.num * state.toOrder.disPrice;

            return state;

        case "NUM_ADD":
	        outPara= {...state.toOrder};
            outPara.num += 1;
            outPara.amount = outPara.num * outPara.disPrice;
            return   {...state, toOrder:outPara};


        case "NUM_REDUCE":
            outPara= {...state.toOrder};
            outPara.num -= 1;
            outPara.amount = outPara.num * outPara.disPrice;
            return   {...state, toOrder:outPara};

        case "BACK_TO_HOME":
            break;

        case "SELECT_SUBSCIBE_STYLE":
            //价格
            state.toOrder.SelectGood.typeData.map((item) => {
                if(item.orderType === action.style){
                    state.toOrder = {...state.toOrder,...item};
	                state.toOrder.originalPrice = item.originalPrice / 1000;
                }
            });

            state.toOrder.disPrice = state.toOrder.price / 1000; //原价
            state.toOrder.price = state.toOrder.originalPrice; //折扣价
            state.toOrder.amount = state.toOrder.num * state.toOrder.disPrice;
            state.toOrder.orderType = action.style;

            return {...state};

	    case "SELECT_STYLE_TYPE":
		    outPara = {...state.toOrder};
		    outPara.styleType = action.styleType;

		    return {...state, toOrder:outPara};


	    case "SELECT_SEND_DATE":
		    outPara = {...state.toOrder};
		    outPara.sendDate = action.sendDate;

		    return {...state, toOrder:outPara};
	    case "TO_PLACE_ORDER":

		    //按代金券金额从大到小排序
		    let compare = (property) => {
			    return (a,b) => {
				    var value1 = a[property];
				    var value2 = b[property];
				    return value2 - value1;
			    }
		    };
		    let condition = '';
		    if (state.toOrder.name === '酸奶8盒装') {
			    condition = '现代牧业酸奶';
		    } else if (state.toOrder.name === '鲜奶1L装' || state.toOrder.name === '鲜奶250ml装') {
			    condition = '现代牧业鲜奶';
		    } else {
			    condition = '农夫山泉橙汁';
		    }

	        let canUseList = [];
	        let unCanUseList = [];
	        action.couponList.map((item) => {
	            if (item.status === "可使用"){
		            if (item.minumum / 1000 > state.toOrder.amount) {
			            unCanUseList.push(item);
		            }else{
			            if(item.range.indexOf(condition) < 0 && item.range.indexOf('全部商品') < 0) {
				            unCanUseList.push(item);
			            }else{
				            canUseList.push(item);
			            }
		            }
                }
            });

		    canUseList.sort(compare('amount')); //从大到小金额排序
            outPara = {...state.toOrder};


		    if (canUseList.length > 0){
                outPara.coupon.id = canUseList[0]._id;
                outPara.coupon.amount = canUseList[0].amount / 1000;
                outPara.coupon.valid = true;
		        outPara.amountOut = outPara.amount - outPara.coupon.amount;
            }else{
                outPara.amountOut = outPara.amount;
            }
            return {...state, couponList: {canUseList,unCanUseList}, toOrder: outPara};

	    case "CHANGE_COUPON":
			outPara = {...state.toOrder};

		    outPara.coupon.id = action.id;
		    outPara.coupon.amount = action.amount;
		    outPara.coupon.valid = action.valid;
		    outPara.amountOut = outPara.amount - outPara.coupon.amount;

		    console.log(outPara.coupon.id)
		    return {...state,toOrder: outPara};

		    //获取个人信息
        case "INIT_ADDR":
            owner = {...state.owner,...action.owner};
           /******************有关A地址的的内容******************/
            //let Rcommunity;
            //let Rbuild;
            //let Runit;
            //let detail;
            //let detailA;
            //let Rroom;
            //if (owner.Address.length === 0 && owner.milkAddress.length === 0){
            //    return {...state,owner:owner};
            //}else if(owner.Address.length > 0){
            //    //处理A地址幢单元
            //    detail = owner.Address[0].detail.substring(0,owner.Address[0].detail.length);
            //    let num = 0;
            //    for(let i=0;i<detail.length-1;i++){
            //        if (detail[i] == '-'){
            //            num++;
            //        }
            //    }
            //    if(num == 3){
            //        detailA=detail.split("-");
            //        Rcommunity = detailA[0];
            //        Rbuild = detailA[1];
            //        Runit = detailA[2]
            //        Rroom = detailA[3]
            //    }else if(num == 4){
            //        detailA=detail.split("-");
            //        Rcommunity = detailA[0];
            //        Rbuild = detailA[2];
            //        Runit = detailA[3]
            //        Rroom = detailA[4]
            //    }
            //    outPara = {...state.toOrder,detail:owner.Address[0].detail,mobile:owner.mobile,name:owner.name,community:Rcommunity,
            //        park:'',build:Rbuild,unit:Runit,room:Rroom,district:''};
            //    return {...state,toOrder: outPara,owner:owner};
            //}
            //else if(owner.Address.length === 0 && owner.milkAddress.length > 0){
            //    outPara = {...state.toOrder,...owner.milkAddress[0]};
            //    return {...state,toOrder: outPara,owner:owner};
            //}

            /******************有关A地址的的内容******************/


            if (owner.milkAddress.length === 0){
                return {...state,owner:owner};
            }else if(owner.milkAddress.length > 0){
                outPara = {...state.toOrder,...owner.milkAddress[0]};
                return {...state,toOrder: outPara,owner:owner};
            }

            return {...state,owner:owner};

        case "ADD_ADDR":
            //订单中无地址
            toOrder = {...state.toOrder};
            owner = {...state.owner};

            if (!toOrder.detail){//不存在
                toOrder.detail = action.milkAddress.detail;
                toOrder.name = action.milkAddress.name;
                toOrder.mobile = action.milkAddress.mobile;
                toOrder.community = action.milkAddress.community;
                toOrder.district = action.milkAddress.district;
                toOrder.park = action.milkAddress.park;
                toOrder.build = action.milkAddress.build;
                toOrder.unit = action.milkAddress.unit;
                toOrder.room = action.milkAddress.room;
                toOrder.note = action.milkAddress.note;
                toOrder._id = action.milkAddress._id;
                owner.milkAddress.push(action.milkAddress);
                return {...state,toOrder:toOrder,owner:owner};
            }else {
                owner.milkAddress.push(action.milkAddress);
                return {...state,toOrder:toOrder,owner:owner};
            }
            break;

        case "DELETE_ADDR":

        return {...state,deleteAddr:action.milkAddress};
            // owner = action.owner;
            // let index = 0xff;
            //
            // if (action.milkAddress.Atype === "A"){
            //     owner.Address.map((item,i) => {
            //         if(item._id === action.milkAddress._id){
            //             index = i;
            //         }
            //     })
            //     if (index != 0xff){
            //         owner.Address.splice(index,1);
            //     }
            //
            //     return {...state,owner:owner};
            //
            // }else if (action.milkAddress.Atype === "C"){
            //     owner.milkAddress.map((item,i) => {
            //         if(item._id === action.milkAddress._id){
            //             index = i;
            //         }
            //     })
            //     if (index != 0xff){
            //         owner.milkAddress.splice(index,1);
            //     }
            //     return {...state,owner:owner};
            // }else {
            //     return state;
            // }
            break;

        case "CORNFORM_DELETE_ADDR":

            let index = 0xff;

            owner= state.owner;
            toOrder = state.toOrder;
            /******************有关A地址的的内容******************/
            //owner.Address.map((item,i) => {
            //    if (item.detail === state.deleteAddr){
            //        index = i;
            //        toOrder.detail = "";
            //        toOrder.name = '';
            //        toOrder.mobile = '';
            //        toOrder.community = '';
            //        toOrder.district = '';
            //        toOrder.park = '';
            //        toOrder.build = '';
            //        toOrder.unit = '';
            //        toOrder.room = '';
            //        toOrder.note = '';
            //        toOrder._id = '';
            //    }
            //});
            //
            //if (index != 0xff){
            //    owner.Address.splice(index,1);
            //    toOrder.detail = "";
            //    toOrder.name = '';
            //    toOrder.mobile = '';
            //    toOrder.community = '';
            //    toOrder.district = '';
            //    toOrder.park = '';
            //    toOrder.build = '';
            //    toOrder.unit = '';
            //    toOrder.room = '';
            //    toOrder.note = '';
            //    toOrder._id = '';
            //    // return {...state,owner:owner,toOrder:toOrder};
            //}
            /******************有关A地址的的内容******************/

            index = 0xff;
            owner.milkAddress.map((item,i) => {
                if (item.detail === state.deleteAddr){
                    index = i;
                }
            });

            if (index != 0xff){
                console.log("index",index);
                owner.milkAddress.splice(index,1);
                toOrder.detail = "";
            }

            if (!toOrder.detail){
                if (owner.milkAddress.length > 0){
                    toOrder.detail = owner.milkAddress[0].detail;
                    toOrder.mobile = owner.milkAddress[0].mobile;
                    toOrder.name = owner.milkAddress[0].name;
                    toOrder.community = owner.milkAddress[0].community;
                    toOrder.district = owner.milkAddress[0].district;
                    toOrder.park = owner.milkAddress[0].park;
                    toOrder.build = owner.milkAddress[0].build;
                    toOrder.unit = owner.milkAddress[0].unit;
                    toOrder.room = owner.milkAddress[0].room;
                    toOrder.note = owner.milkAddress[0].note;
                    toOrder._id = owner.milkAddress[0]._id;
                }
                /******************有关A地址的的内容******************/
                //if (owner.Address.length > 0){
                //    toOrder.detail = owner.Address[0].detail;
                //    toOrder.name = owner.name;
                //    toOrder.mobile = owner.mobile;
                //    toOrder.community = '';
                //    toOrder.district = '';
                //    toOrder.park = '';
                //    toOrder.build = '';
                //    toOrder.unit = '';
                //    toOrder.room = '';
                //    toOrder.note = '';
                //    toOrder._id = '';
                //}
                /******************有关A地址的的内容******************/
            }

            return {...state,owner:owner,toOrder:toOrder};


        case "CANCEL_DELETE_ADDR":
            outPara = {...state};
            delete outPara.deleteAddr;
            return outPara;


        case "SELECT_ADDR":
            toOrder = state.toOrder;
            toOrder.detail = action.milkAddress.detail;
            toOrder.name = action.milkAddress.name;
            toOrder.mobile = action.milkAddress.mobile;
            toOrder.district = action.milkAddress.district;
            toOrder.community = action.milkAddress.community;
            toOrder.park = action.milkAddress.park;
            toOrder.build = action.milkAddress.build;
            toOrder.unit = action.milkAddress.unit;
            toOrder.room = action.milkAddress.room;
            toOrder.note = action.milkAddress.note;
            return {...state,toOrder:toOrder};


        case "TO_RENEW_ORDER":
			let renewList = action.renewList;
		    return {...state,orderList: {renewList}};

        case 'CANCEL_RENEW_ORDER':
            delete state.orderList;
            return state;

        case 'INIT_ALL_ORDER':
        {
            let allList = [];
            return {...state,orderList: {allList: allList}};
        }
            break;
		case "TO_ALL_ORDER":
		    let allList = action.allList;
		    let tabIndex = action.tabIndex;
		    let status = action.status;
		    return {...state,orderList: {allList: allList,tabIndex: tabIndex,status: status}};
	    case "RENEW_ORDER":
			let renewOrder = action.list[action.index];
		    outPara = {...state.toOrder};
		    console.log(outPara)

		    outPara.num = renewOrder.num;
		    outPara.orderType = !renewOrder.orderContent ? '月订' : renewOrder.orderContent.orderWay;
		    outPara.originalPrice = !renewOrder.orderContent ? (renewOrder.price / 1000) : (renewOrder.orderContent.originalUnitPrice / 1000);
            outPara.znum = !renewOrder.znum ? 0 : renewOrder.znum;


		    state.goodsDataList.goodsData.map((res) => {
			    if(res.note === renewOrder.type) {
				    res.typeData.map((item) => {
					    if(item.orderType === outPara.orderType){
						    outPara = {...state.toOrder,SelectGood: res,...item};
					    }
				    })
			    }
		    });

            outPara.disPrice = outPara.price / 1000; //原价
            outPara.originalPrice = outPara.originalPrice / 1000;
            outPara.price = outPara.originalPrice; //折扣价
		    outPara.amount = outPara.num * outPara.disPrice;

            console.log(outPara)
		    return {...state,toOrder: outPara};
	    case "TO_CHANGE_ORDER":
		    let changeOrder = state.orderList.allList[action.orderIndex];

			let canChangeType = true;

		    let orderContent = {
				orderWay: '月订',
			    subhead: changeOrder.type,
			    originalUnitPrice: changeOrder.price
		    };

		    outPara = {...state.toChangeOrder};
		    outPara._id = changeOrder._id;
			outPara.sendTime = changeOrder.sendTime;
		    outPara.name = changeOrder.name;
		    outPara.mobile = changeOrder.mobile;
		    outPara.detail = changeOrder.detail;
		    outPara.orderContent = !changeOrder.orderContent ? orderContent : changeOrder.orderContent;
		    outPara.snum = changeOrder.snum;
		    outPara.rnum = changeOrder.rnum;
		    outPara.num = changeOrder.num;
		    outPara.znum = !changeOrder.znum ? 0 : changeOrder.znum;
		    outPara.type = changeOrder.type;
		    outPara.style = changeOrder.style;
		    //能否调牛奶品种
		    changeOrder.history.map(res => {
			    if(res.msgType === '业主调单') {
				    if(res.msg) {
			            let newArray = res.msg.split(';');
			            newArray.map((e) => {
			                if(e.indexOf('牛奶品种') >= 0) {
				                canChangeType = false;
			                }
			            });
				    }
 			    }
		    });
		    outPara.canChangeType = canChangeType;

		    return {...state, toChangeOrder: outPara};
		case 'TO_CHANGE_PAY':
			let wxPayChange = 0;
			let pursePayChange = 0;
			let changePayModel = WX_PAY;
			let purseMoney = (state.owner.changeaccount + state.owner.giftaccount) / 1000;
			let changeMoney = action.order.diffPrice / 1000;

            if((typeof state.owner.changeaccount == 'undefined') || (typeof state.owner.giftaccount == 'undefined')){
                purseMoney = 0;
            }

			if (purseMoney - changeMoney >= 0){
				changePayModel = PURSE_PAY;

				wxPayChange = 0;
				pursePayChange = changeMoney;

			}else {
				changePayModel = WX_PAY;

				wxPayChange = changeMoney - purseMoney;
				pursePayChange = purseMoney;
			}

			let changePayInfo = {
				orderid: action.orderid,
				flowid: action.flowid,
				order: action.order,
				changeMoney: changeMoney,
				wxPayChange: wxPayChange,
				changePayModel: changePayModel,
				pursePayChange: pursePayChange
			};

		    outPara = {...state.changePayInfo};

		    return {...state,changePayInfo: changePayInfo};
	    case 'DELETE_CHANGE_PAY':
		    if (!!state.changePayInfo){
			    delete state.changePayInfo;
			    return state;
		    }else {
			    return state;
		    }
		    break;

        case 'RECEIVE_ORDER_ID':

            let orderPrice = state.toOrder.num * state.toOrder.disPrice;//商品价格
            let couponMoney = 0;//代金券
            if (state.toOrder.coupon.valid){
                couponMoney = state.toOrder.coupon.amount;
            }
            let needPay = orderPrice - couponMoney;//用户实际需要支付
            let payModel = WX_PAY;
            let wxPayAccount = 0;
            let pursePayAccount = 0;

            let costAccount = (state.owner.changeaccount + state.owner.giftaccount)/1000;//零钱包 = 本金 + 赠金;

            if((typeof state.owner.changeaccount == 'undefined') || (typeof state.owner.giftaccount ==  'undefined')){
                costAccount = 0;
            }

            if (costAccount >= needPay){
                payModel = PURSE_PAY;

                wxPayAccount = 0;
                pursePayAccount = needPay;

            }else {
                payModel = WX_PAY;

                wxPayAccount = needPay - costAccount;
                pursePayAccount = costAccount;
            }


            let payInfo = {
                orderPrice:orderPrice,
                wxPayAccount:wxPayAccount,
                pursePayAccount:pursePayAccount,
                needPay:needPay,
                couponMoney:couponMoney,
                payModel:payModel,
                orderid:action.orderid
            };

            //订单中无地址
            toOrder = {...state.toOrder};
            toOrder.orderid = action.orderid;
            // toOrder.payInfo = payInfo;
            console.log(toOrder);
            state.payInfo = payInfo;

            return {...state, toOrder:toOrder};


        case 'DELERE_ORDER':
            orderList = {...state.orderList};
            orderList.deleteOrderid = action.deleteOrderid;

            return {...state,orderList:orderList};

        case 'CONFIRM_DELERE_ORDER':
            orderList = {...state.orderList};
            let deleteIndex = 0xff;
            orderList.allList.map((item,index) => {
                if (item.orderid === orderList.deleteOrderid){
                    deleteIndex = index;
;                }
            });

            if (deleteIndex != 0xff){
                orderList.allList.splice(deleteIndex,1);
                delete orderList.deleteOrderid;
            }

            return state;
                //allList

        case 'CANCEL_DELERE_ORDER':
            orderList = {...state.orderList};
            delete orderList.deleteOrderid;

            return {...state,orderList:orderList};

        //待支付订单重新支付
        case 'TO_RE_PAY_ORDER':
            index = 0xff;
            orderList = {...state.orderList};
            orderList.allList.map((item,orderIndex) => {
                if (item.orderid == action.orderid){
                    index = orderIndex;
                }
            })
            console.log("index", index);
            if (index != 0xff){

                // let orderPrice = orderList.allList[index].payInfo.amount/1000;//商品价格
                let orderPrice = orderList.allList[index].num * orderList.allList[index].orderContent.unitPrice /1000;//商品价格
                let couponMoney = orderList.allList[index].orderContent.voucherPrice/1000;//代金券
                let needPay = orderPrice - couponMoney;//用户实际需要支付

                let payModel = WX_PAY;
                let wxPayAccount = 0;
                let pursePayAccount = 0;

                let costAccount = (state.owner.changeaccount + state.owner.giftaccount)/1000;//零钱包 = 本金 + 赠金;

                if((typeof state.owner.changeaccount == 'undefined') || (typeof state.owner.giftaccount ==  'undefined')){
                    costAccount = 0;
                }

                if (costAccount >= needPay){
                    payModel = PURSE_PAY;

                    wxPayAccount = 0;
                    pursePayAccount = needPay;

                }else {
                    payModel = WX_PAY;

                    wxPayAccount = needPay - costAccount;
                    pursePayAccount = costAccount;
                }
                let valid;
                if(!orderList.allList[index].orderContent.voucherId){
                    valid = false;
                    orderList.allList[index].orderContent.voucherPrice = 0;
                }else{
                    valid = true
                }
	            let toOrder = {
		            SelectGood: {
			            homeTitle: orderList.allList[index].type
		            },
		            snum: orderList.allList[index].snum,
		            orderType: orderList.allList[index].orderContent.orderWay,
		            styleType: orderList.allList[index].style,
		            sendDate: moment(orderList.allList[index].sendTime).format('YYYY-MM-DD'),
                    amount:orderList.allList[index].orderContent.unitPrice*orderList.allList[index].num/1000,
                    amountOut:orderList.allList[index].orderContent.unitPrice*orderList.allList[index].num/1000-orderList.allList[index].orderContent.voucherPrice/1000,
                    build:orderList.allList[index].build,
                    community:orderList.allList[index].communityName,
                    coupon:{
                        id:orderList.allList[index].orderContent.voucherId,
                        amount:orderList.allList[index].orderContent.voucherPrice/1000,
                        valid:valid
                    },
                    detail:orderList.allList[index].detail,
                    disPrice:orderList.allList[index].orderContent.unitPrice/1000,
                    district:orderList.allList[index].district,
                    giftSnum:orderList.allList[index].giftSnum,
                    giftNum:orderList.allList[index].giftNum,
                    giftType:orderList.allList[index].giftType,
                    num:orderList.allList[index].num,
                    name:orderList.allList[index].name,
                    mobile:orderList.allList[index].mobile,
                    originalPrice:orderList.allList[index].orderContent.originalUnitPrice / 1000,
                    park:orderList.allList[index].park,
                    price:orderList.allList[index].orderContent.unitPrice/1000,
                    room:orderList.allList[index].room,
                    unit:orderList.allList[index].unit,
                    znum:orderList.allList[index].znum,
                    typeIndex:0

	            };


                let payInfo = {
                    orderPrice:orderPrice,
                    wxPayAccount:wxPayAccount,
                    pursePayAccount:pursePayAccount,
                    needPay:needPay,
                    couponMoney:couponMoney,
                    payModel:payModel,
                    orderid:action.orderid
                };


                console.log("payInf", payInfo);
                state.payInfo = payInfo;
	            state.toOrder = toOrder;
                return state;

            }else {
                return state;
            }
            break;

        case 'CANCEL_PAY':
            if (!!state.payInfo){
                delete state.payInfo;
                return state;
            }else {
                return state;
            }

            break;

        case 'INTO_COUPON':
            let couponData = action.couponData;
            return {...state,couponData:couponData}

        case 'REGISTER_INFO':
            let ownerInfo = {...state.owner,...action.ownerInfo};
            ownerInfo.isRgiste = 'Y';
            return {...state,owner:ownerInfo};

        case 'RECEIVE_DISPAPCH_ORDER':
            dispatchOrder = {};
            dispatchOrder.list = action.dispatchOrderList;
            state.dispatchOrder = dispatchOrder;
            return state;

        case 'CANCEL_DISPAPCH_ORDER':
            delete state.dispatchOrder;

            return state;

        case 'SELECT_DISPAPCH_ORDER':
            //dispatchOrder = {...state.dispatchOrder};
            //dispatchOrder.selectIndex = action.selectIndex;
	        let logistics = action.list[action.selectIndex];

			console.log(logistics)
            return {...state, logistics: logistics};
            //break
            //
            //return state;
            //break
		case 'TO_ALL_SEND':
		    let monthArray = action.sendData;

		    return {...state,monthArray: monthArray};

        case 'INIT_GOOD_LIST':
            state.goodsDataList = action.goodsDataList;
            return state;
        default:
            return state;
    }

    console.log('toOrderReducer out was called with args',state);

    return state;

};

export default toOrderReducer;

