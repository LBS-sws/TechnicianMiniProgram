import request from "@/common/request.js"

export default {
	// 密码登录 pages/home/home
	passwordLogin(params) {
		return request("/Staff.Login/login", params, 'POST')
		// return request("/Staff.Login/login", params)
	},
	
	// 首页 当日工作单 pages/home/home
	dayOrderList(params){
		 return request("/Order.Order/dayOrder", params, 'GET')
	},
	// 首页 统计所有工作单 pages/home/home
	dayCount(params){
		 return request("/Order.Order/dayCount", params, 'GET')
	},
	// 工作单详情 pages/service/detail
	getOrderInfo(params){
		 return request("/Order.Order/getOrderInfo", params, 'GET')
	},
	// 技术员备注修改 pages/service/detail
	updateTeachRemarks(params){
		 return request("/Order.Order/updateTeachRemarks", params, 'POST')
	},
	// 历史记录 pages/history/list
	searchOrder(params){
		 return request("/Order.Order/searchOrder", params, 'GET')
	},
	// 签到 pages/sign/sign
	orderSignIn(params){
		 return request("/Order.Order/orderSignIn", params, 'GET')
	},
	// 工作单开始 pages/service/start
	orderStart(params){
		 return request("/Order.Order/orderStart", params, 'GET')
	},
	// 服务简报 pages/service/briefing
	getBriefingsInfo(params){
		 return request("/Briefings.Briefings/getBriefingsInfo", params, 'GET')
	},
	editBriefings(params){
		 return request("/Briefings.Briefings/editBriefings", params, 'POST')
	},
	getMaterials(params){
		 return request("/Materials.Materials/index", params, 'GET')
	},
	getMaterialsInfo(params){
		 return request("/Materials.Materials/getMaterialsInfo", params, 'GET')
	},
	addMaterials(params){
		 return request("/Materials.Materials/addMaterials", params, 'POST')
	},
	editMaterials(params){
		 return request("/Materials.Materials/editMaterials?id=" + params.id, params, 'PUT')
	},
	delMaterials(params){
		 return request("/Materials.Materials/delMaterials?id=" + params.id, params, 'DELETE')
	},
	ReportBaseInfo(params){
		 return request("/Report.Report/baseInfo", params, 'GET')
	},
	getReportBriefingsInfo(params){
		 return request("/Report.Report/getBriefingsInfo", params, 'GET')
	},
	getReportMaterialsInfo(params){
		 return request("/Report.Report/getMaterialsInfo", params, 'GET')
	},
	getReportEqInfo(params){
		 return request("/Report.Report/getEqInfo", params, 'GET')
	},
	getReportRisksInfo(params){
		 return request("/Report.Report/getRisksInfo", params, 'GET')
	},
	getReportSiteWorkPhotosInfo(params){
		 return request("/Report.Report/getSiteWorkPhotosInfo", params, 'GET')
	},
	// 勘察总结
	getSummaryInfo(params){
		return request("/Exploration.Summary/info", params, 'GET')
	},
	// 勘察编辑
	editSummary(params){
		return request("/Exploration.Summary/edit", params, 'POST')
	},
	// 勘察单 风险评估 分类
	getRiskCategoryList(params){
		return request("/Exploration.Risk/getCategoryList", params, 'GET')
	},
	// 勘察单 风险评估 问题列表
	getRiskProblemList(params){
		return request("/Exploration.Risk/getProblemList", params, 'GET')
	},
	// 勘察单 风险评估 编辑
	editRiskAssessment(params){
		return request("/Exploration.Risk/edit", params, 'POST')
	},
	// 风险情况 列表
	getRiskSituationList(params){
		return request("/Exploration.RiskSituation/list", params, 'GET')
	},
	// 风险情况 信息
	getRiskSituationInfo(params){
		return request("/Exploration.RiskSituation/getInfo", params, 'GET')
	},
	addRiskSituation(params){
		return request("/Exploration.RiskSituation/add", params, 'POST')
	},
	
	about(params){
		 return request("/Content.Content/about", params, 'GET')
	},
	logout(params){
		 return request("/Staff.Login/logout", params, 'GET')
	},
	orderSignOut(params){
		 return request("/Order.Order/orderSignOut", params, 'POST')
	},
	getSiteWorkPhotosInfo(params){
		 return request("/SiteWorkPhotos.SiteWorkPhotos/getSiteWorkPhotosInfo", params, 'GET')
	},
	getShortcutContents(params){
		 return request("/SiteWorkPhotos.SiteWorkPhotos/getShortcutContents", params, 'GET')
	},
	delSiteWorkPhotos(params){
		 return request("/SiteWorkPhotos.SiteWorkPhotos/delSiteWorkPhotos?id=" + params.id, params, 'DELETE')
	},
	addSiteWorkPhotos(params){
		  return request("/SiteWorkPhotos.SiteWorkPhotos/addSiteWorkPhotos", params, 'POST')
	},
	editSiteWorkPhotos(params){
		  return request("/SiteWorkPhotos.SiteWorkPhotos/editSiteWorkPhotos", params, 'PUT')
	},
	optionEqAdd(params){
		  return request("/Equipment.Equipment/optionEqAdd", params, 'GET')
	},
	optionEq(params){
		  return request("/Equipment.Equipment/optionEq", params, 'GET')
	},
	equipmentList(params){
		  return request("/Equipment.Equipment/list", params, 'GET')
	},
	getEqInfo(params){
		  return request("/Equipment.Equipment/getEqInfo", params, 'GET')
	},
	
	addEq(params){
		  return request("/Equipment.Equipment/addEq", params, 'POST')
	},
	delEq(params){
		  return request("/Equipment.Equipment/delEq?ids=" + params.ids, params, 'DELETE')
	},
	//设备绑定二维码
	bindQr(params){
		return request("/Equipment.Equipment/bindQr", params, 'POST')
	},
	risksList(params){
		  return request("/Risks.Risks/list", params, 'GET')
	},
	getRiskInfo(params){
		  return request("/Risks.Risks/getRiskInfo", params, 'GET')
	},
	addRisk(params){
		  return request("/Risks.Risks/addRisk", params, 'POST')
	},
	editRisk(params){
		  return request("/Risks.Risks/editRisk", params, 'PUT')
	},
	editRiskByTeach(params){
		  return request("/Risks.Risks/editRiskByTeach", params, 'PUT')
	},
	delRisk(params){
		  return request("/Risks.Risks/delRisk", params, 'DELETE')
	},
	SiteWorkPhotosList(params){
		  return request("/SiteWorkPhotos.SiteWorkPhotos/list", params, 'GET')
	},
	editEq(params){
		  return request("/Equipment.Equipment/editEq?ids=" + params.ids, params, 'PUT')
	},
	CheckData(params){
		  return request("/Order.Order/CheckData", params, 'GET')
	},
	saveEvaluates(params){
		  return request("/Report.Report/saveEvaluates", params, 'POST')
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
		return request("/Risks.Risks/getHistoryRiskList", params)
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

