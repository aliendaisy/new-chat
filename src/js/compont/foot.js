/**
 * Created by Administrator on 2017/8/15 0015.
 */
import React from 'react';

const Footer = ({footerBtn,onClick}) => {
    return (
        <button className="footerBtn"
                onClick={onClick}>{footerBtn}</button>
    )
}

export default Footer;