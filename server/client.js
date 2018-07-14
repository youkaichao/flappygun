let url = 'http://localhost:12306';
let user = {
    userName:null,
    code:null,
    coins:null,
    openID:null
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

function getInitData(userName, code) {
    return new Promise((resolve, reject) => {
        wx.request({
            "url":url + '/init',
            "method":"POST",
            "data":{
                "userName":userName,
                "code":code
            },
            "success":(data)=>{resolve(data)}
        })
    }).then((data)=>{
        return data
    })
}

// initialization
(async function ()
{
    [userName, code] =  await Promise.all([getUserName(), getCode()]);
    data = await getInitData(userName, code);
    user.userName = userName;
    user.code = code;
    user.coins = data.coins;
    user.openID = data.openID;
})();

function update() {
    wx.request({
        "url":url + '/update',
        "method":"POST",
        "data":{
            "coins":user.coins,
            "openID":user.openID
        },
    })
}

function getLeaderBoard(N) {
    return new Promise((resolve, reject) => {
        wx.request({
            "url":url + '/getLeaderBoard',
            "method":"POST",
            "data":{
                "number":number
            },
            "success":(data)=>{resolve(data)}
        })
    }).then((data)=>{
        return data
    })
}

module.exports = {
    "user":user,
    "update":update,
    "getLeaderBoard":getLeaderBoard
};