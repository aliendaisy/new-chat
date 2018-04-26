/**
 * Created by Administrator on 2017/8/15 0015.
 */

import React from 'react';

//选项卡 默认一个选中
const OrderAddr = ({name,phone,addr,onClick}) => {
    return(
        <div className="orderAddrCon" onClick={onClick}>
            <div className="orderAddrSon">
                <span className="receiver">{name}</span>
                <span className="receiverPhone">{phone}</span>
            </div>
            <div className="orderAddrRow">
                <div className="orderAddrPic">
                    <i className="iconfont icon-dizhi iconSm"></i>
                </div>
                <div className="orderAddrFont">
                    {addr}
                </div>
                <div className="orderAddrInto">
                    <i className="iconfont icon-jinru iconNone"></i>
                </div>
            </div>
        </div>
    )
}

export default  OrderAddr;