// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const GameManager = cc.Class({
    extends: cc.Component,

    ctor() {
        this.physManager = null;
        this.colManager = null;
    },

    properties: {
    },

    statics : {
        Instance: null
    },

    onLoad() {
        this.SingletonInit();
        this.physManager = cc.director.getPhysicsManager();
        this.physManager.enabled = true;

        this.colManager = cc.director.getCollisionManager();
        this.colManager.enabled = true;
        this.colManager.enabledDebugDraw = true;

    },

    SingletonInit() {
        if (GameManager.Instance == null) {
            GameManager.Instance = new GameManager();
        }
        else {
            this.node.destroy();
        }
    }

});

module.exports = GameManager;