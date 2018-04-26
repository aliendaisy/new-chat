/**
 * Created by Administrator on 2017/8/16 0016.
 */
import React, {Component} from 'react'

const EditAddrInfo = ({name,phone,addr}) => {
    return(
        <div>
            <div className="receiveCon">
                <span className="receiver">收货人：{name}</span>
                <span className="receiverPhone">{phone}</span>
            </div>
            <div className="defaultAddrCon">
                <span value={addr}>{addr}</span>
            </div>
        </div>
    )
}

export default EditAddrInfo;
