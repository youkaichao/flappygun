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
    this.game.despawnBullet(this.node);
  }
});