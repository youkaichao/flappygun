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
    fireAnimation: {
      default: null,
      type: cc.Animation
    },
    flameAnimation: {
      default: null,
      type: cc.Animation
    }
  },

  onLoad: function () {
    this.node.zIndex = 5
  },

  onCollisionEnter: function (other, self) {
    var dict = {
      0: "coin",
      1: "bullet"
    };
    this.node.emit("pick-" + dict[other.tag]);
  },
  update: function (dt) {}
})
