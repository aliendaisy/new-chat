import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/dispatchAddr.css';
import {Header,fetchJson,Modal} from './public';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {DELETE_ADDR,CORNFORM_DELETE_ADDR,CANCEL_DELETE_ADDR, SELECT_ADDR} from  '../action/orderAction';
import EditAddrInfo from './editAddrInfo';
import AddrBlock from  './addrBlock';

//配送地址信息
class DispatchInfo extends Component {
    render(){
        return(
            <div>
                <div className="receiveCon">
                    <span className="receiver">收货人：{this.props.name}</span>
                    <span className="receiverPhone">{this.props.phone}</span>
                </div>
                <div className="defaultAddrCon">
                    <span className="defaultAddr">[默认地址] </span>
                    <span>{this.props.addr}</span>
                </div>
            </div>
        )
    }
}
//配送地址总页面
class DispatchAddr extends Component {
    constructor(props){
        super(props);
        this._addNewAddr = this.addNewAddr.bind(this);//添加新地址
        this._cancelClick = this.cancelClick.bind(this); //取消按钮,取消操作
        this._deleteOrder = this.deleteOrder.bind(this); //确定按钮,删除订单

	    this.state = {
		    name:'',
		    phone:'',
		    addr:'',
		    AData:'',
		    status: 'hide' //模态框显示状态
	    };
    }
    //删除
    handleEdit(e){
        this.props.deleteAddr(e);
        this.setState({
            status: 'show'
        });
    }
	//模态框取消按钮
	cancelClick(){
		this.setState({
			status: 'hide'
		});

		this.props.cancelDeleteAddr();
	}
	//模态框确认按钮,调取删除订单接口
	deleteOrder() {
        if (!this.props.deleteAddrDetail || this.props.deleteAddrDetail == 'undefined'){
            return;
        }

        let addObj = '';
        let Atype = ''

        /******************有关A地址的的内容******************/
        //this.props.owner.Address.map((item) => {
        //    if (item.detail === this.props.deleteAddrDetail){
        //        addObj = item;
        //        Atype = 'A';
        //    }
        //});
        /******************有关A地址的的内容******************/
        this.props.owner.milkAddress.map((item) => {
            if (item.detail === this.props.deleteAddrDetail){
                addObj = item;
                Atype = "C";
            }
        });
        /******************有关A地址的的内容******************/
        //if (Atype != 'A' && Atype != "C"){
        //    return;
        //}
        /******************有关A地址的的内容******************/
        if (Atype != "C"){
            return;
        }

		var self = this;
		fetchJson('/owner/unbindaddress',{
            ownerid:localStorage.getItem("ownerid"),
			id:addObj._id,
			type:Atype
		},(msg) => {
			if(msg.message === 'success'){
				// getOrderData(self);
                this.props.conformDeleteAddr();
				self.setState({
					status: 'hide'
				});
			}
		});
	}
	//添加新地址
	addNewAddr(){
		this.context.router.history.push({
			pathname: '/addAddr',
            comefrom:'dispatchAddr'
		});
	}
    //更换地址点击事件
    otherHandle(detail,name,mobile,index){
        let addrList = [];
        /******************有关A地址的的内容******************/
        //this.props.owner.Address.map((item) => {
        //    let Rcommunity;
        //    let Rbuild;
        //    let Runit;
        //    let detail;
        //    let detailA;
        //    let Rroom;
        //    detail = item.detail.substring(0,item.detail.length);
        //    let num = 0;
        //    for(let i=0;i<detail.length-1;i++){
        //        if (detail[i] == '-'){
        //            num++;
        //        }
        //    }
        //    if(num == 3){
        //        detailA=detail.split("-");
        //        Rcommunity = detailA[0];
        //        Rbuild = detailA[1];
        //        Runit = detailA[2]
        //        Rroom = detailA[3]
        //        console.log('Rroom',Rroom)
        //    }else if(num == 4){
        //        detailA=detail.split("-");
        //        Rcommunity = detailA[0];
        //        Rbuild = detailA[2];
        //        Runit = detailA[3]
        //        Rroom = detailA[4]
        //    }
        //    addrList.push({mobile:this.props.owner.mobile,name:this.props.owner.name,detail:item.detail,
        //        community:Rcommunity,district:'',park:'',
        //        build:Rbuild,unit:Runit,room:Rroom,note:'',Atype:"A"})
        //});
        /******************有关A地址的的内容******************/
        this.props.owner.milkAddress.map((item) => {
            addrList.push({mobile:item.mobile,name:item.name,detail:item.detail,
                community:item.community,district:item.district,park:item.park,
                build:item.build,unit:item.unit,room:item.room,note:item.note,Atype:"C"})
        });
        var addInfo = {};
        addInfo.detail = detail;
        addInfo.name = name;
        addInfo.mobile = mobile;
        addInfo.community = addrList[index].community;
        addInfo.district = addrList[index].district;
        addInfo.park = addrList[index].park;
        addInfo.build = addrList[index].build;
        addInfo.unit = addrList[index].unit;
        addInfo.room = addrList[index].room;
        addInfo.note = addrList[index].note;
        this.props.selectAddr(addInfo);
        let comefrom = this.context.router.history.location.comefrom;
        if(comefrom == 'personCenter'){
            return;
        }else{
            this.context.router.history.goBack();
        }
    }

