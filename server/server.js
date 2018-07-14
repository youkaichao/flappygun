let ws = require("nodejs-websocket")
let request = require('request')

let model = require("./model")

let appid = 'wxc1863062ee823b05'
let secret = 'd325281df8db423352b40cd682207e11'

let code = '033MwljD0FoVke2dDuiD0q15jD0Mwljx'

function convertCodeToOpenID(code) {
    request(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
        {},
        (err, data)=>{
            if(!err)
            {
                let openid = data.body.openid
            }
        }
    )
}

async function init(conn, code) {

}

// let server = ws.createServer(function (conn) {
//     conn.on('text', function (str) {
//         let data = JSON.parse(str)
//         if(data.init)
//         {
//             init(conn, data.code)
//         }
//         conn.sendText('hello!')
//         console.log(`接收到:${str}`)
//     })
//
//     conn.on("close", function (code, reason) {
//     })
//     conn.on("error", function (code, reason) {
//
//     });
// }).listen(8082);
