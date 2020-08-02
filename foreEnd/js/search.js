$(".topNav2_top_right_search_input").focus(function () {
    $(".topNav2_top_right_search_placeholder").css("display","none")
})
$(".topNav2_top_right_search_input").blur(function () {
    $(".topNav2_top_right_search_placeholder").css("display","block")
})
//渲染查询前十导航
$.get("http://localhost:3000/search/topten",function (result) {
    if(result.code === 200){
        renderTopTen(result.data)
    }
}, "json");
//渲染导航
function renderTopTen(arr) {
    let str = '';
    arr.forEach(item => {
        str += `<li><a href="#">${item.search_text}</a></li>`
    })
    $(".topNav2_top_right_shopsNav").html(str);
}
//查询商品