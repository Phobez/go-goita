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
        lastAttackPiece: {
            default: null,
            // TODO: not actually node, but rather PIECE information (is this node?)
            type: cc.Node
        },
        x: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.deck = [];
        this.currentPlayer;
        this.lastAttackPlayer;
        this.passCounter = 0;
    },

    start () {
        shuffleDeck();
        chooseFirstPlayer();
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

    chooseFirstPlayer(){
        this.firstPlayerIndex = Math.floor((Math.random() * this.player.length));
        player[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, this.lastAttackPiece);
        this.currentPlayerIndex = this.firstPlayerIndex;
    },

    advanceTurn(attackPiece){
        this.lastAttackPiece = attackPiece;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 3;
        // if pass counter is 3 or more,
        // start player turn with isFlipped true
        if(passCounter == 3){
            player[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(true, this.lastAttackPiece);
        }
        player[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(false, this.lastAttackPiece);
    },

    addPassCounter() {
        this.passCounter++;
    }

    //update (dt) {},
});
