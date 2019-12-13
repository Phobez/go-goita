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
        teamAScoreLabel: {
            default: null,
            type: cc.Label
        },
        teamBScoreLabel: {
            default: null,
            type: cc.Label
        },
        lastAttackPieceNode: {
            default: null,
            type: cc.Node
        },
        kingHasDefended: false,
        lastAttackPiece: ''
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // init
        this.deck = [];
        this.passCounter = 0;
        this.teamAScore = 0;
        this.teamBScore = 0;
        this.timer = 30;
    },

    start () {
        if (cc.sys.localStorage.getItem('hasEndedRoundBefore') == 'true') {
            this.firstPlayerIndex = cc.sys.localStorage.getItem('firstPlayerIndex');
            this.teamAScore = cc.sys.localStorage.getItem('teamAScore');
            this.teamBScore = cc.sys.localStorage.getItem('teamBScore');
            console.log("Team A Score: " + this.teamAScore);
            console.log("Team B Score: " + this.teamBScore);
            this.updateScore();
            this.startRound();
        } else {
            this.shuffleDeck();
            this.chooseFirstPlayer();
        }
        
    },

    // fills deck and hands out pieces to players
    shuffleDeck () {
        this.fillDeck();
        
        // go through all players
        for(var i = 0; i < 4; i++) {
            // give each player 8 pieces
            for(var j = 0; j < 8; j++) {
                // choose random piece from deck
                var randomIndex = Math.floor((Math.random() * this.deck.length));
                var randomPieceType = this.deck[randomIndex];
                this.players[i].getComponent('Player').addPieceToHand(randomPieceType);
                this.deck.splice(randomIndex, 1);
            }
            this.players[i].getComponent('Player').debugPrintHand();
        }
    },

    // fills deck
    fillDeck () {
        // fill pawns
        for (var i = 0; i < 10; i++) {
            this.deck.push('pawn');
        }

        // fill knights
        for (var i = 0; i < 4; i++) {
            this.deck.push('knight');
        }

        // fill lances
        for (var i = 0; i < 4; i++) {
            this.deck.push('lance');
        }

        // fill silver generals
        for (var i = 0; i < 4; i++) {
            this.deck.push('silver');
        }

        // fill gold generals
        for (var i = 0; i < 4; i++) {
            this.deck.push('gold');
        }

        // fill bishops
        for (var i = 0; i < 2; i++) {
            this.deck.push('bishop');
        }

        // fill rooks
        for (var i = 0; i < 2; i++) {
            this.deck.push('rook');
        }

        // fill kings
        for (var i = 0; i < 2; i++) {
            this.deck.push('king');
        }
    },

    // choose first player randomly
    chooseFirstPlayer () {
        // choose a random player to start the game
        // TEMPORARY: human player always first
        this.firstPlayerIndex = 0;
        // this.firstPlayerIndex = Math.floor((Math.random() * this.players.length));
        this.currentPlayerIndex = this.firstPlayerIndex;
        this.players[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
    },

    // pass turn and start next turn
    passTurn () {
        this.passCounter++;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;

        // if everyone else passes
        if (this.passCounter == 3) {
            this.passCounter = 0;
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
        } else {
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(false, this.lastAttackPieceType);
        }
        
    },

    // finish turn and start next turn
    advanceTurn (attackPieceType) {
        this.lastAttackPieceNode.getComponent('LastAttackPieceHandler').setLastAttackPieceSprite(attackPieceType);
        this.lastAttackPieceType = attackPieceType;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;

        // if everyone else passes
        // NOTE: this if shouldn't be possible
        if (this.passCounter == 3) {
            this.passCounter = 0;
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
        } else {
            console.log(this.currentPlayerIndex);
            this.passCounter = 0;
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(false, this.lastAttackPieceType);
        }   
    },

    startRound () {

        // this.lastAttackPiece = null;
        // this.passCounter = 0;

        // for (var i = 0; i < 4; i++) {
        //     this.players[i].getComponent('Player').reset();
        // }

        this.shuffleDeck();

        this.currentPlayerIndex = this.firstPlayerIndex;
        this.players[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, this.lastAttackPiece);
    },

    // end round with single piece
    endRound(roundWinner, lastPiece) {
        var roundPoints = 0;
        
        // get points according to last piece type
        switch (lastPiece) {
            case 'king':
                roundPoints = 50;
                break;
            case 'rook':
            case 'bishop':
                roundPoints = 40;
                break;
            case 'gold':
            case 'silver':
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
            if (roundWinner.name == this.players[i].name) {
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

    // end round with double piece
    endRoundWithDouble(roundWinner, secondLastPiece, lastPiece) {
        // if two last pieces are same piece
        // get double points
        if (secondLastPiece == lastPiece) {
            var roundPoints = 0;

            // get points according to last piece type
            switch (lastPiece) {
                case 'king':
                    roundPoints = 100;
                    break;
                case 'rook':
                case 'bishop':
                    roundPoints = 80;
                    break;
                case 'gold':
                case 'silver':
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
                if (roundWinner.name == this.players[i].name) {
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

    // checks points and determines if game has ended
    checkPoints() {
        // update score
        this.updateScore();

        if (this.teamAScore >= 100 || this.teamBScore >= 100) {
            this.endGame();
        } else {
            cc.sys.localStorage.setItem('hasEndedRoundBefore', true);
            cc.sys.localStorage.setItem('firstPlayerIndex', this.firstPlayerIndex);
            cc.sys.localStorage.setItem('teamAScore', this.teamAScore);
            cc.sys.localStorage.setItem('teamBScore', this.teamBScore);
            cc.director.loadScene(cc.director.getScene().name);
        }
    },

    // updates score labels
    updateScore() {
        this.teamAScoreLabel.string = this.teamAScore.toString();
        this.teamBScoreLabel.string = this.teamBScore.toString();
    },

    endGame() {
        if (this.teamAScore > this.teamBScore) {
            // team A wins
        } else if (this.teamAScore < this.teamBScore) {
            // team B wins
        } else {
            // draw
        }
    },

    update (dt) {
        // if(this.timer > 0){
        //     this.timer -= 1;
        // }
        // if(this.players[this.currentPlayerIndex].getComponent('Player').isDefending){
        //     if(this.timer <= 0){
        //         this.passTurn();
        //     }
        // }
        // else{
        //     this.players[this.currentPlayerIndex].getComponent('Player').chooseRandomPiece();
        // }
        
    },
});
