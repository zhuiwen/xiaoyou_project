class SendAjax{
    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.result = null;
    }
    sendGet(){
        return new Promise((resolve, reject) => {
            $.get(this.url, this.options, function (d) {
                resolve(d)
                this.result = d;
            })
        })
    }
    sendPost(){
        return new Promise((resolve, reject) => {
            $.post(this.url, this.options, function (d) {
                resolve(d);
                this.result = d;
            })
        })
    }
}
let getFirstCate = new SendAjax("http://localhost:3000/category_first"),
    isChange = true, //是否改变;
    prePage = 1, //当前页数
    orderBy = "zonghe",
    type = 'asc';
//渲染一级分类
let cateFirstUl = $("#cateFirst");
async function renderFirtCate() {
    let [err, list] = await getFirstCate.sendGet();
    if(!err){
        let str = ``;
        list.forEach((item, index) => {
            if(index === 0){
                str += `<li class="active" first-id = ${item.first_id}>${item.first_name}</li>`
            }else {
                str += `<li first-id = ${item.first_id}>${item.first_name}</li>`
            }
        });
        cateFirstUl.html(str);
    }
    renderSecondCate(list[0].first_id);
    $("#cateFirst>li").click(function () {
        if(!$(this).hasClass("active")){
            isChange = true;
            prePage = 1;
            renderSecondCate(list[$(this).index()].first_id);
        }
        $(this).addClass("active").siblings().removeClass("active");
    });
}
renderFirtCate();
//渲染二级分类
let cateSecondUl = $("#cateSecond");
async function renderSecondCate(first_id) {
    let getSecondCate = new SendAjax("http://localhost:3000/category_second",{first_id});
    let [err, list] = await getSecondCate.sendGet();
    if(!err){
        let str = '';
        list.forEach((item , index)=> {
            if(index === 0){
                str += `<li  class="active" second-id = ${item.second_id}>${item.second_name}</li>`
            }else {
                str += `<li second-id = ${item.second_id}>${item.second_name}</li>`
            }
        })
        cateSecondUl.html(str);
    }
    prePage = 1;
    renderThiredCate(list[0].second_id);
    $("#cateSecond>li").click(function () {
        if(!$(this).hasClass("active")){
            isChange = true;
            prePage = 1
            renderThiredCate(list[$(this).index()].second_id);
        }
        $(this).addClass("active").siblings().removeClass("active");
        renderThiredCate(list[$(this).index()].second_id);
    });
}
//渲染三级分类
let cateThiredUl = $("#cateThired"),
    cateThiredLi = $("#cateThired > li"),
    thirdid = 0;
async function renderThiredCate(second_id) {
    $(".show_top_nav>li").eq(0).addClass("active").siblings().removeClass("active");
    let getThiredCate = new SendAjax("http://localhost:3000/category_thired",{second_id});
    let [err, list] = await getThiredCate.sendGet();
    if(!err){
        let str = '';
        list.forEach((item, index) => {
            if (index === 0){
                str += `<li class="active" thired-id = ${item.thired_id}>${item.thired_name}</li>`
            }else {
                str += `<li thired-id = ${item.thired_id}>${item.thired_name}</li>`
            }
        })
        cateThiredUl.html(str);
    }
    thirdid = list[0].thired_id;
    isChange = true;
    prePage = 1;
    getThiredGoodList(thirdid);
    $("#cateThired>li").click(function () {
        thirdid = $(this).attr("thired-id")
        if(!$(this).hasClass("active")){
            getThiredGoodList(thirdid);
            isChange = true;
            prePage = 1
        }
        $(this).addClass("active").siblings().removeClass("active");

    });
}
//获取三级分类下的商品
let goodsListUl = $(".show_goodsList"),
    total = 0, //商品总数
    skip = 0, //跳过的数量
    pageNum = 0, //总页数
    limit = 2; //每页限制显示的商品数量

async function getThiredGoodList(thiredId) {
    let getGoods = new SendAjax("http://localhost:3000/goodslist", {
        thiredId,
        limit,
        skip: (prePage- 1)*limit,
        orderBy,
        sortType: type
    });
    // alert(thirdid)
    let {code, data, total} = await getGoods.sendGet();
    let str = ``;
    if(code === 200){
        data.forEach((item, index) => {
            console.log(item);
            str += `<li onclick="jumpPage('${item.goods_id}')">
                    <a href="#1">
                        <img src="${item.image_url}" alt="">
                        <p class="price">￥${item.goods_price}</p>
                        <p class="goodsName">${item.goods_name}</p>
                        <p class="tag">不要错过, 不要辜负</p>
                        <p class="commentCount">已有 <span>${item.evalNum}万<sup>+</sup></span>人评价</p>
                        <div>
                            <div class="addCartBtn fl">
                                <span class="iconfont icon-gouwuche"></span>
                                加入购物车
                            </div>
                            <div class="collectBtn fl">
                                <span class="iconfont icon-shoucang"></span>
                                收藏
                            </div>
                        </div>
                    </a>
                </li>`
        });
        goodsListUl.html(str);
        //渲染商品总数
        $(".show_top_rignt > p > .num").html(total);
        $(".show_top_rignt_pageBtn > .prePage").html(prePage);
        $(".breadcrumbTrail>li").eq(1).html(`<a href="#">${$('#cateFirst>li.active').text()} &gt;</a>`)
        $(".breadcrumbTrail>li").eq(2).html(`<a href="#">${$('#cateSecond>li.active').text()} &gt;</a>`)
        $(".breadcrumbTrail>li").eq(3).html(`<a href="#">${$('#cateThired>li.active').text()}  <button>x</button></a>`)
    }
    //页面跳转
    window.jumpPage = function (goods_id) {
        location.href = "./detail.html?goods_id="+goods_id;
    }
    if(isChange){
        pageNum = Math.ceil(total / limit);
        $(".show_top_rignt_pageBtn > .pageTotal").text(pageNum)
        //渲染分页按钮
        renderPageBtns();
        isChange = false;
    }
}
//渲染分页按钮
let showpageBtns  = $(".show_pageBtns "),
    pageBtns;
