import request from "@/common/request.js"

export default {
	// 密码登录
	passwordLogin(params) {
		
		return request("/Staff.Login/login", params, 'POST')
		
		// return request("/Staff.Login/login", params)
	},
	
	// 未解决问题
	stayQuestion(params) {
		return request("/Risks.Risks/getHistoryRiskList", params)
	},
	// 跟进问题
	followQuestion(params) {
		return request("/Risks.Risks/getHistoryRiskList", params)
	},
	// 待确认
	verifyQuestion(params) {
	
	},
	// 已解决
	resolvedQuestion(params) {
		return request("/Risks.Risks/getHistoryRiskList", params)
	},
	
	// 基础信息
	getBaseinfo(params) {
		return request("/Report.Report/baseInfo", params)
	},
	// 获取员工签名客户签名，点评
	getSignature(params) {
		return request("/Report.Report/getSignData", params)
	},
}

