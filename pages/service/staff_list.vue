<template>
	<view class="container">
		<u-search placeholder="关键词" v-model.trim="key"
		:clearabled="true"
		:showAction="false" actionText="" :animation="true"
		@input="inputFun"
		></u-search>
		<view class="list">
			<view class="item" v-for="(item,i) in options" :key="i">
				{{item.name}}
			</view>
		</view>
	</view>
</template>

<script>
export const fuzzyQuery = (list, keyWord, attribute = 'name') => {
  const reg = new RegExp(keyWord)
  const arr = []
  for (let i = 0; i < list.length; i++) {
    if (reg.test(list[i][attribute])) {
      arr.push(list[i])
    }
  }
  return arr
}
export default{
	data(){
		return{
			key:"",
			timer: null, 
			key: '',
			popList:[],
			options:[]
		}
	},
	onShow() {
		this.list()
	},
	methods:{
		
		onSearch() {
			if (this.key) {
				let result = fuzzyQuery(this.options, this.key, 'name')
				this.options = result
			}else {
				this.options = this.popList
			}
		},
		inputFun(e){
			console.log(e)
			this.clearTimer()
			if (e) { // e.detail.value
				
				this.timer = setTimeout(() => {
					this.onSearch()
				}, 500)
				
			}else{
				this.onSearch()
			}
		},
		clearTimer() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
		},
		list(){
			let params = {
				page:1,
				limit:20,
				key: this.key
			}
			this.$api.staffRecord(params).then(res=>{
				let arr = [
					{id:1,name:'张三'},
					{id:2,name:'李四'}
				]
				this.options = arr
				
				this.popList = JSON.parse(JSON.stringify(arr))
			})
		}
		//...
	}
}
</script>

<style lang="scss">
page{
	background: #fff;
}
image{
	height: auto;
}
.container{
	padding: 20rpx 20rpx;
}
.list{
	.item{
		
	}
}
</style>