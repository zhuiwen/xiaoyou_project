const express = require("express");
const router = express.Router();
const dbMySQL = require("../modules/dbMySql");
const paths = "http://106.13.114.114:5000/";
const auths = require("../modules/auth");
router.get("/",async (req, res)=>{
    let {goods_id} = req.query;
    let dataObj ={}
    //查询基本信息
    let sql = `select gl.goods_name, gl.goods_introduce, gl.goods_price, gl.goods_detailed_information, gf.first_name,gs.second_name,gt.thired_name, count(gt.thired_id) as sum from goods_list as gl left join category_first as gf on gl.first_id=gf.first_id left join category_second as gs on gl.second_id=gs.second_id left join category_thired as gt on gl.thired_id=gt.thired_id where gl.goods_id='${goods_id}' group by gl.goods_id`;
    // let sql = `select * from goods_list where goods_id=13024650000001000001`
    let [err, data] = await dbMySQL.querys(sql);
    dataObj.goods = data
    //查询图片
    sql = `select concat('${paths}', file_name) as imageUrl from goods_image where goods_id=${goods_id}`;
    let [, images] = await dbMySQL.querys(sql);
    dataObj.images = images;
    //查询商品评论
    sql = `select e.*,concat('${paths}', m.head_photo_url) as headurl, m.username from goods_eval as e left join member as m on m.uid=e.uid where e.goods_id='${goods_id}'`
    let [err1, evals] = await dbMySQL.querys(sql);
    dataObj.evals = evals;
    //查询产品规格
    sql = `select * from goods_style where goods_id='${goods_id}'`;
    let [, styles] = await dbMySQL.querys(sql);
    dataObj.styles = styles;
    res.send(dataObj)
});

//加入购物车
router.get('/shopadd', async(req, res) => {
    // console.log(req.headers.authorization, 887);
    //    res.send(req.headers);
    //    return ;
    //注意：使用Token(jwt数据)之后req对象里有个uid属性，其值为已登录用户id
        auths.decodeToken(req);

    //接参(商品id,商品规格、商品数量)
        let { goods_id = '', goods_num = 0, goods_style = '' } = req.query;
        console.log(req.query);
        goods_style = JSON.parse(goods_style);
        // console.log(goods_style, 889);
        // return;

        //根据商品id判断商品是否存在
        let sql = `select count(*) as n  from goods_list where goods_id='${goods_id}'`;
        let [e, goods] = await dbMySQL.querys(sql);
        if (goods[0].n == 0) {
            res.send({
                code: 500,
                tip:'该商品不存在，非法操作'
            });
            return ;
        }

        //判断当前用户是否添加过该商品
        sql = `select count(*) as num from shopcar where uid='${req.uid}' and goods_id='${goods_id}'`;

        let [, result] = await dbMySQL.querys(sql);
        if (result[0].num > 0) { //该商品已添加过
            res.send({
                code: 500,
                tip:'该商品已添加过'
            });
            return;
        }

        // sql = `insert into shopcar(uid,goods_id,style_obj,goods_num)values('${req.uid}','${goods_id}','${JSON.stringify(goods_style)}','${goods_num}')`;

        sql = `insert into shopcar(uid,goods_id,goods_num,style_obj)values('${req.uid}','${goods_id}','${goods_num}','111243')`;

        let [err, data] = await dbMySQL.querys(sql);
        if (err === '') {
            res.send({
                code: 200,
                tip:'添加成功'
            });
        } else {
            res.send({
                code: 500,
                tip:'添加失败'
            });
        }
});

module.exports = router;