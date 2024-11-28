<template>
  <view>
    <picker mode="multiSelector" :value="multiIndex" :range="multiRange" @change="onMultiChange">
      <view class="picker">
        <input type="text" :value="formattedDateTime" readonly />
        <text class="picker-label"></text>
      </view>
    </picker>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    defaultTime: {
      type: String,
      default: () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      }
    }
  },
  data() {
    const now = new Date();
    return {
      multiIndex: [
        now.getFullYear() - 1900,
        now.getMonth(),
        now.getDate() - 1,
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ],
      multiRange: this.getMultiRange()
    };
  },
  computed: {
    formattedDateTime() {
      const year = this.multiRange[0][this.multiIndex[0]];
      const month = String(this.multiRange[1][this.multiIndex[1]]).padStart(2, '0');
      const day = String(this.multiRange[2][this.multiIndex[2]]).padStart(2, '0');
      // const hour = String(this.multiRange[3][this.multiIndex[3]]).padStart(2, '0');
      // const minute = String(this.multiRange[4][this.multiIndex[4]]).padStart(2, '0');
      // const second = String(this.multiRange[5][this.multiIndex[5]]).padStart(2, '0');

      // return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
	  return `${year}-${month}-${day}`;
    }
  },
  methods: {
    getMultiRange() {
      let yearRange = [];
      let monthRange = [];
      let dayRange = [];
      let hourRange = [];
      let minuteRange = [];
      let secondRange = [];
      
      for (let i = 1900; i <= 2100; i++) yearRange.push(i);
      for (let i = 1; i <= 12; i++) monthRange.push(i);
      for (let i = 1; i <= 31; i++) dayRange.push(i);
      // for (let i = 0; i <= 23; i++) hourRange.push(i);
      // for (let i = 0; i <= 59; i++) minuteRange.push(i);
      // for (let i = 0; i <= 59; i++) secondRange.push(i);
      
      // return [yearRange, monthRange, dayRange, hourRange, minuteRange, secondRange];
	  return [yearRange, monthRange, dayRange];
    },
    onMultiChange(e) {
      this.multiIndex = e.detail.value;
      this.$emit('input', this.formattedDateTime);
    }
  },
  watch: {
    value(newValue) {
      const dateParts = newValue.split(/[- :]/);
      if (dateParts.length === 6) {
        this.multiIndex = [
          parseInt(dateParts[0]) - 1900,
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2]) - 1,
          // parseInt(dateParts[3]),
          // parseInt(dateParts[4]),
          // parseInt(dateParts[5])
        ];
      }
    }
  }
};
</script>

<style>
.picker {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer; /* 使其看起来像可点击的按钮 */
}
input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0;
}
.picker-label {
  margin-left: 10px;
  color: #007BFF; /* 可选：设置文字颜色 */
}
</style>