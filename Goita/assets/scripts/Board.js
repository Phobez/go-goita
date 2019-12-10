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
        gameManager: {
            default: null,
            type: cc.Node
        },
        pieces: {
            default: [],
            type: cc.Sprite
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
        this.pieceCounter = 0;
        this.pieceTypes = [];
    },

    start () {
        
    },

    addPieceToBoard(isFlipped, pieceType) {
        // if isFlipped
        // add flipped piece to board
        // else
        // add open piece to board
        if (isFlipped) {
            this.pieces[this.pieceCounter].spriteFrame = this.flippedPieceSprite;
            this.pieceTypes.push('');
        } else {
            switch (pieceType) {
                case 'king':
                    this.pieces[this.pieceCounter].spriteFrame = this.kingSprite;
                    break;
                case 'rook':
                    this.pieces[this.pieceCounter].spriteFrame = this.rookSprite;
                    break;
                case 'bishop':
                    this.pieces[this.pieceCounter].spriteFrame = this.bishopSprite;
                    break;
                case 'gold':
                    this.pieces[this.pieceCounter].spriteFrame = this.goldGeneralSprite;
                    break;
                case 'silver':
                    this.pieces[this.pieceCounter].spriteFrame = this.silverGeneralSprite;
                    break;
                case 'knight':
                    this.pieces[this.pieceCounter].spriteFrame = this.knightSprite;
                    break;
                case 'lance':
                    this.pieces[this.pieceCounter].spriteFrame = this.lanceSprite;
                    break;
                case 'pawn':
                    this.pieces[this.pieceCounter].spriteFrame = this.pawnSprite;
                    break;
            }
            this.pieceTypes.push(pieceType);
        }

        this.pieceCounter++;

        if (this.pieceCounter > 7) {
            this.pieceCounter = 0;
            if (isFlipped) {
                this.gameManager.getComponent('GameManager').endRound(this, this.pieceTypes[7]);
            } else {
                this.gameManager.getComponent('GameManager').endRound(this, this.pieceTypes[6], this.pieceTypes[7]);
            }
            
        }
    }

    // update (dt) {},
});
