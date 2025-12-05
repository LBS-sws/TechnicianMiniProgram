<template>
	<view>
		<!-- 图片同步开关 - 只有智能识别后才显示 -->
		<view v-if="hasRecognized" class="sync-switch-container">
			<view class="sync-switch-label">保存时同步图片到现场工作照</view>
			<switch :checked="syncToWorkPhoto" @change="onSyncSwitchChange" color="#007AFF"></switch>
		</view>
		<!-- 悬浮AI识别按钮 - 只在灭蝇灯设备时显示 -->
		<view
			v-if="equipment_name && (equipment_name.includes('灭蝇灯') || equipment_name.includes('灭蝇')  || equipment_name.includes('灭蚊') || equipment_name.includes('蝇灯'))"
			class="floating-ai-btn"
			:style="{
				left: btnLeft + 'px',
				top: btnTop + 'px'
			}"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			@touchend="onTouchEnd"
			@tap="startAIRecognition"
		>
			<text class="ai-btn-icon">🪰</text>
			<text class="ai-btn-text">{{ hasRecognized ? '重新识别' : 'AI识别' }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ai-scan",
		props: {
			job_id: {
				type: [String, Number],
				default: ''
			},
			job_type: {
				type: [String, Number],
				default: ''
			},
			equipment_id: {
				type: [String, Number],
				default: 0
			},
			equipment_name: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				hasRecognized: false,
				syncToWorkPhoto: true,
				btnLeft: 300,
				btnTop: 400,
				start_time: 0,
				is_move: false,
				start_x: 0,
				start_y: 0,
				move_x: 0,
				move_y: 0,
			};
		}
	}
</script>

<style>
.floating-ai-btn {
	position: fixed;
	width: 80px;
	height: 40px;
	background-color: #007aff;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	z-index: 1000;
	transition: background-color 0.3s;
}

.floating-ai-btn:active {
	background-color: #0056b3;
}

.ai-btn-icon {
	font-size: 20px;
	margin-right: 5px;
}

.ai-btn-text {
	color: white;
	font-size: 14px;
}

.sync-switch-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	background-color: #f8f8f8;
	border-top: 1px solid #eee;
	border-bottom: 1px solid #eee;
	margin-top: 10px;
}

.sync-switch-label {
	font-size: 16px;
}
</style>