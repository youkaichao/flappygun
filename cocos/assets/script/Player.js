cc.Class({
  extends: cc.Component,
  properties: {
    recoil: 0,
    recoilPosX: 0,
    recoilPosY: 0,
    gravityAvailable: false,
    rigidBody: {
      default: null,
      type: cc.RigidBody
    },
    polygonCollider: {
      default: null,
      type: cc.PhysicsPolygonCollider
    },
    animation: {
      default: null,
      type: cc.Animation
    }
  },

  onLoad: function () {
    this.rigidBody.awake = false
    this.node.zIndex = 5
  },

  onAnimationFinished: function(){
    console.log("Finished!");
  },

  update: function (dt) {}
})
