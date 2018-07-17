const Player = require('Player');
const Coin = require('Coin');
const Bullet = require('Bullet');
const Client = require('Client');
const Coinaction = require('Coinaction');
cc.Class({
  extends: cc.Component,
  properties: {
    width: 0,
    height: 0,
    coinLabel: {
      default: null,
      type: cc.Label
    },
    player: {
      default: null,
      type: Player
    },
    coinPrefab: {
      default: null,
      type: cc.Prefab
    },
    bulletPrefab: {
      default: null,
      type: cc.Prefab
    },
    coinactionPrefab: {
      default: null,
      type: cc.Prefab
    },
    background: {
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
    clipNode: {
      default: null,
      type: cc.Node
    },
    clipGroup: {
      default: [],
      type: cc.Sprite
    },
    fullClip: {
      default: null,
      type: cc.Sprite
    },
    emptyClip: {
      default: null,
      type: cc.Sprite
    },
    gravity: 0,
    gameStart: false,
    maxHeight: 0,
    score: 0,
    window: 0,
    heightPerWindow: 0,
    deadlineSpacing: 400,
    clipSize: 20,
    currentClip: 0,
    coinNumber: 0,
  },

  onLoad: function() { 
    var self = this;
    this.player.node.on("pick-coin", function(event){
      self.spawnCoinaction(event.target.x, event.target.y);
    });
    this.player.node.on("pick-bullet", function(event){
      self.currentClip = self.clipSize;
      self.clipUpdate();
    });
    this.coinPool = new cc.NodePool("Coin");
    this.bulletPool = new cc.NodePool("Bullet");
    this.coinactionPool = new cc.NodePool("Coinaction");
    this.coinNumber = Global.coinNumber;
    this.gameStart = true;
    cc.game.addPersistRootNode(this.coinLabel.node);
    this.onStartGame();
  },

  onStartGame: function() {
    this.initPhysics();
    this.setupScene();
    this.setupInputControl();
    this.initCollide();
    this.spawnNewObject();
  },

  initPhysics: function() {
    var physicsManager = cc.director.getPhysicsManager();
    this.physicsManager = physicsManager;
    physicsManager.enabled = true;
    physicsManager.gravity = cc.v2(0, -this.gravity);
  },

  initCollide: function() {
    var collisionManager = cc.director.getCollisionManager();
    this.collisionManager = collisionManager;
    collisionManager.enabled = true;
  },

  setupScene: function() {
    this.player.node.setPosition(0, 0);
    this.maxHeight = 0;
    this.score = 0;
    this.window = 0;
    this.camera.enabled = true;
    this.currentClip = this.clipSize;
    this.clipUpdate();
    this.scoreLabel.string = "Current Height: 0";
    this.spawnCoin(0, this.player.node.height * 4);
  },

  setupInputControl: function() {
    if(this.touchListener != undefined)
      return;
    var self = this;
    this.touchListener = cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function(touch, event) {
        if(!self.gameStart)
          return;
        if(self.currentClip == 0)
          return;
        self.currentClip--;
        self.clipUpdate();
        if(!self.player.gravityAvailable){
          self.player.gravityAvailable = true;    
          self.player.rigidBody.type = cc.RigidBodyType.Dynamic;
        }
        self.player.fireAnimation.play("pistol_fire");
        self.player.flameAnimation.play("spark_flame");
        self.player.rigidBody.applyLinearImpulse(self.player.rigidBody.getWorldVector(new cc.Vec2(-self.player.recoil, 0)), self.player.rigidBody.getWorldPoint(new cc.Vec2(self.player.recoilPosX, self.player.recoilPosY)), true);
      }
    }, self.node)
  },

  coinNumberUpdate: function(){
    this.coinLabel.string = this.coinNumber;
  },

  clipUpdate: function() {
    var bulletNum = Math.ceil(this.currentClip / this.clipSize * 10);
    for(var i = 0; i < bulletNum; i++)
      this.clipGroup[i].spriteFrame = this.fullClip.spriteFrame.clone();
    for(var i = bulletNum; i < 10; i++)
      this.clipGroup[i].spriteFrame = this.emptyClip.spriteFrame.clone();
  },

  heightUpdate: function() {
    this.maxHeight = Math.max(this.player.node.y, this.maxHeight);
    this.deadline.setPosition(this.player.node.x, this.maxHeight - this.deadlineSpacing);
    if(Math.round(this.player.node.y * this.heightPerWindow / this.height) > this.score){
      this.score = Math.round(this.player.node.y * this.heightPerWindow / this.height);
      this.scoreLabel.string = "Current Height: " + this.score;
    }
  },

  objectUpdate: function() {
    if(Math.round(this.player.node.y / this.height) > this.window) {
      this.window = Math.round(this.player.node.y / this.height);
      this.spawnNewObject();   
    }
  },

  backgroundShift: function() {
    let w = this.width, h = this.height;
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

  spawnCoinaction: function(posX, posY) {
    var newCoinaction = null;
    if(this.coinactionPool.size() > 0)
      newCoinaction = this.coinactionPool.get(this);
    else
      newCoinaction = cc.instantiate(this.coinactionPrefab);
    this.node.addChild(newCoinaction);
    newCoinaction.getComponent("Coinaction").game = this;
    newCoinaction.getComponent("Coinaction").move(posX, posY);
  },

  spawnCoin: function(posX, posY) {
    var newCoin = null;
    if(this.coinPool.size() > 0){
      newCoin = this.coinPool.get(this);
      newCoin.getComponent("Coin").enabled = true;
    }
    else
      newCoin = cc.instantiate(this.coinPrefab);
    this.node.addChild(newCoin);
    newCoin.setPosition(posX, posY);
    newCoin.getComponent("Coin").game = this;
    this.camera.addTarget(newCoin);
  },

  spawnBullet: function(posX, posY) {
    var newBullet = null;
    if(this.bulletPool.size() > 0){
      newBullet = this.bulletPool.get(this);
      newBullet.getComponent("Bullet").enabled = true;
    }
    else
      newBullet = cc.instantiate(this.bulletPrefab);
    this.node.addChild(newBullet);
    newBullet.setPosition(posX, posY);
    newBullet.getComponent("Bullet").game = this;
    this.camera.addTarget(newBullet);
  },

  spawnNewObject: function() {
//    var mode = Math.floor(4 * cc.random0To1());
    var mode = 0;
    switch(mode) {
      case 0:
        for(var i = -2; i < 3; i++)
          for(var j = -1; j < 2; j++)
            for(var k = -1; k < 2; k++)
              this.spawnCoin(this.background[0].x + k * this.width + j * this.width / 4, (this.window + 1) * this.height + i * this.height / 7);
        break;
      case 1:
        for(var i = -2; i < 3; i++)
          for(var j = -1; j < 2; j++)
            for(var k = -1; k < 2; k++)
              this.spawnCoin(this.background[0].x + k * this.width + i * this.width / 7, (this.window + 1) * this.height + this.height * j / 4);
        break;
      case 2: 
        for(var i = -2; i < 3; i++)
          for(var j = -1; j < 2; j+=2)
            for(var k = -1; k < 2; k++)
              this.spawnCoin(this.background[0].x + k * this.width + j * this.width / 4, (this.window + 1) * this.height + i * this.height / 7);
        for(var i = -1; i < 2; i++)
          for(var k = -1; k < 2; k++)
            this.spawnBullet(this.background[0].x + k * this.width, (this.window + 1) * this.height + i * this.height / 7);
        break;
      case 3:
        break;
    }
  },

  despawnCoin: function(node) {
    this.camera.removeTarget(node);
    this.coinPool.put(node);
  },

  despawnBullet: function(node) {
    this.camera.removeTarget(node);
    this.bulletPool.put(node);
  },

  despawnCoinaction: function(node) {
    this.coinactionPool.put(node);
  },

  endGame: function() {
    this.physicsManager.enabled = false;
    this.collisionManager.enabled = false;
    this.player.node.active = false;
    this.deadline.active = false;
    var coinList = this.node.getComponentsInChildren("Coin");
    for(var i = 0; i < coinList.length; i++)
      this.despawnCoin(coinList[i].node);
    var bulletList = this.node.getComponentsInChildren("Bullet");
    for(var i = 0; i < bulletList.length; i++)
      this.despawnBullet(bulletList[i].node);
    this.clipNode.active = false;
    this.gameStart = false;
    this.node.active = false;
    Global.coinNumber = this.coinNumber;
    Global.score = this.score;
    cc.director.loadScene("finish");
  },
  
  update: function(dt) {
    if(this.gameStart){
      this.backgroundShift();
      this.heightUpdate();
      this.objectUpdate();
      if(this.deadline.y > this.player.node.y + Math.abs(this.player.node.width / 2 * Math.sin(this.player.node.rotation / 180 * Math.PI))){
        this.endGame();
      }
    }
  }
});
