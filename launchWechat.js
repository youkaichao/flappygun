let path = require("path");
require('shelljs/global');
// console.log(`WechatTool -o ${path.join(__dirname, 'wechatgame')}`)
exec(`WechatTool -o ${path.join(__dirname, 'wechatgame')}`);