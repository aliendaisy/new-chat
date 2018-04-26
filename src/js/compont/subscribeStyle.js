/**
 * Created by Administrator on 2017/8/14 0014.
 */
import React from 'react';

//选项卡 默认一个选中
const SubscribeStyle = ({arr,style,handleStyle}) => {
    return(
        <div>
            {/*循环 通过this.props.arr传值给父组件*/}
            {arr.map((res,i) => {
                let ss = 'false';
                if (style === res){
                    ss = 'true';
                }
                return(
                    <button className={ss === 'true' ? 'blue' : 'white'}
                            key={i} value={res} onClick={ (e) => {
                                handleStyle(e.target.value)
                    }}>{res}</button>
                )
            })}
        </div>
    )
}

export default SubscribeStyle;
