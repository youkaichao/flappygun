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

//添加一个新用户,默认金币数为0,枪支状态为1，表示有最低级的枪
function addNewUser(userName, openId) {
    db.prepare('insert into flappygun (coins, userName, openId, gun) values (?, ?, ?, ?)').run([0, userName, openId, 1]);
}

// 更新用户金币数
function updateCoin(coins, openId) {
    db.prepare('update flappygun set coins=? where openId=?').run([coins, openId]);
}

// 更新用户金币数
function updateGun(gun, openId) {
    db.prepare('update flappygun set gun=? where openId=?').run([gun, openId]);
}


module.exports = {
    "checkUser":checkUser,
    "addNewUser":addNewUser,
    "updateCoin":updateCoin,
    "updateGun":updateGun
};

// console.log(checkUser("123"));
// console.log(checkUser("456"));
// console.log(addNewUser("you", "id2"));
// console.log(updateCoin(10, "id2"));
// console.log(updateGun(10, "id2"));
// console.log(checkUser("id2"));