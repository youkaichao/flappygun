// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.ScrollView)
    rankingScrollView : cc.ScrollView = null;

    @property(cc.Node)
    scrollViewContent : cc.Node = null;

    @property(cc.Prefab)
    prefabRankItem : cc.Prefab = null;

    @property(cc.Node)
    loadingLabel : cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if (CC_WECHATGAME) {
            
            let self = this;
            
            window.wx.onMessage(async (data) =>{
              if(data.show)
              {
                self.showLoading();
                await self.updateScore(data.score);
                await self.showRank(data.score);
              }else{
                await self.updateScore(data.score);
              }
            });
        }else{}
    };

    showLoading () {
        this.node.removeChildByTag(1000);
        this.rankingScrollView.node.active = false;
        this.scrollViewContent.removeAllChildren();
        this.loadingLabel.getComponent(cc.Label).string = "loading...";
        this.loadingLabel.active = true;
    };

    async updateScore(score){
      let shouldUpdateScore = await new Promise((resolve, reject)=>{
        window.wx.getUserCloudStorage({
            keyList: ["score"],
            success: function (getres) {
                resolve(getres);
            },
            fail: function (res) {
            }
        });
        }).then((getres)=>{
            if (getres.KVDataList.length !== 0 && parseInt(getres.KVDataList[0].value) > score) {
                return false;
            }
            return true;
        });

    if(shouldUpdateScore)
    {
        await new Promise((resolve, reject)=>{
            window.wx.setUserCloudStorage({
                KVDataList: [{key: "score", value: `${score}`}],
                success: function (res) {
                    resolve(res);
                },
                fail: function (res) {
                }
            });
        }).then((data)=>{

        });
    }
    };
    
    async showRank (score)
    {
        this.rankingScrollView.node.active = true;

        let userData = await new Promise(resolve =>{
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes)=>{resolve(userRes, true);},
                fail: (res) => {
                    resolve(res, false);
                }
            });
        }).then((userRes, noError)=>{
            if(noError)
            {
                let userData = userRes.data[0];
                return userData;
            }else{
                // this.loadingLabel.getComponent(cc.Label).string = "failed to load data.";
                return userRes.data[0];
            }
        });

        let data = await new Promise((resolve, reject)=>{
            wx.getFriendCloudStorage({
                keyList: ["score"],
                success : (res) => {resolve(res, true);},
                fail : (res) => {
                    resolve(res, false);
                }
            });
        }).then((res, noError)=>{
            if(noError)
            {
                let data = res.data;
                return data;
            }else{
                // this.loadingLabel.getComponent(cc.Label).string = "failed to load data.";
                return res.data;
            }
        });
        
        this.processData(data, userData);
    };
    // update (dt) {}

    processData(data, userData)
    {
        if(!data)
        {
            data = [];
            this.loadingLabel.getComponent(cc.Label).string = "failed to load data.";
        }else{
            this.loadingLabel.active = false;
            data.sort((a, b) => {
                if (a.KVDataList.length === 0 && b.KVDataList.length === 0) {
                    return 0;
                }
                if (a.KVDataList.length === 0) {
                    return 1;
                }
                if (b.KVDataList.length === 0) {
                    return -1;
                }
                return parseInt(b.KVDataList[0].value) - parseInt(a.KVDataList[0].value);
            });
            let findUser = false;
            for (let i = 0; i < data.length; i++) {
                var playerInfo = data[i];
                var item = cc.instantiate(this.prefabRankItem);
                item.getComponent('RankItem').init(i, playerInfo);
                this.scrollViewContent.addChild(item);
                if (data[i].avatarUrl === userData.avatarUrl && !findUser) {
                    let userItem = cc.instantiate(this.prefabRankItem);
                    userItem.getComponent('RankItem').init(i, playerInfo);
                    userItem.y = -700;
                    this.node.addChild(userItem, 1, 1000);
                    findUser = true;
                }
            }
            if (data.length <= 8) {
                let layout = this.scrollViewContent.getComponent(cc.Layout);
                layout.resizeMode = cc.Layout.ResizeMode.NONE;
            }
        }
    };
}
