axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'
    // 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么

    //获取本地存储个人信息  token 令牌
    const token = localStorage.getItem('token') || '';
    //判断发送请求之前是否有 /my开头的请求路径
    //如果有,手动添加 headers请求头
    if (config.url.startsWith('/my')) {
        //headers 是即将被发送的自定义请求头   给全局请求添加token密钥
        config.headers.Authorization = token
    }
    return config;
}, function(error) {
    // 对响应数据做点什么
    return Promise.reject(error);
});

// 添加全局响应拦截器
axios.interceptors.response.use(function(response) {

    const { message, status } = response.data
        //判断身份验证是否成功
    if (message == '验证失败!' && status == 1) {
        //清除本地存储的 token
        localStorage.removeItem('token')
            //跳转到登录页面
        location.href = './login.html'
    }
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});