import axios from 'axios';
import Loading from '../components/loading.vue'
import {createApp, h} from 'vue';

const request = axios.create({
    baseURL: 'https://api.openai.com/v1/chat/completions',
    headers: {
        'Content-Type': 'application/json',
    },
});
// 创建 loading 实例
const loading = {
    show() {
        // 创建 div 元素
        const div = document.createElement('div');
        // 将 div 元素挂载到 body 元素
        document.body.appendChild(div);
        // 创建应用程序实例
        const app = createApp({
            render() {
                return h(Loading, {
                    visible: true
                });
            }
        });
        // 挂载应用程序实例
        app.mount(div);
        // 保存 div 元素和应用程序实例
        this.div = div;
        this.app = app;
    },
    hide() {
        // 取消应用程序实例的挂载
        this.app.unmount();
        // 从 DOM 中删除 div 元素
        document.body.removeChild(this.div);
    }
};


// 添加请求拦截器
request.interceptors.request.use(
    (config) => {
        // 显示加载中状态
        loading.show();
        return config;
    },
    (error) => {
        // 处理请求错误
        return Promise.reject(error);
    }
);

// 添加响应拦截器
request.interceptors.response.use(
    (response) => {
        // 取消加载中状态
        loading.hide();
        return response;
    },
    (error) => {
        // 处理响应错误
        loading.hide();
        return Promise.reject(error);
    }
);

export default request;
