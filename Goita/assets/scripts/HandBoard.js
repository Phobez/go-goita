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
            default: null,
            type: cc.Node
        },
        pieces: {
            default: [],
            type: cc.Node
        },
        flippedPieceSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        kingSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        rookSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        bishopSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        goldGeneralSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        silverGeneralSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        knightSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        lanceSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        pawnSprite: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hasFilledHand = false;
    },

    start () {

    },

    update (dt) {
        if (!(this.hasFilledHand) && this.player.getComponent('Player').handHasBeenFilled) {
            this.fillBoard();
            this.hasFilledHand = true;
        }
    },

    fillBoard () {
        for (var i = 0; i < 8; i++) {
            var pieceType = this.player.getComponent('Player').hand[i].type;
            this.pieces[i].getComponent('HandPiece').setHandPiece(pieceType);
        }
    },

    removePiece(piece) {
        var pieceIndex = 0;
        for (var i = 0; i < 8; i++) {
            if (piece == this.pieces[i]) {
                pieceIndex = i;
                break;
            }
        }
        this.player.getComponent('Player').putPiece(piece.getComponent('HandPiece').pieceType, pieceIndex);
    },

    deactivatePiece(index) {
        this.pieces[index].getComponent(cc.Button).interactable = false;
    },

    activatePiece(index) {
        this.pieces[index].getComponent(cc.Button).interactable = true;
    },

    deactivateAllPieces() {
        for (var i = 0; i < 8; i++) {
            this.pieces[i].getComponent(cc.Button).interactable = false;
        }
    },

    activateAllPieces() {
        for (var i = 0; i < 8; i++) {
            this.pieces[i].getComponent(cc.Button).interactable = true;
        }
    }
});
