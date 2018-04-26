/**
 * Created by qm on 2017/7/10.
 */
import React from 'react';
import '../../css/public.css';
import '../../css/home.css';
import {NoBackHeader,goodList} from '../../js/compont/public';
import {Carousel} from 'antd-mobile/lib';

import {fetchJson} from './public';
import PropTypes from 'prop-types';
import URI from 'urijs';
import { connect } from 'react-redux';
import HomeMilk from './homeMilk';
import { Toast } from 'antd-mobile/lib';

import {TO_RENEW_ORDER,RECEIVE_DISPAPCH_ORDER,INIT_GOOD_LIST} from '../action/orderAction';
import store from '../store/store';


//wxa852b4d1234384dc  智取管家
//wx578e32724b797cb3 礼邻网络
function generateGetCodeUrl(redirectURL) {
	return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
		.addQuery("appid", "wxa852b4d1234384dc")
		.addQuery("redirect_uri", redirectURL)
		.addQuery("response_type", "code")
		.addQuery("scope", "snsapi_base")
		.hash("wechat_redirect")
		.toString();
}
//上图下面文字
class HomeIcon extends React.Component {
    render() {
        return(
            <div className="homeIconWidth">
                <div><img src={this.props.imgSrc} alt=""/></div>
                <div>{this.props.title}</div>
            </div>
        )
    }
}

