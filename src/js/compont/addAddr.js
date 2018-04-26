import React, {Component} from 'react'
import {Header,Footer,PickerItem,fetchJson,Modal} from './public';
import '../../css/public.css';
import '../../css/addAddr.css';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile/lib';
import { connect } from 'react-redux';
import { ADD_ADDR } from  '../action/orderAction';

//整改滑动组件的函数
export function getComuArr(CommList){
	var comArr = [];
	for(var i = 0; i < CommList.length; i++){
		var item = {};
		item.label = CommList[i].community;
		item.value = i;
		item.district = CommList[i].district;
		item.park = CommList[i].park;
		comArr.push(item);
	}
	return comArr;
}
// 苑／区
function getPark(parkList){
	var parkArr = [];
	if(parkList.length === 0){
		var item1 = {};
		item1.label = '';
		item1.value = '';
		parkArr.push(item1);
	}else{
		for(var i = 0; i < parkList.length; i++){
			var item = {};
			item.label = parkList[i]
			item.value = i;
			parkArr.push(item);
		}
	}

	return parkArr;

}
//幢，单元
function detailArr(){
	var buildArr = [];
	var parkArr = [];
	for(var i = 0; i < 60;i ++){
		var build  = {};
		build.label = i + 1 + '幢';
		build.value = i + 1 + '幢';
		buildArr.push(build)
	}
	for(var j = 0; j < 10;j ++){
		var park  = {};
		park.label = j + 1  + '单元';
		park.value = j + 1  + '单元';
		parkArr.push(park)
	}
	var detailArr = [buildArr,parkArr];
	return detailArr;
}
//小区数组
function contains(arr, obj) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === obj) {
			return true;
		}
	}
	return false;
}
//整改小区数组
function arrCom(arr){
	var arrComm=[];
	for(var i=0; i<arr.length;i++){
		arrComm.push(arr[i].label)
	}
	return arrComm;
}
//添加地址页
export class AddAddr extends Component {
	constructor(props,context) {
		super(props,context);
		this.state = {
			showModal: false,
			showCommModal: false,
			showParkModal: false,
			animateShow: 'slideInUp',
			valueChange: '', //社区选择弹框里pickerView的数据
			buildChange: '', //幢单元选择pickerView里幢的数据
			unitChange: '', //幢单元选择pickerView里单元的数据
			parkChange:'',
			name:'',
			phone:'',
			park:'',
			building:'',
			unit:'',
			indoor:'',
			comm:'',
			district:'',
			index:'',
			other:'',
			classItem:false,
			addrDetail:'',
			status:'hide',
			dataCom:[], //社区数组,后台获取
			dataComSearch:[],
			datalistShow:false

		};

		this._handleSelect = this.handleSelect.bind(this); //跳出幢单元弹框
		this._getValueForBuild = this.getValueForBuild.bind(this); //获取幢单元pickerView里数据
		this._getValueForPark = this.getValueForPark.bind(this); //获取幢单元pickerView里数据
		this._sureModal = this.sureModal.bind(this); //确定按钮,获取幢,单元

		//this._handleCommunity = this.handleCommunity.bind(this); //社区点击事件
		this._handlePark = this.handlePark.bind(this); //社区点击事件
		//this._sureCommModal = this.sureCommModal.bind(this);//确定获取小区
		this._sureParkModal = this.sureParkModal.bind(this);//确定获取小区
		this._getValue = this.getValue.bind(this); //获取社区pickerView里数据

		this._hideModal = this.hideModal.bind(this); //取消或者点击遮布

		this._inputName = this.inputName.bind(this); //收货人onchange事件
		this._inputPhone = this.inputPhone.bind(this); //手机号码onchange事件
		this._inputPark = this.inputPark.bind(this); //苑/区onchange事件
		this._inputDoor = this.inputDoor.bind(this); //室
		this._inputComm = this.inputComm.bind(this); //小区
		this._inputDetail = this.inputDetail.bind(this); //备注

		this._confirmAddr = this.confirmAddr.bind(this); //确认新增按钮

		this._cancelClick = this.cancelClick.bind(this);
		this._confirmClick = this.confirmClick.bind(this);
	}
	componentWillMount(){
		var self = this;
		fetchJson('/owner/getMilkCommunityLists',{keyword:self.state.comm},function(msg){
			//console.log('tttttttt',[getComuArr(msg.data)])
			self.setState({
				dataCom: [getComuArr(msg.data)],
				dataComSearch:msg.data
			});
		});
	}
//模糊搜索的点击事件
	datalistClick(e){
		//console.log(e);
		//console.log(this.state.dataComSearch[e].community);
		this.state.index = e;
		if(this.state.dataComSearch[e].park.length === 0){
			this.setState({
				park:'',
				other:'空',
				addrDetail:'杭州市'+this.state.dataComSearch[e].district+this.state.dataComSearch[e].community+''+
				this.state.buildChange+this.state.unitChange+this.state.indoor+'室'
			})
		}else{
			this.setState({
				park:this.state.dataComSearch[e].park[0],
				other:this.state.dataComSearch[e].park,
				addrDetail:'杭州市'+this.state.dataComSearch[e].district+this.state.dataComSearch[e].community+this.state.dataComSearch[e].park[0]+
				this.state.buildChange+this.state.unitChange+this.state.indoor+'室'
			})
		}
		this.setState({
			comm:this.state.dataComSearch[e].community,
			district:this.state.dataComSearch[e].district,
			datalistShow:false
		})

	}

//幢.单元选择
	//跳出幢单元弹框
	handleSelect() {
		this.setState({
			showModal: true,
			animateShow: 'slideInUp',
			buildChange: detailArr()[0][0].value,
			unitChange: detailArr()[1][0].value
		});
	}
	//确定按钮,获取幢,单元
	sureModal() {
		this.timer = setTimeout(function() {
			this.setState({
				showModal: false
			});
		}.bind(this), 300);
		this.setState({
			animateShow: 'slideOutDown',
			building: this.state.buildChange,
			unit: this.state.unitChange,
			addrDetail:'杭州市'+this.state.district+this.state.comm+this.state.park+
			this.state.buildChange+this.state.unitChange+this.state.indoor+'室'
		});
	}
	//获取幢单元pickerView里的数据
	getValueForBuild(e) {
		this.setState({
			buildChange: e[0],
			unitChange: e[1]
		});
	}

//社区选择
	//点击弹出社区选择弹框
	//handleCommunity(){
	//	this.setState({
	//		showCommModal: true,
	//		animateShow: 'slideInUp',
	//		valueChange: this.state.dataCom[0][0],
	//		datalistShow:false
	//	});
	//	console.log('333',this.state.dataCom[0])
	//}
	//确定获取小区
	//sureCommModal(){
	//	this.timer = setTimeout(function() {
	//		this.setState({
	//			showCommModal:false
	//		});
	//	}.bind(this), 300);
	//	if(this.state.valueChange.park.length === 0){
	//		this.setState({
	//			park:'',
	//			comm: this.state.valueChange.label,
	//			district: this.state.valueChange.district,
	//			addrDetail:'杭州市'+this.state.valueChange.district+this.state.valueChange.label+''+
	//			this.state.buildChange+this.state.unitChange+this.state.indoor+'室'
	//		})
	//	}else{
	//		this.setState({
	//			park:this.state.valueChange.park[0],
	//			comm: this.state.valueChange.label,
	//			district: this.state.valueChange.district,
	//			addrDetail:'杭州市'+this.state.valueChange.district+this.state.valueChange.label+this.state.valueChange.park[0]+
	//			this.state.buildChange+this.state.unitChange+this.state.indoor+'室'
	//		})
	//	}
	//	this.setState({
	//		animateShow: 'slideOutDown'
    //
	//	});
	//	console.log('kkkkkkk',this.state.valueChange)
	//}
	//获取社区pickerView里的数据
	getValue(e) {
		//此处e为dataCom数组的value层,而我们想拿到的时label层,由于value层恰好是数组项的index值
		this.setState({
			valueChange: this.state.dataCom[0][e]
		});
	}
// 苑／区
	//	点击弹出苑／区选择弹框
	handlePark(){

		if(this.state.dataComSearch.length === 0){
			this.setState({
				park:'',
				district:''
			});
		}else{
			//if(this.state.valueChange){
			//	console.log('rrrrr')
			//	if(this.state.valueChange.park.length === 0){
			//		this.setState({
			//			showParkModal: false,
			//			parkChange:'',
			//			park:''
			//		});
			//	}else{
			//		this.setState({
			//			showParkModal: true,
			//			parkChange:[getPark(this.state.dataComSearch[this.state.index].park)][0][0],
			//			animateShow: 'slideInUp'
			//		});
			//	}
            //
			//}else{
			//	console.log('00',this.state.other)

			//这里会有两种情况，需要判断一下  自己输入时的情况进入if，  搜索时点击搜索出现的小区时进入else
				if(this.state.other){
					if(this.state.other === '空' ) {
						this.setState({
							showParkModal: false,
							park:''
						});
					}else{
						if(getPark(this.state.other)[0].label === ''){
							this.setState({
								showParkModal: false,
								parkChange:'',
								park:''
							});
						} else{
							this.setState({
								showParkModal: true,
								parkChange:[getPark(this.state.other)][0][0],
								animateShow: 'slideInUp'
							});
						}
					}

				}else{
					//直接点击苑时会出现未定义，所以要判断一下不是未定义时执行下面的操作
					if(this.state.dataComSearch[this.state.index] !== undefined){
						//如果没有苑就让内容默认为空，弹框不出现，    有苑时弹框出现
						if(getPark(this.state.dataComSearch[this.state.index].park)[0].label === ''){
							this.setState({
								showParkModal: false,
								parkChange:'',
								park:''
							});
						} else{
							this.setState({
								showParkModal: true,
								parkChange:[getPark(this.state.dataComSearch[this.state.index].park)][0][0],
								animateShow: 'slideInUp'
							});
						}
					}

				}


			//}

		}
	}
	//获取苑／区里面的数据
	getValueForPark(e){
		if(this.state.other){
			this.setState({
				parkChange: [getPark(this.state.other)][0][e]
			});
		}else{
			this.setState({
				parkChange: [getPark(this.state.dataComSearch[this.state.index].park)][0][e]
			});
		}

	}
    //确认选择苑
	sureParkModal(){
		this.timer = setTimeout(function() {
			this.setState({
				showParkModal:false
			});
		}.bind(this), 300);
		this.setState({
			animateShow: 'slideOutDown',
			park:this.state.parkChange.label,
			addrDetail:'杭州市'+this.state.district+this.state.comm+this.state.parkChange.label+
			this.state.buildChange+this.state.unitChange+this.state.indoor+'室'
		});
	}


