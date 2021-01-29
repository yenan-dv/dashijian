$(function() {
    function getUserInfo() {
        axios({
            url: '/my/userinfo',
        }).then(res => {
            console.log(res);
        })
    }
    getUserInfo()
})