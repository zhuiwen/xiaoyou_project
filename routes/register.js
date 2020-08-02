const express = require("express");
const router = express();
const app = express();
const dbMySql = require("../modules/dbMySql");
const uuid = require("uuid");
app.use(express.urlencoded({extended: false}))
//渲染注册页面
router.get("/", (req, res)=>{
    res.render("register.html")
});
//注册业务处理
router.post("/", async (req, res)=>{
    let {username, password} = req.body;
    if(username&&password){
        let sql = `select username from member where username='${username}'`;
        let result = await dbMySql.querys(sql);
        if(result[0] === ''){
            if(result[1].length === 0){
                //将用户数据写入数据库
                let date = new Date()
                let sql = `insert into member(username,password,uid,createdate) values('${username}','${password}','${uuid.v4()}','${date.getTime()}')`;
                dbMySql.querys(sql).then(date=>res.send({code:200,result: "注册成功"}), err=>res.send({code:500, result:"无法添加到数据库，注册失败"}));
            }else {
                res.send({
                    code: 403,
                    result: "用户名已存在"
                })
            }
        }else {

        }
    }else {
        res.send({
            code: 402,
            result: "填写信息不完整"
        })
    }

})
module.exports = router;