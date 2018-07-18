let fs = require("fs");
let data = fs.readFileSync('wechatgame/project.config.json', 'utf-8');
let json = JSON.parse(data);
json.setting.urlCheck = false;
fs.writeFileSync('wechatgame/project.config.json', JSON.stringify(json) ,  {encoding : 'utf-8'});