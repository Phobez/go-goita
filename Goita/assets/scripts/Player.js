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
        isAI: false,
        aiReactionDelay: 1,
        gameManager: {
            default: null,
            type: cc.Node
        },
        board: {
            default: null,
            type: cc.Node
        },
        handBoard: {
            default: null,
            type: cc.Node
        },
        passButton: {
            default: null,
            type: cc.Button
        },
        putPieceAudioClip: {
            default: null,
            type: cc.AudioClip
        },
        hand: [],
        handHasBeenFilled: false,
        isDefending: true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hand = [];
        this.isDefending = true;
    },

    start () {
        this.pieceCounter = 0;
    },

    addPieceToHand (pieceType) {
        var obj = {
            type: pieceType,
            index: this.hand.length
        };
        this.hand.push(obj);

        // set flag as true if hand is complete
        if (this.hand.length >= 7) {
            this.handHasBeenFilled = true;
        }
    },

    // starts turn
    startPlayerTurn (isFlipped, lastAttackPieceType) {
        this.isFlipped = isFlipped;
        this.lastAttackPieceType = lastAttackPieceType;
        this.isDefending = true;
        if (!(this.isAI)) {
            this.passButton.interactable = true;
            this.handBoard.getComponent('HandBoard').activateAllPieces();
            // if the piece is flipped
            if (isFlipped) {
                this.passButton.interactable = false;
                // check if there's only two pieces left in hand AND they're both kings
                if (this.hand.length == 2) {
                    if (this.hand[0].type == 'king' && this.hand[1].type == 'king') {
                        this.isFlipped = false;
                    }
                }
                // else, all pieces enabled
            } else {
                // this.isDefending = true;
                this.checkPieceAvailability(this.isDefending);
            }
        } else {
            // this.gameManager.getComponent('GameManager').addPassCounter();
            // this.gameManager.getComponent('GameManager').passTurn();
            // console.log(this.node.name + "'s Deck: " + this.hand);
            this.scheduleOnce(function() {
                this.checkPieceAvailability(this.isDefending);
            }, this.aiReactionDelay);
        }
    },

    reset () {
        this.hand = [];
        this.pieceCounter = 0;
        this.isDefending = true;

        this.board.getComponent('Board').clearBoard();
    },

    putPiece (pieceType, pieceIndex) {
        // console.log(this.node.name + ": put piece " + pieceType);
        // put piece on board
        this.board.getComponent('Board').addPieceToBoard(this.isFlipped, pieceType);
        var volume = cc.sys.localStorage.getItem("sfxVol");
        cc.audioEngine.play(this.putPieceAudioClip, false, volume);

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
            if (pieceType == 'king' && !(this.isFlipped)) {
                // if king hasn't been played before
                if (!(this.gameManager.getComponent('GameManager').kingHasDefended)) {
                    this.gameManager.getComponent('GameManager').kingHasDefended = true;
                }
            }
            this.isDefending = false;
            this.isFlipped = false;
            if (!(this.isAI)) {
                // this.hand.splice(this.hand.indexOf(pieceType), 1);
                for (var i = 0; i < this.hand.length; i++) {
                    if (this.hand[i].index == pieceIndex) {
                        this.hand.splice(i, 1);
                    }
                }
                this.passButton.interactable = false;
            }
            this.checkPieceAvailability(false);
        } else {
            if (!(this.isAI)) {
                // this.hand.splice(this.hand.indexOf(pieceType), 1);
                for (var i = 0; i < this.hand.length; i++) {
                    if (this.hand[i].index == pieceIndex) {
                        this.hand.splice(i, 1);
                    }
                }
                this.handBoard.getComponent('HandBoard').deactivateAllPieces();
                this.passButton.interactable = false;
            }
            this.gameManager.getComponent('GameManager').advanceTurn(pieceType);
        }
    },

    checkPieceAvailability (isDefending) {
        if (!(this.isAI)) {
            if (isDefending) {
                // if only 2 pieces left on hand
                if (this.hand.length == 2) {
                    var kingIndex = -1;
                    var thereIsKing = false;
                    // go through all remaining pieces on hand
                    for (var i = 0; i < this.hand.length; i++) {
                        // find king, if any
                        if (this.hand[i].type == 'king') {
                            kingIndex = i;
                            thereIsKing = true;
                            break;
                        }
                    }

                    // if there is king
                    if (thereIsKing) {
                        // if king hasn't been used to defend
                        if (!(this.gameManager.getComponent('GameManager').kingHasDefended)) {
                            // disable other piece
                            // get other piece index
                            var otherPieceIndex = (kingIndex + 1) % 2; 
                            if (this.handBoard != null) {
                                this.handBoard.getComponent('HandBoard').deactivatePiece(this.hand[otherPieceIndex].index);
                            }

                            // check if king can be used
                            if (this.lastAttackPieceType == 'pawn' || this.lastAttackPieceType == 'lance') {
                                this.handBoard.getComponent('HandBoard').deactivatePiece(this.hand[kingIndex].index);
                            }
                        }
                        return;
                    }

                    
                }

                for (var i = 0; i < this.hand.length; i++) {
                    if (this.hand[i].type != this.lastAttackPieceType) {
                        if (this.hand[i].type == 'king') {
                            if (this.lastAttackPieceType == 'lance' || this.lastAttackPieceType == 'pawn') {
                                if (this.handBoard != null) {
                                    this.handBoard.getComponent('HandBoard').deactivatePiece(this.hand[i].index);
                                }
                            } else {
                                if (this.handBoard != null) {
                                    this.handBoard.getComponent('HandBoard').activatePiece(this.hand[i].index);
                                }
                            }
                        } else {
                            if (this.handBoard != null) {
                                this.handBoard.getComponent('HandBoard').deactivatePiece(this.hand[i].index);
                            }
                        }
                    }
                }
            } else { // attacking
                for (var i = 0; i < this.hand.length; i++) {
                    // if king has defended, activate all pieces
                    if (this.hand.length == 1 && this.gameManager.getComponent('GameManager').kingHasDefended) {
                        if (this.handBoard != null) {
                            this.handBoard.getComponent('HandBoard').activatePiece(this.hand[i].index);
                        }
                    } else {
                        if (this.hand[i].type === 'king') {
                            if (this.handBoard != null) {
                                this.handBoard.getComponent('HandBoard').deactivatePiece(this.hand[i].index);
                            }
                        } else {
                            if (this.handBoard != null) {
                                this.handBoard.getComponent('HandBoard').activatePiece(this.hand[i].index);
                            }
                        }
                    }
                }
            }
        } else {
            if (isDefending) {
                // if only 2 pieces left on hand
                if (this.hand.length == 2) {
                    var kingIndex = -1;
                    var thereIsKing = false;
                    // go through all remaining pieces on hand
                    for (var i = 0; i < this.hand.length; i++) {
                        // find king, if any
                        if (this.hand[i].type == 'king') {
                            kingIndex = i;
                            thereIsKing = true;
                            break;
                        }
                    }

                    // if there is king
                    if (thereIsKing) {
                        // if king hasn't been used to defend
                        if (!(this.gameManager.getComponent('GameManager').kingHasDefended)) {
                            // if king can be used, play king
                            if (this.lastAttackPieceType != 'pawn' && this.lastAttackPieceType != 'lance') {
                                var temp = this.hand[kingIndex].type;
                                this.hand.splice(kingIndex, 1);
                                this.debugPrintHand();
                                this.putPiece(temp, -1);
                            } else { // else pass
                                // console.log(this.node.name + " passes.");
                                this.gameManager.getComponent('GameManager').passTurn();
                                return;
                            }
                        }
                    }
                }

                if (this.lastAttackPieceType == '') {
                    var temp = this.hand[0].type;
                    this.hand.splice(0, 1);
                    this.debugPrintHand();
                    this.putPiece(temp, -1);
                    
                } else {
                    var noAvailablePiece = true;
                    for (var i = 0; i < this.hand.length; i++) {
                        if (this.hand[i].type == 'king') {
                            if (this.lastAttackPieceType != 'pawn' && this.lastAttackPieceType != 'lance') {
                                var temp = this.hand[i].type;
                                this.hand.splice(i, 1);
                                this.putPiece(temp, -1);
                                noAvailablePiece = false;
                                break;
                            }
                        }
                        if (this.hand[i].type === this.lastAttackPieceType) {
                            var temp = this.hand[i].type;
                            this.hand.splice(i,1);
                            this.debugPrintHand();
                            this.putPiece(temp, -1);
                            noAvailablePiece = false;
                            break;
                        }
                    }

                    if (noAvailablePiece) {
                        // console.log(this.node.name + " passes.");
                        this.gameManager.getComponent('GameManager').passTurn();
                    }
                }
            } else {
                for (var i = 0; i < this.hand.length; i++) {
                    if (this.hand[i].type == 'king') {
                        if (this.hand.length == 1) {
                            if (this.gameManager.getComponent('GameManager').kingHasDefended) {
                                var temp = this.hand[i].type;
                                this.hand.splice(i, 1);
                                this.putPiece(temp, -1);
                                this.debugPrintHand();
                                break;
                            }
                        }
                    } else {
                        var temp = this.hand[i].type;
                        this.hand.splice(i, 1);
                        this.putPiece(temp, -1);
                        this.debugPrintHand();
                        break;
                    }
                }
            }
        }
    },

    debugPrintHand() {
        var debugPrint = this.node.name + ": ";
        for (var i = 0; i < this.hand.length; i++) {
            debugPrint += this.hand[i].type;
            if (i < this.hand.length - 1) {
                debugPrint += ", ";
            }
        }
        // console.log(debugPrint);
    },
    
    chooseRandomPiece(){
        this.handBoard.getComponent('HandBoard').pieces[this.hand[0].index].getComponent('HandPiece').sendToBoard();
    }

    // update (dt) {},
});