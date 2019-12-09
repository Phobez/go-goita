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
        pieceType: '',
        player: {
            default: null,
            type: cc.Node
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

    // onLoad () {},

    start () {
        this.spriteComponent = this.getChildByName('Background').getComponent('Sprite');
    },

    setHandPiece(pieceType) {
        // sets piece type
        this.pieceType = pieceType;
        // shows appropriate sprite
        switch (pieceType) {
            case 'king':
                this.spriteComponent.spriteFrame = this.kingSprite;
                break;
            case 'rook':
                this.spriteComponent.spriteFrame = this.rookSprite;
                break;
            case 'bishop':
                this.spriteComponent.spriteFrame = this.bishopSprite;
                break;
            case 'gold general':
                this.spriteComponent.spriteFrame = this.goldGeneralSprite;
                break;
            case 'silver general':
                this.spriteComponent.spriteFrame = this.silverGeneralSprite;
                break;
            case 'knight':
                this.spriteComponent.spriteFrame = this.knightSprite;
                break;
            case 'lance':
                this.spriteComponent.spriteFrame = this.lanceSprite;
                break;
            case 'pawn':
                this.spriteComponent.spriteFrame = this.pawnSprite;
                break;
            default:
                this.spriteComponent.spriteFrame = null;
                break;
        }
    },

    sendToBoard () {
        this.player.getComponent('Player').putPiece(this.pieceType);
        this.setHandPiece('');
        this.getComponent('Button').interactable = false;
    },

    // update (dt) {},
});