	//取消或者点击遮布
	hideModal() {
		this.setState({animateShow: 'slideOutDown'});
		this.timer = setTimeout(function() {
			this.setState({
				showModal: false,
				showCommModal:false,
				showParkModal:false
			});
		}.bind(this), 300);
	}
//input onchange事件
	//收货人onchange事件
	inputName(e){
		this.setState({
			name:e.target.value
		})
	}
	//手机号码onchange事件
	inputPhone(e){
		this.setState({
			phone:e.target.value
		})
	}
	//苑/区onchange事件
	inputPark(e){

		this.setState({
			park:e.target.value
		})
	}
	//室
	inputDoor(e){
		this.setState({
			indoor:e.target.value,
			addrDetail:'杭州市'+this.state.district+this.state.comm+this.state.park+
			this.state.buildChange+this.state.unitChange+e.target.value+'室'
		})
	}
	//小区
	inputComm(e){
		var self = this;
		this.setState({
			comm:e.target.value
		})
		fetchJson('/owner/getMilkCommunityLists',{keyword:e.target.value},function(msg){
			self.setState({
				dataComSearch:msg.data,
				datalistShow:true
				//showCommModal: false,
				//animateShow: 'slideOutDown',
				//classItem:true,
				//valueChange: [getComuArr(msg.data)][0][0]
			});
			//console.log('刷新数据',self.state.dataComSearch)
			//console.log('444',self.state.comm)

			//没有配送小区的时候，数据的展示
			if(msg.data.length === 0){
				self.setState({
							park:'',
							district:'',
							datalistShow:false,
							addrDetail:'杭州市'+''+self.state.comm+''+
							self.state.buildChange+self.state.unitChange+self.state.indoor+'室'
						})
			}else{
				var j;
				//搜索出带有关键子的数据
				msg.data.map((item,i) => {
					if(self.state.comm === item.community){
						j = i;
					}
				})
				console.log('++++++',msg.data[j])
				if(msg.data[j] === undefined){
					return;
				}else{
					//如果输入完全名，搜出了指定的一条数据。要判断对应的苑是否是空  ，把全名输入才会有other这个参数
					if(msg.data[j].park.length === 0){
						self.setState({
							park:'',
							other:'空',
							district:msg.data[j].district,
							addrDetail:'杭州市'+msg.data[j].district+msg.data[j].community+''+
							self.state.buildChange+self.state.unitChange+self.state.indoor+'室'
						})
					}else{
						self.setState({
							park:msg.data[j].park[0],
							district:msg.data[j].district,
							other:msg.data[j].park,
							addrDetail:'杭州市'+msg.data[j].district+msg.data[j].community+msg.data[j].park[0]+
							self.state.buildChange+self.state.unitChange+self.state.indoor+'室'
						})
					}
				}


			}
		});

			this.setState({
				comm:e.target.value,
				addrDetail:'杭州市'+this.state.district+e.target.value+this.state.park+
				this.state.buildChange+this.state.unitChange+this.state.indoor+'室'
			})


	}
	//备注
	inputDetail(e){
		this.setState({
			addrDetail: e.target.value
		})
	}
//申请小区点击事件
	//取消申请
	cancelClick(){
		this.setState({
			status:'hide'
		});
	}
	//确认申请
	confirmClick(){
		var self = this;
		fetchJson('/owner/applyXdmyMilkCommunity',
			{openid:localStorage.getItem('openid'),community:self.state.comm},
			function(msg){
			if(msg.message === 'success'){
				self.setState({
					status:'hide'
				});
				self.context.router.history.push({
					pathname: '/submitSuccess',
					comefrom:'addAddr'
				});
			}
		})
	}
	//确认新增按钮
	confirmAddr(){
		var self = this;
		var regex = /^((\+)?86|((\+)?86)?)0?1[3578]\d{9}$/;//手机号码正则表达式
		let changeBuild = this.state.buildChange;//幢
		let changeUnit = this.state.unitChange;//单元
		let Rname = this.state.name;//名字
		let Rphone = this.state.phone;//手机号
		let Rdistrict = this.state.district; //小区名
		let Rcomm = this.state.comm; //小区名
		let Rpark = this.state.park;//区／苑
		let Rindoor = this.state.indoor;//室
		let detailAddr = `杭州市${Rdistrict}${Rcomm}${Rpark}${changeBuild}${changeUnit}${Rindoor}室`;
		if(regex.test(Rphone) && Rphone !== '' && Rname !== '' && changeBuild !== ''
			&& changeUnit !== '' && Rindoor !== '' && Rcomm !=='' && contains(arrCom(self.state.dataCom[0]),self.state.comm) === true){
			fetchJson('/owner/addXdmyMilkAddress',
				{
					ownerid:localStorage.getItem("ownerid"),
					info:{
						name: Rname,
						mobile: Rphone
					},
					address:{
						community: Rcomm,
						detail: detailAddr,
						district:Rdistrict,
						park:Rpark,
						build:parseInt(changeBuild),
						unit:parseInt(changeUnit),
						room:Rindoor,
						note:self.state.addrDetail
					}
				},
				function(msg){
					var milkAddress = {};
					milkAddress.detail = detailAddr;
					milkAddress.mobile = Rphone;
					milkAddress.name = Rname;
					milkAddress.community = Rcomm;
					milkAddress.district = Rdistrict;
					milkAddress.park = Rpark;
					milkAddress.build = changeBuild;
					milkAddress.unit = changeUnit;
					milkAddress.room = Rindoor;
					milkAddress.note = self.state.addrDetail;
					milkAddress._id = msg.data.milkAddress[msg.data.milkAddress.length-1]._id;
					self.props.addAddr(milkAddress);

					self.context.router.history.goBack();
				}
			);
		}else if(Rname==''){
			Toast.info('收货人不能为空！',1.5)
		}else if(Rphone==''){
			Toast.info('手机号码不能为空！',1.5)
		}else if(!regex.test(Rphone)){
			Toast.info('请填写正确的手机号码！',1.5)
		}else if(changeBuild=='' || changeUnit=='' || Rindoor==''){
			Toast.info('幢或单元或室不能为空！',1.5)
		}else if(Rcomm==''){
			Toast.info('小区名字不能为空！',1.5)
		}else if(contains(arrCom(self.state.dataCom[0]),self.state.comm) === false){
			self.setState({
				status:'show'
			});
		}
	}

