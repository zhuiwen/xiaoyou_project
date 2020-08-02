const express = require("express");
const dbMySql = require("../modules/dbMySql");
const router = express.Router();
router.get("/topten", async (req, res)=>{
    let sql = `select * from search order by count desc limit 10`;
    let [err, data] = await dbMySql.querys(sql);
    if(!err){
        res.send({
            code: 200,
            data
        })
    }
});
module.exports = router;