let Database = require('better-sqlite3');
let name = "data.db";
let db = new Database(name);

// 检查一个用户是否在表中
function checkUser(openId) {
    let row = db.prepare('SELECT * FROM flappygun WHERE openId=?').get([openId]);
    if(!row){
        return [false, null];
    }else {
        return [true, row];
    }
}

//添加一个新用户,默认金币数为0
function addNewUser(userName, openId) {
    db.prepare('insert into flappygun (coins, userName, openId) values (?, ?, ?)').run([0, userName, openId]);
}

// 更新用户金币数
function updateCoin(coins, openId) {
    db.prepare('update flappygun set coins=? where openId=?').run([coins, openId]);
}

// 查询排行榜前N个
function queryBoard(N) {
    let rows = db.prepare('SELECT * FROM flappygun order by coins desc').all();
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
};

// console.log(checkUser("123"));
// console.log(checkUser("456"));
// addNewUser("you", "id2");
// updateCoin(10, "id2");
// console.log(queryBoard(4));
// // ans = addNewUser("you", "id");