import Vue from "vue";
import App from "./App";
import cooluni from "./cl-uni";
import store from './store/index'
import './styles/index.scss'
import uView from "uview-ui";

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

Vue.prototype.$version =2
Vue.prototype.$mapApiKey="2atTyVGiF8KTsdegg7KKSjGTsdINm8gw" //百度地图 appkey
Vue.prototype.$mapApiUrl="https://api.map.baidu.com/reverse_geocoding/v3" //百度地图apiURl

Vue.prototype.$baseUrl="https://v1.teach.lbsapps.cn/api"   //api.technician.com   apiuat.lbsapps.cn   v1.teach.lbsapps.cn
Vue.prototype.$baseUrl_imgs="https://files.lbsapps.cn"

// Vue.prototype.$baseUrl="http://localhost:10006/api"
// Vue.prototype.$baseUrl_imgs="https://files.lbsapps.cn"
