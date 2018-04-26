/**
 * Created by qm on 2017/7/20.
 */
import React, { Component } from 'react'
import '../../css/iconfont.css';
import '../../css/public.css';
import '../../css/feedback.css';
import {Header,Footer,PickerItem,fetchJson} from './public';
import {ImagePicker,Toast} from 'antd-mobile/lib';
import PropTypes from 'prop-types';

//上传图片数据
//const data = [{
//	url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
//	id: '2121'
//}, {
//	url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
//	id: '2122'
//}];
//建议与反馈
export default class Feedback extends Component{
	constructor(props,context) {
		super(props,context);
		this.dataArr = [
			[{
				label: '质量问题',
				value: '质量问题'
			},{
				label: '物流问题',
				value: '物流问题'
			},{
				label: '优化建议',
				value: '优化建议'
			},{
				label: '产品使用',
				value: '产品使用'
			}]
		];
		this.state = {
			showModal: false,
			animateShow: 'slideInUp',
			valueChange: this.dataArr[0][0].value, //pickerView中滑动结束后的值
			fType: this.dataArr[0][0].value, //点击确定填充的值
			phone:'',
			content:''
			//files: data,上传图片
		};

		this._handleSelect = this.handleSelect.bind(this);
		this._hideModal = this.hideModal.bind(this);
		this._sureModal = this.sureModal.bind(this);
		this._getValue = this.getValue.bind(this);
		this._inputMobile = this.inputMobile.bind(this);
		this._textContent = this.textContent.bind(this);
		this._submitFeedback = this.submitFeedback.bind(this);
		this._fBack = this.fBack.bind(this);
		//图片
		//this._onChange = this.onChange.bind(this);
		//this._onAddImageClick = this.onAddImageClick.bind(this);
	}
	//跳出popup
	handleSelect() {
		this.setState({
			showModal: true,
			animateShow: 'slideInUp',
			valueChange: this.dataArr[0][0].value //每次点击调出弹框时初始化pickView里面的初始值
		})
	}
	//取消或者点击遮布
	hideModal() {
		this.setState({animateShow: 'slideOutDown'});
		this.timer = setTimeout(function() {
			this.setState({showModal: false});
		}.bind(this), 300);
	}
	//确定按钮
	sureModal() {
		this.setState({
			animateShow: 'slideOutDown',
			fType: this.state.valueChange //把pickerView里面的值填充到页面中
		});
		this.timer = setTimeout(function() {
			this.setState({showModal: false});
		}.bind(this), 300);
	}
	//从子组件获取数据
	getValue(e) {
		this.setState({valueChange: e});
	}
	//选择图片
	//onChange(files, type, index) {
	//	console.log(files, type, index);
	//	this.setState({
	//		files
	//	});
	//};

	//导航返回
	fBack(){
		this.context.router.history.push({
			pathname:'/personCenter',
			query: {
				comefrom:'feedback'
			}
		})
	}
	//手机号码onchange事件
	inputMobile(e){
		this.setState({
			phone: e.target.value
		})
	}
	//反馈内容
	textContent(e){
		this.setState({
			content: e.target.value
		})
	}
	//提交反馈
	submitFeedback(){
		var self = this;
		var regex = /^((\+)?86|((\+)?86)?)0?1[3578]\d{9}$/;//手机号码正则表达式
		let phone  = this.state.phone;
		let content  = this.state.content;
		let type = this.state.fType;
		if(regex.test(phone) && phone !== '' && type !== '' && content !== ''){
			fetchJson('/submitXdmyFeedback',{feedType:type,mobile:phone,content:content},function(msg){
				//console.log('反馈成功',msg);
				if(msg.message=='success'){
					self.context.router.history.push({
						pathname:'/submitSuccess',
						query: {
							comefrom:'feedback'
						}
					});
				}
			});
		}else if(type ==''){
			Toast.info('反馈类型不能为空！',1)
		}else if(phone==''){
			Toast.info('手机号码不能为空！',1)
		}else if(!regex.test(phone)){
			Toast.info('请填写正确的手机号码！',1)
		}else if(content==''){
			Toast.info('反馈内容不能为空！',1)
		}

	}
	//onAddImageClick(e) {
	//	e.preventDefault();
	//	this.setState({
	//		files: this.state.files.concat({
	//			url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
	//			id: '3'
	//		})
	//	});
	//}

    render(){
        return(
            <div className="topCon">
                <Header name="建议与反馈" onClick={this._fBack}/>
                <div className="feedbackSon">
                    <div className="feedBox">
                        <span>反馈类型:</span>
	                    <div className="pickerShow right" onClick={this._handleSelect}>{this.state.fType}</div>
                    </div>
                    <div className="feedBox">
                        <span>手机号码:</span>
                        <input type="number" value={this.state.phone} onChange={this._inputMobile}/>
                    </div>
                    <div className="feedBox">
                        <span>反馈内容:</span>
                        <textarea rows="8" placeholder="请填写需要反馈的问题" className="right" value={this.state.content} onChange={this._textContent}>

                        </textarea>
                    </div>
					{/*上传图片部分*/}
					{/*<div className="feedBox">
		                <span>选择图片</span>
		                <ImagePicker file={this.state.files}
		                             onChange={this._onChange}
		                             //onAddImageClick={this._onAddImageClick}
		                             selectable={this.state.files.length < 5}/>
	                </div>*/}
                </div>
                <Footer footerBtn="确定" onClick={this._submitFeedback}/>
	            {(()=>{
		            if(this.state.showModal) {
			            return <PickerItem ifShow={this.state.animateShow}
			                               hideModal={this._hideModal}
			                               sureModal={this._sureModal}
			                               data={this.dataArr}
			                               getValue={this._getValue}/>
		            }
	            })()}
            </div>
        )

    }
}
Feedback.contextTypes = {
	router: PropTypes.object
};
