$(function() {
    const { form } = layui
    getCatList()
        //定义弹出层的id编号索引编号
    let index
        //封装函数

    function getCatList() {
        //发送axios请求
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            //判断请求失败
            if (res.status !== 0) {
                return layer.msg('获取列表失败')
            }
            //请求成功TODO
            //渲染获取到的res  使用模板引擎调用模板函数template(id,数据对象)
            const htmLStr = template('tpl', res)
            console.log(htmLStr);
            $('tbody').html(htmLStr)
        })
    }
    $('.add-cs').click(function() {
        //文档弹出功能
        index = layer.open({
            //层类型
            type: 1,
            //标题
            title: '添加文章分类',
            //弹出层里面的内容
            content: $('.add-form-container').html(), //这里content是一个普通的String
            //弹出层的宽高
            area: ['500px', '300px']
        });
    });
    //这个表单是后来添加的  所有要采用事件委托
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault()
        axios.post('/my/article/addcates', $(this).serialize()).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('添加列表失败')
            }
            layer.msg('添加分类成功');
            //关闭弹出窗 文档方法
            layer.close(index)
                //调用渲染
            getCatList()
        })
    })
    $(document).on('click', '.edit-btn', function() {
        //文档弹出功能
        index = layer.open({
            //层类型
            type: 1,
            //标题
            title: '修改文章分类',
            //弹出层里面的内容
            content: $('.edit-form-container').html(), //这里content是一个普通的String
            //弹出层的宽高
            area: ['500px', '300px']
        });
        //获取自定义属性的值
        console.log($(this).data('id'))
        const id = $(this).data('id')
        console.log(id);
        //发送请求到服务器,获取当前的分类数据
        axios.get(`/my/article/cates/${id}`).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败')
            }
            form.val('edit-form', res.data)
        });
        //监听表单提交的事件

    })
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()
        console.log(134);
        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('更新失败')
            }
            //渲染和关闭弹出层
            layer.close(index)
            layer.msg('更新成功')
            getCatList()
        })
    })
    $('tbody').on('click', '.btn-delete', function() {
        //获取id值
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            console.log(index);
            //发送请求
            axios.get(`/my/article/deletecate/` + id).then(res => {
                if (res.status !== 0) {
                    return layer.msg('删除分类失败！')
                }
                layer.msg('删除分类成功！')
                layer.close(index)
                getCatList()
            });
            //使用ajax方法删除
            // $.ajax({
            //     url: 'http://ajax.frontend.itheima.net/my/article/deletecate/' + id,
            //     method: 'GET',
            //     success: function(res) {
            //         console.log(123);
            //         if (res.status !== 0) {
            //             return layer.msg('删除分类失败！')
            //         }
            //         layer.msg('删除分类成功！')
            //         layer.close(index)
            //         getCatList()
            //     }
            // })
        })
    })
})