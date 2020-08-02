$(function () {
    /*获取验证码*/
    function getCod(length) {
        let arr = [];
        for (let i = 0; i < 10; i++){
            arr[i] = [i]
        }
        let len1 = arr.length;
        for (let i = 97; i < 122; i ++){
            arr[len1 ++] = String.fromCharCode(i);
        }
        let len2 = arr.length;
        let strCode ='';
        for (let i = 0; i < length; i ++){
            strCode += arr[parseInt( Math.random() * len2)]
        }
        console.log(strCode);
        return strCode
    }
    $(".yanzhengma>span").html( getCod(4))
    Array.prototype.splice(0,1,23)
})
