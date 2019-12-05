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
        hand: {
            default: [],
            type: cc.Node
        },
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
        
    },

    startPlayerTurn(isFlipped, lastAttackPiece) {
        this.isFlipped = isFlipped;
        this.lastAttackPiece = lastAttackPiece;
        if(isFlipped){
            // check if there's only two pieces left in hand AND they're both kings
            // isFlipped is false
            // enable all pieces
            
        } else {
            this.isDefending = true;
            checkPieceAvailability(this.isDefending);
            // if no matching piece, tell player, enable only pass button
        }
    },

    putPiece(piece) {
        // put piece on board
        // call Board's add piece function
        // board.getComponent('Board').pieces.push(piece);
        // remove piece from hand
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] === piece) {
                if (!this.isDefending) {
                    this.attackPiece = hand[i];
                }
                hand.splice(i, 1);
                break;
            }
        }
        if (this.isDefending) {
            checkPieceAvailability(false);
            this.isDefending = false;
        } else {
            gameManager.getComponent('GameManager').advanceTurn(this.attackPiece);
        }
    },

    checkPieceAvailability(isDefending) {
        if (isDefending) {
            for(var i = 0; i < hand.length; i++){
                if(hand[i].getComponent('Piece').type !== this.lastAttackPiece.type){
                    hand[i].getComponent('Button').interactable = false;
                }
            }
        } else {
            for(var i = 0; i < hand.length; i++){
                // TODO: add checking for KING
                hand[i].getComponent('Button').interactable = true;
            }
        }
    }

    // update (dt) {},
});