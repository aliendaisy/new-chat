/**
 * Created by Administrator on 2017/8/14 0014.
 */
import { createStore, applyMiddleware, combineReducers } from 'redux'

import toOrderReducer from '../reduers/toOrderReducer';

const store = createStore(toOrderReducer);

export default store;