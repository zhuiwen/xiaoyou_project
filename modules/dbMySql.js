const express = require("express");
const config = require("./config");
const mysql = require("mysql");
class dbMySql {
    constructor() {
        this.mysqlObj = mysql.createConnection(config.configure);
        this.mysqlObj.connect();
    }
    exec(sql){
        return new Promise((resolve, reject) => {
            this.mysqlObj.query(sql, (err, result)=>{
                if(!err){
                    resolve(['', result])
                }else {
                    resolve([err, ''])
                }
            })
        })
    }
    async querys(sql){
        let data = await this.exec(sql);
        return data
    }
}
module.exports = new dbMySql()