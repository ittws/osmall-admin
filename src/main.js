import Vue from 'vue';
import iView from 'iview';
import 'babel-polyfill';
import VuePreview from 'vue-preview';
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import echarts from 'echarts';
import axios from 'axios';
import common from '@/common/common.js';
import dateutil from '@/common/dateutil.js';
import stringutil from '@/common/stringutil.js';
import VueClipboard from 'vue-clipboard2';
import env from '../build/env';

const ajaxUrl = env === 'development'
    ? 'http://127.0.0.1:8083'
    : env === 'production'
        ? 'https://www.url.com'
        : 'https://debug.url.com';

Vue.prototype.$http = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

Vue.prototype.$echarts = echarts;

Vue.prototype.common = common;
Vue.prototype.dateutil = dateutil;
Vue.prototype.stringutil = stringutil;

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(VuePreview);
Vue.use(VueClipboard);

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
