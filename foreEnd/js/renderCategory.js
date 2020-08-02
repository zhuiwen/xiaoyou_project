$(function () {
    /*跨域请求及渲染一级菜单*/
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
    /*渲染一级菜单*/
    async function renderFirst(){
        return new Promise((resolve, reject) => {
            let sendObj = new SendAjax('http://localhost:3000/category_first', {});
            sendObj.sendGet().then(data=>{
                let firstStr = ''
                data[1].forEach(item=>{
                    firstStr += `<li first-id = ${item.first_id} class="categoryfirst"> <a href="#1">${item.first_name} <span class="iconfont icon-jiantou"></span></a></li>`
                })
                $(".topNav2_bottom_shopTypeDetail").html(firstStr)
                resolve()
            })
        })
    }
    /*跨域请求及渲染二、三级菜单*/
    let childMenu = $(".topNav2_bottom_shopSecondAndThird");
    childMenu.mouseleave(function (event) {
        $(this).hide();
    })
    childMenu.mouseenter(function (event) {
        $(this).show();
    })
    $(".topNav2_bottom_shopTypeDetail").mouseleave(function () {
        childMenu.css("display", "none")
    })
    $(".topNav2_bottom_shopTypeDetail").mouseenter(function () {
        childMenu.css("display", "block")
    })
    async function renderSecondAndThird() {
        await renderFirst();
        $(".topNav2_bottom_shopTypeDetail > li").hover(async function () {
            // console.log($(this).attr('first-id'));
            childMenu.css("display", "block")
            //获取二级菜单数据
            let sendObj2 = new SendAjax(`http://localhost:3000/category_second`,{first_id: $(this).attr('first-id')});
            let data2 = await sendObj2.sendGet();
            let secondArr = data2[1];
            //获取三级菜单数据
            let arr = secondArr.map(item => {
                return new Promise(async (resolve, reject) => {
                    let sendObj3 = new SendAjax(`http://localhost:3000/category_thired`,{second_id: item.second_id});
                    resolve(await sendObj3.sendGet())
                })
            })
            Promise.all(arr).then(data3 => {
                let len1 = secondArr.length;
                let str = ``;
                for (let i = 0; i < len1; i++){
                    str += `<dl class="clearfix"><dt second-id=${secondArr[i].second_id}><a href="#1">${secondArr[i].second_name}</a></dt>`;
                    let len2 = data3[i][1].length;
                    for (let j = 0; j < len2; j++){
                        str += `<dd> <a href="#1">${data3[i][1][j].thired_name}</a></dd>`
                    }
                    str += `</dl>`;
                }
                $(".topNav2_bottom_shopSecondAndThird").html(str)
            })
        })
    }
    renderSecondAndThird()
});