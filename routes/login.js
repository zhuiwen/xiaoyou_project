const express = require("express");
const router = express();
const app = express();
const dbMySql = require("../modules/dbMySql");
const Auth = require("../modules/auth")
app.use(express.urlencoded({extended: false}));

//渲染登录页面
router.get("/", (req, res)=>{
    let {username, password} = req.cookies;
    console.log();
    res.render("login.html", {username, password})
});
//是否可以登录
router.post("/", async (req, res) => {
    let {username, password, isAutoLogin} = req.body;
    console.log(username, 2222);
    let sql = `select username, password,uid from member where username='${username}'`;
    let [err, data] = await dbMySql.querys(sql);
    if(err ===""&&data.length!==0){
        console.log(data, 1111);
        if(password === data[0].password){
            //用户勾选了自动登录并且是新账号登录
            if(isAutoLogin && req.cookies.username !== username){
                console.log("cookie种下了")
                res.cookie("username",username,{maxAge: 60*60*24*7*1000});
                res.cookie("password",password,{maxAge: 60*60*24*7*1000});
            }else {
                console.log("cookie没有种下")
            }
            let tokens = Auth.getToken(data[0]['uid']);
            res.send({
                code: 200,
                tip: "登录成功",
                result: {
                    tokens,
                    username,
                    uid: data[0]['uid']
                }
            })
        }else {
            res.send({
                code: 403,
                result: "登录失败，密码错误"
            })
        }
    }else {
        res.send({
            code: 403,
            result: "该账号未注册！"
        })
    }

})
module.exports = router;