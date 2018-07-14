let url = 'ws://localhost:8082'
let ws = new WebSocket(url);
let userName = null, code = null

ws.onmessage = function (message)
{
    console.log(`接收数据: ${message.data}`)
};

ws.onclose = function()
{
    // 关闭 websocket
    console.log(`连接已关闭...`)
};

function getUserName() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: function (res) {
                resolve(res)
            },
            fail: function (res) {
                reject(res)
            }
        })
    }).then((res) => {
        return res['userInfo']['nickName']
    }, (res) => {
        return "小气鬼"
    })
}

function getCode() {
    return new Promise((resolve, reject) => {
        wx.login({
            //获取code
            success: function (res) {
                resolve(res)
            }
        })
    }).then((res)=>{
        return res.code
    })
}

async function login()
{
     [userName, code] =  await Promise.all([getUserName(), getCode()])
    ws.send(JSON.stringify({
        'type':'init',
        'userName':userName,
        'code':code
    }))
}