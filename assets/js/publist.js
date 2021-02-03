$(function() {
    //提取组件
    const { form } = layui
    //定义全局状态变量
    let state = '';
    //1.从服务器获取文章的分类列表
    getCateList()
        //封装函数
    function getCateList() {
        //发送请求
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            //判断是否成功
            if (res.status !== 0) {
                return layer.msg('获取失败')
            }
            res.data.forEach(item => {
                //遍历一次向下拉选择框中追加一条option
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            });
            // 方法 更新表单,单项!!!!
            form.render('select')
        })
    }
    //初始化 富文本编辑器
    initEditor();
    //获取要裁剪的图片
    const $image = $('#image')
        //初始化裁剪区
    $image.cropper({
        //指定宽高比
        aspectRatio: 400 / 280,
        //指定预览区元素
        preview: '.img-preview'
    });
    //为选择封面按钮绑定点击事件
    $('#choose-btn').click(function() {
        //自动触发文件框的点击事件
        $('#file').click()
    });
    //给文件选择框区绑定change事件
    $('#file').change(function() {
            //获取所有的文件列表
            console.log(this.files[0]);
            const imgUrl = URL.createObjectURL(this.files[0])
            $image.cropper('replace', imgUrl)
        })
        //监听表单的提交事件(点击发布或存为草稿)
    $('.publish-form').submit(function(e) {
        e.preventDefault();
        //获取表单中所有的内容(formdata格式)
        const fd = new FormData(this)
            //formdata 新增方法: append()  set() get()  forEach()
        fd.forEach(item => {
            console.log(item);
        });
        //向fd中新增state数据
        fd.append('state', state);
        //获取裁剪封面图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {
            console.log(blob); //二进制的图片数据
            //吧二进制的图片数据添加到formdaata中
            fd.append('cover_img', blob);
            //调用封装函数发送请求
            publishArticle(fd)
        })
    });
    //点击发布和存为草稿按钮,改变state的状态值
    $('.last-row button').click(function() {
        //获取自定义属性值
        console.log($(this).data('state'));
        state = $(this).data('state')
    });
    //在外层封装一个发布文章请求的函数,参数就是组装好的formdata数据
    function publishArticle(fd) {
        //发送请求
        axios.post('/my/article/add', fd).then(res => {
            console.log(res);
            //判断失败的情况
            if (res.status !== 0) {
                return layer.msg('发布文章失败')
            }
            layer.msg(state == '草稿' ? '发布草稿成功' : '发布文章成功')
                //跳转页面
            location.href = '../../article/list.html'
            window.parent.$('.layui-this').prev().find('a').click()
        })
    }
})