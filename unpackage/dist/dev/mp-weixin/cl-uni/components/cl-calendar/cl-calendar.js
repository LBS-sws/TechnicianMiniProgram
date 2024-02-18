(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["cl-uni/components/cl-calendar/cl-calendar"],{

/***/ 694:
/*!********************************************************************************************************!*\
  !*** D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/cl-uni/components/cl-calendar/cl-calendar.vue ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cl-calendar.vue?vue&type=template&id=21ab87fe& */ 695);
/* harmony import */ var _cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cl-calendar.vue?vue&type=script&lang=js& */ 697);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs




/* normalize component */

var component = Object(_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__["render"],
  _cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "cl-uni/components/cl-calendar/cl-calendar.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 695:
/*!***************************************************************************************************************************************!*\
  !*** D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/cl-uni/components/cl-calendar/cl-calendar.vue?vue&type=template&id=21ab87fe& ***!
  \***************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./cl-calendar.vue?vue&type=template&id=21ab87fe& */ 696);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_template_id_21ab87fe___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 696:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/cl-uni/components/cl-calendar/cl-calendar.vue?vue&type=template&id=21ab87fe& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    clPopup: function () {
      return Promise.all(/*! import() | cl-uni/components/cl-popup/cl-popup */[__webpack_require__.e("common/vendor"), __webpack_require__.e("cl-uni/components/cl-popup/cl-popup")]).then(__webpack_require__.bind(null, /*! @/cl-uni/components/cl-popup/cl-popup.vue */ 710))
    },
    clIcon: function () {
      return Promise.all(/*! import() | cl-uni/components/cl-icon/cl-icon */[__webpack_require__.e("common/vendor"), __webpack_require__.e("cl-uni/components/cl-icon/cl-icon")]).then(__webpack_require__.bind(null, /*! @/cl-uni/components/cl-icon/cl-icon.vue */ 501))
    },
    clRow: function () {
      return Promise.all(/*! import() | cl-uni/components/cl-row/cl-row */[__webpack_require__.e("common/vendor"), __webpack_require__.e("cl-uni/components/cl-row/cl-row")]).then(__webpack_require__.bind(null, /*! @/cl-uni/components/cl-row/cl-row.vue */ 456))
    },
    clCol: function () {
      return Promise.all(/*! import() | cl-uni/components/cl-col/cl-col */[__webpack_require__.e("common/vendor"), __webpack_require__.e("cl-uni/components/cl-col/cl-col")]).then(__webpack_require__.bind(null, /*! @/cl-uni/components/cl-col/cl-col.vue */ 461))
    },
    clButton: function () {
      return __webpack_require__.e(/*! import() | cl-uni/components/cl-button/cl-button */ "cl-uni/components/cl-button/cl-button").then(__webpack_require__.bind(null, /*! @/cl-uni/components/cl-button/cl-button.vue */ 600))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var f0 = _vm._f("format_date")(_vm.date)
  var l1 = _vm.__map(_vm.table, function (tr, index) {
    var $orig = _vm.__get_orig(tr)
    var l0 = _vm.__map(tr, function (td, __i0__) {
      var $orig = _vm.__get_orig(td)
      var m0 = _vm.isStart(td)
      var m1 = _vm.isEnd(td)
      var m2 = _vm.isThrough(td)
      return {
        $orig: $orig,
        m0: m0,
        m1: m1,
        m2: m2,
      }
    })
    return {
      $orig: $orig,
      l0: l0,
    }
  })
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        f0: f0,
        l1: l1,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 697:
/*!*********************************************************************************************************************************!*\
  !*** D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/cl-uni/components/cl-calendar/cl-calendar.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./cl-calendar.vue?vue&type=script&lang=js& */ 698);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_cl_calendar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 698:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/cl-uni/components/cl-calendar/cl-calendar.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _utils = __webpack_require__(/*! ../../utils */ 36);
var _dayjs = _interopRequireDefault(__webpack_require__(/*! ../../utils/dayjs */ 699));
var _calendar = _interopRequireDefault(__webpack_require__(/*! ./calendar */ 700));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/**
 * calendar 日历
 * @description 支持单选，多选，自定义日期
 * @tutorial https://docs.cool-js.com/uni/components/advanced/calendar.html
 * @property {String, Array} value 绑定值
 * @property {String} type 类型 date | daterange，默认date
 * @property {String} title 标题
 * @property {Array} customList 自定义列表
 * @property {Boolean} lunar 是否显示农历
 * @event {Function} change 值改变时触发
 * @event {Function} cancel 取消时时触发
 * @example <cl-calendar ref="calendar" v-model="date" />
 */
