$(function() {
    const { form, laypage } = layui
    //获取文章列表的分类数据
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
    //定义一个查询对象
    const query = {
        pagenum: 1, //表示当前的页码值,第几页
        pagesize: 2, //表示每一页显示的数据条数 
        cate_id: '', //分类
        state: '', //状态
    };
    //发送请求,获取文章列表数据
    renderTable()

    function renderTable() {
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res);
            //时间格式化
            template.defaults.imports.dateFormat = function(date) {
                console.log(moment(date).format('YYYY/MM/DD HH:mm:ss'));
                return moment(date).format('YYYY/MM/DD HH:mm:ss');
            }

            //使用模板引擎渲染数据
            const htmlStr = template('tpl', res)
            $('tbody').html(htmlStr);

            //请求后渲染分页器
            renderPage(res.total)
        })
    }

    function renderPage(total) {
        //调用layui文档中的方法
        laypage.render({
            elem: 'pagination', //注意，这里的 pagination 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, //每页显示的数量
            limits: [2, 3, 4, 5], // 每一页的数据条数
            curr: query.pagenum, //当前页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器的布局排版
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                //修改插叙对象的参数
                query.pagenum = obj.curr
                query.pagesize = obj.limit
                    //首次不执行
                if (!first) {
                    //非首次进入页面,需要重新渲染表格数据
                    renderTable()
                }
            }
        })
    }
    //表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault()
            //获取选择状态框的分类和状态
        const cate_id = $('#cate-sel').val()
        const state = $('#state').val();
        console.log(cate_id, state);
        //吧获取到的值重新赋值给query对象
        query.cate_id = cate_id
        query.state = state
            //提交发送请求之前去修改页码值 为第一页
        query.pagenum = 1
            //在调用一下renderTable()渲染表格方法
        renderTable()
    });
    //点击删除按钮删除当前的文章
    $(document).on('click', '.del-btn', function() {
        const id = $(this).data('id')
        console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            console.log(index);
            //发送请求
            axios.get(`/my/article/delete/` + id).then(res => {
                if (res.status !== 0) {
                    return layer.msg('删除分类失败！')
                }
                layer.msg('删除分类成功！')
                    //当前页只有一条数据,那么我们点击删除这条数据之后 应该去手动请求更新上一页的数据
                if ($('.del-btn').length == 1 && query.pagenum !== 1) { //每一页只有一个并且不处于第一页的时候
                    //跳回上一页
                    query.pagenum--
                }

                renderTable()
            });
            layer.close(index)
        })
    });
    //点击编辑按钮,跳转到编辑页面
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id')
            //吧当前编辑的文章id  传入到编辑页面
        location.href = `./edit.html?id=${id}`

        window.parent.$('.layui-this').next().find('a').click()
    })
})