	render(){
		const randomid=Math.random().toString(16).substring(2);
		return(
			<div className="topCon">
				<Header name="添加地址" onClick={() => {
				if(this.props.owner.milkAddress.length == 0 && this.props.owner.Address.length == 0){
					let comefrom = this.context.router.history.location.comefrom;
					if(comefrom == 'personCenter/dispatchAddr'){
						this.context.router.history.push({
									pathname:'/personCenter',
									comefrom:'personCenter/dispatchAddr/addAddr'
								})
					}else if(comefrom == 'placeOrder/dispatchAddr'){
						this.context.router.history.push({
								pathname:'/placeOrder',
								comefrom:'placeOrder/dispatchAddr/addAddr'
							})
					}else{
						this.context.router.history.goBack();
					}

				}else{
				 	this.context.router.history.goBack();
				}

				}}/>
				<div className="addAddr">
					<div className="feedBox">
						<span>收货人:</span>
						<input type="text" value={this.state.name} onChange={this._inputName}/>
					</div>
					<div className="feedBox">
						<span>手机号码:</span>
						<input type="number"
						       pattern="[0-9]*"
						       value={this.state.phone}
						       onChange={this._inputPhone}/>
					</div>
					<div className="feedBox addAddrBox">
						<span>所在小区:</span>
						<input type="text"
							   placeholder="请输入小区关键字"
							   value={this.state.comm}
							   onChange={this._inputComm}/>

						<div className={this.state.datalistShow ? "datalistSon" :'hide'} >
							{
								this.state.dataComSearch.map((item,i) => {
									return(
										<div key={i} className="datalistBlock" onClick={this.datalistClick.bind(this,i)} value={i}>{item.community}</div>
									)
								})
							}
						</div>




						{/*<i className="iconfont icon-arrowdown" onClick={this._handleCommunity}></i>*/}
						{/*<input type="text"
							   placeholder="苑/区(可为空)"
							   value={this.state.park}
							   disabled="disabled"
							   onChange={this._inputPark}
							   onClick={this._handlePark}/>
						<i className="iconfont icon-arrowdown" onClick={this._handlePark} ></i>*/}


					</div>
					<div className="feedBox addrSecondBox">
						<span>所在苑:</span>
						<div className="parkDiv" onClick={this._handlePark}>
							<input type="text"
								   placeholder="苑/区(可为空)"
								   value={this.state.park}
								   disabled="disabled"
								   onChange={this._inputPark}
								   onClick={this._handlePark}/>
						<i className="iconfont icon-arrowdown"  ></i>
						</div>

					</div>
					<div className="feedBox addAddrLastBox">
						{/*<span className="left">详细地址:</span>
						<div style={{width: '100%',overflow: 'hidden'}}>
							<div className="left addrDetail">
								{/!*<input type="text"
								       placeholder="苑/区(可不填)" value={this.state.park}
								       onChange={this._inputPark}/>*!/}
								<input type="text"
								       placeholder="幢"
								       value={this.state.building}
								       disabled="disabled"/>
								<input type="text"
								       placeholder="单元"
								       value={this.state.unit}
								       disabled="disabled"/>
								<i className="iconfont icon-arrowdown right" onClick={this._handleSelect}></i>
							</div>
							<div className="right addrRoom">
								<input type="number"
								       placeholder="门牌号"
								       pattern="[0-9]*"
								       value={this.state.indoor}
								       onChange={this._inputDoor}/>室
							</div>
						</div>*/}
						<span>详细地址:</span>
						<div style={{width: '100%',overflow: 'hidden',flex:1}}>
							<div className="left addrDetail" onClick={this._handleSelect}>
								{/*<input type="text"
								 placeholder="苑/区(可不填)" value={this.state.park}
								 onChange={this._inputPark}/>*/}
								<input type="text"
									   placeholder="幢"
									   value={this.state.building}
									   disabled="disabled"/>
								<input type="text"
									   placeholder="单元"
									   value={this.state.unit}
									   disabled="disabled"/>
								<i className="iconfont icon-arrowdown right"></i>
							</div>
							<div className="right addrRoom">
								<input type="number"
									   placeholder="门牌号"
									   pattern="[0-9]*"
									   value={this.state.indoor}
									   onChange={this._inputDoor}/>室
							</div>
						</div>
					</div>
					<div className="feedBox">
						<span className="left">备注:</span>
						<div style={{width: '100%',overflow: 'hidden'}}>
							<textarea type="text" value={this.state.addrDetail}
									  style={{width: '100%'}}
								      onChange={this._inputDetail}
									  rows="1">
							</textarea>
						</div>
					</div>
				</div>
				<div className="addSpare"></div>
				<Footer footerBtn="确定" onClick={this._confirmAddr}/>


				<Modal header="提示"
					   tip={'该小区不在配送范围内，是否申请为'+this.state.comm+"开通配送"}
					   left="暂不申请"
					   right="立即申请"
					   status={this.state.status}
					   _cancelClick={this._cancelClick}
					   _confirmClick={this._confirmClick}
				/>

				{(()=>{
					if(this.state.showModal) {
						return <PickerItem ifShow={this.state.animateShow}
						                   hideModal={this._hideModal}
										   sureModal={this._sureModal}
										   data={detailArr()}
										   getValue={this._getValueForBuild}/>
					}
				})()}

				{(()=>{
					if(this.state.showCommModal) {
						return <PickerItem ifShow={this.state.animateShow}
										  hideModal={this._hideModal}
										  sureModal={this._sureCommModal}
										  data={this.state.dataCom}
										  getValue={this._getValue}/>


					}
				})()}

				{(()=>{
					if(this.state.showParkModal) {
						return <PickerItem ifShow={this.state.animateShow}
										   hideModal={this._hideModal}
										   sureModal={this._sureParkModal}
										   data={this.state.other ? [getPark(this.state.other)]:[getPark(this.state.dataComSearch[this.state.index].park)]}
										   getValue={this._getValueForPark}/>

					}
				})()}


			</div>
		)
	}
}
AddAddr.contextTypes = {
	router: PropTypes.object
};

//传过来的值,props指向了state.toOrder
const mapStateToProps = (state, props) => {
    console.log('addAddr', state.toOrder,state.owner);
    return {toOrder:state.toOrder,owner:state.owner};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    addAddr:(addr) => {
        dispatch(ADD_ADDR(addr))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAddr)
