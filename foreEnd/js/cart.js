$(function () {
    let selectAllBtn = $("#selectAllBtn"),//上部分全选按钮
        totalSelectBtn = $("#totalSelectBtn"), //结算全选按钮
        selectBtns = $(".selectBtn"), //各项商品按钮
        subBtns = $(".subBtn"), //各项商品数量减少按钮
        addBtns = $(".addBtn"), //各项商品数量增加按钮
        goodsNumInputs = $(".goodsNumInputs"), //各项商品选择数量输入框
        unitPrices = $(".unitPrice"), //各项商品单价
        subtatols = $(".subtatol"), //各项商品小计
        dels = $(".del"), //各项商品删除按钮
        selectCheckedBtn = $(".selectCheckedBtn"), //删除已选按钮
        goodsUl = $(".cart_item"), //各项商品的包含ul
        goodsSelectNum = $(".goodsSelectNum"), //已选商品数量
        preferentialPrice = $(".preferentialPrice"), //优惠价
        totalPrice = $(".totalPrice"), //总价格
        finalPrice = $(".finalPrice"); //最终价
    let cartTatol = goodsUl.length, //表示购物车商品总数
        selectNum = goodsUl.length; //表示选中商品数量
    //是否勾选
    let isChecked1 = true, isChecked2 = true;
    goodsSelectNum.text(selectNum);
    //每项商品的选择操作
    selectBtns.click(function () {
        $(this).prop("checked") ? ++ selectNum  : -- selectNum ;
        //更新已选商品数量
        goodsSelectNum.text(selectNum);
        cartTatol === selectNum ? selectAllBtn.prop("checked", true):selectAllBtn.prop("checked", false)
        cartTatol === selectNum ? totalSelectBtn.prop("checked", true):totalSelectBtn.prop("checked", false)
        finalOpt()
    })
    //上面全选按钮操作
    selectAllBtn.click(function () {
        $(this).prop("checked") ? selectNum = goodsUl.length : selectNum = 0;
        //更新已选商品数量
        goodsSelectNum.text(selectNum);
        selectBtns.prop("checked", $(this).prop("checked"))
        totalSelectBtn.prop("checked", $(this).prop("checked"))
        finalOpt()
    })
    //结算全选按钮操作
    totalSelectBtn.click(function () {
        $(this).prop("checked") ? selectNum = goodsUl.length : selectNum = 0
        //更新已选商品数量
        goodsSelectNum.text(selectNum);
        selectBtns.prop("checked", $(this).prop("checked"))
        selectAllBtn.prop("checked", $(this).prop("checked"))
        finalOpt()
    });
    //计算总价
    function getTotalPrice() {
        let totalPrice = 0;
        let len = selectBtns.length;
        for(let i = 0; i < len; i++){
            if(selectBtns.eq(i).prop("checked")){
                totalPrice +=  parseFloat(unitPrices.eq(i).text().slice(1) ).toFixed(2)*goodsNumInputs.eq(i).val()
            }
        }
        return parseFloat(totalPrice);
    }
    //计算优惠加
    function getpreferentialPrice(){
        return parseFloat(preferentialPrice.text().slice(1))
    }
    //结算
    function finalOpt(){
        //计算商品总价
        totalPrice.text("￥"+getTotalPrice().toFixed(2));
        finalPrice.text("￥"+(getTotalPrice()-getpreferentialPrice()).toFixed(2))
    }
    finalOpt()
    function isSelectAll() {
        let select = 0;
        let btnArr = $(".selectBtn");
        let len = btnArr.length;
        for(let i = 0; i < len; i++){
            if(btnArr.eq(i).prop("checked")){
                select ++
            }
        }
        if(select === len){
            selectAllBtn.prop("checked", true);
            totalSelectBtn.prop("checked", true);
        }else if(  selectAllBtn.prop("checked")){
            selectAllBtn.prop("checked", false);
            totalSelectBtn.prop("checked", false);
        }
    }
    function getPrice(optBox, opt, preIndex){
        //当前商品数量输入框
        let preNumInput = $(".goodsNumInputs").eq(preIndex)
        //当前商品数量
        let preNum = preNumInput.val() === "" ? 0 : parseInt(preNumInput.val());
        let selectBtns = $(".selectBtn");
        // selectBtns.eq(preIndex).prop("checked", !(preNum === 0))
        if(opt === "-"){
            preNum --;
            if(preNum <= 0){
                preNum = 0;
                //取消勾选
                // if(selectBtns.eq(preIndex).prop("checked")){
                    //勾选商品数量减一
                    selectNum --;
                    goodsSelectNum.text(selectNum);
                // }
                selectBtns.eq(preIndex).prop("checked", false);
                //取消全选
                selectAllBtn.prop("checked", false);
                totalSelectBtn.prop("checked", false);
                isChecked1 = false;
            }
        }else {
            // console.log(preNumInput)
            preNum ++;
            if(!selectBtns.eq(preIndex).prop("checked") && preNum!==0){
                //勾选商品数量加一
                if(!selectBtns.eq(preIndex).prop("checked")){
                    selectNum++;
                    goodsSelectNum.text(selectNum);
                }
                selectBtns.eq(preIndex).prop("checked", true)
                //检测是否恢复全选
                isSelectAll()
            }
        }

        preNumInput.val(preNum)
        //小计
        //单价
        let preunitPrices = unitPrices.eq(preIndex).text().slice(1);
        subtatols.eq(preIndex).text(parseFloat(preunitPrices*preNum).toFixed(2));
        //计算商品总价
        finalOpt()
    }
    //减少商品数量操作
    subBtns.click(function () {
        console.log($(this).parent().index(".subBtn"));
        getPrice($(this), "-", $(this).index(".subBtn"))
    })
    //增加商品数量操作
    addBtns.click(function () {
        console.log($(this));
        getPrice($(this), "+", $(this).index(".addBtn"))
    })
    //商品数量输入操作
    goodsNumInputs.blur(function () {
        //用户输入数据
        let val = parseInt($(this).val());
        //当前下标
        let preIndex = $(this).index(".goodsNumInputs")
        if(isNaN(val)){
            alert("输入不合法");
            $(this).val(1)
        }else {
            if(val <= 0){
                selectBtns.eq(preIndex).prop("checked", false);
                selectNum --;
                goodsSelectNum.text(selectNum);
                //取消全选
                isSelectAll()
            }else {
               if (!selectBtns.eq(preIndex).prop("checked")){
                   selectNum ++;
                   goodsSelectNum.text(selectNum);
                   selectBtns.eq(preIndex).prop("checked", true);
                   //考虑是否恢复全选
                   isSelectAll()
               }
            }
            //小计
            //单价
            let preunitPrices = unitPrices.eq(preIndex).text().slice(1);
            subtatols.eq(preIndex).text(parseFloat(preunitPrices * val).toFixed(2));
            //计算商品总价
            finalOpt()
        }
    })
    //删除选中商品
    selectCheckedBtn.click(function () {
        let len = selectBtns.length;
        for(let i = 0; i < len; i++){
            console.log(selectBtns.eq(i).prop("checked"));
            if(selectBtns.eq(i).prop("checked")){
                selectNum --;
                goodsSelectNum.text(selectNum);
                selectBtns.eq(i).prop("checked", false)
                goodsUl.eq(i).remove();
                finalOpt();
             }
        }
        //取消全选
        isSelectAll();
        //更新购物车商品数量
        cartTatol = $(".cart_item").length;
        console.log(cartTatol, selectNum);
    })
    //各项删除操作
    dels.click(function () {
        let preIndex = $(this).index(".del");
        let goodsUl = $(".cart_item");
        if(selectBtns.eq(preIndex).prop("checked")){
            selectBtns.eq(preIndex).prop("checked", false);
            //更新购物车商品数量
            cartTatol = goodsUl.length;
            selectNum --;
            goodsSelectNum.text(selectNum);
            finalOpt()
        }
        console.log(preIndex);
        console.log(goodsUl.eq(preIndex).remove());
        isSelectAll();
    })
})