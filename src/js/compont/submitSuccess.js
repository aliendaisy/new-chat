import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/orderSuccess.css';
import {NoBackHeader,SuccessSign,GreyBtn} from './public';
import PropTypes from 'prop-types';

//提交成功主页面
export default class SubmitSuccess extends Component {
    constructor(props){
        super(props);
        this._backPerson = this.backPerson.bind(this);//返回个人中心
        //this._submitBack = this.submitBack.bind(this);//导航返回上一级
    }
    backPerson(){
        this.context.router.history.push({
            pathname: '/wxReactHome',
            comefrom:'submitSuccess'
        });
    }
    render(){
        return(
            <div className="orderSuccessCon">
                <NoBackHeader name="提交状态"/>
                <div className="innerWhite topCon">
                    <div className="successBox">
                        <SuccessSign success="提交成功"/>
                    </div>
                    <div className="successSon">
                        <p>非常感谢您的提交</p>
                        <p>我们会尽快处理并与您联系</p>
                    </div>
                    <div className="successSon distance">
                        <div className="btnPosition">
                            <GreyBtn greyBtn="返回首页" onClick={this._backPerson}/>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

//SubmitSuccess组件跳转定义
SubmitSuccess.contextTypes = {
    router: PropTypes.object
};