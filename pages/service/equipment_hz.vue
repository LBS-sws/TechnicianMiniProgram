<template>
	<view class="content">
		<view class="service" v-for="(item, index) in list">
			<view class="service_title">{{item.equipment_name}}({{item.use_count}}/{{item.total_count}})</span></view>
			<view class="new_card_content"  v-if="item.table_data.length>0">
				<t-table>
					<!-- 表头 -->
					<t-tr>
						<t-th v-for="(table_title, index_t) in item.table_title" :key="index_t">{{table_title}}</t-th>
					</t-tr>
					<!-- 内容 -->
					<t-tr v-if="JSON.stringify(item.content)!='{}'" v-for="(contents, index_cs) in item.table_data" :key="index_cs">
						<t-td v-for="(content, index_c) in contents" :key="index_c">
							<text v-if="content!='null'">
								{{content}}
							</text>
						
						</t-td>
					</t-tr>
				</t-table> 
			</view>
		</view>
	</view>
</template>

<script>
import tTable from '@/components/t-table/t-table.vue';
import tTh from '@/components/t-table/t-th.vue';
import tTr from '@/components/t-table/t-tr.vue';
import tTd from '@/components/t-table/t-td.vue';
export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd,
		},
		data() {
			return {
				name:'汇总预览',
				list: [],
				jobid: '',
				jobtype: '',
				shortcut_type: '',
				service_type: '',
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
			
			this.data_select()
			
		},
		methods: {
			data_select() {
				let params = {
					job_type: this.jobtype,
					job_id: this.jobid,
				}
				this.$api.getReportEqInfo(params).then(res=>{
					if (res.code == 200) {
						console.log(res.data)
						if (res.data) {
							this.list = res.data
						}
					}
				}).catch(err=>{
					console.log(err)
				})
			},
		}
}
</script>

<style>
.new_card {
	background-color:#fff;
	border-radius:10px;
	padding-bottom:10px;
	margin:10px 0px;
}
.new_card_title {
	border-bottom:1px solid #e0dcdc;
	font-size:18px;
	font-weight:bold;
	padding:10px;
	height:30px;
}
.xh {
	color:#007AFF;
	font-weight:bold;
	font-size:20px;
	margin-right:5px;
}
.new_card_title_left {
	float:left;
}
.new_card_title_right {
	font-size:20px;
	color:#d0cece;
	float:right;
}
.new_card_content {
	margin:10px;
	font-size:15px;
}
.new_card_content span {
	color:#5e6165;
}
.tj_bu {
	position:relative;
	bottom:0px;
	background-color:#007AFF;
	color:#FFFFFF;
	z-index:9999;
}
.lcx {
	background-color:#fff;
	border-radius:10px;
	padding-bottom:10px;
	margin:10px 0px;
	padding-top:10px;
}
.tab-h {
	height:80rpx;
	width:100%;
	line-height:80rpx;
	background:#f7f7f7;
	font-size:16px;
	white-space:nowrap;
}
.tab-item {
	padding:0 36rpx;
	display:inline-block;
}
.tab-bar-active {
	font-weight:bold;
	color:#007aff;
}
/* new */
	.content {
	padding:10px;
}
.service {
	padding-bottom:15px;
}
.service_title {
	/* color:#03A9F4;
	*/
		font-size:18px;
	font-weight:bold;
}
.text-green.data-v-2ee6bce8 {
	color:#12900a;
}
page {
	background-color:#FFFFFF;
}
.service_content {
	margin:8px 0px;
}
.service_content view {
	margin:3px 0px;
}
</style>
