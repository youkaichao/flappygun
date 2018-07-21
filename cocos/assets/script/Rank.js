let Client = require("./Client");
cc.Class({
    extends: cc.Component,
    properties: {
        rankingScrollView: cc.Sprite,// container to show rank list
        width : 600,
        height : 1200,
    },
    onLoad: function(){
    },
    start : function(){
        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = this.width;
            window.sharedCanvas.height = this.height;
            window.wx.postMessage({
                score: Client.user.score,
                show : true
            });
        }else {
            cc.log(`post message to update score and show rank list. score is ${Client.user.score}`);
        }
    },

    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    update() {
        this._updateSubDomainCanvas();
    },

    replayGame(){
      cc.director.loadScene("start");
    },
});