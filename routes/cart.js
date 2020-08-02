const express = require("express");
const app = express();
const router = express.Router();
app.use(express.urlencoded({extended: false}));
router.get("/", (req, res)=>{
    res.render("gouwuche.html")
})
module.exports = router;