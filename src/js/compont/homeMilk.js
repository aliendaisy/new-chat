/**
 * Created by Administrator on 2017/8/11 0011.
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Select} from  '../action/orderAction';

// 文字左边,下面图

class HomeMilk extends React.Component {
    render() {
        return(
            <div className="homeMilkCon" onClick={ () => {
                this.props.dispatch(Select(this.props.index,"home"));
                this.context.router.history.push({
                    pathname: '/ownerMain',
                });
            }}>
                <div className="homeMilkFont">
                    <div>{this.props.goods.homeTitle}</div>
                    <div>{this.props.goods.homeSubTitle}</div>
                </div>
                <img src={this.props.imgSrc} alt=""/>
            </div>
        )
    }
}
//跳页传值(必须)
HomeMilk.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = (state, props) => {
    console.log("homeMilk",state,props)
    return {goods:state.goodsDataList.goodsData[props.index]};
}


export default connect(mapStateToProps)(HomeMilk)


