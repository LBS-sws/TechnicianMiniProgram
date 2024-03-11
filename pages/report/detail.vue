<template>
	<view>
		<view class="download" @tap="download()" v-if="current_tab==0">
			<cl-icon name="cl-icon-cloud-download" color="#007AFF" :size="80"></cl-icon>
		</view>
		<view>
			<view class="add" @tap="add()" v-if="(current_tab>0 && current_tab<=tab_bar.length-2) && (basic.status==2 || basic.status==-1)">
				<cl-icon name="cl-icon-plus-border" color="#007AFF" :size="80"></cl-icon>
			</view>
		</view>
		<scroll-view scroll-x="true" class="tab-h" v-bind:scroll-into-view="scroll_into"
			v-bind:scroll-with-animation="true">
			<view v-for="(item, index) in tab_bar" class="tab-item"
				v-bind:class="current_tab==index ? 'tab-bar-active' : ''" v-bind:key="index" v-bind:data-current="index"
				v-bind:id="item.id" v-on:click="change_tab">{{item.tit}}</view>
		</scroll-view> 
		<view class="hr"></view>
		<swiper class="swiper" v-bind:current="current_tab" duration="300" @change="change_swiper">
			<!-- 基础信息 -->
			<swiper-item>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="客户名称：">
						<text selectable="true">{{basic.customer.name_zh}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="客户地址：">
						<text selectable="true">{{basic.addr}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="联系人员：">
						<text selectable="true">{{basic.contact_name}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="联系方式：">
						<text selectable="true">{{basic.mobile}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务类型：">
						<text selectable="true">{{basic.service_type_info.service_name}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务项目：">
						<text selectable="true">{{basic.project}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务时间(开始)：">
						<text selectable="true">{{basic.start_date}}  &nbsp; {{basic.start_time}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务时间(结束)：">
						<text v-if="basic.finish_date">{{basic.finish_date}}  &nbsp; {{basic.finish_time}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务人员：">
						<text selectable="true">{{basic.staff.main}}</text> <text selectable="true">{{basic.staff.other}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="设备巡查：">
						<text selectable="true">{{basic.equipments}}</text>
					</cl-list-item>
				</view>
			</swiper-item>
			<!-- 服务简报 -->
			<swiper-item v-if="show_briefing">
				<view style="border-bottom: 1px solid #eeeeee;background-color: #FFFFFF;" v-if="briefing.content">
					<view class="service_title">服务内容</view>
					<view class="service_content">
						<text selectable="true">{{briefing.content}}</text>
					</view>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;background-color: #FFFFFF;" v-if="briefing.proposal">
					<view class="service_title">跟进与建议</view>
					<view class="service_content">
						<text selectable="true">{{briefing.proposal}}</text>
					</view>
				</view>
			</swiper-item>
			<!-- 物料使用 -->
			<swiper-item v-if="show_material">
				<cl-scroller>
					<view style="background-color: #FFFFFF;" v-for="(item,index) in material">
						<view class="material_title" style="border-bottom: 1px solid #eeeeee;display: flex;justify-content: space-between;">
							{{item.material_name}}
							<view>
								
							</view>
							<view style="padding: 3px 5px;border: 1px solid #ffffff;background: #2b9cec;color: #ffffff;border-radius: 3px;letter-spacing: 4px;"
								v-if="item.img_arr==1" @click="goMaterial(item.id)">
								物料证件
							</view>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="农药登记证号：">
								<text>{{item.material_registration_no}}</text>
							</cl-list-item>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="有效成分：">
								<text>{{item.material_active_ingredient}}</text>
							</cl-list-item>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="药物配比：">
								<text>{{item.material_ratio}}</text>
							</cl-list-item>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="靶标：">
								<text>{{item.targets}}</text>
							</cl-list-item>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="使用方式：">
								<text>{{item.use_mode}}</text>
							</cl-list-item>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="使用区域：">
								<text>{{item.use_area}}</text>
							</cl-list-item>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="处理空间/面积：">
								<text>{{item.processing_space}}</text>
							</cl-list-item>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="药物用量：">
								<text>{{item.dosage}}{{item.unit}}</text>
							</cl-list-item>
						</view>
						<view style="border-bottom: 1px solid #eeeeee;">
							<cl-list-item label="注意事项：">
								<text>{{item.matters_needing_attention}}</text>
							</cl-list-item>
						</view>
					</view>
				</cl-scroller>
			</swiper-item>
			<!-- 设备巡查 -->
			<swiper-item style="background-color: #FFFFFF;" v-if="show_equipment">
				<cl-scroller>
					<view class="new_card" v-for="(item, index) in equipment">
						<view class="new_card_title">
							<view class="new_card_title_left">
								<span class="xh">|</span>
								{{item.equipment_name}}({{item.use_count}}/{{item.total_count}})
							</view>
						</view>
						<view class="new_card_content" v-if="item.table_data.length > 0">
						    <t-table>
						        <t-tr>
						            <t-th v-for="(table_title, index_t) in item.table_title" :key="index_t">{{table_title}}</t-th>
						        </t-tr>
						        <t-tr v-if="JSON.stringify(item.content) != '{}'"
						            v-for="(contents, index_cs) in item.table_data" :key="index_cs">
						            <t-td v-for="(content, index_c) in contents" :key="index_c">
						                <text v-if="content !== 'null' && content !== '' && content !== null">{{content}}</text>
						            </t-td>
						        </t-tr>
						    </t-table>
						</view>
					</view>
				</cl-scroller>
			</swiper-item>
			<!-- 风险跟进 -->
			<swiper-item v-if="show_risk">
				<cl-scroller>
					<view class="risk" v-for="(item,index) in risk" @tap="risk_detail(item.id)">
						<cl-row>
							<cl-col span="9">
								<img :src="item.img" />
							</cl-col>
							<cl-col span="15" style="text-align: left;line-height: 22px;">
								<cl-list><span>标靶：</span>{{item.risk_targets}}</cl-list>
								<cl-list v-if="ct==1"><span>风险区域：</span>{{item.risk_area}}</cl-list>
								<cl-list><span>风险类别：</span>{{item.risk_types}}</cl-list>
								<cl-list><span>跟进时间：</span>{{item.follow_date}}</cl-list>
								<cl-row>
									<cl-col span="12">
										<view class="fx">风险等级：{{item.risk_rank}}</view>
									</cl-col>
									<cl-col span="12">
										<view class="gj">跟进次数：{{item.follow_times}}</view>
									</cl-col>
								</cl-row>
							</cl-col>

						</cl-row>
					</view>
				</cl-scroller>
			</swiper-item>
			<!-- 现场工作照 -->
			<swiper-item class="photo" v-if="show_photo">
				<cl-scroller>
					<view class="sign_content" v-for="(item, index) in photo" :key="index">
						<view class="block">
							<cl-image size="150rpx" v-for="(site_photo, index_p) in item.site_photos" :key="index_p" :src="site_photo"
								:preview-list="[site_photo]">
							</cl-image>
						</view>
						<view class="sign_time">
							<cl-list>{{item.remarks}}</cl-list>
						</view>
					</view>
				</cl-scroller>
			</swiper-item>
			<!-- 签名点评 -->
			<swiper-item  class="sign-review">
				<cl-scroller>
					<!-- 选中[签名点评]时 弹窗 -->
					<view>
						<u-modal :show="signReview_popshow"
							:title="signReview_poptitle" 
							:content='signReview_popcontent'
							@confirm="signReview_popshow=false"
							
						></u-modal>
					</view>
					<view class="sign_content">
						<view class="sign_title">现场签到</view>
						<view class="sign_time">
							<cl-list v-if="jobtype==1">签到时间：{{basic.start_date}} &nbsp;{{basic.start_time}}</cl-list>
							<cl-list v-else>签到时间：{{basic.start_date}} &nbsp;{{basic.start_time}}</cl-list>
							<!-- <cl-list>签到地点：江苏省无锡市滨湖区刘唐路2号</cl-list> -->
						</view>
					</view>
					<view class="sign_content">
						<view class="sign_title">员工签名</view>
						<cl-row>
							<cl-col span="8">
								<view class="eblock">
								<cl-image size="200rpx" v-for="(img_url, index) in staff_signature" :key="index" :src="img_url" :preview-list="[img_url]">
								</cl-image>
								</view>
							</cl-col>
						</cl-row>
					</view>
					<view class="sign_content">
						<view class="sign_title">客户签名<span style="font-size: 12px;color: #999999;"></span></view>
						<cl-row>
							<cl-col span="16">
								<view class="eblock" >
									<cl-image size="300rpx"  :style="autograph_customer_style" :src="autograph_customer_signature" >
									</cl-image> 
								</view>
							</cl-col>
							<cl-col span="8" class="sign_qm">
								<!-- <cl-button @tap="startSign">签名</cl-button> -->
								<cl-button @tap="startSign_s">签名</cl-button>
							</cl-col>
						</cl-row>
						<!-- 增加客户签名栏位 -->
						<cl-row>
							<cl-col span="16">
								<view class="eblock">
									<cl-image size="300rpx" :style="autograph_customer_style_add" :src="autograph_customer_signature_add">
									</cl-image>
								</view>
							</cl-col>
							<cl-col span="8" class="sign_qm">
								<cl-button @tap="startSign_sadd">附加签名</cl-button>
							</cl-col>
						</cl-row>
					</view>
					<view class="sign_content">
						<view class="sign_title">客户点评</view>
						<cl-rate :max="3" :value="0" v-model="autograph_customer_grade" color="#ffc800" void-color="#dadada" disabled="true"></cl-rate>
					</view>
				</cl-scroller>
			</swiper-item>
		</swiper>
		<!-- 点评弹窗  -->
		<u-modal
			position="center"
			:show="startSign_sData.show"
			@leave="startSign_sData.show=false"
			@click-overlay="startSign_sData.show=false"
			@confirm="submitStartSign_sDialog"
			width="100%"
			:z-index="9999"
		>
			<view class="review_popup">
				<view class="review_popup_title">请点评</view>
				
				<view class="review_popup_box" :key="i" v-for="(itemx, i) in questionsData">
					<view class="review_popup_box_title">{{ i+1 }}. {{itemx.question}}</view>
					<view class="review_popup_box_entitle">　　{{itemx.en_question}}</view>
					<radio-group @change="radioChange($event,i)">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in itemx.options" :key="item.v">
							<radio :value="item.v" :checked="item.v == itemx.answer" />{{item.t}}
						</label>
					</radio-group>
				</view>
			</view>
		</u-modal>
	</view>
</template>
<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import Signature from '@/components/sin-signature/sin-signature.vue';
	import luPopupWrapper from "@/components/lu-popup-wrapper/lu-popup-wrapper.vue";
	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd,
			Signature,
			luPopupWrapper,
		},
		data() {
			return {
				name:'服务详情',
				noClick:true,
				// 当前选中tab索引
				current_tab: 0,
				// 当前滚动条距离左边的位置
				scroll_left: 0,
				// 当前滚动条滚动到id位置
				scroll_into: '',
				// 屏幕宽度
				screen_width: 0,
				tab_bar: [{
						id: 'basic',
						tit: '基础信息'
					},
					{
						id: 'briefing',
						tit: '服务简报'
					},
					{
						id: 'material',
						tit: '物料使用'
					},
					{
						id: 'equipment',
						tit: '设备情况'
					},
					{
						id: 'risk',
						tit: '风险跟进'
					},
					{
						id: 'photo',
						tit: '现场工作照'
					},
					{
						id: 'autograph',
						tit: '签名点评'
					}
				],
				
				//评论弹窗
				type: "bottom", // left right top bottom center
				transition: "bottom", //none slider fade
				backgroundColor: '#FFF',
				active: false,
				height: "100%",
				width: "100%",
				popupId: 1,
				maskShow: true,
				maskClick: true,
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
				basic: [],
				briefing: [],
				material: [],
				equipment:[],	// add
				risk: [],
				photo: [],
				staff_signature:[],
				autograph_employee01_signature:'',
				autograph_customer_signature:'',
				autograph_customer_signature_add:'',
				autograph_customer_style_add:'',
				autograph_customer_grade:0,
				show_briefing:false,
				show_equipment:false,
				show_material:false,
				show_photo:false,
				show_risk:false,
				Staff01:'',
				// 图片旋转 flag
				conversion_flag:1,
				is_base64:0,
				
				// 图片旋转样式 如果是1就不需要旋转，如果是0就需要进行旋转处理
				autograph_customer_style:'',
				ct:0,
				
				//签名点评
				signReview_popshow: true,
				signReview_poptitle: '',
				signReview_popcontent:"请向负责人汇报本次服务情况,\r\n如有风险问题请重点汇报!",
				/* 点评问题 */
				question_type:'questions',
				startSign_sData: {
					show: false, // 
					questions: []
				},
				questionsData:[],	// 问题列表
				radioData:[{t: '是　Yes', v: 1}, {t: '否　No', v: 0}],	// 是、否
				isShowAdd:false,
				isdp:false,
				current:0,
			}
		},
		onLoad(index) {
			uni.$on('startSign_s', this.onStartSign_s)// 监听签名保存
			uni.$on('startSign_sadd', this.onStartSign_sadd)// 监听附加签名

			var loginRes = this.checkLogin();
			if (!loginRes) {
				uni.showToast({
					title: "请先登录",
					icon: 'none',
				});
				setTimeout(() => {
					return false
				}, 2000);
			}
			this.jobid = index.jobid
			this.jobtype = index.jobtype
			this.ct = uni.getStorageSync('ct')
			this.shortcut_type = index.shortcut_type
			this.service_type = index.service_type
			this.Staff01 = uni.getStorageSync('staffname')
			// 首次获取屏幕宽度
			uni.getSystemInfo({
				success: (res) => {
					this.screen_width = res.screenWidth
				}
			});
			this.getBaseinfo()
		},
		onShow: function () {
			var that = this;
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			let datas = currPage.data.customer_signature;
			this.autograph_customer_signature = currPage.data.customer_signature;
			let datas_add = currPage.data.customer_signature_add;
			this.autograph_customer_signature_add = currPage.data.customer_signature_add;
			this.show_briefing = true
			this.show_material = true
			this.show_equipment = true
			this.show_risk = true
			this.show_photo = true
		},
		//页面销毁
		beforeDestroy() {
			uni.$off('startSign_s', this.onStartSign_s)// 销毁监听签名保存事件
			uni.$off('startSign_sadd', this.onStartSign_sadd)//销毁监听保存附加签名
		},
		methods: {
			radioChange(e,i){
				console.log('eeee',e)
				console.log('iiii',i)
				this.questionsData[i].answer = e.detail.value
			},
			goMaterial(e){
				console.log(e)
				uni.navigateTo({
					url:'/pages/report/material?id='+e,
				})
			},
			// 点击tabbar事件
			change_tab(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.run_tab(index)
				console.log('1')
				this.current = index
			},
			// swiper滑动事件
			change_swiper(e) {
				let index = e.target.current || e.detail.current;
				if(this.current == index){
					return false
				}
				this.run_tab(index)
				console.log('2')
				this.current = index
			},
			// 执行整个tab事件
			run_tab(index) {
				// console.log(index)
				if(index==1){
					this.getBriefing()		// 简报
				}
				if(index==2){
					this.getMaterial()		// 物料
				}
				if(index==3){
					this.getEquipment()		// 设备
				}
				if(index==4){
					this.getRisk()			// 风险跟进
				}
				if(index==5){
					this.getPhoto()			// 现场工作照
				}
				if(index==6){
					this.getItems()			// 签名
				}
				// 记录当前滑动的位置
				this.current_tab = index
				// 如果点击了第4个以后的,滚动条向右移动屏幕的宽度
				this.scroll_into = this.tab_bar[index].id
			},
			//风险详情页
			risk_detail(index) {
				uni.navigateTo({
					url: "/pages/report/risk_detail?id=" + index + "&jobid=" + this.jobid +"&jobtype="+ this.jobtype
				})
			},
			previewImg(logourl) {
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
			// 签名
			startSign_s() {
				uni.navigateTo({ 
					url: "/pages/report/sign?jobid=" + this.jobid +"&jobtype="+ this.jobtype + "&is_main=1"
				})
				//显示点评弹窗
				let timer = setTimeout(() => {
					this.startSign_sData.show = true
					clearTimeout(timer);
				}, 1000);
			},
			startSign_sadd() {
				uni.navigateTo({ 
					url: "/pages/report/sign?jobid=" + this.jobid +"&jobtype="+ this.jobtype + "&is_main=0"
				})
			},
			// 保存签名时
			onStartSign_s(data) {
				if(data.is_main == '1'){
					this.autograph_customer_signature = `${this.$baseUrl_imgs}` + data.img_url + '?t=' + new Date().getTime()
				}else{
					this.autograph_customer_signature_add = `${this.$baseUrl_imgs}` + data.img_url + '?t=' + new Date().getTime()
				}
			},
			//保存附加签名时
			onStartSign_sadd(code) {
				console.log('onStartSign_sadd: ' + String(code))
			},
			//评价
			bottom: function() {
				this.width = "100%";
				this.height = "60%";
				this.transition = "bottom";
				this.type = "bottom";
				this.show();
			},
			show: function() {
				this.$refs.luPopupWrapper.show();
			},
			close: function() {
				this.$refs.luPopupWrapper.close();
			},
			closeCallback: function() {
				console.log("关闭后回调");
			},
			add() {
				var i = this.current_tab
				var url_t = this.tab_bar[i].id
				uni.navigateTo({
					url: "../service/" + url_t+"?jobid=" + this.jobid+'&jobtype='+this.jobtype+'&shortcut_type='+url_t+'&service_type='+this.service_type,
					success(res) {
						console.log(res);
					},
					fail(err) {
						console.log(err);
					}
				})
			},
			getItems(){
				let that = this
				/* 6.签名点评 */ 
				let params6 = {
					job_id:this.jobid,
					job_type:this.jobtype,
				}
				this.$api.getSignature(params6).then(res=>{
					// 员工签名
					if(this.staff_signature == ''){
						res.data.staff_sign_urls.forEach((item, index) => {
							this.staff_signature.push(`${this.$baseUrl_imgs}` + item)
						})
					}
					// 客户签名
					if(res.data.cust.customer_signature_url){
						this.autograph_customer_signature = `${this.$baseUrl_imgs}` + res.data.cust.customer_signature_url + '?t=' + new Date().getTime()
					}
					// 客户附加签名
					if(res.data.cust.customer_signature_url_add){
						this.autograph_customer_signature_add = `${this.$baseUrl_imgs}` + res.data.cust.customer_signature_url_add + '?t=' + new Date().getTime()
					}
					// 客户点评 星星
					this.autograph_customer_grade = res.data.evaluates.score
					// 点评过
					if(res.data.evaluates.question){
						let qearr = JSON.parse(res.data.evaluates.question)	// 问题答案
						console.log('已点评:',qearr)
						this.isdp = true
						setTimeout(()=>{
							let arr = this.startSign_sData.questions
							arr.forEach((item,i)=>{
								item.answer = parseInt(qearr[i].answer) //qearr[i].answer
							})
							let arr2 = []
							for (let i in arr) {
								arr2.push(arr[i])
							}
							console.log(arr2)
							this.questionsData = arr2
						},500)
					}else{
						this.questionsData = this.startSign_sData.questions
					}
				}).catch(err=>{
					// console.log(err)
				})
			},
			getBaseinfo(){
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.ReportBaseInfo(params).then(res=>{
					if (res.code == 200) {
						if (res.data) {
							this.basic = res.data
							if(res.data.staff.main == this.Staff01)
							{
								this.isShowAdd = true
							}
						}
						let questionsData = res.data.questionnaire
						questionsData.forEach((item,i)=>{
							item.answer = '0'
							item.options = this.radioData
						})
						this.startSign_sData.questions = questionsData	// 暂存问题列表
					}
					if(res.code == 400){
						uni.$utils.toast(res.msg)
						return false
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 1.服务简报
			getBriefing(){
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.getReportBriefingsInfo(params).then(res=>{
					if (res.code == 200) {
						this.briefing = res.data
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			// 2.物料使用
			getMaterial(){
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.getReportMaterialsInfo(params).then(res=>{
					this.material = res.data.data
				}).catch(err=>{
					console.log(err)
				})
			},
			// 3.设备情况
			getEquipment(){
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.getReportEqInfo(params).then(res=>{
					this.equipment = res.data
				}).catch(err=>{
					console.log(err)
				})
			},
			// 4.风险跟进
			getRisk(){
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype,
					limit:100,
					page:1
				}
				this.$api.getReportRisksInfo(params).then(res=>{
					let list = res.data.data
					list.forEach((item,i)=>{
						let photoArr = item.site_photos.split(",")
						item.img = `${this.$baseUrl_imgs}` + photoArr[0]
					})
					this.risk = list
				}).catch(err=>{
					console.log(err)
				})
			},
			// 5.现场工作照
			getPhoto(){
				let params = {
					job_id:this.jobid,
					job_type:this.jobtype,
					limit:100,
					page:1
				}
				this.$api.getReportSiteWorkPhotosInfo(params).then(res=>{
					let list = res.data.data
					list.forEach((item,i)=>{
						item.site_photos.forEach((itemx,index)=>{
							item.site_photos[index] = `${this.$baseUrl_imgs}` + itemx
						})
					})
					this.photo = list
				}).catch(err=>{
					console.log(err)
				})
			},
			download() {
				uni.showLoading({
					title: "数据加载中..."
				});
				let param = {
					job_id: this.jobid,
					job_type: this.jobtype,
				}
				uni.request({
					url: `${this.$baseUrl}/Preview.Preview/getHtmlContent`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'GET',
					data: param,
					responseType: "arraybuffer", //注意这里的responseType
					success: (result) => {
						var fileManager = uni.getFileSystemManager();
						// var FilePath = `${wx.env.USER_DATA_PATH}/${this.basic.CustomerName}-${this.jobid}-${this.basic.JobDate}.pdf`;
						var FilePath = `${wx.env.USER_DATA_PATH}/${this.basic.customer.name_zh}-${this.jobid}-${this.basic.job_date}.pdf`;
						fileManager.writeFile({
							filePath: FilePath,
							data: result.data,
							encoding: "binary", //编码方式 
							success: res => {
								console.log('编码格式');
			          uni.openDocument({ //我这里成功之后直接打开
									filePath: FilePath,
									showMenu: true,
									fileType: "pdf",
									success: result => {
										//隐藏加载状态
										uni.hideLoading();
										console.log("打开文档成功");
									},
									fail: err => {
										console.log("打开文档失败", err);
										//隐藏加载状态
										uni.hideLoading();
										uni.showToast({
											title: '打开文档失败',
											icon: 'none',
											duration: 2000
										});
									}
								});
							},
							fail: res => {
								//隐藏加载状态
								uni.hideLoading();
								uni.showToast({
									title: '文档已下载!',
									icon: 'none', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
									duration: 2000, //停留时间
								})
								console.log(res);
							}
						})
					},
					fail(err) {
						uni.hideLoading();
						console.log(err)
					}
				})
			},
			// 提交客户点评
			submitStartSign_sDialog() {
				let that = this
				var sorce = 0;
				let shouldContinue = true;  
				this.questionsData.forEach((item,i)=>{
					console.log('请为本次的服务进行评价',item)
					if(!this.isdp){
						if(item.answer == ''){
							uni.showToast({
								title: '请为本次的服务进行评价！',
								icon: 'none',
							});
							shouldContinue = false;
							return false
							console.log('null')
						}
					}
					if(item.answer ==1 ){
						sorce++;
					}
				})
				if(shouldContinue ==false){
					return
				}
				let qe = []
				this.questionsData.forEach((item,i)=>{
					qe.push({"id":item.id,"question_score":item.question_score,"type":"radio","status":item.status,"answer":item.answer})
				})
				let param = {
					customer_id:this.basic.customer_id,
					job_id:this.jobid,
					job_type:this.jobtype,
					question:JSON.stringify(qe),
				}
				//关闭弹窗
				this.startSign_sData.show = false
				// 提交点评到后台
				this.$api.saveEvaluates(param).then(res=>{
					let msg = '已提交点评，感谢您的反馈！'
					if(res.code == 200){
						console.log('sorce2',sorce)
						this.autograph_customer_grade = sorce;//服务评分 此处是为兼容旧版
					}
					uni.showToast({
						title: msg || res.data.msg,
						icon: 'none',
					});
				}).catch(err=>{
					console.log('err',err)
				})
			},
		}
	}
</script>

<style lang="scss">
	.new_card {
		background-color: #fff;
		border-radius: 10px;
		padding-bottom: 10px;
	}

	.new_card_title {
		border-bottom: 1px solid #e0dcdc;
		font-size: 18px;
		font-weight: bold;
		padding: 10px;
		height: 30px;
	}

	.xh {
		color: #007AFF;
		font-weight: bold;
		font-size: 20px;
		margin-right: 5px;
	}

	.new_card_title_left {
		float: left;
	}

	.new_card_title_right {
		font-size: 20px;
		color: #d0cece;
		float: right;

	}

	.new_card_content {
		margin: 10px;
		font-size: 15px;
	}

	.new_card_content span {
		color: #5e6165;
	}

	.sign_content {
		border-bottom: 1px solid #eeeeee;
		padding: 10px;
	}

	.sign_title {
		text-align: left;
		font-size: 18px;
		padding: 0px 15px 10px 15px;
		color: #504f4f;
	}
	.sign_time {
		text-align: left;
		font-size: 13px;
		background-color: #f7f7f7;
		border-radius: 10px;
		padding: 10px;
		margin: 10px;
	}

	.sign_qm {
		/*flex 布局*/
		display: flex;
		/*实现垂直居中*/
		align-items: center;
		/*实现水平居中*/
		justify-content: center;
	}

	.block {
		display: flow-root;
	}

	.block cl-image {
		width: 22%;
		float: left;
		margin: 5px;
	}

	.tab-h {
		height: 80rpx;
		width: 100%;
		line-height: 80rpx;
		background: #f7f7f7;
		font-size: 18px;
		white-space: nowrap;

	}

	.tab-item {
		padding: 0 36rpx;
		display: inline-block;
	}

	.tab-bar-active {
		font-weight: bold;
		color: #007aff;
	}

	.hr {
		height: 1rpx;
		background-color: #FFFFFF;
	}

	.swiper {
		height: 1300rpx;
		text-align: center;

	}

	.swiper-item {
		height: 1300rpx;
		line-height: 500rpx;
	}

	.service_title {
		text-align: left;
		font-size: 18px;
		padding: 10px 15px;
		color: #504f4f;
	}

	.service_content {
		font-size: 16px;
		background-color: #eeeeee;
		/* height: 30px; */
		padding: 10px;
		text-align: center;
		margin: 0 10px;
		border-radius: 5px;
		/*flex 布局*/
		display: flex;
		/*实现垂直居中*/
		align-items: center;
		/*实现水平居中*/
		justify-content: center;
	}

	.material_title {
		text-align: left;
		font-size: 17px;
		padding: 10px 15px;
		padding: 10px 15px;
		color: #b91306;
	}

	.risk {
		background-color: #FFFFFF;
		font-size: 15px;
		/* height: 120px; */
		padding: 10px 0px 0px 0px;
		border-bottom: 1px solid #eeeeee;
	}

	.risk cl-list {
		line-height: 16px;
	}

	.risk img {
		height: 100px;
		width: 130px;
		border-radius: 10px;
	}

	.risk span {
		font-weight: bold;
		color: #b91306;
	}

	.fx {
		margin-bottom: 5px;
		width: 90px;
		height: 22px;
		font-size: 14px;
		border-radius: 5px;
		text-align: center;
		background-color: #EEEEEE;
	}
	.gj {
		margin-bottom: 5px;
		width: 90px;
		height: 22px;
		font-size: 12px;
		border-radius: 5px;
		text-align: center;
		background-color: #EEEEEE;
	}
	.photo {
		background-color: #FFFFFF;
	}

	.sign-review{
		background-color: #FFFFFF;
	}

	.sign_content {
		border-bottom: 1px solid #eeeeee;
		padding: 10px;
	}

	.sign_title {
		text-align: left;
		font-size: 18px;
		padding: 0px 15px 10px 15px;
		color: #504f4f;
	}

	.sign_time {
		text-align: left;
		font-size: 16px;
		background-color: #f7f7f7;
		border-radius: 10px;
		padding: 10px;
		margin: 10px;
	}

	.sign_qm {
		/*flex 布局*/
		display: flex;
		/*实现垂直居中*/
		align-items: center;
		/*实现水平居中*/
		justify-content: center;
	}

	.page-content {
		position: relative;
		width: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		font-size: 14px;
	}

	.title {
		flex: none;
		position: relative;
		width: 100%;
		height: 40px;
		font-size: 16px;
		padding-left: 20px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
	}

	.btn-group {
		flex: 1 1 auto;
		position: relative;
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
		background-color: #eee;
		font-size: 14px;

	}

	.btn {
		height: 40px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		background-color: #f9f9f9;
		border-radius: 5px;
		padding: 0 10px;
		margin: 10px;
		overflow: hidden;
		box-shadow: 1px 2px 3px rgba(100, 100, 100, 0.5);
	}

	.mycontent {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		overflow: scroll;
	}

	.add {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px
	}
	.eblock {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 30rpx;
	}
	.eblock cl-image {
		width: -1%;
		float: left;
		margin: 5px;
	}
	.placeholder {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		background-color: #eee;
	}
	.cl-list-item__label {
		padding: 0 20rpx 0 0;
		font-size: 32rpx;
	}
	cl-list-item text{
		font-size: 16px;
	}
	.t-td {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		width: 100%;
		padding: 14rpx;
		border-top: 1px #d0dee5 solid;
		border-left: 1px #d0dee5 solid;
		text-align: center;
		color: #555c60;
		font-size: 30rpx;
		/* font-size: 30rpx; */
	}
	.download {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px
	}
	.review_popup{
		box-sizing:border-box;
		padding:0 24rpx 24rpx;

		.review_popup_title{
			text-align:center;
			padding:24rpx;
			font-size: 45rpx;
		}
		.review_popup_box{
			padding-inline:40rpx;
			margin-bottom:24rpx;

			.review_popup_box_title{

			}
			.review_popup_box_entitle{
				font-size: 35rpx;
				color: #201f1f;
				text-indent: 1rem;
			}
			.review_popup_box_radio{
				margin-top:20rpx;
				display: inline-block;
				width: 100%;

				> view{
					width: 45%;
					float: left;
				}
			}
		}
		.review_popup_button{
			padding-top:24rpx;

			.cl-button{
				width: 100%;
				height: 70rpx;
			}
		}
	}
	.u-modal__content__text{
		font-size: 17px !important;
		line-height: 27px;
	}
.u-modal__content{ padding-left: 0; padding-right: 0; }
</style>
