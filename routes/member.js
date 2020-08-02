const express = require("express");
const router = express.Router();
const app = express();
app.use(express.urlencoded({extended: false}));
const dbMySql = require("../modules/dbMySql");
router.post("/", async (req, res) => {
    console.log(req.body);
    let {username} = req.body;
    // console.log(username);
    if(username){
        let sql = `select username from member where username='${username}'`;
        let result = await dbMySql.querys(sql);
        console.log(result,111);
        if(result[0] === ''){
            res.send({
                code: 1,
                result: "用户名已存在"
            })
        }else {
            res.send({
                code: 2,
                result: "用户名不存在"
            })
        }
    }else {
        res.send({
            code: 3,
            result: "填写信息不完整"
        })
    }
})
module.exports = router;