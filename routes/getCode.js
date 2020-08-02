const express = require("express");
const svgCaptcha = require("svg-captcha");
const router = express.Router();
router.get("/", (req, res)=>{
    let svgObj = svgCaptcha.create({
        height: 36,
        width: 150,
        noise: 3
    });
    res.send({
        code: 200,
        data: svgObj
    })
})
module.exports = router;