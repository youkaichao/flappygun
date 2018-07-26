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
    buttonGroup: {
      default: [],
      type: cc.Button
    },
    gunNode: {
      default: [],
      type: cc.Node
    },
    valueLabel: {
      default: null,
      type: cc.Label
    },
    buttonAudio: {
      default: null,
      type: cc.AudioSource
    },
    purchaseAudio: {
      default: null,
      type: cc.AudioSource
    },
    audioEnable: {
      default: null,
      type: cc.Button
    },
    muteEnable: {
      default: null,
      type: cc.Button
    },
    selectStatus: 0,
    duration: 1,
    currentGun: 0,
    gunNumber: 5,
  },
  onLoad: function(){
    this.gunValue = [0, 1000, 2000, 3000, 5000];
    this.buttonGroup[0].node.zIndex = 3;
    this.timer = setInterval(()=>{
      Client.init()
      if(Client.user.authorized){
        clearInterval(this.timer);
        cc.game.resume();
        this.coinLabel.string = Client.user.coins;
        for(var i = 0; i < 3; i++)
          this.buttonGroup[i].interactable = true;
      }
      else{
        for(var i = 0; i < 3; i++)
          this.buttonGroup[i].interactable = false;
      }
    }, 100);
    if(Client.user.mute) 
      this.setMute();
    else
      this.setAudio();
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
  gunShiftLeft: function() {
    var leftGun = this.gunNode[(this.currentGun+Math.floor((this.gunNumber+1)/2))%this.gunNumber];
    leftGun.setPositionX(leftGun.x + 640 * this.gunNumber);
    for(var i = 0; i < 5; i++)
      this.gunNode[i].runAction(cc.moveBy(this.duration, -640, 0).easing(cc.easeCubicActionOut()));
    this.currentGun = (this.currentGun + 1) % this.gunNumber;
    this.buttonUpdate();
    this.buttonAudio.play();
  },
  gunShiftRight: function() {
    var rightGun = this.gunNode[(this.currentGun+Math.floor((this.gunNumber-1)/2))%this.gunNumber];
    rightGun.setPositionX(rightGun.x - 640 * this.gunNumber);
    for(var i = 0; i < 5; i++)
      this.gunNode[i].runAction(cc.moveBy(this.duration, 640, 0).easing(cc.easeCubicActionOut()));
    this.currentGun = (this.currentGun + this.gunNumber - 1) % this.gunNumber;
    this.buttonUpdate();
    this.buttonAudio.play();
  },
  changeScene: function() {
    this.buttonAudio.play();
    Client.user.currentGun = this.currentGun;
    cc.director.loadScene("main");
  },
  buttonUpdate: function() {
    this.valueLabel.string = this.gunValue[this.currentGun];
    switch(this.selectStatus){
      case 0:
        if((Client.user.gun&(1<<this.currentGun)) != 0)
          return;
        this.buttonGroup[0].node.runAction(cc.fadeOut(this.duration / 2));
        this.buttonGroup[0].node.zIndex = 1;
        if(Client.user.coins >= this.gunValue[this.currentGun])
          this.selectStatus = 1;
        else
          this.selectStatus = 2;
        break;
      case 1:
        if((Client.user.gun&(1<<this.currentGun)) == 0 && Client.user.coins >= this.gunValue[this.currentGun])
          return;
        this.buttonGroup[1].node.runAction(cc.fadeOut(this.duration / 2));
        this.buttonGroup[1].node.zIndex = 1;
        if((Client.user.gun&(1<<this.currentGun)) != 0)
          this.selectStatus = 0;
        else
          this.selectStatus = 2;
        break;
      case 2:
        if((Client.user.gun&(1<<this.currentGun)) == 0 && Client.user.coins < this.gunValue[this.currentGun])
          return;
        this.buttonGroup[2].node.runAction(cc.fadeOut(this.duration / 2));
        this.buttonGroup[2].node.zIndex = 1;
        if((Client.user.gun&(1<<this.currentGun)) != 0)
          this.selectStatus = 0;
        else
          this.selectStatus = 1;
        break;
    }
    this.buttonGroup[this.selectStatus].node.runAction(cc.fadeIn(this.duration / 2));
    this.buttonGroup[this.selectStatus].node.zIndex = 3;
  },
  purchaseGun: function() {
    this.purchaseAudio.play();
    Client.user.coins -= this.gunValue[this.currentGun];
    Client.user.gun |= (1 << this.currentGun);
    this.coinLabel.string = Client.user.coins;
    this.buttonGroup[1].node.runAction(cc.fadeOut(this.duration / 2));
    this.buttonGroup[1].node.zIndex = 1;
    this.buttonGroup[0].node.runAction(cc.fadeIn(this.duration / 2));
    this.buttonGroup[0].node.zIndex = 3;
    Client.update();
  },
  setAudio: function() {
    this.muteEnable.node.active = false;
    this.audioEnable.node.active = true;
    this.buttonAudio.mute = false;
    this.purchaseAudio.mute = false;
    Client.user.mute = false;
  },
  setMute: function() {
    this.audioEnable.node.active = false;
    this.muteEnable.node.active = true;
    this.buttonAudio.mute = true;
    this.purchaseAudio.mute = true;
    Client.user.mute = true;
  },
  update: function(dt) {
    this.textShift();
  },
});
