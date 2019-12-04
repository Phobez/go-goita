// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        player: {
            default: [],
            type :cc.Node
        },
        kingHasDefended: false,
        lastAttackPiece,
        x: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.teamOne = [player[0] , player[2]];
        //this.teamTwo = [player[1] , player[3]];
        this.deck = [];
        this.currentPlayer;
        this.lastAttackPlayer;
    },

    start () {
    },

    shuffleDeck(){
        this.deck = [];
        var index = 0;
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 8;j++){
                var random = Math.floor((Math.random() * this.deck.length));
                var randomPiece = this.deck[random];
                this.player[i].hand.push(this.randomPiece);
                this.deck.splice(this.randomPiece,1);
            }
        }
    },

    chooseRandomFirstPlayer(){
        this.firstPlayerIndex = Math.floor((Math.random() * this.player.length));
        //call firstplayer turn method
        this.currentPlayerIndex = this.firstPlayerIndex;
    },

    advanceTurn(){
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 3;
        // call next player turn method
    }

    //update (dt) {},
});
