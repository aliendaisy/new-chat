/**
 * Created by Administrator on 2017/8/11 0011.
 */

export const Select = (index,comefrom) => ({
    type: 'Select',
    SelectIndex: index,
    comefrom:comefrom
})

export const NUM_ADD = {type: 'NUM_ADD'}

export const NUM_REDUCE = {type: 'NUM_REDUCE'}

export const BACK_TO_HOME = {type: 'BACK_TO_HOME'}

//订购方式
export const SELECT_SUBSCIBE_STYLE = (style) => ({
        type: 'SELECT_SUBSCIBE_STYLE',
        style: style
})

//配送方式
export const SELECT_STYLE_TYPE = (style) => ({
	type: 'SELECT_STYLE_TYPE',
	styleType: style
})

//配送日期
export const SELECT_SEND_DATE = (date) => ({
	type: 'SELECT_SEND_DATE',
	sendDate: date
})
//跳转至placeOrder
export const TO_PLACE_ORDER = (couponList) => ({
    type: 'TO_PLACE_ORDER',
    couponList: couponList
});
//选择代金券
export const CHANGE_COUPON = (amount,id,valid) => ({
	type: 'CHANGE_COUPON',
	amount: amount,
	id: id,
	valid: valid
})

//初始化地址
export const INIT_ADDR = (owner) => ({
    type: 'INIT_ADDR',
    owner: owner
})

//添加地址
export const ADD_ADDR = (milkAddress) => ({
    type: 'ADD_ADDR',
    milkAddress: milkAddress
})

export const DELETE_ADDR = (milkAddress) => ({
    type: 'DELETE_ADDR',
    milkAddress: milkAddress
})

export const SELECT_ADDR = (milkAddress) => ({
    type: 'SELECT_ADDR',
    milkAddress: milkAddress
})

export const CORNFORM_DELETE_ADDR = {
    type: 'CORNFORM_DELETE_ADDR'
};

export const CANCEL_DELETE_ADDR = {
    type: 'CANCEL_DELETE_ADDR'
};

//获取订单
export const TO_RENEW_ORDER = (renewList) => ({
	type: 'TO_RENEW_ORDER',
	renewList: renewList
})

export const INIT_ALL_ORDER = {
    type: 'INIT_ALL_ORDER',
}

export const TO_ALL_ORDER = (allList,status,tabIndex) => ({
	type: 'TO_ALL_ORDER',
	allList: allList,
	status: status,
	tabIndex: tabIndex
})

//点击再来一单
export const RENEW_ORDER = (list,index) => ({
	type: 'RENEW_ORDER',
	list: list,
	index: index
})
//调单
export const TO_CHANGE_ORDER = (orderIndex) => ({
	type: 'TO_CHANGE_ORDER',
	orderIndex: orderIndex
})
export const TO_CHANGE_PAY = (orderid,flowid,order) => ({
	type: 'TO_CHANGE_PAY',
	orderid: orderid,
	flowid: flowid,
	order: order
})
export const DELETE_CHANGE_PAY = {
	type: 'DELETE_CHANGE_PAY'
}

//获取代金券
export const INTO_COUPON = (couponData) => ({
	type: 'INTO_COUPON',
	couponData: couponData
});

//订单id
export const RECEIVE_ORDER_ID = (orderid) => ({
    type: 'RECEIVE_ORDER_ID',
    orderid: orderid
})

//待支付订单--继续支付
export const TO_RE_PAY_ORDER = (orderid) => ({
    type: 'TO_RE_PAY_ORDER',
    orderid: orderid
})

//取消支付
export const CANCEL_PAY = {
    type: 'CANCEL_PAY',
}

//取消调单
export const DELERE_ORDER = (orderid) => ({
    type: 'DELERE_ORDER',
    deleteOrderid: orderid
})

//取消调单
export const CANCEL_DELERE_ORDER = {
    type: 'CANCEL_DELERE_ORDER'
};

export const CONFIRM_DELERE_ORDER = {
    type: 'CONFIRM_DELERE_ORDER'
};

export const REGISTER_INFO = (ownerInfo) =>  ({
    type:'REGISTER_INFO',
    ownerInfo:ownerInfo
})

//获取可以查看物流的订单
export const RECEIVE_DISPAPCH_ORDER = (dispatchOrderList) => ({
    type:'RECEIVE_DISPAPCH_ORDER',
    dispatchOrderList:dispatchOrderList
});

export const CANCEL_DISPAPCH_ORDER = {
    type:'CANCEL_DISPAPCH_ORDER'
};

//选择某一条订奶信息进入查看物流页面
export const SELECT_DISPAPCH_ORDER = (list,selectIndex) => ({
    type: 'SELECT_DISPAPCH_ORDER',
	list: list,
    selectIndex: selectIndex
});
//进入allSend
export const TO_ALL_SEND = (sendData) => ({
	type: 'TO_ALL_SEND',
	sendData: sendData
})

//Init
export const INIT_GOOD_LIST = (goodsDataList) => ({
    type: 'INIT_GOOD_LIST',
    goodsDataList: goodsDataList
})


