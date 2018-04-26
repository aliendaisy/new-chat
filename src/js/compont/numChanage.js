/**
 * Created by Administrator on 2017/8/13 0013.
 */
import React from 'react';

const NumChanageFun = ({defaultNum,add,reduce}) => {
    let iconColor = defaultNum == 1 ? 'colorGrey' : 'colorBlue';
    let val = defaultNum;

    return(
        <div className="numChange">
            <span className={"iconfont icon-jianhao " + iconColor} onClick={ () => {
                if ( val > 1){
                    reduce()}
                }
            }/>
            <input type="number" className="inputStyle" value={val} disabled="disabled" readOnly/>
            <span className="iconfont icon-jiahao colorBlue" onClick={() => {
                 add()

            }} />

        </div>
    )
};

export default NumChanageFun
