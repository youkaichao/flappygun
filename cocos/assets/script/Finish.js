let Client = require("./Client");
cc.Class({
    extends: cc.Component,
    properties: {
      scoreLabel: {
        default: null,
        type: cc.Label
      },
      coinLabel: {
        default: null,
        type: cc.Label
      },
    },
    onLoad: function(){
      this.scoreLabel.string = "Current Height: " + Client.user.score;
      this.coinLabel.string = Client.user.coins;
    },
    changeScene(){
        cc.director.loadScene("start");
    },
});
