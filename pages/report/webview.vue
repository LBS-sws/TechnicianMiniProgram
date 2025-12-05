<template>
    <view class="page">
        <view class="top-bar">
            <u-button type="primary" text="下载PDF" @click="exportPdf"></u-button>
        </view>
        <view class="u-content">
            <web-view v-if="useWebview" :src="webviewUrl" style="height: 100vh;"></web-view>
            <scroll-view v-else scroll-x scroll-y style="height: calc(100vh - 120rpx);">
                <u-parse v-if="htmlContent" :content="htmlContent" :domain="domain"></u-parse>
                <view v-else style="padding: 50rpx; text-align: center; color: #999;">
                    加载中...
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    import { BASE_URL, BASE_URL_IMGS } from '@/common/config'
    export default {
        data() {
            return {
                webviewUrl: '',
                htmlContent: '',
                domain: '',
                jobid: '',
                jobtype: '',
                useWebview: false
            }
        },
        onLoad(options) {
            const webBase = BASE_URL.replace(/\/api\/?$/, '')
            this.domain = BASE_URL_IMGS || webBase
            
            if (options.url) {
                this.webviewUrl = decodeURIComponent(options.url)
                this.useWebview = true
            } else if (options.local) {
                const content = uni.getStorageSync('preview_html');
                if (content) {
                    this.htmlContent = content;
                }
            }
            this.jobid = options.jobid || ''
            this.jobtype = options.jobtype || ''
        },
        methods: {
            exportPdf() {
                const p = { preview: 1 }
                if (this.jobid && this.jobtype) {
                    p.job_id = this.jobid
                    p.job_type = this.jobtype
                } else if (this.webviewUrl) {
                    try {
                        const full = decodeURIComponent(this.webviewUrl)
                        const domain = (BASE_URL_IMGS || this.domain || BASE_URL.replace(/\/api\/?$/, ''))
                        const htmlPath = domain && full.startsWith(domain) ? full.replace(domain, '') : full
                        if (htmlPath) p.html_url = htmlPath.split('?')[0]
                    } catch(e) {}
                }
                uni.showLoading({ title: '生成中...' })
                this.$api.htmlToPdf(p).then(res => {
                    uni.hideLoading()
                    if (typeof res === 'string') {
                        try {
                            const obj = JSON.parse(res)
                            if (obj && obj.code === 200 && obj.data && obj.data.pdf_url) {
                                const fileUrl = (BASE_URL_IMGS || BASE_URL.replace(/\/api\/?$/, '')) + obj.data.pdf_url + '?t=' + Date.now()
                                uni.downloadFile({ url: fileUrl, success: r => { uni.openDocument({ filePath: r.tempFilePath, showMenu: true, fileType: 'pdf' }) } })
                                return
                            }
                        } catch (e) {}
                    }
                    if (res && res.code === 200 && res.data && res.data.pdf_url) {
                        const fileUrl = (BASE_URL_IMGS || BASE_URL.replace(/\/api\/?$/, '')) + res.data.pdf_url + '?t=' + Date.now()
                        uni.downloadFile({ url: fileUrl, success: r => { uni.openDocument({ filePath: r.tempFilePath, showMenu: true, fileType: 'pdf' }) } })
                        return
                    }
                    uni.showToast({ title: '生成失败', icon: 'none' })
                }).catch(err => {
                    uni.hideLoading()
                    uni.showToast({ title: '请求失败', icon: 'none' })
                })
            }
        }
    }
</script>

<style scoped>
.page { 
    display: flex; 
    flex-direction: column; 
    min-height: 100vh; 
    background: #fff;
}

.top-bar { 
    padding: 20rpx; 
    background: #fff; 
    box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.04);
    z-index: 10;
}

.u-content { 
    background-color: #fff; 
    flex: 1;
    overflow: hidden;
}

/* web-view 容器样式优化 */
:deep(.web-view-container) {
    height: 100% !important;
}
</style>
