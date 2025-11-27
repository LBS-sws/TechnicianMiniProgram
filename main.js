import Vue from "vue";
import App from "./App";
import cooluni from "./cl-uni";
import store from './store/index'
import './styles/index.scss'
import uView from "uview-ui";
import "url-search-params-polyfill";
import Base64 from 'base-64';

import "common/message.js"		// 消息  用法 uni.$utils.toast(res.data.msg)
//导入封装的请求对象
import api from './common/api.js'
//将请求对象设置为全局属性
Vue.prototype.$api = api


// 防止多次点击
import common from './common/common.js'

Vue.prototype.$noMultipleClicks = common.noMultipleClicks;

Vue.config.productionTip = false;

// 检查登录
Vue.prototype.checkLogin = function(backpage,backtype){
	
	var token = uni.getStorageSync('token');
	// console.log(token)
	
	if(token==''){
		uni.redirectTo({
			url:'../login/login?backpage='+backpage+'$backtype='+backpage
		});
		return false;
	}
	return [token];
}

// 判断返回状态 200、400、401
Vue.prototype.checkCode = function(code, msg){
	console.log('1111111')
	// token 过期
	if(code == 400){
		uni.showToast({
			title:msg,
			icon:'none'
		})
	}
}

App.mpType = "app";

Vue.use(cooluni);
Vue.use(uView);

const app = new Vue({
	...App,
  store
});
app.$mount();

import { VERSION, BASE_URL, BASE_URL_IMGS, MAP_API_KEY, MAP_API_URL, AMAP_API_KEY, AMAP_WEB_API_KEY } from './common/config'

Vue.prototype.$version = VERSION
Vue.prototype.$mapApiKey = MAP_API_KEY
Vue.prototype.$mapApiUrl = MAP_API_URL
Vue.prototype.$amapApiKey = AMAP_API_KEY
Vue.prototype.$amapWebApiKey = AMAP_WEB_API_KEY
Vue.prototype.$baseUrl = BASE_URL
Vue.prototype.$baseUrl_imgs = BASE_URL_IMGS

// wx68b6f3ef0a8ab2f1		test
// wx3f3ad415ff3abb7d		v1		

