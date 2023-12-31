<template>
	<view
		class="cl-text"
		:class="[classList]"
		:style="{
			margin: parseRpx(margin),
			color,
			'font-size': '26rpx',
			'letter-spacing': parseRpx(letterSpacing),
			'-webkit-line-clamp': ellipsis,
		}"
		@tap="onTap"
	>
		<!-- 价格 -->
		<text class="cl-text__symbol--price" v-if="type == 'price'">￥</text>

		<!-- 前缀图标 -->
		<text class="cl-text__prefix-icon" v-if="prefixIcon">
			<cl-icon :name="prefixIcon" :size="fontSize"></cl-icon>
		</text>

		<text
			class="cl-text__value"
			:style="{
				fontSize,
			}"
			>{{ d.value }}</text
		>
		<text class="cl-text__precision" v-if="type == 'price' && precision"
			>.{{ d.precision }}</text
		>

		<!-- 后缀图标 -->
		<text class="cl-text__suffix-icon" v-if="suffixIcon">
			<cl-icon :name="suffixIcon" :size="fontSize"></cl-icon>
		</text>
	</view>
</template>

<script>
import { parseRpx } from "../../utils";

/**
 * text 文本
 * @description 多种文本展示，包括价格，手机号等等
 * @tutorial https://docs.cool-js.com/uni/components/basic/text.html
 * @property {String, Number} value 文本内容
 * @property {String} type 类型 (text | price | phone)
 * @property {Boolean} encrypt 手机号是否加密，默认true
 * @property {Boolean} bold 是否粗体
 * @property {Boolean} block 是否块状
 * @property {Number} ellipsis 文本超出省略
 * @property {String} color 字体颜色，默认#444
 * @property {Number, String} size 字体大小，默认24
 * @property {Boolean} precision 价格小数点，默认true
 * @property {Boolean} lineThrough 穿过文本下的一条线
 * @property {Boolean} underline 文本下的一条线
 * @property {String, Number} letterSpacing 文本水平间隔
 * @property {String, Number, Array} margin 外间距
 * @property {String} prefixIcon 前缀图标
 * @property {String} suffixIcon 后缀图标
 * @example <cl-text value="Hello, Cool uni" />
 */

export default {
	name: "cl-text",

	props: {
		// 绑定值
		value: [String, Number],
		// 类型：text | price | phone
		type: {
			type: String,
			default: "text",
		},
		// 是否加密
		encrypt: {
			type: Boolean,
			default: true,
		},
		// 是否粗体 500
		bold: Boolean,
		// 是否块状
		block: Boolean,
		// 文本超出省略
		ellipsis: Number,
		// 字体颜色
		color: {
			type: String,
			default: "#444",
		},
		// 字体大小
		size: {
			type: [String, Number],
			default: 28,//24
		},
		// 小数点：price 有效
		precision: {
			type: Boolean,
			default: true,
		},
		// 穿过文本下的一条线
		lineThrough: Boolean,
		// 文本下的一条线
		underline: Boolean,
		// 文本水平间隔
		letterSpacing: {
			type: [String, Number],
			default: 0,
		},
		// 外间距
		margin: [String, Number, Array],
		// 前缀图标
		prefixIcon: String,
		// 后缀图标
		suffixIcon: String,
	},

	computed: {
		d() {
			if (this.type == "price") {
				const [value, precision = "00"] = parseFloat(this.value || 0)
					.toFixed(2)
					.split(".");

				if (this.precision) {
					return {
						value,
						precision,
					};
				} else {
					return {
						value,
					};
				}
			} else if (this.type == "phone") {
				const str = String(this.value);

				return {
					value: this.encrypt ? str.substr(0, 3) + "****" + str.substr(7) : str,
				};
			} else {
				return {
					value: this.value,
				};
			}
		},

		fontSize() {
			return parseRpx(this.size);
		},

		classList() {
			let list = [];

			if (this.bold) {
				list.push("is-bold");
			}

			if (this.block) {
				list.push("is-block");
			}

			if (this.lineThrough) {
				list.push("is-line-through");
			}

			if (this.underline) {
				list.push("is-underline");
			}

			if (this.ellipsis > 0) {
				list.push("is-ellipsis");
			}

			if (this.type) {
				list.push(`is-${this.type}`);
			}

			if (this.color) {
				list.push(`is-color-${this.color}`);
			}

			return list.join(" ");
		},
	},

	methods: {
		parseRpx,

		onTap(e) {
			this.$emit("click", e);
			this.$emit("tap", e);
		},
	},
};
</script>
