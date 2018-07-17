cc.Class({
  extends: cc.Component,
  properties: {
    game: {
      default: null,
      serializable: false
    }
  },
  onCollisionEnter: function (other, self) {
    this.game.camera.removeTarget(this.node);
    this.game.despawnCoin(this.node);
  },
  update: function(dt) {
    if(this.game.deadline.y > this.node.y + cc.winSize.height){
      this.game.camera.removeTarget(this.node);
      this.game.despawnCoin(this.node);
    }
  }
});
