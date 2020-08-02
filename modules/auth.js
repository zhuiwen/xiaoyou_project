let { pwdstr } = require('./config');
// console.log(pwdstr, 111);
class Auths {
    //base64加密，将utf-8编码的字符串转换成base64编码的字符串
    static bases64(str) {
        if (typeof str !== 'string') {
            str = JSON.stringify(str);
        }
        return Buffer.from(str).toString('base64');
    }
    //base64解密
    static debases64(str) {
        return Buffer.from(str, 'base64').toString('utf-8');
    }
    //生成Token(JWT数据)
    static getToken(uid) {
        let header = { 'alg': "Base64", 'typ': 'JWT' }; //haeder部分

        //payload部分：用户自定义的，用于存放相关数据
        let payloads = {
            uid,
            'curt': new Date().getTime(),
            'last': 60 * 60 * 10 * 1000
        };

        let headerBase64 = this.bases64(header);
        // console.log(headerBase64, 111);
        let payloadBase64 = this.bases64(payloads);
        // console.log(payloadBase64, 222);

        //生成签名
        let sing = this.bases64(headerBase64 + payloadBase64 + pwdstr);

        return headerBase64 + '.' + payloadBase64 + '.' + sing;
    }

    //使用Token
    static decodeToken(req) {
        let authArr = req.headers.authorization.split('.');
        let payload = JSON.parse(this.debases64(authArr[1])); //base64解密
        // console.log(payload.uid, 88886);
        req.uid = payload.uid;
    }

}

module.exports = Auths;

// console.log(Auths.getToken(123));