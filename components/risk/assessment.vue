<template>
	<view>
		<cl-select v-model="val" :options="columns" placeholder="请选择" @change="changeHandle"></cl-select>
		
	</view>
</template>

<script>
export default{
	props:{
		value:{
			type:[Number,String],
			default:''
		},
		i:{
			type:[Number,String],
			default:''
		},
		ii:{
			type:[Number,String],
			default:''
		},
		reportRiskData:{
			type:[Array,Object],
			default:[]
		}
	},
	data(){
		return{
			val:this.value,
			columns: [
			    {
			        label: '是',
			        value:1
			    }, {
			        label: '否',
			        value:0
			    }
			],
			data:[]
		}
	},
	created() {
		
	},
	methods:{
		changeHandle(e){
			console.log(e)
			console.log('i:',this.i)
			console.log('ii',this.ii)
			console.log(this.reportRiskData)
			
			this.reportRiskData[this.i].list[this.ii].is_conform = e
			let data = this.reportRiskData[this.i].list
			
			this.data = data
			console.log(this.reportRiskData)
			this.submit()
		},
		submit() {
			
			let params = {
				data:this.data
			}
			this.$api.editRiskAssessment(params).then(res=>{
				if (res.code == 200) {
					if (res.data) {
						uni.hideLoading();
						uni.$utils.toast("保存成功")
		
					}
				}
				if(res.code == 400){
					uni.$utils.toast(res.msg)
					return false
				}
			}).catch(err=>{
				uni.showToast({
					icon: 'error',
					title: err.errMsg
				});
				setTimeout(function() {
					uni.hideLoading();
				}, 2000);
			})
		
		},
	}
}
</script>

<style>
</style>