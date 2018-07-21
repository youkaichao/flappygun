let Client = require("./Client");
cc.Class({
    extends: cc.Component,
    properties: {
      ggNode: {
        default: null,
        type: cc.Node
      },
      scoreLabel: {
        default: null,
        type: cc.Label
      },
      coinLabel: {
        default: null,
        type: cc.Label
      },
      resetButton: {
        default: null,
        type: cc.Button
      },
      ranklistButton: {
        default: null,
        type: cc.Button
      },
      gameoverAudio: {
        default: null,
        type: cc.AudioSource
      },
      duration: 0,
    },
    onLoad: function(){
      if(Client.user.mute)
        this.gameoverAudio.mute = true;
      this.gameoverAudio.play();
      this.scoreLabel.string = "Current Height: " + Client.user.score;
      this.coinLabel.string = Client.user.coins;
      var callBack = cc.callFunc(this.showButton, this);
      this.ggNode.runAction(cc.sequence(cc.moveBy(this.duration, 0, 750).easing(cc.easeCubicActionOut()), callBack));
    },
    showButton: function(){
      this.resetButton.node.runAction(cc.fadeIn(this.duration));
      this.ranklistButton.node.runAction(cc.fadeIn(this.duration));
    },
    replayGame(){
      cc.director.loadScene("start");
    },
    displayRankList(){
      cc.director.loadScene("rank");
    },
});
