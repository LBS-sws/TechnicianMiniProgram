(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/service/add_photo"],{

/***/ 370:
/*!*********************************************************************************************************!*\
  !*** D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/main.js?{"page":"pages%2Fservice%2Fadd_photo"} ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _add_photo = _interopRequireDefault(__webpack_require__(/*! ./pages/service/add_photo.vue */ 371));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_add_photo.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 371:
/*!**************************************************************************************!*\
  !*** D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/pages/service/add_photo.vue ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add_photo.vue?vue&type=template&id=138e7bde& */ 372);
/* harmony import */ var _add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./add_photo.vue?vue&type=script&lang=js& */ 374);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _add_photo_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./add_photo.vue?vue&type=style&index=0&lang=scss& */ 377);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__["render"],
  _add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/service/add_photo.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 372:
/*!*********************************************************************************************************************!*\
  !*** D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/pages/service/add_photo.vue?vue&type=template&id=138e7bde& ***!
  \*********************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add_photo.vue?vue&type=template&id=138e7bde& */ 373);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_template_id_138e7bde___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 373:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/pages/service/add_photo.vue?vue&type=template&id=138e7bde& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    clIcon: function () {
      return Promise.all(/*! import() | cl-uni/components/cl-icon/cl-icon */[__webpack_require__.e("common/vendor"), __webpack_require__.e("cl-uni/components/cl-icon/cl-icon")]).then(__webpack_require__.bind(null, /*! @/cl-uni/components/cl-icon/cl-icon.vue */ 501))
    },
    clConfirm: function () {
      return __webpack_require__.e(/*! import() | cl-uni/components/cl-confirm/cl-confirm */ "cl-uni/components/cl-confirm/cl-confirm").then(__webpack_require__.bind(null, /*! @/cl-uni/components/cl-confirm/cl-confirm.vue */ 490))
    },
    mUpload: function () {
      return Promise.all(/*! import() | components/m-upload/m-upload */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/m-upload/m-upload")]).then(__webpack_require__.bind(null, /*! @/components/m-upload/m-upload.vue */ 658))
    },
    ldSelect: function () {
      return __webpack_require__.e(/*! import() | components/ld-select/ld-select */ "components/ld-select/ld-select").then(__webpack_require__.bind(null, /*! @/components/ld-select/ld-select.vue */ 526))
    },
    clTextarea: function () {
      return Promise.all(/*! import() | cl-uni/components/cl-textarea/cl-textarea */[__webpack_require__.e("common/vendor"), __webpack_require__.e("cl-uni/components/cl-textarea/cl-textarea")]).then(__webpack_require__.bind(null, /*! @/cl-uni/components/cl-textarea/cl-textarea.vue */ 535))
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
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 374:
/*!***************************************************************************************************************!*\
  !*** D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/pages/service/add_photo.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add_photo.vue?vue&type=script&lang=js& */ 375);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 375:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/pages/service/add_photo.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fuzzyQuery = exports.default = void 0;
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var ldSelect = function ldSelect() {
  __webpack_require__.e(/*! require.ensure | components/ld-select/ld-select */ "components/ld-select/ld-select").then((function () {
    return resolve(__webpack_require__(/*! @/components/ld-select/ld-select.vue */ 526));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var newUpload = function newUpload() {
  Promise.all(/*! require.ensure | components/new-upload/new-upload */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/new-upload/new-upload")]).then((function () {
    return resolve(__webpack_require__(/*! @/components/new-upload/new-upload.vue */ 677));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    ldSelect: ldSelect,
    newUpload: newUpload
  },
  data: function data() {
    return {
      name: '新增工作照',
      noClick: true,
      upload_site_photos: [],
      site_photos: '',
      remarks: [],
      tablename: "photos",
      id: '',
      jobid: '',
      jobtype: '',
      shortcut_type: '',
      service_type: '',
      shortcuts: [],
      shortcutsOld: [],
      custInfo: {},
      search_key: '',
      timer: null,
      len: false,
      percent: 0,
      // showProgress:false,
      imageNum: -1,
      upPicUrl: "".concat(this.$baseUrl, "/Upload.Upload/image"),
      init_photos: [],
      headerUpload: {
        'token': uni.getStorageSync('token')
      },
      type: 0,
      formData: {
        type: 0
      }
    };
  },
  onLoad: function onLoad(index) {
    var loginRes = this.checkLogin();
    if (!loginRes) {
      uni.showToast({
        title: "请先登录",
        icon: 'none'
      });
      setTimeout(function () {
        return false;
      }, 2000);
    }
    this.id = index.id;
    this.jobid = index.jobid;
    this.jobtype = index.jobtype;
    this.shortcut_type = index.shortcut_type;
    this.service_type = index.service_type;
    if (this.id > 0) {
      this.getItem();
    }
    // 设置预览图片
    // this.$nextTick(() => {
    // 	this.$refs.upload3.setItems(this.init_photos);
    // })

    // 获取快捷语
    this.getshortcuts();
    console.log("".concat(this.$baseUrl));
  },
  methods: {
    /**
     *搜索开始
     * *
     */
    inputFun: function inputFun(data) {
      var _this = this;
      this.search_key = data.value;
      this.clearTimer();
      if (this.search_key && this.search_key.length > 0) {
        this.timer = setTimeout(function () {
          var result = fuzzyQuery(_this.shortcuts, _this.search_key, 'value'); // 数组、搜索值、字段
          _this.shortcuts = result;
        }, 500);
      } else {
        // 恢复原来值
        this.shortcuts = this.shortcutsOld;
      }
    },
    clearTimer: function clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    /**
     *搜索结束
     * *
     */
    getCache: function getCache(name) {
      //获取缓存数据
      var data = uni.getStorageSync(name);
      if (data) {
        if (isJsonString(data)) {
          //json字符串转对象
          return JSON.parse(data);
        }
        return data;
      }
      return null;
    },
    selectChange: function selectChange(val) {
      this.remarks = val;
    },
    // 详情
    getItem: function getItem() {
      var _this2 = this;
      var that = this;
      var param = {
        id: this.id
      };
      uni.request({
        url: "".concat(this.$baseUrl, "/SiteWorkPhotos.SiteWorkPhotos/getSiteWorkPhotosInfo"),
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': uni.getStorageSync('token')
        },
        method: 'GET',
        data: param,
        success: function success(res) {
          if (res.data.code == 200) {
            if (res.data.data) {
              var _res$data$data$site_p;
              // console.log(res.data.data)

              var strArr = (_res$data$data$site_p = res.data.data.site_photos) !== null && _res$data$data$site_p !== void 0 ? _res$data$data$site_p : [];
              if (strArr.length > 0) {
                strArr.forEach(function (item, i) {
                  var imgurl = '/' + item;
                  imgurl.replace(/\"/g, "").replace(/[\\]/g, '');
                  _this2.init_photos[i] = imgurl;
                });
                _this2.$refs.upload3.setItems(_this2.init_photos);
              }
              that.remarks = res.data.data.remarks;
            }
          } else {
            if (res.data.code == 400) {
              uni.$utils.toast(res.data.msg);
              return false;
            }
          }
        },
        fail: function fail(err) {
          console.log(res);
        }
      });
    },
    onBeforeUpload: function onBeforeUpload(file, index) {
      // 受支持的图片格式
      // const fileType = ['image/png', 'image/jpeg'];
      // 受支持的图片大小
      // if (file.size / 1000 > 51.2) {
      //     uni.showToast({icon:'none',title:`图片大小不能大于50K`});
      //     return false;
      // }
      // if (fileType.indexOf(fileType) === -1) {
      //     uni.showToast({icon:'none',title:`仅支持${fileType.join('、').replace(/image\//g, '')}图片格式`});
      //     return false;
      // }
    },
    handleChange3: function handleChange3() {
      this.$refs.upload3.upload();
    },
    // 获取上传或者预览后的图片
    handleLoaded3: function handleLoaded3(arr) {
      console.log("获取上传或者预览后的图片：");
      console.log(arr);
      var imageStr = "";
      for (var i = 0; i < arr.length; i++) {
        imageStr += arr[i].result + ",";
      }
      //去掉最后一个逗号
      if (imageStr.length > 0) {
        imageStr = imageStr.substr(0, imageStr.length - 1);
      }
      // console.log(imageStr);
      this.upload_site_photos = imageStr;
    },
    //查询快捷语
    getshortcuts: function getshortcuts() {
      var _this3 = this;
      var params = {
        job_type: this.jobtype,
        job_id: this.jobid
      };
      uni.request({
        url: "".concat(this.$baseUrl, "/SiteWorkPhotos.SiteWorkPhotos/getShortcutContents"),
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': uni.getStorageSync('token')
        },
        method: 'GET',
        data: params,
        success: function success(res) {
          if (res.data.code == 200) {
            // console.log(res.data.data)

            var shortcuts = res.data.data;
            var shortcutsArr = [];
            shortcuts.forEach(function (item, i) {
              shortcutsArr.push({
                label: item.content,
                value: item.content
              });
            });
            // console.log(shortcutsArr)

            _this3.shortcuts = shortcutsArr;
            _this3.shortcutsOld = shortcutsArr;
          } else {
            uni.showToast({
              title: res.msg
            });
          }
        },
        fail: function fail(err) {
          console.log(res);
        }
      });
    },
    // 删除
    del: function del() {
      var _this4 = this;
      this.$refs["del_confirm"].open({
        title: "提示",
        message: "确认删除？",
        callback: function callback(_ref) {
          var action = _ref.action;
          if (action == 'confirm') {
            var param = {
              id: _this4.id
            };
            uni.request({
              url: "".concat(_this4.$baseUrl, "/SiteWorkPhotos.SiteWorkPhotos/delSiteWorkPhotos"),
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': uni.getStorageSync('token')
              },
              method: 'DELETE',
              data: param,
              success: function success(res) {
                if (res.data.code == 200) {
                  uni.showToast({
                    icon: 'none',
                    title: '删除成功'
                  });
                  setTimeout(function () {
                    uni.redirectTo({
                      url: "/pages/service/photo?jobid=" + _this4.jobid + '&jobtype=' + _this4.jobtype
                    });
                  }, 1000);
                }
              },
              fail: function fail(err) {
                console.log(res);
              }
            });
          } else {
            uni.showToast({
              icon: 'none',
              title: '取消成功'
            });
          }
        }
      });
    },
    // 添加
    add: function add() {
      var _this5 = this;
      if (this.upload_site_photos == '' || this.upload_site_photos == undefined || this.upload_site_photos.length == 0) {
        uni.showToast({
          icon: 'none',
          title: "\u6CA1\u9009\u62E9\u5DE5\u4F5C\u7167(\u2299_\u2299)?"
        });
        return false;
      }
      var param = {
        job_id: this.jobid,
        job_type: this.jobtype,
        site_photos: this.upload_site_photos,
        remarks: this.remarks
      };
      uni.showLoading({
        title: '正在保存'
      });
      var log = __webpack_require__(/*! log.js */ 376);
      log.info('点击了保存现场工作照。。。');
      log.info('param', param);
      uni.request({
        url: "".concat(this.$baseUrl, "/SiteWorkPhotos.SiteWorkPhotos/addSiteWorkPhotos"),
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': uni.getStorageSync('token')
        },
        method: 'POST',
        data: param,
        success: function success(res) {
          if (res.data.code == 200) {
            if (res.data.data) {
              log.info('保存现场工作照-成功');
              log.info('param', param);
              _this5.id = res.data.data;
              _this5.del_index = [];
              uni.hideLoading();
              uni.showToast({
                title: '保存成功'
              });
              setTimeout(function () {
                uni.redirectTo({
                  url: "/pages/service/photo?jobid=" + _this5.jobid + '&jobtype=' + _this5.jobtype
                });
              }, 100);
            }
          } else {
            uni.$utils.toast(res.data.msg);
            return false;
          }
        },
        fail: function fail(err) {
          uni.showToast({
            icon: 'error',
            title: err.errMsg
          });
          setTimeout(function () {
            uni.hideLoading();
          }, 2000);
        }
      });
    },
    // 保存
    save: function save() {
      var _this6 = this;
      //保存信息
      console.log("保存图片信息：");
      if (this.upload_site_photos == '' || this.upload_site_photos == undefined || this.upload_site_photos.length == 0) {
        uni.showToast({
          icon: 'none',
          title: "\u6CA1\u9009\u62E9\u5DE5\u4F5C\u7167(\u2299_\u2299)?"
        });
        return false;
      }

      // this.upload_site_photos = this.upload_site_photos.split(',').filter(item => item !== 'undefined').join(',');
      var param = {
        id: this.id,
        site_photos: this.upload_site_photos,
        remarks: this.remarks
      };
      uni.showLoading({
        title: '正在保存'
      });
      var log = __webpack_require__(/*! log.js */ 376);
      log.info('点击了保存现场工作照。。。');
      log.info('param', param);
      uni.request({
        url: "".concat(this.$baseUrl, "/SiteWorkPhotos.SiteWorkPhotos/editSiteWorkPhotos"),
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': uni.getStorageSync('token')
        },
        method: 'PUT',
        data: param,
        success: function success(res) {
          if (res.data.code == 200) {
            if (res.data.data) {
              log.info('保存现场工作照-成功');
              log.info('param', param);
              _this6.id = res.data.data;
              _this6.del_index = [];
              uni.hideLoading();
              uni.showToast({
                title: '保存成功'
              });
              setTimeout(function () {
                uni.redirectTo({
                  url: "/pages/service/photo?jobid=" + _this6.jobid + '&jobtype=' + _this6.jobtype
                });
              }, 1000);
            }
          } else {
            uni.$utils.toast(res.data.msg);
            return false;
          }
        },
        fail: function fail(err) {
          uni.showToast({
            icon: 'error',
            title: err.errMsg
          });
          setTimeout(function () {
            uni.hideLoading();
          }, 2000);
        }
      });
    }
  }
}; // 快捷语搜索
exports.default = _default;
var fuzzyQuery = function fuzzyQuery(list, keyWord) {
  var attribute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'value';
  var reg = new RegExp(keyWord);
  var arr = [];
  for (var i = 0; i < list.length; i++) {
    if (reg.test(list[i][attribute])) {
      arr.push(list[i]);
    }
  }
  return arr;
};
exports.fuzzyQuery = fuzzyQuery;
var isJsonString = function isJsonString(str) {
  // 判断字符串是否是json字符串
  try {
    var toObj = JSON.parse(str);
    if (toObj && (0, _typeof2.default)(toObj) === 'object') {
      return true;
    }
  } catch (_unused) {}
  return false;
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 377:
/*!************************************************************************************************************************!*\
  !*** D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/pages/service/add_photo.vue?vue&type=style&index=0&lang=scss& ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./add_photo.vue?vue&type=style&index=0&lang=scss& */ 378);
/* harmony import */ var _HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_add_photo_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 378:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/phpstudy_pro/WWW/qianduan/TechnicianMiniProgram/pages/service/add_photo.vue?vue&type=style&index=0&lang=scss& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[370,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/service/add_photo.js.map