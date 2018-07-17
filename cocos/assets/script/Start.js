// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        width: 0,
        height: 0,
        textUpper: {
            default: [],
            type: cc.Node
          },
          textLower: {
            default: [],
            type: cc.Node
          },
    },

    textShift: function(){
        let w = this.width, h = this.height;
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

    changeScene(){
        cc.director.loadScene("main");
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        this.textShift();
    },

});
