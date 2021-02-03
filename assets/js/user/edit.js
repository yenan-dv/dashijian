$(function() {
    //提取组件
    const { form } = layui
    //定义全局状态变量
    let state = '';
    //接受别表页的参数
    console.log(location.search);
    //获取查询参数中的id值 slice (截取的起始位置)=>从开始的位置截取到最后 split(`分隔符`)=>吧字符串按指定分隔符分隔成数字
    const arr = location.search.slice(1).split('=')
    const id = arr[1]
    console.log(arr[1]);
    //发送请求到服务器,获取当前这条id的文章详情
    function getArtDetail(id) {
        axios.get(`/my/article/${id}`).then(res => {
            //给form表单赋值渲染数据
            form.val('edit-form', res.data)
                //初始化 富文本编辑器
            initEditor();
            //替换更路径
            $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
        })
    }

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
            getArtDetail(id);
        })
    }

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

        //formdata 新增方法: append()  set() get()  forEach()
        // fd.forEach(item => {
        //     console.log(item);
        // });

        //获取裁剪封面图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {
            //获取表单中所有的内容(formdata格式)
            const fd = new FormData(this)
            console.log(blob); //二进制的图片数据
            //向fd中新增state数据
            fd.append('state', state);
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
        //发送之前,我们向formdata数据中添加一条id数据
        fd.append('Id', id);
        //发送请求
        axios.post('/my/article/edit', fd).then(res => {
            console.log(res);
            //判断失败的情况
            if (res.status !== 0) {
                return layer.msg('发布文章失败')
            }
            layer.msg(state == '草稿' ? '发布草稿成功' : '编辑文章成功')
                //跳转页面
            location.href = '../../article/list.html'

        })
    }
})