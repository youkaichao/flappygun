cc.Class({
    extends: cc.Component,
    properties: {
      recoil: 0,  
      rigidbody: {
        default: null,
        type: cc.RigidBody
      }
    },
    onLoad: function() {
      this.rigidbody.awake = false
      this.setupInputControl();
      this.node.zIndex = 5;
      console.log(this.recoil);
      console.log(this.rigidbody);
    },
    setupInputControl: function() {
      var self = this;
      cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function(touch, event) {
          self.rigidbody.applyLinearImpulse(new cc.Vec2(0,100), new cc.Vec2(0,0), true)
        }
      }, self.node)
    },
    update: function(dt) {

    }
});
