/**
 * Created by Administrator on 2017/8/19 0019.
 */
import React  from 'react'
import UnSend from './unSend';


/*
 *
 * @param content : 调单消息内容
 * @param time 调单时间
 * @returns {XML}
 * @constructor
 */

const ChangeSend = ({content,time}) =>{
    return(
        <div className="changeSend">
            <div className="iconfont icon-error icon-md leftP"></div>
            <div className="rightP">
                <p>修改了配送内容</p>
                <p>配送内容改为: {content}</p>
                <p>{time}</p>
            </div>
            <UnSend/>
        </div>
    )
}

export default ChangeSend;