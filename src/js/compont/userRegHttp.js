/**
 * Created by qm on 2017/8/12.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import PropTypes from 'prop-types';
import {Header} from './public';

export default class UserRegHttp extends Component {
    constructor(props,context){
        super(props);
        this._userRegHttpClick = this.userRegHttpClick.bind(this)
    }

    userRegHttpClick(toUrl){
        let comefrom = this.context.router.history.location.comefrom;
        if(comefrom == 'ownerLogin'){
            this.context.router.history.push({
                pathname: 'ownerLogin',
                comefrom:'userRegHttp'
            })
        }else{
            this.context.router.history.push({
                pathname:'/help',
                comefrom:'userRegHttp'
            })
        }
    }
    render(){
        return(
            <div className="topCon">
                <Header name="用户注册协议" onClick={this._userRegHttpClick}/>
                <div className="httpCon">
                    <p>在您完成智取管家用户注册之际，建议您仔细阅读本协议再进行注册。
                       本协议在您接受注册时生效，将成为您和智取管家之间具有法律意义的文件，您和智取管家将同时受到本协议条款的约束。
                    </p>
                    <p> 第一条	定义</p>
                    <p> “智取管家”是指杭州礼邻网络科技有限公司创建的用于提供物品配送的平台
                        “会员”是指按照智取管家的要求完成注册的智取管家用户，用户可以通过线下订单和网上注册成为智取管家会员，享受智取管家为会员提供的服务。
                    </p>
                    <p> 第二条	会员享受的服务</p>
                    <p>会员可以享受如下服务：</p>
                    <p> （1）	在完成提交订单并支付等相关程序后接受用车服务；</p>
                    <p> （2）	拥有会员信息管理系统，初期有效的保存在智取管家数据；</p>
                    <p> （3）	随时查询历史订单记录；</p>
                    <p> （4）	享受最新的智取管家服务及优惠政策；</p>
                    <p> （5）	“智取管家”根据业务规划随时增添的其他服务；</p>
                    <p>  第三条	会员注册</p>
                    <p>
                        用户根据“智取管家”会员注册的要求填写真实会员信息，并表示接受本协议后方可申请成为会员。
                        申请成为“智取管家”会员的具体流程如下：
                    </p>
                    <p>第一步：点击“个人中心”；</p>
                    <p>第二步：填写注册信息；</p>
                    <p>第三步：勾选“同意用户注册协议”；</p>
                    <p>第四步：点击登录；</p>
                    <p> 第四条	会员的ID及密码的保管</p>
                    <p>
                        会员的ID及密码由会员自行保管。禁止会员将自己的ID及密码交付第三人使用，
                       若第三人凭正确的用户ID密码进行网络活动（网络预订等），将被智取管家视为该用户自身行为，
                       该行为引起的一切法律后果由该会员承担。
                    </p>
                    <p>第五条	会员的义务</p>
                    <p>
                        会员不得从事以下行为，若发生下列行为，则会员应承担相应的法律责任，智取管家有权限制或取消其会员权限：
                    </p>
                    <p>（1）	申请或变更会员信息时提供虚假信息；</p>
                    <p>（2）	盗用他人信息</p>
                    <p>（3）	利用任何方式方法危害“智取管家”网站系统的安全；</p>
                    <p>（4）	利用智取管家损害任何第三人的合法权益；</p>
                    <p>（5）	在智取管家网站上复制、发布任何形式的虚假信息，或复制、发布含有下列内容的信息：</p>
                    <p>a．	危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一</p>
                    <p>b．	损害国家荣誉和利益；</p>
                    <p>c．	煽动民族仇恨、民族歧视，破坏民族团结</p>
                    <p>d．	破坏国家宗教政策，宣扬邪教和封建迷信</p>
                    <p>e．	散步谣言，扰乱社会秩序，破坏社会稳定</p>
                    <p>f．	散步淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪</p>
                    <p>g．	含有法律、行政法规禁止的其他内容</p>
                    <p> 第六条	智取管家的义务</p>
                    <p>
                       智取管家保证遵从其在智取管家服务平台上公布的所有服务承诺，努力创建高效便捷的网络购物平台。
                        智取管家为保障会员安全的使用其提供的网络服务，将建立保护会员信息的安全系统并定期进行维护，非经国家有关机关的指令，智取管家绝不向任何人泄露会员的任何信息。
                    </p>
                    <p>第七条	通知的发送</p>
                    <p>智取管家通过会员注册时指定的手机号码以及APP、微信公众号的通知推送向会员发送通知。</p>
                </div>
            </div>
        )
    }
}

//UserRegHttp组件跳转定义
UserRegHttp.contextTypes = {
    router: PropTypes.object
};
