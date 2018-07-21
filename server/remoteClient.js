let url = 'https://youkc16.iterator-traits.com';
let user = {
    userName:null,
    code:null,
    coins:null,
    openId:null,
    gun : null
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
            "header":{
                "Content-Type":"form-data"
            },
            "success":(data)=>{resolve(data)}
        })
    }).then((data)=>{
        console.log(data.data);
        return data.data
    })
}

// initialization
(async function ()
{
    let userName = null, code = null, data = null;
    [userName, code] =  await Promise.all([getUserName(), getCode()]);
    data = await getInitData(userName, code);
    user.userName = userName;
    user.code = code;
    user.coins = data.coins;
    user.openId = data.openId;
    user.gun = data.gun;
})();

function isReady() {
    return !!user.openId;
}

function update(){
    if(!isReady())
    {
        return false;
    }
    wx.request({
        "url":url + '/update',
        "method":"POST",
        "header":{
            "Content-Type":"form-data"
        },
        "data":{
            "coins":user.coins,
            "openId":user.openId,
            "gun":user.gun,
        },
    });
    return true;
}

module.exports = {
    "user":user,
    "update":update,
    "isReady":isReady
};