    render(){
        let addrList = [];
        /******************有关A地址的的内容******************/
        //this.props.owner.Address.map((item) => {
        //    addrList.push({mobile:this.props.owner.mobile,name:this.props.owner.name,detail:item.detail,Atype:"A"})
        //});
        /******************有关A地址的的内容******************/
        this.props.owner.milkAddress.map((item) => {
            addrList.push({mobile:item.mobile,name:item.name,detail:item.detail,
                community:item.community,district:item.district,park:item.park,
                build:item.build,unit:item.unit,room:item.room,note:item.note,Atype:"C"})
        });
        console.log('addrList222:',addrList)
        if (addrList.length === 0){
            console.log("************************************")
            let comefrom = this.context.router.history.location.comefrom;
            if(comefrom == 'personCenter'){
                this.context.router.history.push({
                    pathname: "/addAddr",
                    comefrom: 'personCenter/dispatchAddr'
                });
            }else if(comefrom == 'placeOrder'){
                this.context.router.history.push({
                    pathname: "/addAddr",
                    comefrom: 'placeOrder/dispatchAddr'
                });
            }else{
                this.context.router.history.goBack();
            }
            return null;
        }else {
            return (
                <div className="topCon dispatchAddr">
                    <Header name="配送地址" onClick={() => {
                        this.context.router.history.goBack();
                    }}/>
                    <div>
                        <div className="innerConPad otherFlex">
                            <div className="infoFlex">
                                <DispatchInfo name={addrList[0].name} phone={addrList[0].mobile}
                                              addr={addrList[0].detail}/>
                            </div>
                            {/*<div className="intoWidth">
                             <span className="iconfont icon-jinru"></span>
                             </div>*/}
                        </div>
                        <div className="innerConPad clearLine distance">
                            <div className="titleFont">
                                <p>请选择地址</p>
                            </div>
                            <div className="titleFont" onClick={this._addNewAddr}>
                                <span className="iconfont icon-jiahao colorBlue"></span>
                                <span>添加新地址</span>
                            </div>
                            {addrList.map((res, i) => {
                                return (
                                    <AddrBlock key={i}
                                               name={res.name}
                                               phone={res.mobile}
                                               addr={res.detail}
                                               onDelete={this.handleEdit.bind(this, res.detail)}
                                               onSelected={this.otherHandle.bind(this, res.detail,res.name,res.mobile,i)}
                                        // value={res.detail}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    {/*模态框*/}
                    <Modal status={this.state.status}
                           header="提示"
                           left="取消"
                           right="确定"
                           _cancelClick={this._cancelClick}
                           tip='确认删除地址?'
                           _confirmClick={this._deleteOrder}/>
                </div>
            )
        }
    }
}
//DispatchAddr组件跳转定义
DispatchAddr.contextTypes = {
    router: PropTypes.object
};

//传过来的值,props指向了state.toOrder
const mapStateToProps = (state, props) => {
    console.log('DispatchAddr', state.owner, state.deleteAddr)
    return {owner:state.owner,deleteAddrDetail:state.deleteAddr};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    deleteAddr:(milkAddress) => {
         dispatch(DELETE_ADDR(milkAddress))
    },
    conformDeleteAddr:() => {
         dispatch(CORNFORM_DELETE_ADDR)
    },

    cancelDeleteAddr:() => {
        dispatch(CANCEL_DELETE_ADDR)
    },

    selectAddr:(milkAddress) => {
        dispatch(SELECT_ADDR(milkAddress))
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(DispatchAddr)