//首页主页面
export class Home extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			sliderData: [
				'sliderVege',
				'sliderRegister',
				'sliderJuice',
				'sliderMilk',
				'sliderYogurt',
				'sliderBlueberry'
			]
		};
        this.goodsData = this.props.goodsData; //获取从public export出来的变量
		// this.state.num = this.props.toOrder.num;
	}
	componentWillMount() {
		var self = this;
		//fetchJson('/chenckOpenid',{},function (inMsg) {
			let openid = localStorage.getItem('openid');
			if(!openid){
                const uri = new URI(document.location.href);
                const query = uri.query(true);
                const {code} = query;
                if(code){
                    fetchJson('/getAccessCode',{code: code},(msg) => {
						if(msg.message === 'success'){
							localStorage.setItem("openid", msg.data);
							//localStorage.setItem("openid", 'oCWLqtzAU1sNABjiBcz6TSnFjhiM');
						}else{
							Toast.info(msg.message)
						}
                    });
                }else{
	                document.location = generateGetCodeUrl(document.location.href);
                }
			}else {
				let goodsData = {};
				let initGoodList = [];
                initGoodList.typeData = [];
                for (let index = 0;index < goodList.length; index++){
                	initGoodList.push(goodList[index]);
                }

                fetchJson('/getXdmyMilkInfoLists',{},(msg) => {
                    for(var i = 0;i < msg.data.length;i ++) {
                        switch (msg.data[i].name) {
							case '鲜奶1L装':
                                initGoodList[0].typeData.push(msg.data[i]);
                                break;
                            case '酸奶8盒装':
                                initGoodList[1].typeData.push(msg.data[i]);
                                break;
                            case '鲜奶250ml*3装':
                                initGoodList[2].typeData.push(msg.data[i]);
                                break;
                            case '橙汁950ml装':
                                initGoodList[3].typeData.push(msg.data[i]);
                                break;
                            case '橙汁330ml*3装':
                                initGoodList[4].typeData.push(msg.data[i]);
								break;
							case '蓝莓味酸奶8盒装':
								initGoodList[5].typeData.push(msg.data[i]);
		                        break;
	                        case '有机蔬菜':
		                        initGoodList[6].typeData.push(msg.data[i]);
                        }
                    }

                    this.props.initGoodsDataList({goodsData:initGoodList});

                    fetchJson('/getOwnerByOpenid',{openid:openid},function(msg) {
                        console.log('ownermain页面判断角色', msg);
                        if (msg.message === 'success' && msg.data.docs && msg.data.docs.role === '业主') {
                            localStorage.setItem("ownerid", msg.data.sessions.ownerid);
                            localStorage.setItem("mobile", msg.data.sessions.mobile);
                        }
                    });
				});
			}
        //})
	}
	//跳转页面传值,若不是业主跳转到注册,由于ownerMain需要跳转注册,传值必须.但跳转到需要的url则不一定要传值
	clickTo(toUrl,action) {
		let self = this;
		let owner = store.getState().owner;
		fetchJson('/getOwnerByOpenid',{openid: owner.openid},(msg) => {
			if (msg.message === 'success') {
				if (msg.data.docs && msg.data.docs.role === '业主') {
					if(toUrl === 'renewOrder') {
						fetchJson('/owner/getMilkOrderByRenew', {mobile: owner.mobile}, (msg) => {
							self.props.toRenewOrder(msg.data);
							self.context.router.history.push({
								pathname: toUrl,
								comefrom:   '/wxReactHome'
							});
						});
					}else if(toUrl === 'dispatchQuery') {
						fetchJson('/owner/getMilkOrderByRenew', {mobile: owner.mobile},(msg) => {
							self.props.dispatchOrder(msg.data);
							self.context.router.history.push({
								pathname: toUrl,
								comefrom: '/wxReactHome'
							});
						});
					}else{
						self.context.router.history.push({
							pathname: toUrl,
							comefrom: '/wxReactHome'
						});
					}
				}else{
					self.context.router.history.push({
						pathname: '/ownerLogin',
						comefrom: '/wxReactHome'
					});
				}
			}
		});
	}
    render() {
        return (
            <div>
                <NoBackHeader name="生鲜商城"/>
                <div className="topCon">
	                <Carousel className="my-carousel"
	                          autoplay={true}
	                          infinite={true}
	                          selectedIndex={0}
	                          swipeSpeed={50}
	                          dotStyle={{background: 'transparent',margin: '0 0.1rem',border: '1px solid #609dd4'}}
	                          dotActiveStyle={{background: '#609dd4'}}>
		                {this.state.sliderData.map(res => (
			                <img
				                src={`http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/${res}.png`}
				                alt=""
			                    key={res}
				                onLoad={() => {
				                  // fire window resize event to change height
				                  window.dispatchEvent(new Event('resize'));
				               }}
			                />
		                ))}
	                </Carousel>
                    <div className="homeIconCon">
                        <div className="homeIconSon">
                            <div onClick={this.clickTo.bind(this,'dispatchQuery')}>
	                            <HomeIcon imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/icon_search.png"
	                                      title="配送查询"/>
                            </div>
                        </div>
                        <div className="homeIconSon">
                            <div onClick={this.clickTo.bind(this,'purse')}>
	                            <HomeIcon imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/icon_chongzhi.png"
	                                      title="充值优惠"/>
                            </div>
                        </div>
                        <div className="homeIconSon">
	                        <div onClick={this.clickTo.bind(this,'renewOrder')}>
		                        <HomeIcon imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/icon_continue.png"
		                                  title="一键续订"/>
	                        </div>
                        </div>
                    </div>
	                {/*现代牧业*/}
                    <div className="coolMilkBac">
                        <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_diwennai.png" alt=""/>
                    </div>
                    <div className="homeMilkFlex">
                        <div className="homeMilkLeft">
							<div className="homeSonLeft">
								<HomeMilk index={0}
										  imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_danai.png"/>
							</div>
							<div className="homeSonLeft">
								<HomeMilk index={5}
										  imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/blueberry.png"/>
							</div>
                        </div>
                        <div className="homeMilkRight">
                            <div className="homeSonMilk">
	                            <HomeMilk index={1}
	                                      imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_suannai.png"/>
                            </div>
	                        <div className="homeSonMilk">
		                        <HomeMilk index={2}
		                                  imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_main_xiaonai.png"/>
	                        </div>
                        </div>
                    </div>
	                {/*橙汁*/}
	                <div className="coolMilkBac">
		                <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/coolJuice.png" alt=""/>
	                </div>
	                <div className="homeMilkFlex">
		                <div className="homeJuice">
			                <HomeMilk index={3}
			                          imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_juice950.png"/>
		                </div>
		                <div className="homeJuice">
			                <HomeMilk index={4}
			                          imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_juice330.png"/>

		                </div>
	                </div>
	                {/*蔬菜*/}
	                <div className="coolMilkBac">
		                <img src="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_shucai.png" alt=""/>
	                </div>
	                <div className="homeMilkFlex">
		                <div className="homeVege">
			                <HomeMilk
				                index={6}
				                imgSrc="http://wxxdmy.oss-cn-hangzhou.aliyuncs.com/wxxdmy/pic_vegetable.png"
			                />
		                </div>
	                </div>

                </div>
            </div>
        )
    }
}
Home.contextTypes = {
	router: PropTypes.object
};

const mapStateToProps = (state, props) => {
    return state;
}
const mapDispatchToProps = (dispatch, ownProps) => ({
	toRenewOrder:(renewList) => {
		dispatch(TO_RENEW_ORDER(renewList))
	},

    dispatchOrder:(dispatchList) => {
        dispatch(RECEIVE_DISPAPCH_ORDER(dispatchList))
    },

    initGoodsDataList:(goodsDataList) => {
        dispatch(INIT_GOOD_LIST(goodsDataList))
	}

})
export default connect(mapStateToProps, mapDispatchToProps)(Home)
