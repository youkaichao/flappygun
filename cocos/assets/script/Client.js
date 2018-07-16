let url = 'http://localhost:12306';
let user = {
    userName:null,
    code:null,
    coins:null,
    openId:null
};

setTimeout(function () {
    user.userName = "该死";
    user.code = "123";
    user.coins = 123;
    user.openId = "123";
},3000);

function update()
{

}

function getLeaderBoard(N)
{
    let ans = [];
    for (let i = 0; i < N; i++) {
        ans.push(user);
    }
    return ans;
}

function isReady()
{
    return !!user.openId;
}

module.exports = {
    "user":user,
    "update":update,
    "getLeaderBoard":getLeaderBoard,
    "isReady":isReady
};