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
        // hand: {
        //     default: [],
        //     type: cc.Node
        // },
        board: {
            default: null,
            type: cc.Node
        },
        gameManager: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isFlipped = false;
    },

    start () {
        this.pieceCounter = 0;
    },

    setPlayerToHand() {
        for (var i = 0; i < this.hand.length; i++) {
            this.hand[i].getComponent('HandPiece').player = this;
        }
    },

    addPieceToHand (pieceType) {
        // set current hand piece to piece type
        this.hand[this.pieceCounter].getComponent('HandPiece').setHandPiece(pieceType);
        // add piece counter by 1, max of 7
        this.pieceCounter = (this.pieceCounter + 1) % 8;
    },

    startPlayerTurn (isFlipped, lastAttackPieceType) {
        this.isFlipped = isFlipped;
        this.lastAttackPieceType = lastAttackPieceType;
        // if the piece is flipped
        if (isFlipped) {
            // check if there's only two pieces left in hand AND they're both kings
            if (hand.length == 2)
            {
                if(hand[0].getComponent('HandPiece').pieceType === 'king' && hand[1].getComponent('HandPiece').pieceType === 'king') {
                    // TODO: ask the player to win by putting out two kings or pass
                }
            }
            // else, all pieces enabled
        } else {
            this.isDefending = true;
            this.checkPieceAvailability(this.isDefending);
        }
    },

    putPiece (pieceType) {
        // put piece on board
        this.board.getComponent('Board').addPieceToBoard(this.isFlipped, pieceType);

        // remove piece from hand
        for (var i = 0; i < hand.length; i++) {
            if (hand[i].getComponent('HandPiece').pieceType === pieceType) {
                if (!this.isDefending) {
                    this.attackPiece = hand[i];
                }
                hand.splice(i, 1);
                break;
            }
        }

        // if was defending, now attack
        // else, next turn
        if (this.isDefending) {
            // if the defending piece is king
            if (pieceType === 'king') {
                // if king hasn't been played before
                if (!(this.gameManager.getComponent('GameManager').kingHasDefended)) {
                    this.gameManager.getComponent('GameManager').kingHasDefended = true;
                }
            }
            this.isDefending = false;
            this.isFlipped = false;
            this.checkPieceAvailability(false);
        } else {
            gameManager.getComponent('GameManager').advanceTurn(pieceType);
        }
    },

    checkPieceAvailability (isDefending) {
        if (isDefending) {
            for (var i = 0; i < hand.length; i++) {
                // TODO: check king special condition in defending
                if (hand[i].getComponent('HandPiece').pieceType !== this.lastAttackPieceType){
                    hand[i].getComponent('Button').interactable = false;
                }
            }
        } else {
            for (var i = 0; i < hand.length; i++) {
                // TODO: only allow player to play king if KING HAS DEFENDED AND it's now player's last piece
                if (gameManager.getComponent('GameManager').kingHasDefended) {
                    hand[i].getComponent('Button').interactable = true;
                }
                else{
                    if (hand[i].getComponent('HandPiece').pieceType === 'king') {
                        hand[i].getComponent('Button').interactable = false;
                    } else {
                        hand[i].getComponent('Button').interactable = true;
                    }
                }
            }
        }
    }

    // update (dt) {},
});