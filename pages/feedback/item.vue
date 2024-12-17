<template>
	<view class="container">
		<view class="list">
			<view class="new_card_title">非常好吃</view>
			<view class="new_card_content">
				<view class="service_info">
					<view class="service_name">
						灭虫
					</view>
					<view class="first_job">
						首次服务
					</view>
				</view>
				<view>
					<view class="content_t _span">日期: 2024-09-26</view>
					<view class="content_t _span">时间: 07:51:41 - 16:51:47</view>
					<view class="content_t _span">地址: 珠海市香洲区翠前北路3街森宇国际2202</view>
				</view>
			</view>
		</view>
		<view class="item-list">
			<view class="service_title">是否异常反馈<span class="jh">*</span>：</view>
			<view>
				是
			</view>
		</view>
		<view class="item-list">
			<view class="service_title">申请工作日期<span class="jh">*</span>：</view>
			<view style="max-width: 260rpx;">
				 2021-11-22
			</view>
		</view>
		<view class="item-list">
			<view class="service_title">申请理由<span class="jh">*</span></view>
			<view class="lz"></view>
			<view class="content">
				客户今天在休息，约在明天！
			</view>
		</view>
		
		<view class="item-list">
			<view class="service_title">申请人<span class="jh">*</span>：</view>
			<view>
				403797 王一茗
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
page{
	background: #fff;
}
.container{
	padding: 20rpx 20rpx;
}
.new_card_title {
    border-bottom: 1px solid #e0dcdc;
    font-size: 18px;
    font-weight: bold;
    padding: 10px;
    height: 25px;
}
.new_card_content {
    margin: 10px;
    font-size: 16px;
    color: #7b7070;
	.service_info{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.service_name {
	    background-color: #c6ecc0;
	    color: #12900a;
	    border-radius: 8px;
	    padding: 3px 0px;
	    text-align: center;
	    margin-right: 5px;
		min-width: 200rpx;
	}
	.first_job {
	    background-color: #cbe8ff;
	    color: #0876f1;
	    border-radius: 8px;
	    padding: 3px 0px;
	    text-align: center;
	    margin-right: 5px;
		min-width: 200rpx;
	}
	.content_t{
		color: #6b6464;
		margin: 20rpx;
		font-size: 30rpx;
	}
}

.item-list{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 0;
	.service_title{
		font-size: 30rpx;
		color: #000;
		font-weight: 700;
		.jh{
			color: red;
			margin-left: 10rpx;
		}
	}
	.content{
		border: 1rox solid #999;
	}
}
</style>