function renderPageBtns() {
    let str = `<li class="lastOne" onclick="showPrePage(this)">上一页</li>`
    isAdd = true;
    for(let i = 0; i <pageNum; i++ ){
        if(i === 0){
            str += `<li class="active" onclick="changePage(this)">${i+1}</li>`;
            continue;
        }
        if(i === pageNum-1 || i < 4){
            str += `<li  onclick="changePage(this)">${i+1}</li>`
            continue;
        }
        if(i === 4  && pageNum > 5){
            str += `<li  onclick="changePage(this)">...</li>`;
        }
    }
    str += `<li class="nextOne" onclick="showNextPage(this)">下一页</li>`;
    showpageBtns.html(str);
    pageBtns = $(".show_pageBtns > li")
}
//点击按钮渲染商品
function changePage(e, pages) {
    e = $(e);
    let pageStr = e.text()

    if(pageStr !== "..."){
        prePage = parseInt(pageStr)
        e.addClass("active").siblings().removeClass("active")
        // console.log(e.index(), 2222);
    }else if(e.index()!==2) {
        prePage = parseInt(e.prev().text())+1;
        if(prePage === pageNum -1){
            e.text(prePage)
            e.prevAll().eq(2).text("...");
            e.addClass("active").siblings().removeClass("active")
            return ;
        }
        e.prev().text(prePage).addClass("active").siblings().removeClass("active")
        e.prev().prev().text(prePage -1);
        e.prevAll().eq(2).text("...");
    }else if(pageStr === "..."){
        prePage = parseInt(e.next().text())-1;

        if(prePage === 2){
            e.text(2)
            e.addClass("active").siblings().removeClass("active")
            return ;
        }
        e.next().text(prePage).addClass("active").siblings().removeClass("active");
        e.next().next().text(prePage + 1);
        e.nextAll().eq(2).text("...");
    }
    skip = (prePage - 1)*limit;
    getThiredGoodList(thirdid);
}
//
// 上一页
let isEs
function showPrePage(e) {
    if(pageNum < 6&&prePage > 1){
        prePage --;
        changePage(pageBtns.eq(prePage));
        return;
    }
    console.log("prePage",prePage);
    if(prePage > 1){
        prePage --;
        if(prePage === pageNum -1&&pageNum>5){
            pageBtns.eq(5).text(prePage);
            let i = 0;
            while (i < 2){
                i ++;
                pageBtns.eq(5-i).text(prePage-i)
            }
            pageBtns.eq(2).text("...")
        }
        if(pageNum -prePage < 3 ){
            console.log(pageNum-prePage);
            console.log(5 -( pageNum - prePage));
            console.log(pageBtns.eq(5 - pageNum - prePage));
            changePage(pageBtns.eq(6 - (pageNum-prePage)), prePage)

        }else if (prePage>=2){
            console.log(222);
            changePage(pageBtns.eq(2))
        }
    }
    if(prePage === 1){
        changePage(pageBtns.eq(1))
    }
}
function showNextPage(e) {
    if(pageNum < 6&&prePage < pageNum){
        prePage ++;
        changePage(pageBtns.eq(prePage));
        return;
    }
    if(prePage < pageNum){
        ++ prePage;
        if(prePage === 2&&pageNum>5){
            pageBtns.eq(2).text(2);
            let i =3;
            while (i < 5){

                pageBtns.eq(i).text(i)
                i ++;
            }
            pageBtns.eq(5).text("...")
        }
        if(prePage === pageNum){
            changePage(pageBtns.eq(pageNum>6?6:pageNum))
        }else if(prePage > 4){
            changePage(pageBtns.eq(5))
        }else {
            changePage(pageBtns.eq(prePage))
        }
    }
}
//商品排序
$(".show_top_nav>li").click(async function () {
    if($(this).children("span").hasClass("iconfont")){
        if($(this).children("span").hasClass("icon-xiangshangjiantou")){
            type= 'asc';
            $(this).children("span").removeClass("icon-xiangshangjiantou").addClass("icon-xiangxiajiantou");
        }else {
            type= 'desc';
            $(this).children("span").removeClass("icon-xiangxiajiantou").addClass("icon-xiangshangjiantou");
        }
    }
    $(this).addClass("active").siblings().removeClass("active");
    // let getGoods = new SendAjax("http://localhost:3000/goodslist",{
    //     thiredId:thirdid,
    //    $(".show_top_nav>li").addClass("active").siblings().removeClass("active");
    //     sortType: type,
    // });
    orderBy = $(this).attr("arg"),
    // let data = await getGoods.sendGet();
    // console.log(data);
    prePage = 1;
    // console.log($("show_pageBtns>li").eq(1));
    $(".show_pageBtns>li").eq(1).addClass("active").siblings().removeClass("active")
    getThiredGoodList(thirdid);

})