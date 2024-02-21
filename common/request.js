
import {BASE_URL} from '@/common/config'

const defauls = {
	method: "GET",
	loading: true
}

console.log(BASE_URL)
// 全局请求封装
export default (path, data = {}, method = 'GET') => {
	// console.log('%c请求拦截：', ' background:orange', data);

	const token = uni.getStorageSync("token") ? `${uni.getStorageSync("token")}` : "";
	
	// uni.showLoading({
	// 	title: "加载中",
	// 	mask: true
	// })

	return new Promise((resolve, reject) => {
		uni.request({
			header:{token},
			url: BASE_URL + path,
			method: method,
			data,
			success(response) {
				// console.log('%c响应拦截：', ' background:green', response);
				if (response.data.code === 400) {
					// logout()
				}
				if (response.data.code == 200) {
					// uni.showToast({
					// 	icon: "none",
					// 	duration: 4000,
					// 	title: response.data.msg
					// });
				}
				if (response.data.code == 401) {
					uni.showToast({
						title: response.data.msg,
						icon: 'none',
					});	
					setTimeout(()=>{
						uni.clearStorageSync()
						uni.reLaunch({
							url:"/pages/login/login"
						})
						return false;
					},1500)
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
				uni.hideLoading();
			}
		});
	});
};
