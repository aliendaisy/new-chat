/**
 * Created by qm on 2017/8/12.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import PropTypes from 'prop-types';
import {Header} from './public';

export default class RechargeHttp extends Component {
    constructor(props,context){
        super(props);
        this._rechargeHttpClick = this.rechargeHttpClick.bind(this);
        //this.purseComeFrom = props.location.query.purseComeFrom
    }

    rechargeHttpClick(){
        let comefrom = this.context.router.history.location.comefrom;
        if(comefrom == 'home/purse'){
            this.context.router.history.push({
                pathname: '/purse',
                comefrom:'home/purse/rechargeHttp'
            });
        }else if(comefrom == 'personCenter/purse'){
            this.context.router.history.push({
                pathname: '/purse',
                comefrom:'personCenter/purse/rechargeHttp'
            });
        }else{
            this.context.router.history.goBack()
        }
        //if(this.purseComeFrom == 'purse'){
        //    this.context.router.history.push({
        //        pathname: 'purse',
        //        query:{
        //            purseComeFrom:'rechargeHttp'
        //        }
        //    })
        //}else{
        //    this.context.router.history.push({
        //        pathname:'/help',
        //        purseComeFrom:'rechargeHttp'
        //    })
        //}
    }
    render(){
        return(
            <div className="topCon">
                <Header name="充值协议" onClick={this._rechargeHttpClick}/>
                <div className="httpCon">
                    <p>尊敬的用户，为保障您的合法权益，请您在点击“确认充值”按钮前，完整，仔细的阅读本充值协议，当您点击“确认充值”按钮，即视为您已阅读、理解本协议，并同意按照本协议约定的规则进行充值和使用余额行为。如您不接受本协议的部分或全部内容，请您不要点击“确认充值”按钮。
                    </p>
                    <p>第一条	定义</p>
                    <p>1、“智取管家”是指杭州礼邻网络科技有限公司（以下简称礼邻公司）所有并负责运营的网络购物平台。</p>
                    <p>2、“注册用户”是指接受《智取管家用户注册协议》约定，自主自愿在智取管家APP、微信公众号中按照要求填写注册信息，
                        直到完成注册后按照约定享受智取管家提供的网络购物服务的自然人，本协议中的“您”即指注册用户。
                    </p>
                    <p>3、若用户未满18周岁，则为未成年人，应在法定监护人的监督指导下阅读、理解本协议，再进行充值行为。</p>
                    <p>第二条	账户安全</p>
                    <p>1、您在使用智取管家的充值服务时，智取管家特别提醒您应妥善保管您的账户和密码，不要随意向第三方透露您的账户信息。</p>
                    <p>2、因您的账户密码保管不善而导致遭受盗号、密码失窃等损失情况的，责任由您自行承担</p>
                    <p>第三条	充值信息保护</p>
                    <p>若用户未满18周岁，则为未成年人，应在监护人监护、指导下阅读本协议和使用本服务</p>
                    <p>1、智取管家将运用现有的各种安全技术和程序保护您的充值信息，以免您遭受未授权的信息获取、披露、泄露。</p>
                    <p>2、智取管家不会随意将您的充值信息向任何非关联的第三方进行披露，若因一下原因发生信息被第三方或需要智取管家进行披露的，智取管家不承担责任：</p>
                    <p>a．相关法律法规或法院、政府机关要求；</p>
                    <p>b．为完成合并、分立、收购或资产转让而转移；</p>
                    <p>c．为了履行本协议的目的；</p>
                    <p>d．为提供您要求的服务所必需；</p>
                    <p>e．您授权同意披露的；</p>
                    <p>f．您主动分享给第三方的；</p>
                    <p>g．网络黑客攻击窃取的；</p>
                    <p>h．法律法规另有规定的；</p>
                    <p>第四条	充值方式</p>
                    <p>1、您可登录智取管家微信公众号在线充值，通过微信支付进行；</p>
                    <p>2、您还可以通过智取管家发行的各类充值卡（体验卡）进行在线充值。</p>
                    <p>第五条	充值金额、充值优惠及可用余额</p>
                    <p>1、智取管家根据市场需要，不定期推出在线充值优惠活动，您可以通过登录智取管家微信公众号查询充值优惠活动及活动细则；</p>
                    <p>2、充值金额（本金）是指：您登录智取管家微信公众号进行在线充值并通过微信支付方式实际支出的金额（人民币），
                        不包括充值赠送的金额，可在智取管家微信公众号上任意消费使用。
                    </p>
                    <p>3、充值赠送金额（赠金）是指：根据智取管家不定期推出的充值优惠活动，在充值金额之外、额外赠予的金额。可用于支付订单费用。</p>
                    <p>4、可用余额（总金额）是指：您在智取管家微信公众号中当前所显示的可用总金额，由充值本金和赠送金额两部分构成</p>
                    <p>第六条	账户金额使用</p>
                    <p>1、账户金额用于支付在智取管家微信公众号上进行购物所应当支付的费用，智取管家默认优先从您赠金账户（如有）中扣除，
                        不足扣除的，则从本金账户中扣除，如充值本金账户余额不足，对此您须另行通过微信支付方式进行支付；
                    </p>
                    <p>2、您充值后，账户余额的使用不设有效期，不能转移、转赠。因此，请您根据自己的消费情况选择充值金额，智取管家对充值次数不设限制；</p>
                    <p>第七条	充值开票</p>
                    <p>1、如果你充值后需要开具发票，可联系客服电话4000494478，智取管家将根据您的充值金额和您提供的信息进行开票并按照开票规则给您快递寄出纸质发票或通过电子邮件发送电子发票；
                    </p>
                    <p>2、发票金额根据礼邻公司收到的充值金额开具，充值赠送金额或其他非您实际支付的费用，不可申请开具发票；</p>
                    <p>3、通过智取管家发行的充值卡充值所获得的账户余额，不可申请开具发票；</p>
                    <p>第八条	关于退款</p>
                    <p>1、充值金额仅支持一次性全部退还，充值赠送金额不支持申请退款;</p>
                    <p>2、无论基于何种原因，如需申请退款，您可拨打智取管家客服热线4000494478进行咨询和申请，退款额=充值金额-充值之时其余额账户所使用的金额
                        （余额账户含本金账户和赠金账户两部分）。一旦您申请退款成功后，您的余额账户中原余额（包含本金和赠金）将被清零。
                    </p>
                    <p>3、智取管家发行的各类充值卡一经售出、拆封或充值，均不可申请退款；</p>
                    <p>4、若充值金额已开具发票，但账户内还有可用余额，退款仅针对账户现有余额进行一次性退款处理，
                        可拨打智取管家客服热线4000494478进行咨询和申请，纸质发票须寄回，邮寄费用由您承担；
                    </p>
                    <p>第九条	特别说明</p>
                    <p>1、您在充值过程中，若由于您操作不当或第三方支付平台的原因，给您造成任何不便或财产损失的，智取管家不予承担责任；</p>
                    <p>2、杭州礼邻网络科技有限公司有权不时修改本协议的任何条款，一旦本协议的内容发生变动，
                        礼邻公司将会直接在智取管家微信公众号上公布修改后的协议内容，该公布视为礼邻公司已通知您修改协议内容，
                        同时，礼邻公司也可以通过其他适当的方式向您提示修改内容；
                    </p>
                    <p>3、如果您选择继续充值即表示您同意并接受修改后的协议且受其约束；如果您不同意我们对本协议的修改，请立即放弃充值或停止使用本服务;</p>
                    <p>4、在法律、法规允许的范围内，礼邻公司保留对本协议下的充值与充值优惠、账户余额使用规则等解释的权利；</p>
                    <p>5、如您因本协议与智取管家发生任何争议，可联系智取管家客服热线4000494478进行投诉或协商解决，如协商不成,
                        任何一方可向杭州礼邻网络科技有限公司所在地有管辖权的人民法院提起诉讼解决争议。
                    </p>

                </div>
            </div>
        )
    }
}

//RechargeHttp组件跳转定义
RechargeHttp.contextTypes = {
    router: PropTypes.object
};