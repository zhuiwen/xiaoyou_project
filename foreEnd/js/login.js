$(function () {
    let usernameInput = $(".username"),  //username输入框
        pswInput = $(".password"),  //密码输入框
        yzmInput = $(".yangzhengma_input"), //验证码输入框
        yzmBox = $(".yanzhengma>div");//验证码渲染容器
    function checkName(unameInput){
        if(unameInput.val() === ""){
            $(".tip").html("账号必填，不可为空").css("color", "#f15200");
            return false;
        }else {
            $(".tip").html("账号填写完成").css("color", "green");
            return true;
        }
    }
    usernameInput.blur(function () {
        checkName(usernameInput)
    })
    //验证密码
    function checkPsw(pswInpu){
        if(pswInpu.val() === ""){
            $(".tip").html("密码必填，不可为空").css("color", "#f15200");
            return false;
        }else {
            $(".tip").html("密码填写完成").css("color","green");
            return true;
        }
    }
    pswInput.blur(function () {
        checkPsw(pswInput)
    })
    /*获取验证码*/
    async function getCod() {
        return new Promise((resolve, reject) => {
            $.get("http://localhost:3000/getcode",{},function (result) {
                console.log(result);
                resolve(result)
            }, "json")
        })
    }
    //渲染验证码
    async function renderCode(){
        yzmServer = await getCod();
        yzmBox.html(yzmServer.data.data)
    }
    renderCode()
    yzmBox.click(function () {
        renderCode()
    })
    //验证验证码
    function checkYzm(yzmInput){
        let yzm = yzmServer.data.text.toUpperCase();
        console.log(yzm);
        console.log(yzmServer.data.text.toUpperCase());
        if(yzmInput.val() === ""){
            $(".tip").html("验证码必填，不可为空").css("color", "#f15200");
            return false;
        }else if(yzmInput.val().toUpperCase() !== yzm){
            renderCode()
            $(".tip").html("验证码输入错误").css("color", "#f15200");
            return false;
        }else {
            $(".tip").html("验证码填写完成").css("color", "green");
            return true;
        }

    }
    yzmInput.blur(function () {
        checkYzm(yzmInput)
    })
    $("button").click(function () {
       if(checkName(usernameInput)&& checkPsw(pswInput) && checkYzm(yzmInput)){
          $.post("http://localhost:3000/login",{
              username: usernameInput.val(),
              password: pswInput.val()
          }, function (data) {
              if(data.code === 200){
                  //保存token
                  localStorage['token'] = data.result.tokens; //获取服务器生成Token
                  localStorage['username'] = data.result.username; //登录成功的帐号
                  location.href ="./index.html"
              }
          }, "json")
       }else {
           alert("填写错误, 提交失败")
           return false;
       }
    })
    //实现自动登录功能
    function autoLogin() {
        let cookieArr = document.cookie.split("; ");
        console.log(cookieArr);
        let obj = {};
        cookieArr.forEach(item => {
            let arr = item.split("=")
            obj[arr[0]] = arr[1]
        })
        console.log(obj);

        if(obj.username&&obj.password){
            console.log(11);
            usernameInput.val(obj.username);
            pswInput.val(obj.password)
        }
    }
    autoLogin()
})