<template>
	<view>
		<view class="download" @tap="download()" v-if="current_tab==0">
			<cl-icon name="cl-icon-cloud-download" color="#007AFF" :size="80"></cl-icon>
		</view>
		<view v-if="basic.jStaff01==Staff01">
			<view class="add" @tap="add()" v-if="(current_tab>0 && current_tab<=tab_bar.length-2) && (basic.Status==2 || basic.Status==-1)">
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
						<text>{{basic.CustomerName}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="客户地址：">
						<text>{{basic.Addr}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="联系人员：">
						<text>{{basic.ContactName}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="联系方式：">
						<text>{{basic.Mobile}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务类型：">
						<text>{{basic.ServiceName}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务项目：">
						<text>{{basic.service_projects}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务时间(开始)：">
						<text v-if="jobtype==1">{{basic.startDate}} &nbsp;{{basic.StartTime}}</text>
						<text v-else>{{basic.startDate}} &nbsp;{{basic.StartTime}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务时间(结束)：">
						<text v-if="jobtype==1">{{basic.FinishDate}} &nbsp;{{basic.FinishTime}}</text>
						<text v-else>{{basic.FinishDate}} &nbsp;{{basic.FinishTime}}</text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="服务人员：">
						<text>{{basic.Staff01}}<span v-if="basic.Staff02!=null">,{{basic.Staff02}}</span><span
								v-if="basic.Staff03!=null">,{{basic.Staff03}}</span></text>
					</cl-list-item>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;">
					<cl-list-item label="设备巡查：">
						<text>{{basic.equipments}}</text>
					</cl-list-item>
				</view>
			</swiper-item>
			<!-- 服务简报 -->
			<swiper-item v-if="show_briefing">
				<view style="border-bottom: 1px solid #eeeeee;background-color: #FFFFFF;" v-if="briefing.content">
					<view class="service_title">服务内容</view>
					<view class="service_content">
						{{briefing.content}}
					</view>
				</view>
				<view style="border-bottom: 1px solid #eeeeee;background-color: #FFFFFF;" v-if="briefing.proposal">
					<view class="service_title">跟进与建议</view>
					<view class="service_content">
						{{briefing.proposal}}
					</view>
				</view>
			</swiper-item>
			<!-- 物料使用 -->
			<swiper-item v-if="show_material">
				<cl-scroller>
					<view style="background-color: #FFFFFF;" v-for="(item,index) in material">
						<view class="material_title" style="border-bottom: 1px solid #eeeeee;">{{item.material_name}}
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
								{{item.title}}
							</view>
						</view>
						<view class="new_card_content">
							<t-table>
								<t-tr>
									<t-th v-for="(table_title, index_t) in item.table_title" :key="index_t">{{table_title}}</t-th>
								</t-tr>
								<t-tr v-if="JSON.stringify(item.content)!='{}'"
									v-for="(contents, index_cs) in item.content" :key="index_cs">
									<t-td v-for="(content, index_c) in contents" :key="index_c">{{content}}</t-td>
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
								<img :src="item.site_photos" />
							</cl-col>
							<cl-col span="15" style="text-align: left;line-height: 22px;">
								<cl-list><span>标靶：</span>{{item.risk_targets}}</cl-list>
								<cl-list><span>风险类别：</span>{{item.risk_types}}</cl-list>
								<cl-list><span>跟进时间：</span>{{item.creat_time}}</cl-list>
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
			<swiper-item style="background-color: #FFFFFF;">
				<cl-scroller>
					<view class="sign_content">
						<view class="sign_title">现场签到</view>
						<!-- <view class="block">
							<cl-image size="300rpx" :src="sign_phone" :preview-list="[sign_phone]">
							</cl-image>
						</view> -->
						<view class="sign_time">
							<cl-list v-if="jobtype==1">签到时间：{{basic.FinishDate}} &nbsp;{{basic.StartTime}}</cl-list>
							<cl-list v-else>签到时间：{{basic.JobDate}} &nbsp;{{basic.StartTime}}</cl-list>
							<!-- <cl-list>签到地点：江苏省无锡市滨湖区刘唐路2号</cl-list> -->
						</view>
					</view>
					<view class="sign_content">
						<view class="sign_title">员工签名</view>
						<cl-row>
							<cl-col span="8">
								<view class="eblock">
								<cl-image size="200rpx" :src="autograph_employee01_signature" :preview-list="[autograph_employee01_signature]">
								</cl-image>
								</view>
							</cl-col>
							<cl-col span="8" v-if="autograph_employee02_signature!=''">
								<view class="eblock">
								<cl-image size="200rpx" :src="autograph_employee02_signature" :preview-list="[autograph_employee02_signature]">
								</cl-image>
								</view>
							</cl-col>
							<cl-col span="8" v-if="autograph_employee03_signature!=''">
								<view class="eblock">
								<cl-image size="200rpx" :src="autograph_employee03_signature" :preview-list="[autograph_employee03_signature]">
								</cl-image>
								</view>
							</cl-col>
						</cl-row>
					</view>
					<view class="sign_content">
						<view class="sign_title">客户签名<span style="font-size: 12px;color: #999999;">(签名需点评后保存)</span></view>
						<cl-row>
							<cl-col span="16">
								<view class="eblock">
								<cl-image size="300rpx" :style="autograph_customer_style" :src="autograph_customer_signature">
								</cl-image> 
								</view>
								<!-- <Signature ref="sig" v-model="autograph_customer_signature"></Signature> -->
							</cl-col>
							<cl-col span="8" class="sign_qm">
								<!-- <cl-button @tap="startSign">签名</cl-button> -->
								<cl-button @tap="startSign_s">签名</cl-button>
							</cl-col>
						</cl-row>

					</view>
					<view class="sign_content">
						<view class="sign_title">客户点评</view>
						<cl-rate :value="0" v-model="autograph_customer_grade" @change="$noMultipleClicks(save_autograph)"></cl-rate>
					</view>
				</cl-scroller>
			</swiper-item>
		</swiper>
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
		// components: {
		//           Signature,
		//       },
		data() {
			return {
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
				risk: [],
				photo: [],
				autograph_employee01_signature:'',
				autograph_employee02_signature:'',
				autograph_employee03_signature:'',
				autograph_customer_signature:'',
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
				autograph_customer_style:''
			}
		},
		onLoad(index) {
			
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
			this.shortcut_type = index.shortcut_type
			this.service_type = index.service_type
			this.Staff01 = uni.getStorageSync('staffid')
			// 首次获取屏幕宽度
			uni.getSystemInfo({
				success: (res) => {
					this.screen_width = res.screenWidth
				}
			});
			this.data_select()
		},
		onShow: function () {
			
			var that = this;
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			let datas = currPage.data.customer_signature;
			this.autograph_customer_signature = currPage.data.customer_signature;
			this.is_base64 = currPage.data.is_base64;
			if(this.conversion_flag == 0 && this.is_base64 == 0 || this.conversion_flag == 1 && this.is_base64 == 0){
				this.autograph_customer_style = '';
			}else{
				this.autograph_customer_style = 'transform: rotate(-90deg)';
			}
			console.log('this.conversion_flag:')
			console.log(this.conversion_flag)
			console.log('this.is_base64:')
			console.log(this.is_base64)
			// let that = this
			// 	uni.$on('getdata',function(data){
			// 		console.log('监听到事件来自返回的参数：' , data);
			// 	})
		 },
		methods: {
			// 点击tabbar事件
			change_tab(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.run_tab(index)
			},
			// swiper滑动事件
			change_swiper(e) {
				let index = e.target.current || e.detail.current;
				this.run_tab(index)
			},
			// 执行整个tab事件
			run_tab(index) {
				// 记录当前滑动的位置
				this.current_tab = index
				// 如果点击了第4个以后的,滚动条向右移动屏幕的宽度
				this.scroll_into = this.tab_bar[index].id
			},
			//风险详情页
			risk_detail(index) {
				uni.navigateTo({
					url: "/pages/report/risk_detail?id=" + index
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
			// async startSign() {
			// 	let s = await this.$refs.sig.getSyncSignature();
			// 	this.autograph_customer_signature = s;
			// 	// console.log('组件版本', this.$refs.sig.VERSION);
			// 	console.log('签名数据', s);
			// },
			startSign_s() {
				uni.navigateTo({ 
					url: "/pages/report/sign?jobid=" + this.jobid +"&jobtype="+ this.jobtype
				})
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
						// errMsg: "navigateTo:fail page "pages/index/pages/test/test" is not found"
						console.log(err);
					}
				})
			},
			data_select() {
				//查询是否存在
				let param = {
					staffid: uni.getStorageSync('staffid'),
					city: uni.getStorageSync('city'),
					job_id: this.jobid,
					job_type: this.jobtype,
					service_type: this.service_type
				}
				uni.request({
					url: `${this.$baseUrl}/getreport`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: param,
					success: (res) => {
						if (res.data.code == 1) {
							if (res.data.data) {
								this.basic = res.data.data.basic
								this.briefing = res.data.data.briefing
								this.material = res.data.data.material
								this.risk = res.data.data.risk
								for (let i = 0; i < this.risk.length; i++) {
									this.risk[i]['site_photos'] = this.risk[i]['site_photos'].split(",");
									var site_po = this.risk[i]['site_photos'][0].replace(/\"/g, "").replace(/[\\]/g,'');
									this.risk[i]['site_photos'] = `${this.$baseUrl_imgs}` + site_po;
								}
								this.equipment = res.data.data.equipment
								this.photo = res.data.data.photo
								for (let i = 0; i < this.photo.length; i++) {
									this.photo[i]['site_photos'] = this.photo[i]['site_photos'].split(",");
									for (let j = 0; j < this.photo[i]['site_photos'].length; j++) {
										var site_po = this.photo[i]['site_photos'][j].replace(/\"/g, "").replace(/[\\]/g,'');
										this.photo[i]['site_photos'][j] = `${this.$baseUrl_imgs}` + site_po;
									}
								}
								this.autograph_employee01_signature = res.data.data.autograph.employee01_signature?res.data.data.autograph.employee01_signature:''
								this.autograph_employee02_signature = res.data.data.autograph.employee02_signature?res.data.data.autograph.employee02_signature:''
								this.autograph_employee03_signature = res.data.data.autograph.employee03_signature?res.data.data.autograph.employee03_signature:''
								this.autograph_customer_signature = res.data.data.autograph?res.data.data.autograph.customer_signature:''
								this.autograph_customer_grade = res.data.data.autograph?res.data.data.autograph.customer_grade:''
								this.conversion_flag = res.data.data.autograph?res.data.data.autograph.conversion_flag:1
								// if(this.conversion_flag == 1){
								// 	this.autograph_customer_style = ''
								// }
								
								if(res.data.data.service_sections!=''){
									var list_add = [];
									list_add.push(this.tab_bar[0]);
									for (var i=0;i<res.data.data.service_sections.length;i++)
									{ 
									    list_add.push(this.tab_bar[res.data.data.service_sections[i]]);
										if(res.data.data.service_sections[i]==1){
											this.show_briefing = true
										}else if(res.data.data.service_sections[i]==2){
											this.show_material = true
										}else if(res.data.data.service_sections[i]==3){
											this.show_equipment = true
										}else if(res.data.data.service_sections[i]==4){
											this.show_risk = true
										}else if(res.data.data.service_sections[i]==5){
											this.show_photo = true
										}
										
									}
									list_add.push(this.tab_bar[6]);
									this.tab_bar = list_add;
								}else{
									this.show_briefing = true
									this.show_material = true
									this.show_equipment = true
									this.show_risk = true
									this.show_photo = true
								}
							}
							
							setTimeout(() => {
								uni.hideLoading();
							}, 500)

						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
							});
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/login/login"
								});
							}, 2000)
						}

					},
					fail: (err) => {
						console.log(res);
					}
				})
			},
			save_autograph(){
				uni.showLoading({
					title: "保存中..."
				});
				let param = {
					staffid: uni.getStorageSync('staffid'),
					job_id: this.jobid,
					job_type: this.jobtype,
					employee01_signature:this.autograph_employee01_signature,
					employee02_signature:this.autograph_employee02_signature,
					employee03_signature:this.autograph_employee03_signature,
					customer_signature:this.autograph_customer_signature,
					customer_grade:this.autograph_customer_grade
				}
				uni.request({
					url: `${this.$baseUrl}/saveautograph`,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'token': uni.getStorageSync('token')
					},
					method: 'POST',
					data: param,
					success: (res) => {
						uni.hideLoading();
						if (res.data.code == 1) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
							});
				
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
							});
						}
				
					},
					fail: (err) => {
						console.log(res);
					}
				})
			},
			download() {
				uni.showLoading({
					title: "数据加载中..."
				});
			    let param = {
			    	staffid: uni.getStorageSync('staffid'),
			    	job_id: this.jobid,
			    	job_type: this.jobtype,
			    }
			    let time = new Date().getTime();
			    wx.request({
			      url: `${this.$baseUrl}/generatepdf`,
			      header: {
			        'content-type': 'application/x-www-form-urlencoded',
					'token': uni.getStorageSync('token')
			      },
				  method: 'POST',
				  data: param,
			      responseType: "arraybuffer",
			      success: (result) => {
			        var fileManager = wx.getFileSystemManager();
			        var FilePath = wx.env.USER_DATA_PATH + "/服务报告-" + this.jobid + "-" + this.basic.JobDate + "-" + time + ".pdf";
			        fileManager.writeFile({
			          data: result.data,
			          filePath: FilePath,
			          encoding: "binary",
			          success: res => {
			            wx.openDocument({
			                filePath: FilePath,
			                showMenu: true,
			                fileType: "pdf",
			                success: result => {
			                    uni.hideLoading();
			                    uni.showToast({
			                        title: '文档打开成功',
			                        icon: 'success',
			                        duration: 1500
			                    });
			                },
			                fail: err => {
			                    uni.hideLoading();
			                    uni.showToast({
			                        title: '文档打开失败',
			                        icon: 'none',
			                        duration: 2000
			                    });
			                }
			            });
			          },
			          fail: res => {
						uni.hideLoading();
			            uni.showToast({
			                title: '文件保存失败，请重试',
			                icon: 'none',
			                duration: 2000
			            });
			          }
			        })
			      },
			      fail(err) {
			        uni.hideLoading();
			        uni.showToast({
			            title: '文档请求失败',
			            icon: 'none',
			            duration: 2000
			        });
			      }
			    })
			  },

		}
	}
</script>

<style>
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
</style>
