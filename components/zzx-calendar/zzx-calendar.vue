<template>
	<view class="zzx-calendar">
		<view class="calendar-heander">
			{{timeStr}}{{todayInfo}}
		</view>
		<view class="calendar-weeks">
			<view class="calendar-week" v-for="(week, index) in weeks" :key="index">
				{{week}}
			</view>
		</view>
		<view class="calendar-content">
		   <swiper class="calendar-swiper" :style="{
			   width: '100%',
			   height: sheight
		   }" :indicator-dots="false" :autoplay="false" :duration="duration" :current="current" @change="changeSwp" :circular="true">
				<swiper-item class="calendar-item" v-for="sitem in swiper" :key="sitem">
					<view class="calendar-days">
						<template v-if="sitem === current">
							<view class="calendar-day" v-for="(item,index) in days" :key="index"
							:class="{
								'day-hidden': !item.show
							}" @click="clickItem(item)">
								<view
									class="date"
									:class="[
										item.isToday ? todayClass : '',
										item.fullDate === selectedDate ? checkedClass : ''
										]"
								>
									{{item.time.getDate()}}
									<view class="work-badge" :class="item.info && item.info.inProgress ? 'badge-primary' : (item.info && item.info.unfinsh ? 'badge-danger' : 'badge-success')" v-if="item.info && item.info.count">{{item.info.count}}</view>
								</view>
								<view class="dot-show" v-if="item.info && !item.info['unfinsh']" :style="[dotStyle]"></view>
								<view class="dot-show" v-if="item.info && item.info['unfinsh']" :style="[ReddotStyle]"></view>
						</view>
						</template>
						<template v-else>
							<template v-if="current - sitem === 1 || current-sitem ===-2">
								<view class="calendar-day" v-for="(item,index) in predays" :key="index"
									:class="{
										'day-hidden': !item.show
									}" @click="clickItem(item)">
									<view
										class="date"
										:class="[
											item.isToday ? todayClass : ''
											]"
									>
									{{item.time.getDate()}}
									</view>
								</view>
							</template>
							<template v-else>
								<view class="calendar-day" v-for="(item,index) in nextdays" :key="index"
									:class="{
										'day-hidden': !item.show
									}" @click="clickItem(item)">
									<view
										class="date"
										:class="[
											item.isToday ? todayClass : ''
											]"
									>
									{{item.time.getDate()}}
									</view>
								</view>
							</template>
							
						</template>
					</view>				
				</swiper-item>			
			</swiper>
			<view class="mode-change" @click="changeMode">
				<view :class="weekMode ? 'mode-arrow-bottom' : 'mode-arrow-top'">	
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {gegerateDates, dateEqual,formatDate} from './generateDates.js';
	export default {
		props: {
			duration: {
				type: Number,
				default: 500
			},
			dotList: {
				type: Array,
				default() {
					return [
					]
				}
			},
			cilck_time: {
				type: Object,
				default() {
					return {
						cur: '',
						fullDate: ''
					}
				}
			},
			showBack: {
				type: Boolean,
				default: false
			},
			todayClass: {
				type: String,
				default: 'is-today'
			},
			checkedClass: {
				type: String,
				default: 'is-checked'
			},
			dotStyle: {
				type: Object,
				default() {
					return {
						background: '#1899dc'
					}
				}
			},
			ReddotStyle: {
				type: Object,
				default() {
					return {
						background: '#E91E63'
					}
				}
			}
		},
		watch:{
			dotList: function(newvalue){
				const days = this.days.slice(0);
				newvalue.forEach(item => {
					const index = days.findIndex(ditem => ditem.fullDate === item.date);
					if (index > 0) {
						days[index].info = item
					}
				});
				this.days = days;
			},
			cilck_time: function(newvalue){
				this.initDate(newvalue.cur)
				this.clickItem(newvalue)
			}
		},
		computed: {
			sheight() {
				let h = '70rpx';
				if (!this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth, 0);
					const days = d.getDate();
					let day = new Date(d.setDate(1)).getDay();
					if (day === 0) {
						day = 7;
					}
					const pre = 8 - day;
					const rows = Math.ceil((days-pre) / 7) + 1;
					h = 70 * rows + 'rpx'
				}
				return h
			},
			timeStr() {
				const y = this.currentYear;
				const m = this.currentMonth <= 9 ? `0${this.currentMonth}` : this.currentMonth;
				return `${y}年${m}月`;
			},
			predays() {
				let pres = [];
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1,this.currentDate)
					d.setDate(d.getDate() - 7);
					pres = gegerateDates(d, 'week')
				} else {
					const d = new Date(this.currentYear, this.currentMonth - 2,1)
					pres = gegerateDates(d, 'month')
				}
				return pres;
			},
			nextdays() {
				let nexts = [];
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1,this.currentDate)
					d.setDate(d.getDate() + 7);
					nexts = gegerateDates(d, 'week')
				} else {
					const d = new Date(this.currentYear, this.currentMonth,1)
					nexts = gegerateDates(d, 'month')
				}
				return nexts;
			},
			todayInfo() {
				if (!this.selectedDate) return '';
				const date = new Date(this.selectedDate.replace(/-/g, '/'));
				const day = String(date.getDate()).padStart(2, '0');
				const weeks = ['日', '一', '二', '三', '四', '五', '六'];
				const week = weeks[date.getDay()];
				return ` ${day}日 周${week}`;
			}
		},
		data() {
			return {
				weeks: ['一', '二', '三', '四', '五', '六', '日'],
				current: 1,
				currentYear: '',
				currentMonth: '',
				currentDate: '',
				days: [],
				weekMode: true,
				swiper: [0,1,2],
				selectedDate: ''
			};
		},
		methods: {
			changeSwp(e) {
				const pre = this.current;
				const current = e.target.current;
				this.current = current;
				if (current - pre === 1 || current - pre === -2) {
					this.daysNext();
				} else {
					this.daysPre();
				}
			},
			initDate(cur) {
				let date = ''
				if (cur) {
				  date = new Date(cur)
				} else {
					date = new Date()
				}
				this.currentDate = date.getDate()
				this.currentYear = date.getFullYear()
				this.currentMonth = date.getMonth() + 1
				this.currentWeek = date.getDay() === 0 ? 7 : date.getDay()
				const nowY = new Date().getFullYear()
				const nowM = new Date().getMonth() + 1
				const nowD = new Date().getDate()
				const nowW = new Date().getDay();
				this.days = [];
				let days = [];
				if (this.weekMode) {
					days = gegerateDates(date, 'week');
				} else {
					days = gegerateDates(date, 'month');
				}
				days.forEach(day => {
					const dot = this.dotList.find(item => {
						return dateEqual(item.date, day.fullDate);
					})
					if (dot) {
						day.info = dot;
					}
				})
				this.days = days;
				let obj = {
					start: '',
					end: ''
				};
				if (this.weekMode) {
					obj.start = this.days[0].time;
					obj.end = this.days[6].time
				} else {
					const start = new Date(this.currentYear, this.currentMonth - 1, 1);
					const end =  new Date(this.currentYear, this.currentMonth , 0);
					obj.start = start;
					obj.end = end;
				}
				this.$emit('days-change', obj)
			},
			daysPre() {
				this.selectedDate = '';
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1,this.currentDate);
					d.setDate(d.getDate() - 7);
					this.initDate(d);  
				} else {
					const d = new Date(this.currentYear, this.currentMonth -2, 1);
					this.initDate(d);
				}
				this.$emit('change-month', this.currentYear +'-' +  this.currentMonth);
			},
			daysNext() {
				this.selectedDate = '';
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1,this.currentDate);
					d.setDate(d.getDate() + 7);
					this.initDate(d);  
				} else {
					const d = new Date(this.currentYear, this.currentMonth, 1);
					this.initDate(d);
				}
				this.$emit('change-month', this.currentYear +'-' + this.currentMonth);
			},
			changeMode() {
				const premode = this.weekMode;
				let isweek = false;
				if (premode) {
					isweek = !!this.days.find(item => item.fullDate === this.selectedDate)
				}
				this.weekMode = !this.weekMode;
				let d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate)
				const sel = new Date(this.selectedDate.replace('-', '/').replace('-', '/'));
				const isMonth = sel.getFullYear() === this.currentYear && (sel.getMonth() + 1) === this.currentMonth;
				if ((this.selectedDate && isMonth) || isweek) {
					d = new Date(this.selectedDate.replace('-', '/').replace('-', '/'))
				}
				this.initDate(d)
			},
			clickItem(e) {
				this.selectedDate = e.fullDate;
				this.$emit('selected-change', e);
			},
			goback() {
				const d = new Date();
				this.initDate(d);
			},
		},
		created() {
			this.initDate();
		},
		mounted() {
		}
	}
