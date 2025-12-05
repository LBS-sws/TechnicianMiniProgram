import {BASE_URL} from '@/common/config'

const defauls = {
	method: "GET",
	loading: true
}

console.log(BASE_URL)

// 防止多次重复跳转
let isRedirecting = false;

// 全局请求封装
export default (path, data = {}, method = 'GET') => {
	const token = uni.getStorageSync("token") ? `${uni.getStorageSync("token")}` : "";

	return new Promise((resolve, reject) => {
		uni.request({
			header:{token},
			url: BASE_URL + path,
			method: method,
			data,
			success(response) {
				if (response.data.code === 400) {
					// logout()
				}
				if (response.data.code == 200) {
					// 成功处理
				}
				if (response.data.code == 401) {
					// 防止多个请求同时跳转
					if (isRedirecting) {
						return false;
					}
					isRedirecting = true;
					uni.showToast({
						title: response.data.msg || 'token已过期，请重新登录',
						icon: 'none',
					});
					uni.clearStorageSync();
					setTimeout(() => {
						uni.reLaunch({
							url:"/pages/login/login"
						});
						isRedirecting = false;
					}, 500);
					return false;
				}
				resolve(response.data);
			},
			fail(err) {
				uni.showToast({
					icon: "none",
					title: '服务响应失败'
				});
				console.error(err);
				reject(err);
			},
			complete() {
				// uni.hideLoading();
			}
		});
	});
};
