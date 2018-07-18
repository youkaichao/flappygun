let Client = require("./Client");
cc.Class({
  extends: cc.Component,
  properties: {
    width: 0,
    height: 0,
    textUpper: {
      default: [],
      type: cc.Node
    },
    textLower: {
      default: [],
      type: cc.Node
    },
    coinLabel: {
      default: null,
      type: cc.Label
    },
    startButton: {
      default: null,
      type: cc.Button
    },
    coinNumber: 0,
  },
  onLoad: function(){
    this.timer = setInterval(()=>{
      if(Client.isReady()){
        clearInterval(this.timer);
        this.coinNumber = Client.user.coins;
        this.coinLabel.string = this.coinNumber;
        this.startButton.interactable = true;
      }else{
        this.startButton.interactable = false;
      }
    }, 10);
  },
  textShift: function(){
    let w = this.width, h = this.height;
    let pos0L = this.textLower[0].x, pos1L = this.textLower[1].x;
    if(pos1L <= 0){
      pos1L += w;
      pos0L += w;
    }
    this.textLower[0].setPositionX(pos0L - 5);
    this.textLower[1].setPositionX(pos1L - 5);
    let pos0U = this.textUpper[0].x, pos1U = this.textUpper[1].x;
    if(pos0U >= 0){
      pos0U = pos0U - w;
      pos1U = pos1U - w;
    }
    this.textUpper[0].setPositionX(pos0U + 5);
    this.textUpper[1].setPositionX(pos1U + 5);
  },
  changeScene(){
    cc.director.loadScene("main");
  },
  update (dt) {
    this.textShift();
  },
});