</script>

<style lang="scss" scoped>
.zzx-calendar {
	width: 100%;
	height: auto;
	.calendar-heander {
		text-align: center;
		height: 60upx;
		line-height: 60upx;
		position: relative;
		font-size: 35upx;
		.today-tip {
			font-size: 35upx;
			color: #333333;
			margin-left: 0;
			cursor: pointer;
			user-select: none;
		}
	}
	.calendar-weeks {
		width: 100%;
		display: flex;
		flex-flow:row nowrap;
		height: 60upx;
		line-height: 60upx;
		justify-content: center;
		align-items: center;
		font-size: 35upx;
		.calendar-week {
			width: calc(100% / 7);
			height: 100%;
			text-align: center;
		}
	}
	swiper {
		width: 100%;
		height: 60upx;
	}
	.calendar-content {
		min-height: 60upx;
	}
	.calendar-swiper {       
		min-height: 70upx;
		transition: height ease-out 0.3s;
	}
	.calendar-item {
		margin: 0;
		padding: 0;
		height: 100%;
	}
	.calendar-days {
		display: flex;
		flex-flow: row wrap;
		width: 100%;
		height: 100%;
		overflow: hidden;
		font-size: 33upx;
	.calendar-day {
		width: calc(100% / 7);
		height: 70upx;
		text-align: center;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		padding-top: 4upx;
	}
	}
	.day-hidden {
		visibility: hidden;
	}
	.mode-change {
		display: flex;
		justify-content: center;
		margin-top:10upx;
		.mode-arrow-top {
			width: 0;
			height:0;
			border-left: 15upx solid transparent;
		    border-right: 15upx solid transparent;
		    border-bottom: 13upx solid #007aff;
		}
		.mode-arrow-bottom {
			width: 0;
			height:0;
			border-left: 15upx solid transparent;
			border-right: 15upx solid transparent;
			border-top: 13upx solid #007aff;
		}
	}
	.is-today {
		background: #ffffff;
		border-radius: 50%;
		color: #007aff;
		border: 2upx solid #007aff;
	}
	.is-checked {
		background: #007aff;
		color: #ffffff !important;
	}
	.date {
		width: 50upx;
		height: 50upx;
		line-height: 50upx;
		margin: 0 auto;
		border-radius: 50upx;
		position: relative;
		color: #666666;
	}
	.dot-show {
		margin-top:4upx;
		width: 10upx;
		height: 10upx;
		background: #c6c6c6;
		border-radius: 10upx;
	}
	.work-count {
		display: none;
	}
	.work-badge {
		position: absolute;
		top: -8upx;
		right: -8upx;
		min-width: 22upx;
		height: 22upx;
		padding: 0 4upx;
		background-color: #e91e63;
		color: #ffffff;
		font-size: 12upx;
		font-weight: 600;
		border-radius: 11upx;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		z-index: 10;
	}
	.badge-success {
		background-color: #4CAF50;
	}
	.badge-danger {
		background-color: #e91e63;
	}
	.badge-primary {
		background-color: #1899dc;
	}
}
</style>