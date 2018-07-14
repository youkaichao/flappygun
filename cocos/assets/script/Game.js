const Player = require('Player');
cc.Class({
  extends: cc.Component,
  properties: {
    startButton: {
      default: null,
      type: cc.Node
    },
    title: {
      default: null,
      type: cc.Node
    },
    player: {
      default: null,
      type: Player
    },
    background: {
      default: [],
      type: cc.Node
    },
    camera: {
      default: null,
      type: cc.Camera
    },  
    gravity: 0,
    gameStart: false
  },
  initPhysics: function() {
    cc.director.getPhysicsManager().enabled = true;
    cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |cc.PhysicsManager.DrawBits.e_pairBit |cc.PhysicsManager.DrawBits.e_centerOfMassBit |cc.PhysicsManager.DrawBits.e_jointBit |cc.PhysicsManager.DrawBits.e_shapeBit;
    cc.director.getPhysicsManager().gravity = cc.v2(0, -this.gravity);
  },
  onLoad: function() {

  },
  onStartGame: function() {
    this.title.active = false;
    this.startButton.active = false;
    this.initPhysics();
    this.player.node.active = true;
    this.setupInputControl();
    this.gameStart = true;
  },
  setupInputControl: function() {
    var self = this;
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function(touch, event) {
        if(!self.player.gravityAvailable){
          self.player.gravityAvailable = true;
        }
        console.log(self.player.animation.play("pistol_fire").duration);
        self.player.rigidBody.applyLinearImpulse(self.player.rigidBody.getWorldVector(new cc.Vec2(-self.player.recoil, 0)), self.player.rigidBody.getWorldPoint(new cc.Vec2(-10, 0)), true);
      }
    }, self.node)
  },
  backgroundShift: function() {
    let w = cc.winSize.width, h = cc.winSize.height;
    let LC = this.player.node.x - w/2, RC = this.player.node.x + w/2, DC = this.player.node.y - h/2, UC = this.player.node.y + h/2;
    let LB = this.background[0].x - w/2, DB = this.background[1].y - h/2, UB = this.background[2].y + h/2, RB = this.background[3].x + w/2;
    if(LC < LB){
      console.log("Shift left");
      for(var i = 0; i < 4; i++)
        this.background[i].setPositionX(this.background[i].x - w);
    }
    else if(RC > RB){
      console.log("Shift right");
      for(var i = 0; i < 4; i++)
        this.background[i].setPositionX(this.background[i].x + w);
    }
    if(DC < DB){
      console.log("Shift down");
      for(var i = 0; i < 4; i++)
        this.background[i].setPositionY(this.background[i].y - h);
    }
    else if(UC > UB){
      console.log("Shift up");
      for(var i = 0; i < 4; i++)
        this.background[i].setPositionY(this.background[i].y + h);
    }
  },
  update: function(dt) {
    if(this.gameStart)
      this.backgroundShift();
  }
});
