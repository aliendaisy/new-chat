/**
 * Created by Administrator on 2017/8/16 0016.
 */
import React, {Component} from 'react'
import EditAddrInfo from './editAddrInfo';
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/dispatchAddr.css';

//地址块
const AddrBlock = ({name,phone,addr,onSelected,onDelete}) => {
    return(
        <div className="borderBottom otherFlex">
            <div className={"infoFlex infoFlexPad"} onClick={onSelected} value={addr}>
                <EditAddrInfo name={name}
                              phone={phone}
                              addr={addr}/>
            </div>
            <div className="intoWidth">
                <span className="iconfont icon-shanchu"
                      onClick={onDelete}
                      value={addr}>
                </span>
            </div>
        </div>
    )
};

export default AddrBlock;


