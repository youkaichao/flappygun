cc.Class({
  extends: cc.Component,
  properties: {
    duration: 0,
  },
  move: function() {
    this.node.active = true;
    this.node.setPosition(0, -600);
    var action = cc.moveBy(this.duration, 0, 750).easing(cc.easeCubicActionOut());
    this.node.runAction(action);
  },
});
