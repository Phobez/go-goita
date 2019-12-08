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
        players: {
            default: [],
            type: cc.Node
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
        this.teamAScore = 0;
        this.teamBScore = 0;
    },

    start () {
        shuffleDeck();
        chooseFirstPlayer();
    },

    shuffleDeck(){
        // TODO: fill deck
        this.deck = [];
        var index = 0;
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 8;j++){
                var random = Math.floor((Math.random() * this.deck.length));
                var randomPiece = this.deck[random];
                this.players[i].hand.push(this.randomPiece);
                this.deck.splice(this.randomPiece,1);
            }
        }
    },

    chooseFirstPlayer(){
        this.firstPlayerIndex = Math.floor((Math.random() * this.players.length));
        this.players[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, this.lastAttackPiece);
        this.currentPlayerIndex = this.firstPlayerIndex;
    },

    advanceTurn(attackPiece){
        this.lastAttackPiece = attackPiece;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 3;
        // if pass counter is 3 or more,
        // start player turn with isFlipped true
        if(this.passCounter == 3){
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(true, this.lastAttackPiece);
        }
        this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(false, this.lastAttackPiece);
    },

    addPassCounter() {
        this.passCounter++;
    },

    startRound() {
        shuffleDeck();
        this.lastAttackPiece = null;
        this.players[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, this.lastAttackPiece);
    },

    endRound(roundWinner, lastPiece) {
        var roundPoints = 0;

        // get points according to last piece type
        switch (lastPiece.getComponent('Piece').type) {
            case 'king':
                roundPoints = 50;
                break;
            case 'rook':
            case 'bishop':
                roundPoints = 40;
                break;
            case 'gold general':
            case 'silver general':
                roundPoints = 30;
                break;
            case 'knight':
            case 'lance':
                roundPoints = 20;
                break;
            case 'pawn':
                roundPoints = 10;
                break;
        }

        // find out which team round winner belongs to
        for (var i = 0; i < this.players.length; i++) {
            if (roundWinner === this.players[i]) {
                if (i % 2 == 0) {
                    this.teamAScore += roundPoints;
                } else {
                    this.teamBScore += roundPoints;
                }
                break;
            }
        }

        this.checkPoints();
    },

    endRound(roundWinner, secondLastPiece, lastPiece) {
        // if two last pieces are same piece
        // get double points
        if (secondLastPiece.getComponent('Piece').type === lastPiece.getComponent('Piece').type) {
            var roundPoints = 0;

            // get points according to last piece type
            switch (lastPiece.getComponent('Piece').type) {
                case 'king':
                    roundPoints = 100;
                    break;
                case 'rook':
                case 'bishop':
                    roundPoints = 80;
                    break;
                case 'gold general':
                case 'silver general':
                    roundPoints = 60;
                    break;
                case 'knight':
                case 'lance':
                    roundPoints = 40;
                    break;
                case 'pawn':
                    roundPoints = 20;
                    break;
            }

            // find out which team round winner belongs to
            for (var i = 0; i < this.players.length; i++) {
                if (roundWinner === this.players[i]) {
                    if (i % 2 == 0) {
                        this.teamAScore += roundPoints;
                    } else {
                        this.teamBScore += roundPoints;
                    }
                    break;
                }
            }

            this.checkPoints();
        } else {
            this.endRound(roundWinner, lastPiece);
        }
    },

    checkPoints() {
        if (this.teamAScore >= 100 || this.teamBScore >= 100) {
            // end game
        } else {
            this.startRound();
        }
    }

    //update (dt) {},
});
