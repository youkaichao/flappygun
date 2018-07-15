const Player = require('Player');
const Coin = require('Coin');
const Bullet = require('Bullet');
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
    coinPrefab: {
      default: null,
      type: cc.Prefab
    },
    bulletPreflab: {
      default: null,
      type: cc.Prefab
    },
    background: {
      default: [],
      type: cc.Node
    },
    textUpper: {
      default: [],
      type: cc.Node
    },
    textLower: {
      default: [],
      type: cc.Node
    },
    camera: {
      default: null,
      type: cc.Camera
    }, 
    deadline: {
      default: null,
      type: cc.Node
    },
    scoreLabel: {
      default: null,
      type: cc.Label
    },
    gravity: 0,
    gameStart: false,
    maxHeight: 0,
    score: 0,
    heightPerWindow: 0,
    deadlineSpacing: 400
  },
  initPhysics: function() {
    var physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;
    physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |cc.PhysicsManager.DrawBits.e_pairBit |cc.PhysicsManager.DrawBits.e_centerOfMassBit |cc.PhysicsManager.DrawBits.e_jointBit |cc.PhysicsManager.DrawBits.e_shapeBit;
    physicsManager.gravity = cc.v2(0, -this.gravity);
  },
  initCollide: function() {
    var collisionManager = cc.director.getCollisionManager();
    collisionManager.enabled = true;
    collisionManager.enabledDebugDraw = true;
    collisionManager.enabledDrawBoundingBox = true;
  },
  onLoad: function() {
    var self = this;
    this.player.node.on("pick-coin", function(event){
      console.log("pick-coin");
    });
    this.player.node.on("pick-bullet", function(event){
      console.log("pick-bullet");
    });
    this.coinPool = new cc.NodePool("Coin");
    this.bulletPool = new cc.NodePool("Bullet");
  },
  onStartGame: function() {
    this.initPhysics();
    this.setupScene();
    this.setupInputControl();
    this.initCollide();
    this.spawnNewObject("coin");
  },
  setupScene: function() {
    this.title.active = false;
    console.log(this.player.flameAnimation.node.active);
    this.player.node.active = true;
    this.player.flameAnimation.node.active = true;
    this.deadline.active = true;
    this.startButton.active = false;
    this.scoreLabel.node.active = true;
    this.textLower[0].active = false;
    this.textLower[1].active = false;
    this.textUpper[0].active = false;
    this.textUpper[1].active = false;
    this.gameStart = true;
  },
  setupInputControl: function() {
    var self = this;
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function(touch, event) {
        if(!self.player.gravityAvailable){
          self.player.gravityAvailable = true;    
          self.player.rigidBody.type = cc.RigidBodyType.Dynamic;
        }
        self.player.fireAnimation.play("pistol_fire");
        console.log(self.player.flameAnimation.play("spark_flame").duration);
        self.player.rigidBody.applyLinearImpulse(self.player.rigidBody.getWorldVector(new cc.Vec2(-self.player.recoil, 0)), self.player.rigidBody.getWorldPoint(new cc.Vec2(self.player.recoilPosX, self.player.recoilPosY)), true);
      }
    }, self.node)
  },
  backgroundShift: function() {
    let w = cc.winSize.width, h = cc.winSize.height;
    let LC = this.player.node.x - w/2, RC = this.player.node.x + w/2, DC = this.player.node.y - h/2, UC = this.player.node.y + h/2;
    let LB = this.background[0].x - w/2, DB = this.background[1].y - h/2, UB = this.background[2].y + h/2, RB = this.background[3].x + w/2;
    if(LC < LB){
      for(var i = 0; i < 4; i++)
        this.background[i].setPositionX(this.background[i].x - w);
    }
    else if(RC > RB){
      for(var i = 0; i < 4; i++)
        this.background[i].setPositionX(this.background[i].x + w);
    }
    if(DC < DB){
      for(var i = 0; i < 4; i++)
        this.background[i].setPositionY(this.background[i].y - h);
    }
    else if(UC > UB){
      for(var i = 0; i < 4; i++)
        this.background[i].setPositionY(this.background[i].y + h);
    }
  },
  textShift: function(){
    let w = cc.winSize.width, h = cc.winSize.height;
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
  spawnNewObject: function(name) {
    switch(name){
      case "coin":
        this.spawnCoin();
        break;
      case "bullet":
        this.spawnBullet();
        break;
    }
  },
  spawnCoin: function() {
    var newCoin = null;
    if(this.coinPool.size() > 0)
      newCoin = this.coinPool.get(this);
    else
      newCoin = cc.instantiate(this.coinPrefab);
    this.node.addChild(newCoin);
    newCoin.getComponent("Coin").game = this;
    this.camera.addTarget(newCoin);
  },
  spawnBullet: function() {
    var newBullet = null;
    if(this.bulletPool.size() > 0)
      newBullet = this.BulletPool.get(this);
    else
      newBullet = cc.instantiate(this.bulletPrefab);
    this.node.addChild(newBullet);
    newBullet.getComponent("Bullet").game = this;
    this.camera.addTarget(newBullet);
  },
  heightUpdate: function() {
    this.maxHeight = Math.max(this.player.node.y, this.maxHeight);
    this.deadline.setPosition(this.player.node.x, this.maxHeight - this.deadlineSpacing);
    if(this.player.node.y * this.heightPerWindow / cc.winSize.height > this.score){
      this.score = Math.round(this.player.node.y * this.heightPerWindow / cc.winSize.height);
      this.scoreLabel.string = "Current Score: " + this.score;
    }
  },
  endGame: function() {

  },
  despawnCoin: function(node) {
    this.coinPool.put(node);
  },
  despawnBullet: function(node) {
    this.bulletPool.put(node);
  },
  update: function(dt) {
    if(!this.gameStart)
      this.textShift();
    if(this.gameStart){
      this.backgroundShift();
      this.heightUpdate();
      if(this.deadline.y > this.player.node.y + Math.abs(this.player.node.width / 2 * Math.sin(this.player.node.rotation / 180 * Math.PI))){
        this.endGame();
      }
    }
  }
});
