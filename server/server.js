// ===============3rd party package
let express = require('express');
let app = express();
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
        return JSON.parse(data.body).openid
    })
}

async function getPayload(req){
    let str="";
    return new Promise((resolve, reject) => {
        req.on("data",function(dt){str+=dt;});
        req.on("end", resolve);
    }).then(()=>{
        console.log(JSON.parse(str));
        return JSON.parse(str);
    })
}

app.post('/init', async function (req, res) {
    let data = await getPayload(req);
    let openId = null;
    let userName = data['userName'];
    let code = data["code"];
    openId = await convertCodeToOpenID(code);
    [exist, data] = await model.checkUser(openId);
    console.log(data);
    if(!exist)
    {
        await model.addNewUser(userName, openId);
        data = {
            'userName':userName,
            'openId':openId,
            'coins':0,
            'gun' : 1
        }
    }
    res.set('content-type', 'application/json')
    res.json(data)
});

app.post('/update', async function (req, res) {
    let data = await getPayload(req);
    let coins = data["coins"];
    let openId = data["openId"];
    let gun = data["gun"];
    await model.updateCoin(coins, openId);
    await model.updateGun(gun, openId);
    res.status(200)
});

let server = app.listen(port);