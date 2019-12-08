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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pieces = [];
        //placeholder change it later to actual flipped piece asset
        this.flippedPiece = 1;
    },

    start () {
        
    },

    addPieceToBoard(isFlipped, piece) {
        // if isFlipped
        // add flipped piece to board
        if(isFlipped){
            //needed to be flipped
            this.flippedPiece = null;
            this.pieces.push(this.flippedPiece);
        }
        // else
        // add open piece to board
        else{
            //check if king used for defend or not
            if(! gameManager.getComponent('GameManager').kingHasDefended){
                gameManager.getComponent('GameManager').kingHasDefended = true;
            }
            this.pieces.push(piece);
        }

        if (this.pieces.length >= 8) {
            if (isFlipped) {
                gameManager.getComponent('GameManager').endRound(this, this.pieces[7]);
            } else {
                gameManager.getComponent('GameManager').endRound(this, this.piece[6], this.pieces[7]);
            }
            
        }
    }

    // update (dt) {},
});
