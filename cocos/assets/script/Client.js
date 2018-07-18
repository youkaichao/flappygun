let url = 'http://localhost:12306';
let user = {
    userName:null,
    code:null,
    coins:null,
    openId:null,
    score:null,
    gun:null
};

setTimeout(function () {
    user.userName = "该死";
    user.code = "123";
    user.coins = 123;
    user.openId = "123";
    user.score = 123;
    user.gun = 1;
},1000);

function update()
{

}

function isReady()
{
    return !!user.openId;
}

module.exports = {
    "user":user,
    "update":update,
    "isReady":isReady
};