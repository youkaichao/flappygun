// ===============3rd party package
let express = require('express');
let app = express();
let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();
let request = require('request');

// ================local package
let model = require("./model");

// =============some config
let appid = 'wxc1863062ee823b05',secret = 'd325281df8db423352b40cd682207e11',port = 12306

function convertCodeToOpenID(code) {
    return new Promise((resolve, reject) => {
        request(
            `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
            {},
            (err, data)=>{
                resolve(data)
            }
        )
    }).then((data)=>{
        return data.body.openid
        // resolve(data.body.openid)
    })
}

app.post('/init', multipartMiddleware, async function (req, res) {
    let openID = null;
    userName = req.param("userName");
    code = req.param("code");
    openID = await convertCodeToOpenID(code);
    [exist, data] = await model.checkUser(openID);
    if(!exist)
    {
        await model.addNewUser(userName, openID);
        data = {
            'userName':userName,
            'openID':openID,
            'coins':0
        }
    }
    res.set('content-type', 'application/json')
    res.json(data)
});

app.post('/update', multipartMiddleware, async function (req, res) {
    coins = req.param("coins");
    openID = req.param("openID");
    await model.updateCoin(coins, openID);
    res.status(200)
});

app.post('/getLeaderBoard', multipartMiddleware, async function (req, res) {
    number = req.param("number");
    rows = await model.queryBoard(number);
    res.set('content-type', 'application/json')
    res.json(rows)
});

let server = app.listen(port);