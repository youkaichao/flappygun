let sqlite  = require("sqlite-sync")
let name = "data.db"
sqlite.connect(name);

// 检查一个用户是否在表中
function checkUser(openId) {
    let rows = sqlite.run("SELECT * FROM flappygun where  openId=?", [openId]);
    if(rows.length === 0){
        return [false, null]
    }else {
        return [true, rows[0]]
    }
}

//添加一个新用户,默认金币数为0
function addNewUser(userName, openId) {
    sqlite.run("insert into flappygun (coins, userName, openId) values (?, ?, ?)", [0, userName, openId])
}

// 更新用户金币数
function updateCoin(coins, openId) {
    sqlite.run("update flappygun set coins=? where openId=?", [coins, openId])
}

// 查询排行榜前N个
function queryBoard(N) {
    let rows = sqlite.run("SELECT * FROM flappygun order by coins desc");
    if(rows.length > N)
    {
        return rows.slice(0, N)
    }else {
        return rows
    }
}

module.exports = {
    "checkUser":checkUser,
    "addNewUser":addNewUser,
    "updateCoin":updateCoin,
    "queryBoard":queryBoard
}