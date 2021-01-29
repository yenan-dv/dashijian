$(function() {
    const { layer, form } = layui
    //页面一加载就获取用户信息
    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            //给表单赋值
            //注意 edit-userinfo是表单lay-filter属性值
            const { data } = res
            form.val('edit-userinfo', data)
        })
    }

    initUserInfo()
        //2表单验证
    form.verify({
            nick: [
                /^\w{1,6}$/,
                '名称长度必须在1到6个字符之间'
            ]
        })
        //3提交修改
    $('.base-info-form').submit(function(e) {
            e.preventDefault()
                //发送ajax请求   serialize()获取所有的input里面的值
            axios.post('/my/userinfo', $(this).serialize())
                .then(res => {
                    console.log(res);
                    //校验失败
                    if (res.status !== 0) {
                        return layer.msg('修改信息失败!')
                    }
                })
                //更新用户信息
            window.parent.getUserInfo()
        })
        //充值功能
    $('#rens').click(function(e) {
        e.preventDefault()
            //重新渲染用户信息
        initUserInfo()
    })
})