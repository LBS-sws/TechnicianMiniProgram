<template>
	<view class="content">
		<view class="add" @tap="add(0)">
			<cl-icon name="cl-icon-plus-border" color="#007AFF" :size="80"></cl-icon>
		</view>
		<view class="noservice" v-if="materials.length==0">
			没有数据哦~~
		</view>
		<view class="list" v-for="(item,index) in materials" @tap="add(item.id)">
			<cl-row>
				<view class="material_name">{{item.material_name}}</view>
			</cl-row>
			<cl-row>
				<view class="dosage">{{item.dosage}}{{item.unit}}</view>
			</cl-row>
			<cl-row v-if="item.use_area">
				<view class="use_area">{{item.use_area}}</view>
			</cl-row>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'物料使用',
				materials: [],
				tablename: "materials",
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
					job_id:this.jobid,
					job_type:this.jobtype
				}
				this.$api.getMaterials(params).then(res=>{
					this.materials = res.data
					this.materials.forEach((item,i)=>{
						item.use_area = JSON.parse(item.use_area)
					})
				}).catch(err=>{
					console.log(err)
				})
			},
			add(id) {
				uni.redirectTo({
					url: "/pages/service/add_material?jobid=" + this.jobid + '&jobtype=' + this.jobtype +
						'&shortcut_type=' + this.shortcut_type + '&service_type=' + this.service_type + '&id=' + id
				})
			}

		}
	}
</script>

<style>
	.add {
		z-index: 9999;
		position: fixed;
		bottom: 10%;
		right: 15px
	}

	.list {
		background-color: #FFFFFF;
		margin: 10px;
		font-size: 17px;
		color: #7b7070;
		border-radius: 10px;
		padding: 10px;
	}

	.list span {
		color: #000000;
	}

	.noservice {
		text-align: center;
		margin-top: 20%;
		color: #a5a6a7;
		font-size: 17px;
	}

	/* new */
	.content_t {
		color: #6b6464;
		margin: 10px;
	}

	.material_name {
		background-color: #c6ecc0;
		color: #12900a;
		border-radius: 8px;
		padding: 3px;
		text-align: center;
		margin: 2px
	}

	.dosage {
		background-color: #cbe8ff;
		color: #0876f1;
		border-radius: 8px;
		padding: 3px;
		text-align: center;
		margin: 2px
	}

	.use_area {
		background-color: #f7cfcc;
		color: #ec1505;
		border-radius: 8px;
		padding: 3px;
		text-align: center;
		margin: 2px
	}
</style>
