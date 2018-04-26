/**
 * Created by Administrator on 2017/8/15 0015.
 */
import React from 'react';

const Header = ({name,onClick}) => {
    return(
        <nav className="navHeader">
            <div className="headerLeft left" onClick={onClick}>
                <span className="iconfont icon-fanhui iconSm colorGrey"></span>
            </div>
            <div className="headerRight left">
                <span>{name}</span>
            </div>
        </nav>
    )
}

export default Header;
