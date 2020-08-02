const express = require("express");
const router = express.Router();
const dbMySql = require("../modules/dbMySql");
const paths = 'http://106.13.114.114:5000/';
router.get("/", async (req, res)=>{
    //获取商品总数
    let {thiredId, skip=0, limit=2, orderBy,sortType} = req.query;
    let str='';
    switch (orderBy) {
        case 'zonghe':
            str='';
            break;
        case 'new_status':
            str = 'order by gl.new_status';
            break;
        case 'sales_num':
            str = `order by evalNum ${sortType}`
            break;
        case 'goods_price':
            str = `order by gl.goods_price ${sortType}`
            break;
    }
    console.log(sortType);
    if(thiredId&&!isNaN(thiredId)){
        let sql = `select count(thired_id) as total from goods_list where thired_id=${thiredId}`;
        let [, [{total}]] = await dbMySql.querys(sql);
        sql = `select gl.thired_id, gl.goods_id, gl.goods_price,concat('${paths}',gl.image_url) as image_url,gl.goods_name, count(ge.id) as evalNum  from goods_list as gl left join goods_eval as ge on gl.goods_id=ge.goods_id  where gl.thired_id = '${thiredId}' group by gl.goods_id ${str} limit ${skip},${limit}`;
        let [err, data] = await dbMySql.querys(sql);
        if(err === ""){
            res.send({
                code: 200,
                data,
                total,
            });
        }else {
            res.send({
                code: 500,
                result: "服务器异常"
            })
        }
    }else {
        res.send({
            code: 403,
            result: "信息填写异常，不能获取数据"
        })
    }
})
module.exports = router;