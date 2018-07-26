let url = 'https://youkc16.iterator-traits.com';
let user = {
    userName: null,
    code: null,
    coins: null,
    openId: null,
    gun: null,
    failed: false,
    authorized: false,
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
              if(user.failed)
                return
              cc.game.pause()
              user.failed = true
              wx.showModal({
                title: "注意",
                content: "您尚未授权, 进入游戏请点击右上角...标记->关于FlippingGun->右上角...标记->设置, 将[使用我的用户信息]设为[允许]. 点击[确认]进入游戏开始界面并手动授权, 点击[取消]退出游戏",
                success: function(res){
                  if(res.cancel)
                    wx.exitMiniProgram({})
                }             
              })
              reject(res)
            }
        })
    }).then((res) => {
        return res['userInfo']['nickName']
    }, (res) => {
        return null
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
        return data.data
    })
}

// initialization
async function init()
{
    let userName = null, code = null, data = null;
    [userName, code] =  await Promise.all([getUserName(), getCode()]);
    data = await getInitData(userName, code);
    user.userName = userName;
    if(userName != null) 
      user.authorized = true
    user.code = code;
    user.coins = data.coins;
    user.openId = data.openId;
    user.gun = data.gun;
}

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
    "isReady":isReady,
    "init":init
};