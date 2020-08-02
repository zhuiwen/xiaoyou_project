let preIndex= 0;
let goods_num = 1, goods_style = null, goods_id='';
function getVal(prop){
    let queryArr = location.href.split("?")[1].split("&");
    let obj = {};
     queryArr.forEach(item => {
         let arr = item.split("=");
         obj[arr[0]] = arr[1]
     })
    return obj[prop]
}

$.get("http://localhost:3000/goodsdetail?goods_id="+getVal("goods_id"),function (data) {
    let {evals, goods:goodsInfo, images, styles} = data;
    goods_style = styles;
    goods_id = styles[0].goods_id;
    //渲染面包屑导航、
    renderNav(goodsInfo[0])
    renderInfo(goodsInfo[0].goods_detailed_information);
    //渲染图片
    $(".goodsDetail1_left_show").prop("src",images[0].imageUrl);
    renderImagesBtn(images);
    //渲染商品基本信息
    renderBaseInfo(goodsInfo[0], styles[0],evals);
    //点击图片，切换展示
    let lis = $(".goodsDetail1_left_nav > ul>li")
    lis.click(function () {
        change($(this), images[$(this).index()])
    })
    $(".btnLeft").click(function () {
        clickChange(preIndex = --preIndex < 0 ? images.length-1: preIndex, images[preIndex], lis.eq(preIndex))
    })
    $(".btnRight").click(function () {
        clickChange(preIndex = ++preIndex>= images.length ? 0 : preIndex, images[preIndex],  lis.eq(preIndex))
    });
    $("#goodsInfoBtn").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        renderInfo(goodsInfo[0].goods_detailed_information);
    })
    $("#goodsEvalsBtn").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        renderEvals(evals)
    })
}, "json");
//渲染商品介绍
function renderInfo(infos) {
    $("#goodsInfo").html(infos)
}
//渲染导航
function renderNav(data) {
    $(".breadcrumbTrail").html(`
         <li><a href="#1">首页 ></a></li>
        <li><a href="#1">${data.first_name} ></a></li>
        <li><a href="#1">${data.second_name} ></a></li>
        <li><a href="#1">${data.thired_name} </a></li>

    `)
}
//图片渲染
function renderImagesBtn(images) {
    let len = images.length;
    let str = ``;
    images.forEach((item, index)=>{
        if(index === 0){
            str += `<li  class="active"><img src="${item.imageUrl}"></li>`;
            return;
        }
        str += `<li><img src="${item.imageUrl}"></li>`
    })
    $(".goodsDetail1_left_nav > ul").html(str);
}
function renderBaseInfo(infos, styles,evals) {
    //渲染商品名
    $(".goodsDetail_right_goodsName").html(infos.goods_name);
    //渲染商品介绍
    $(".goodsDetail_right_intro").html(infos.goods_introduce);
    //渲染价格
    $(".goodsDetail_right_price>.price>p:nth-of-type(2)").html(`￥${infos.goods_price}`);
    //渲染类型
    $(".goodsDetail_right_select > .title").html(styles.style_name);
    $(".goodsDetail_right_select>ul").html(`<li>${styles.style_value}</li>`)
    //评论量
     $(".evalCount>p:nth-of-type(2)").text(evals.length+"万+");
    $("#goodsEvalsBtn > span").text(evals.length+"万+")
}
function clickChange(preIndex, preimg, preli) {
    change(preli, preimg)
}
function change(preLi, preimg) {
    preIndex = preLi.index();
    $(".goodsDetail1_left_show").prop("src",preimg.imageUrl);
    preLi.addClass("active").siblings().removeClass("active");
}
//购物车逻辑
let goodsNumInput =  $(".amountBtn>input")
//减少商品数量
$(".amountBtn > .sub").click(function () {
    let numInit =goodsNumInput.val() === "" ? 1 : parseInt(goodsNumInput.val());
    if(numInit > 1){
        numInit --;
    }
    goods_num = numInit;
    goodsNumInput.val(numInit)
})
$(".amountBtn > .add").click(function () {
    let numInit = goodsNumInput.val() === "" ? 1 : parseInt(goodsNumInput.val());
    numInit++;
    goods_num = numInit;
    goodsNumInput.val(numInit)
})
goodsNumInput.blur(function () {
    let numInit =goodsNumInput.val();
    if(isNaN(numInit)){
        alert("请输入数字");
        goodsNumInput.val(goods_num);
    }else {
        goods_num = numInit;
        goodsNumInput.val(numInit);
    }
})
$(".goodsDetail_right_buyBtns>button:nth-of-type(1)").click(function () {
   if(localStorage['username']){
       console.log(goods_id+"1111");
       $.ajax({
           url: 'http://localhost:3000/goodsdetail/shopadd',
           headers: {
               authorization: localStorage['token']
           },
           data: {
               goods_style: JSON.stringify(goods_style),
               goods_num,
               goods_id
           },
           type: 'get',
           success: data=>{
               console.log(data);
               alert(data.tip)
           }
       })
   }else{
       alert("请登录");
       location.href='./login.html'
   }
});
//渲染评论
function renderEvals(evals) {
    let str = '<ul>';
    evals.forEach(item=>{
        console.log(new Date(parseInt(item.create_time)));
        str += `
            <li>
                 <div class = 'evals-left'>
                    <img src="${item.headurl}" alt="">
                    <span>${item.username}</span>
                </div>
                <div class="evals-right clearfix">
                    <p class="evalText">${item.eval_text}</p>
                    <div class="createTime fl">${new Date(parseInt(item.create_time)).toLocaleDateString()}</div>
                    <span class="iconfont icon-ziyuan fr">${item.eval_start}</span> 
                </div>
            </li>
            `
    })
    str += "</ul>"
    $("#goodsInfo").html(str)
}