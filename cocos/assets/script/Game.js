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
    }
  },
  initPhysics: function() {
    cc.director.getPhysicsManager().enabled = true;
    cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |cc.PhysicsManager.DrawBits.e_pairBit |cc.PhysicsManager.DrawBits.e_centerOfMassBit |cc.PhysicsManager.DrawBits.e_jointBit |cc.PhysicsManager.DrawBits.e_shapeBit;
    cc.director.getPhysicsManager().gravity = cc.v2(0, -40);
  },
  onLoad: function() {

  },
  onStartGame: function() {
    this.title.active = false;
    this.startButton.active = false;
//    this.startButton.setPositionX(2000);
    this.initPhysics();
    this.player.enabled = true;
    this.player.node.active = true;
  },
  update: function(dt) {
  }
});
