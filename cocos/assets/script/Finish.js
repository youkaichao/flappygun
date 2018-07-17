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
      this.scoreLabel.string = "Current Height: " + Global.score;
      this.coinLabel.string = Global.coinNumber;
    },
    changeScene(){
        cc.director.loadScene("start");
    },
});
