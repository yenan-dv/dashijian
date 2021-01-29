$(function() {
    const { layer } = layui
    //获取用户的个人信息
    function getUserInfo() {
        //发送axios请求
        axios({
            url: '/my/userinfo',
        }).then(res => {
            console.log(res);
            //请求失败
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败!')
            }
            const { data } = res
            //渲染用户信息
            //1获取用户名
            const name = data.nickname || data.username;
            //2渲染名称
            $('.nickname').text(`欢迎${name}`).show();
            //3渲染头像
            if (data.user_pic) {
                $('.avatar').prop('src', data.user_pic).show()
                $('.text-avatar').hide()
            } else {
                $('.text-avatar').text(name[0].toUpperCase()).show()
                $('.avatar').hide()
            }
        })
    }
    getUserInfo()
        //点击退出返回登录页面
    $('#logout').click(function() {
        //清除本地存储的token进入密钥
        localStorage.removeItem('token')
            //跳转到登录页面
        location.href = './login.html'

    })
})