$(function() {
    //从layui提取form表单模块
    const { form } = layui
    $('.link a').click(function() {
        //从有到无从无到有
        $('.layui-form').toggle()
        console.log(123);
    });
    //校验表单项
    form.verify({
            pass: [
                /^\w{6,12}$/,
                '密码只能在6到12位之间'
            ],
            samePass: function(value) { //value表示表单的值
                //两个表单的值不一致
                if (value !== $('#pass').val()) {
                    return '两次密码输入不一致'
                }
            }
        })
        //注册功能
    $('.reg-form').submit(function(e) {
        e.preventDefault();
        //发送ajax
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('注册失败!')
                }
                layer.msg('注册成功')
                $('.reg-form a').click()
            })
    });
    //登录功能
    $('.login-form').submit(function(e) {
        e.preventDefault();
        //发送ajax
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res);
                //判断校验是否请求成功
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }
                //存储到本地
                localStorage.setItem('token', res.token)
                    //提示登录成功
                layer.msg('登录成功')
                    //跳转到首页
                location.href = './index.html'
            });
    })
})