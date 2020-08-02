var express = require('express');
var router = express.Router();
var dbMySql = require("../modules/dbMySql");
var paths = "http://106.13.114.114:5000/";
var {getFlashTime} = require("../modules/flashTime");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

/*返回一级菜单*/
router.get('/category_first', async (req, res)=>{
  let sql = 'select * from category_first'
  let data = await dbMySql.querys(sql);
  if(data[0]===""){
    res.send(data)
  }
});
/*返回二级菜单*/
router.get("/category_second", async (req, res) => {
  let {first_id} = req.query;
  let sql = first_id ? `select * from category_second where first_id=${first_id}` : "select * from category_second";
  let data = await dbMySql.querys(sql);
  if(data[0]===""){
    res.send(data)
  }
})
/*返回三级菜单*/
router.get("/category_thired", async (req, res) => {
  let {second_id} = req.query;
  let sql = second_id ? `select * from category_thired where second_id=${second_id}` : "select * from category_thired";
  let data = await dbMySql.querys(sql);
  if(data[0]===""){
    res.send(data)
  }
});
/*返回banner轮播图*/
router.get("/index/banner", async (req, res)=>{
  let {id} = req.query;
  let sql = id ? `select * from banner where id=${id}`: `select * from banner`;
  let data = await dbMySql.querys(sql);
  if(data[0] === ''){
    res.send(data)
  }
})
/*返回抢购商品*/
router.get("/flash",async (req, res)=>{
  let sql1 = `select * from flash_sale`;
  let [err, flashGoodsArr] = await dbMySql.querys(sql1);
  //当前时间戳
  let nowTime = new Date();
  //抢购时间戳数组
  let flashTimeArr = getFlashTime([16, 20])
  if(!err){
    await Promise.all(flashGoodsArr.map(async item => {
      let sql2 = `select g.goods_id,g.goods_name,concat('${paths}',g.image_url) as image_url,g.goods_price,g.assem_price,sum(s.goods_num) as num  from flash_product  as f left join goods_list as g 
        on f.goods_id=g.goods_id 
        left join shopcar as s  on g.goods_id=s.goods_id 
        where flash_id='${item.flash_id}'  
        group by s.goods_id`;
      [, goods] = await dbMySql.querys(sql2);
      item['list_goods'] = goods;
    }))
    res.send({
      code: 200,
      flashGoodsArr,
      flashTimeArr,
      nowTime
    })
  }

});
/*返回排行榜*/
router.get("/topbang", async (req, res) => {
    let sql = ` select ct.thired_name, ct.thired_id from goods_eval as ge left join goods_list as gl on ge.goods_id = gl.goods_id left join category_thired as ct on gl.thired_id=ct.thired_id GROUP BY  ge.goods_id ORDER BY sum(ge.eval_start) desc limit 4`;
    let [err, cateArr] = await dbMySql.querys(sql);
    if(!err){
      await Promise.all(cateArr.map( async item => {
         let sql = `select gl.goods_id,gl.goods_name,concat('${paths}',gl.image_url) as image_url,gl.goods_price from goods_eval as gv left join goods_list as gl on gv.goods_id=gl.goods_id where gl.thired_id='${item.thired_id}' group by gv.goods_id order by sum(gv.eval_start) desc limit 3`;
         let [, goods] = await dbMySql.querys(sql);
        console.log(goods,222);
        item['goods_list'] = goods;
       }))
      res.send(cateArr)
    }else {
      res.send({
        code: 500,
        result: "查询失败"
      })
    }
});
//返回人气好货
router.get("/renqigoodslist", async (req, res)=>{
  let sql = `select gl.goods_name, concat('${paths}',gl.image_url) as image_url, gl.goods_price from goods_eval as ge left join goods_list as gl on ge.goods_id=gl.goods_id group by ge.goods_id order by sum(ge.eval_start) desc limit 8`
  let [err, goodsArr] = await dbMySql.querys(sql);
  if(!err){
    res.send({
      code: 200,
      goodsArr
    })
  }else {
    res.send({
      code: 500,
      result: "服务器异常"
    })
  }
})
//返回猜你喜欢
router.get("/youlike", async (req, res)=>{
  let sql = `select goods_price,concat('${paths}', image_url) as  image_url, goods_introduce from goods_list order by rand() limit 15`;
  let [err, list] = await dbMySql.querys(sql);
  if(err === ''){
    res.send({
      code: 200,
      list
    })
  }else {
    res.send({
      code: 500,
      result: '服务器异常'
    })
  }
});
//首页各项商品
router.get("/categoods", async (req, res)=>{
  console.log(111);
  let sql = `select  big_title, second_id, small_title, concat('${paths}', image_url) as image_url from home`;
  let [err, goodsList] = await dbMySql.querys(sql);
  if(err === ''){
     await Promise.all(goodsList.map(async item => {
        //获取三级标题
        let sql = `select thired_name, thired_id from  category_thired where second_id='${item.second_id}' limit 4`;
        item['thired_goods'] =( await dbMySql.querys(sql))[1];
        //获取该三级标题下的4个商品
        //item['goods_list'] = (await dbMySql.querys(sql))[1]
       await Promise.all(item['thired_goods'].map(async val => {
         sql = `select concat('${paths}', image_url) as image_url, goods_name, goods_introduce from goods_list where thired_id='${val.thired_id}' limit 4`;
         val['goods_list'] = (await dbMySql.querys(sql))[1]
       }))
      }))
    res.send(goodsList)
  }else {
    res.send({
      code: 500,
      result: '服务器异常'
    })
  }
})
module.exports = router;
