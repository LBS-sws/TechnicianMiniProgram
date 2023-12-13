/**
 * 提示方法
 * @param {String} title 提示文字
 * @param {String}  icon icon图片
 * @param {Number}  duration 提示时间
 */

const utils = {
	toast:(title, icon = 'none', duration = 1500)=>{
		uni.showToast({
			title,
			icon,
			duration
		})
	}
}
 
// 全局挂载
uni.$utils = utils
 
// 模块导出 每次使用都要导入 (太麻烦)
// export default utils
