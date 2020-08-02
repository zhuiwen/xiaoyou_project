/*5.1. 商品推荐 */
$.ajax({
    url: "http://106.13.114.114:5000/api/winLocation",
    dataType: 'json',
    success(data){
        renderRec($(".recommond_goodsShow"), data.list)
    }
})
function renderRec(box , arr) {
    let recStr = `` ;
    arr.forEach(val => {
        recStr += `
            <li>
              <a href="#1">
                <img src=${val.imageUrl}>
                <p class="goodsName">${val.goodsName}</p>
                <p class="price">￥${val.goodsPrice}</p> 
              </a>               
            </li>
        `
    })
    box.html(recStr)
}