var _default2 = {
  name: "cl-calendar",
  props: {
    // 绑定值
    value: [String, Array],
    // 类型
    type: {
      type: String,
      default: "date" // date | daterange
    },

    // 标题
    title: {
      type: String,
      default: "选择日期"
    },
    // 自定义列表
    customList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    // 是否显示农历
    lunar: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      // 是否可见
      visible: false,
      // 表格数据
      table: [],
      // 当前日期
      date: null,
      // 选择数据
      selects: {
        // 多选下开始日期
        start: null,
        // 多选下结束日期
        end: null
      }
    };
  },
  filters: {
    format_date: function format_date(val, fmt) {
      return val ? (0, _dayjs.default)(val).format(fmt || "YYYY年MM月") : "";
    }
  },
  computed: {
    isConfirm: function isConfirm() {
      switch (this.type) {
        case "date":
          return this.selects.start;
        case "daterange":
          return this.selects.start && this.selects.end;
        default:
          return false;
      }
    }
  },
  methods: {
    // 打开
    open: function open() {
      var _this = this;
      this.visible = true;
      this.$nextTick(function () {
        // 绑定值
        var date = _this.value;

        // 设置年月
        var start = null;
        var end = null;
        if ((0, _utils.isArray)(date)) {
          start = date[0];
          end = date[1];
        } else if ((0, _utils.isString)(date)) {
          start = date;
        }
        if (start) {
          _this.date = (0, _dayjs.default)(start).format("YYYY-MM-DD");
        } else {
          _this.date = (0, _dayjs.default)().format("YYYY-MM-DD");
        }

        // 设置表格
        _this.setTable();

        // 找到对应的日期
        _this.selects.start = _this.findDate(start);
        if ((0, _utils.isArray)(date)) {
          _this.selects.end = _this.findDate(end);
        }
      });
    },
    // 关闭
    close: function close() {
      this.visible = false;
    },
    // 取消
    cancel: function cancel() {
      this.close();
      this.$emit("cancel");
    },
    // 确定选择
    confirm: function confirm() {
      var _this$selects = this.selects,
        start = _this$selects.start,
        end = _this$selects.end;
      if (this.type == "date") {
        this.$emit("input", start.date);
        this.$emit("change", start);
      } else if (this.type == "daterange") {
        this.$emit("input", [start.date, end.date]);
        this.$emit("change", [start, end]);
      }
      this.close();
    },
    // 回到今天
    toToday: function toToday() {
      this.setDate();
    },
    // 上一个月
    prevMonth: function prevMonth() {
      this.date = (0, _dayjs.default)(this.date).subtract(1, "month").format("YYYY-MM");
      this.setTable();
    },
    // 下一个月
    nextMonth: function nextMonth() {
      this.date = (0, _dayjs.default)(this.date).add(1, "month").format("YYYY-MM");
      this.setTable();
    },
    // 选择日期
    selectDate: function selectDate(item) {
      if (item.disabled) {
        return false;
      }
      if (this.selects.start && this.selects.start.index == item.index) {
        return false;
      }

      // 日期多选
      if (this.type == "daterange") {
        if (this.selects.start && this.selects.end) {
          this.selects.start = item;
          this.selects.end = null;
        } else {
          if (!this.selects.start) {
            this.selects.start = item;
          } else if (!this.selects.end) {
            this.selects.end = item;
          }
        }

        // 调整开始和结束的位置
        if (this.selects.start && this.selects.end) {
          if ((0, _dayjs.default)(this.selects.end.date).isBefore(this.selects.start.date)) {
            var d = this.selects.start;
            this.selects.start = this.selects.end;
            this.selects.end = d;
          }
        }
      }
      // 日期单选
      else if (this.type == "date") {
        this.selects.start = item;
      }
    },
    // 设置表格
    setTable: function setTable() {
      var _this2 = this;
      // 月初是周几
      var day = (0, _dayjs.default)(this.date).date(1).day();
      var start = day == 0 ? 6 : day - 1;

      // 本月天数
      var days = (0, _dayjs.default)(this.date).endOf("month").format("D");

      // 上个月天数
      var prevDays = (0, _dayjs.default)(this.date).endOf("month").subtract(1, "month").format("D");

      // 日期数据
      var arr = [];
      // 清空表格
      this.table = [];

      // 添加上月数据
      arr.push.apply(arr, (0, _toConsumableArray2.default)(new Array(start).fill(1).map(function (e, i) {
        var day = prevDays - start + i + 1;
        return {
          value: day,
          disabled: true,
          date: (0, _dayjs.default)(_this2.date).subtract(1, "month").date(day).format("YYYY-MM-DD")
        };
      })));

      // 添加本月数据
      arr.push.apply(arr, (0, _toConsumableArray2.default)(new Array(days - 0).fill(1).map(function (e, i) {
        var day = i + 1;
        return {
          value: day,
          date: (0, _dayjs.default)(_this2.date).date(day).format("YYYY-MM-DD")
        };
      })));

      // 添加下个月
      arr.push.apply(arr, (0, _toConsumableArray2.default)(new Array(42 - days - start).fill(1).map(function (e, i) {
        var day = i + 1;
        return {
          value: day,
          disabled: true,
          date: (0, _dayjs.default)(_this2.date).add(1, "month").date(day).format("YYYY-MM-DD")
        };
      })));

      // 分割数组
      var _loop = function _loop(n) {
        _this2.table.push(arr.slice(n, n + 7).map(function (e, i) {
          e.index = i + n;

          // 自定义信息
          var custom = _this2.customList.find(function (c) {
            return c.date == e.date;
          });

          // 农历
          if (_this2.lunar) {
            var _this2$getLunar = _this2.getLunar(e.date),
              IDayCn = _this2$getLunar.IDayCn,
              IMonthCn = _this2$getLunar.IMonthCn;
            e.lunar = IDayCn == "初一" ? IMonthCn : IDayCn;
          }
          return _objectSpread(_objectSpread({}, e), custom);
        }));
      };
      for (var n = 0; n < arr.length; n += 7) {
        _loop(n);
      }
    },
    // 设置日期
    setDate: function setDate(date) {
      this.date = date || (0, _dayjs.default)().format("YYYY-MM-DD");
      this.setTable();
      this.selects.start = this.findDate(this.date);
      this.selects.end = null;
    },
    // 从表格找日期
    findDate: function findDate(date) {
      var d = null;
      this.table.forEach(function (tr) {
        tr.forEach(function (td) {
          if (td.date == date) {
            d = td;
          }
        });
      });
      return d;
    },
    // 获取农历
    getLunar: function getLunar(date) {
      var _date$split = date.split("-"),
        _date$split2 = (0, _slicedToArray2.default)(_date$split, 3),
        year = _date$split2[0],
        month = _date$split2[1],
        day = _date$split2[2];
      return _calendar.default.solar2lunar(year, month, day);
    },
    // 选择开始
    isStart: function isStart(_ref) {
      var disabled = _ref.disabled,
        date = _ref.date;
      return disabled ? false : this.selects.start ? (0, _dayjs.default)(date).isSame(this.selects.start.date) : false;
    },
    // 选择结束
    isEnd: function isEnd(_ref2) {
      var disabled = _ref2.disabled,
        date = _ref2.date;
      return disabled ? false : this.selects.end ? (0, _dayjs.default)(date).isSame(this.selects.end.date) : false;
    },
    // 选择路径
    isThrough: function isThrough(_ref3) {
      var disabled = _ref3.disabled,
        date = _ref3.date;
      if (disabled) {
        return false;
      }
      if (this.selects.start && this.selects.end) {
        return (0, _dayjs.default)(date).add(1, "second").isAfter(this.selects.start.date) && (0, _dayjs.default)(date).subtract(1, "second").isBefore(this.selects.end.date);
      }
    }
  }
};
exports.default = _default2;

/***/ })

}]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/cl-uni/components/cl-calendar/cl-calendar.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'cl-uni/components/cl-calendar/cl-calendar-create-component',
    {
        'cl-uni/components/cl-calendar/cl-calendar-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('2')['createComponent'](__webpack_require__(694))
        })
    },
    [['cl-uni/components/cl-calendar/cl-calendar-create-component']]
]);
