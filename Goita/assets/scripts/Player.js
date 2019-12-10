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
        hand: [],
        board: {
            default: null,
            type: cc.Node
        },
        gameManager: {
            default: null,
            type: cc.Node
        },
        handHasBeenFilled: false,
        handBoard: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hand = [];
        this.isDefending = true;
    },

    start () {
        this.pieceCounter = 0;
        
    },

    // setPlayerToHand() {
    //     for (var i = 0; i < this.hand.length; i++) {
    //         this.hand[i].getComponent('HandPiece').player = this;
    //     }
    // },

    addPieceToHand (pieceType) {
        // set current hand piece to piece type
        this.hand.push(pieceType);
        // this.hand[this.pieceCounter].getComponent('HandPiece').setHandPiece(pieceType);
        // add piece counter by 1, max of 7
        // this.pieceCounter = (this.pieceCounter + 1) % 8;
        if (this.hand.length >= 7) {
            this.handHasBeenFilled = true;
        }
    },

    startPlayerTurn (isFlipped, lastAttackPieceType) {
        this.isFlipped = isFlipped;
        this.lastAttackPieceType = lastAttackPieceType;
        this.isDefending = true;
        // if the piece is flipped
        if (isFlipped) {
            // check if there's only two pieces left in hand AND they're both kings
            if (this.hand.length == 2)
            {
                if(this.hand[0].getComponent('HandPiece').pieceType === 'king' && this.hand[1].getComponent('HandPiece').pieceType === 'king') {
                    // TODO: ask the player to win by putting out two kings or pass
                }
            }
            // else, all pieces enabled
        } else {
            // this.isDefending = true;
            this.checkPieceAvailability(this.isDefending);
        }
    },

    putPiece (pieceType) {
        // put piece on board
        this.board.getComponent('Board').addPieceToBoard(this.isFlipped, pieceType);

        // remove piece from hand
        // for (var i = 0; i < this.hand.length; i++) {
        //     if (this.hand[i] === pieceType) {
        //         if (!this.isDefending) {
        //             this.attackPiece = this.hand[pieceIndex];
        //         }
        //         this.hand.splice(i, 1);
        //         break;
        //     }
        // }

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
            this.handBoard.getComponent('HandBoard').deactivateAllPieces();
            this.gameManager.getComponent('GameManager').advanceTurn(pieceType);
        }
    },

    checkPieceAvailability (isDefending) {
        if (isDefending) {
            for (var i = 0; i < this.hand.length; i++) {
                // TODO: check king special condition in defending
                if (this.hand[i] !== this.lastAttackPieceType){
                    // this.hand[i].getComponent('Button').interactable = false;
                    if (this.handBoard != null) {
                        this.handBoard.getComponent('HandBoard').deactivatePiece(i);
                    }
                }
            }
        } else {
            for (var i = 0; i < this.hand.length; i++) {
                // TODO: only allow player to play king if KING HAS DEFENDED AND it's now player's last piece
                if (this.gameManager.getComponent('GameManager').kingHasDefended) {
                    if (this.handBoard != null) {
                        this.handBoard.getComponent('HandBoard').activatePiece(i);
                    }
                }
                else{
                    if (this.hand[i] === 'king') {
                        if (this.handBoard != null) {
                            this.handBoard.getComponent('HandBoard').deactivatePiece(i);
                        }
                    } else {
                        if (this.handBoard != null) {
                            this.handBoard.getComponent('HandBoard').activatePiece(i);
                        }
                    }
                }
            }
        }
    }

    // update (dt) {},
});