let sqlite  = require("sqlite-sync")
let name = "data.db"
sqlite.connect(name);

// 检查一个用户是否在表中
function checkUser(openID) {
    let rows = sqlite.run("SELECT * FROM flappygun where  openID=?", [openID]);
    if(rows.length === 0){
        return [false, null]
    }else {
        return [true, rows[0]]
    }
}

//添加一个新用户,默认金币数为0
function addNewUser(userName, openID) {
    sqlite.run("insert into flappygun (coins, userName, openID) values (?, ?, ?)", [0, userName, openID])
}

// 更新用户金币数
function updateCoin(coins, openID) {
    sqlite.run("update flappygun set coins=? where openID=?", [coins, openID])
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