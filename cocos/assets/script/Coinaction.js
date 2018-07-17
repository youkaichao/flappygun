cc.Class({
    extends: cc.Component,
    properties: {
      duration: 1,
      game: {
        default: null,
        serializable: false
      }
    },
    remove: function() {
      this.game.despawnCoinaction(this.node);
      this.game.coinNumber++;
      this.game.coinNumberUpdate();
    },
    move: function(posX, posY) {
      this.node.active = true;
      this.node.setPosition(0, 0);
      var action = cc.moveBy(this.duration, 280, 450).easing(cc.easeCubicActionOut());
      var callback = cc.callFunc(this.remove, this);
      this.node.runAction(cc.sequence(action, callback));
    },
});
