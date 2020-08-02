$(function () {
    /*跨域请求对象*/
    class SendAjax{
        constructor(url, options) {
            this.url = url;
            this.options = options;
        }
        sendGet(){
            return new Promise((resolve, reject) => {
                $.get(this.url, this.options, function (d) {
                    resolve(d)
                })
            })
        }
        sendPost(){
            return new Promise((resolve, reject) => {
                $.post(this.url, this.options, function (d) {
                    resolve(d)
                })
            })
        }
    }
    /*
    * 轮播部分的代码
    * */
    let btns = $(".banner_lunbo_btn"), //左右按钮
        btnCircles = document.getElementsByClassName("banner_lunbo_circleBtn")[0].getElementsByTagName("li"), //圆点按钮
        lunbo = $(".banner_lunbo")[0], //放置轮播图的大容器
        lunboUl =document.getElementsByClassName("banner_lunbo_imgs")[0], //存放轮播图的ul;
        index = 1, //当前显示轮播图所在的下标
        isMove = false, //轮播是否在动
        len;
    // //console.log(btnCircles);
    $.ajax({
        url:"http://localhost:3000/index/banner",
        dataType: "json",
        type: "get",
        success: data => {
            let imgsArr = data[1]
            len = imgsArr.length;
            //渲染轮播区的图片
            let lunboStr = `<li><a href = '#1'><img src = ${imgsArr[len-1].coverimg} /></a></li>`;
            data[1].forEach(item => {
                lunboStr += `<li><a href = '#1'><img src = ${item.coverimg} /></a></li>`
            });
            lunboStr +=   `<li><a href = '#1'><img src = ${imgsArr[0].coverimg} /></a></li>`
            $(".banner_lunbo_imgs").append(lunboStr)
            // $(".banner_lunbo_imgs").css({
            //     width: (data.list.length+2) * 980 + "px",
            //     left: -200 + "px"
            // });
            lunboUl.style.width = (len+2) * 1000 + "px";
            lunboUl.style.left = -1000+'px'
            //渲染轮播区的圆点按钮
            let lunboCircleBtns = '<li class="active"></li>'
            for(let i = 0; i <len -1; i++ ){
                lunboCircleBtns += "<li></li>"
            }
            $(".banner_lunbo_circleBtn").append(lunboCircleBtns)
            for(let i = 0; i < len; i++){
                btnCircles[i].idx = i;
                btnCircles[i].onclick = function(){
                    //console.log(1);
                    index = this.idx + 1;
                    btnCirclesChange();
                    animate(lunboUl,{left: -1000*index});
                }
            }

        }
    });
//实现轮播功能

//播放下一张
    function next() {
        // //console.log(len)
        if(isMove){
            return ;
        }
        isMove = true;
        index ++;
        // //console.log(index, len);
        btnCirclesChange();
        animate(lunboUl,{left: -1000*index},function () {
            isMove =false;
            if(index >= len+1){
                index = 1;
                lunboUl.style.left = -1000+"px";
            }
        })
    }
    //播放上一张的函数
    function prev(){
        if(isMove) {//正在运动是，就不能进行下一次运动
            return;
        }
        isMove = true;
        index--;
        btnCirclesChange();
        animate(lunboUl, {
            left: -1000 * index
        },function () {
            isMove = false;//运动暂时停止了
            if(index <= 0){
                index = len;
                lunboUl.style.left = -1000 * index + 'px';
            }
        });
    }
    let timer =setInterval(next,2000);
    function btnCirclesChange() {
        for (let i = 0; i < len; i++){
            btnCircles[i].className = "";
        }
        if(index === len+1){
            btnCircles[0].className = "active";
        }else if(index === 0){
            btnCircles[len - 1].className = "active";
        }else {
            btnCircles[index - 1].className = "active";
        }
    }
    btns[0].onclick = next;
    btns[1].onclick = prev;
    // //console.log(btns[1]);
    lunbo.onmousedown = function(){

        clearInterval(timer);
    };
    lunbo.onmouseup = function(){
        //console.log("计时器开始了");
        isMove = false;
        timer = setInterval(next,2000);
    };
    /*
* 限时抢购
* */
    let hourBox = $(".hour"),
        minuteBox = $(".minute"),
        secondBox = $(".second");
    let timerId = null;
    let nowTime = null, flashTimeArr = null
    //存放获取的抢购商品结果
    let flashReult = null;
    function showDaoJiShi(nowTime, futureTime) {
        let restSeconds = (futureTime - nowTime)/1000;
        console.log(futureTime, "kkkkk");
        if(restSeconds <= 0 || isNaN(restSeconds)){
            hourBox.html("00");
            minuteBox.html("00");
            secondBox.html("00");
            return;
        }
        timerId = setInterval(function () {
            hourBox.html(parseInt(restSeconds / 60 /60 % 24));
            minuteBox.html(parseInt(restSeconds / 60 % 60));
            secondBox.html(parseInt(restSeconds % 60));
            restSeconds --;
            if(restSeconds <= 0){
                clearInterval(timerId)
                daojishi(new Date(nowTime), flashTimeArr);
            }
        },1000)
    }
    function changeText(box, content) {
        let str = box.text();
        str = str.replace(str.split("-")[1], content);
        box.text(str);
    }
    function daojishi(nowTime, flashTimeArr){
        let preIndex = -1;
        let futureTime = null;
        let len = flashTimeArr.length;

        for(let i = 0; i < len; i++){
            futureTime =  new Date(flashTimeArr[i])
            if(nowTime.getTime() > futureTime.getTime()){
                preIndex=i;
                continue ;
            }
        }
        showDaoJiShi(nowTime,  new Date(flashTimeArr[preIndex+1]))
        let lis = $(".StartTime >li");
        for(let i = 0; i < preIndex; i++){
            changeText(lis.eq(i),"已经结束")
            lis.eq(i).removeClass("active").css({
                "background": "#eee",
                "color": "#fff"
            })
        }

       if(preIndex!==-1){
           changeText(lis.eq(preIndex),"已经疯抢")
           lis.eq(preIndex).addClass("active");
       }
        for(let i = preIndex+1; i < lis.length; i++){
            changeText(lis.eq(i),"即将开始");
            lis.eq(i).removeClass("active").css("background","pink")
        }
    }

    let getFalsh = new SendAjax("http://localhost:3000/flash",{id:1});
    getFalsh.sendGet().then(data =>  {
        nowTime = data.nowTime;
        flashTimeArr = data.flashTimeArr;
        daojishi(new Date(nowTime), flashTimeArr);
        renderFlashGoods(data.flashGoodsArr[0].list_goods,  $(".section1_qianggou_shops"))
        flashReult = data;
    })
    function renderFlashGoods(arr, box) {
        // //console.log(arr);
        let flashGoods='';
        arr.forEach(val => {
            let per = ((val.num / 150)*100).toFixed(2)
            flashGoods += `<li>
                                 <a href="#1">
                                    <img src= ${val.image_url} alt="">
                                 </a>
                                 <p class="name">${val.goods_name}</p>
                                 <p class="price">
                                     <span class="xianjia">￥${val.assem_price}</span>
                                    <span class="yuanjia">￥${val.goods_price}</span>
                                 </p>
                                 <div class="flashGoodsPer">
                                      <div class = "line">
                                         <div class="highLine" style="width: ${per}px"></div>
                                      </div>
                                      <span>已抢购${per}%</span>
                                </div>
                            </li>`;
        })
        box.html(flashGoods)
    }
    $(".StartTime >li").click(async function () {
        renderFlashGoods(flashReult.flashGoodsArr[$(this).index()].list_goods,  $(".section1_qianggou_shops"))
    })
    /*
    *  5. 排行榜与人气好货渲染
    * */
    $.ajax({
        url:'http://localhost:3000/topbang',
        dataType: "json",
        success(data){
            console.log(data);
            //渲染导航栏
            renderNav( $(".section2_rankList_nav"), data)
            //渲染商品展示
            renderGoodsShow($(".section2_rankList_goodsShow"), data[0].goods_list, data[0].thired_name);
            $(".section2_rankList_nav>li").click(function () {
                $(this).addClass("active").siblings().removeClass("active")
                renderGoodsShow($(".section2_rankList_goodsShow"), data[$(this).index()].goods_list, data[$(this).index()].thired_name);
            })
        }
    })
    function renderNav(navBox, list) {
        let navStr = '';
        let navLen = list.length;
        for (let i = 0; i < navLen; i++) {
            if(i === 0){
                navStr += `<li class="active"><a href="#1">${list[i].thired_name}</a></li>`;
                continue ;
            }
            navStr += `<li><a href="#1">${list[i].thired_name}</a></li>`
        }
        navBox.html(navStr)
    }
    function renderGoodsShow(showBox, list, tag) {
        let showStr = ``;
        list.forEach((val, index) => {
            showStr += `
                <li>
                        <a href="#1" class="fl">
                            <img src=${val.image_url} alt="">
                        </a>
                        <div class="fr">
                            <p class="goodsName">${val.goods_name}</p>
                            <div>
                                <p class="goodsPrice fl">￥${val.goods_price}</p>
                                <p class="goodsTag fr">${tag}销量NO.${index+1}</p>
                            </div>
                        </div>
                    </li>
            `
        });
        showBox.html(showStr)
    }
    /*5.2. 人气好货*/
    $.ajax({
        url: 'http://localhost:3000/renqigoodslist',
        dataType: 'json',
        success(data){
            //console.log(data);
            //渲染人气好货
            renderGoodList($(".section2_goodList_show"), data.goodsArr)
        }
    })
    function renderGoodList(goodListBox, arr) {
        let goodListStr = ``;
        arr.forEach(val => {
            goodListStr += `
             <li>
                        <a href="#1">
                            <img src= ${val.image_url} alt="">
                        </a>
                        <p class="goodsName">${val.goods_name}</p>
                    </li>`
        });
        goodListBox.html(goodListStr);

    }
    /*猜你喜欢*/
    $.ajax({
        url: "http://localhost:3000/youlike",
        success(data){
            //console.log(data)
            /*
                渲染商品
            */
           renderYoulikeGoods(data.list, $(".youLike_goodsShow"))
        }
    })
    function renderYoulikeGoods(arr, box){
        let youlike_str = ``
        //console.log(arr)
        arr.forEach(val=>{
            youlike_str += `
                <li>
                <a href="#1">
                   <div> <img src=${val.image_url} alt=""></div>
                    <p class="goodsIntro">${val.goods_introduce}</p>
                </a>
                <p class="price">￥<span>${val.goods_price}</span></p>
                    <p class="findAlike"><a href="#1">找相似</a></p>
            </li>
            `
        })
        box.html(youlike_str);
    }
    /*渲染各个频道*/
    $.get("http://localhost:3000/categoods", function (data) {
        console.log(data);
        let str = ``;
        data.forEach((item, index) => {
            str += ` <div class="goodsColumns_com cloths fl">
                <!--8.1.1服饰与运动 -- 服饰顶部 -->
                <div class="goodsColumns_com_top clearfix">
                    <div class="goodsColumns_com_top_title fl">
                        ${item.big_title} <span class="iconfont icon-qr-code"></span>
                    </div>
                    <ul class="goodsColumns_com_top_nav fr">
                       ${renderTopNav(item.thired_goods)}
                    </ul>
                </div>
                <div class="goodsColumns_com_goodsShow clearfix">
                    <!--8.1.1服饰与运动 -- 服饰左边-->
                    <a href="#1">
                        <div class="goodsColumns_com_goodsShow_left fl" style="background-image: url(${item.image_url}); background-size: cover; background-color: #f3bb93">
                            <div class="txt">
                                <p class="p1">${item.small_title}</p>
                                <p class="p2">每400减50</p>
                            </div>
                        </div>
                    </a>
                    <!--8.1.2服饰与运动 -- 服饰右边-->
                    <ul class="goodsColumns_com_goodsShow_right fr">
                       ${renderGoods(item.thired_goods[0].goods_list)}
                    </ul>
                </div>
            </div>`
        });
        $(".goodsColumns").html(str);
        $(".goodsColumns_com_top_nav > li").click(function () {
            let preParentIndex = $(this).parent().index(".goodsColumns_com_top_nav");
            console.log(data[preParentIndex].thired_goods[$(this).index()]);
            $(".goodsColumns_com_goodsShow_right").eq(preParentIndex).html(renderGoods(data[preParentIndex].thired_goods[$(this).index()].goods_list));
            $(this).addClass("active").siblings().removeClass("active")
        })
    }, "json");
    function renderTopNav(arr) {
        // console.log(arr);
        let str = '';
        arr.forEach((item, index) => {
            if(index === 0){
                str += `<li class="active">${item.thired_name}</li>`
                return;
            }
            str += `<li>${item.thired_name}</li>`
        })
        return str;
    }

    //商品展示
    function renderGoods(arr) {
        let str = '';
        console.log(arr);
        arr.forEach(item => {
            str += ` <li>
                            <a href="#!">
                                <p class="p1">${item.goods_name.substr(0, 4)}</p>
                                <p class="p2">${item.goods_introduce.substr(0, 7)}...</p>
                                <img src="${item.image_url}" alt="">
                            </a>
                        </li>`
        })
        return str;
    }
});
