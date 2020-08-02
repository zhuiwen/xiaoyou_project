$( function () {

    let isEmptyArr = [true, true, true],/*用户没有输入*/
        //用户名输入框
        usernameInput = $(".username"),
        //用户密码输入框
        passwordInput = $(".password"),
        //验证码输入框
        yanzhengmaInput = $(".yangzhengma_input"),
        //验证码显示容器
        yzmBox = $(".yanzhengma>div"),
        //消息提示框
        tips = $(".tip"),
        // 后台返回的验证码
        yzmServer = null,
        //错误提示
        errTips = ["请输入邮箱/邮箱已注册/邮箱格式错误", "密码格式为6-20为字母数组组合", "验证码输入错误"]
    /*获取验证码*/
    async function getCod() {
       return new Promise((resolve, reject) => {
           $.get("http://localhost:3000/getcode",{},function (result) {
               console.log(result);
               resolve(result)
           }, "json")
       })
    }

    //用户名输入验证
    function  checkName(unameInput){
        let username = unameInput.val();
        console.log(username);
        let nameReg = /^[a-z]\w{3,}/ig;
        //用户名输入是否合法
        if(username === ""){
            isEmptyArr[0] = true;
            tips.eq(0).html("必填，不可为空").css("color", "#f15200");
            return false;
        }
        if(!nameReg.test(username)){
            unameInput.val("");
            isEmptyArr[0] = true;
            tips.eq(0).html("用户名输入不合法，必须以字母开头，4位以上！").css("color", "#f15200");
            return false;
        }else {
            isEmptyArr[0] = false;
            tips.eq(0).html("用户名输入成功！").css("color", "green");
            return true;
        }
    }
    usernameInput.blur(function () {
        checkName($(this))
    });
    //密码验证
    function checkPsw(psdInput){
        let password = psdInput.val();
        //密码不可为空
        if(password === ""){
            isEmptyArr[1] = true;
            $(".tip").eq(1).html("必填，不可为空").css("color", "#f15200");
            return false;
        }
        //验证密码输入是否合法
        let pswReg = /(?!^\d+$)(?!^[a-z]+$)^\w{6,12}$/ig;
        if(pswReg.test(password)){
            isEmptyArr[1] = false;
            $(".tip").eq(1).html("密码输入通过").css("color", "green");
            return true;
        }else {
            psdInput.val("");
            isEmptyArr[1] = true;
            $(".tip").eq(1).html("密码格式为6-20为字母数组组合").css("color", "#f15200");
            return false;
        }
    }
    passwordInput.blur(function () {
        //获取用户输入的密码
        checkPsw($(this));
    })
    //渲染验证码
    async function renderCode(){
        yzmServer = await getCod();
        yzmBox.html(yzmServer.data.data)
    }
    renderCode()
    yzmBox.click(function () {
        renderCode()
    })
    //验证码验证输入
    function checkYanzhengMa(yzmInput){
        let yzm = yzmServer.data.text.toUpperCase();
        if(yzmInput.val() === ""){
            isEmptyArr[2] = true;
            $(".tip").eq(2).html("必填，不可为空").css("color", "#f15200");
            return false;
        }
        if(yzm === yzmInput.val().toUpperCase()) {
            isEmptyArr[2] = false;
            $(".tip").eq(2).html("验证码输入正确").css("color", "green");
            return true;
        }else{
            $(".tip").eq(2).html("验证码输入错误").css("color", "#f15200");
            yzmInput.val("");
            isEmptyArr[2] = true;
            renderCode()
            return false
        }
    }
    yanzhengmaInput.blur(function () {
        checkYanzhengMa($(this))
    })
    //注册前，最后验证
    $("input[type='button']").click(function () {
        // return false;
        let isNameOk = checkName(usernameInput);
        let isPswOk = checkPsw(passwordInput);
        let isYzmOk = checkYanzhengMa(yanzhengmaInput);
        if(isNameOk&&isPswOk&&isYzmOk){
            $.post('http://localhost:3000/register', {
                username: usernameInput.val(),
                password: $.md5(passwordInput.val())
            }, function(d) {
                if (d.code === 200) { //成功
                    alert("注册成功")
                    location.href = "./login.html";
                }else if(d.code === 403){
                    alert("注册失败");
                    tips.eq(0).html(d.result).css("color", "#f15200")
                }

            }, 'json')
        }else {
            isEmptyArr[0] = usernameInput.val() === "" ? true : false;
            isEmptyArr[1] = passwordInput.val() === "" ? true : false;
            isEmptyArr[2] = yanzhengmaInput.val() === "" ? true : false;
            if(isEmptyArr[0] || isEmptyArr[1] || isEmptyArr[2]){
                isEmptyArr.forEach((item, index) => {
                    if(item){
                        tips.eq(index).html("必填，不可为空").css("color", "red")
                    }
                });
                alert("表单填写不完善，无法提交");
                // $(".yanzhengma>span").html( getCod(4));
            }
        }
    })
})