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
        timerLabel: {
            default: null,
            type: cc.Label
        },
        timerTime: 30,
        kingHasDefended: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // init
        this.deck = [];
        this.passCounter = 0;
        this.teamAScore = 0;
        this.teamBScore = 0;
        this.timerIsOn = false;
        this.timer = this.timerTime;
        this.lastAttackPieceType = '';
    },

    start () {
        if (cc.sys.localStorage.getItem('hasEndedRoundBefore') == 'true') {
            this.firstPlayerIndex = cc.sys.localStorage.getItem('firstPlayerIndex');
            this.teamAScore = parseInt(cc.sys.localStorage.getItem('teamAScore'));
            this.teamBScore = parseInt(cc.sys.localStorage.getItem('teamBScore'));
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
        var pawnCounter = 0;
        
        // go through all players
        for(var i = 0; i < 4; i++) {
            pawnCounter = 0;
            // give each player 8 pieces
            for(var j = 0; j < 8; j++) {
                // choose random piece from deck
                var randomIndex = Math.floor((Math.random() * this.deck.length));
                var randomPieceType = this.deck[randomIndex];
                
                // makes sure there is max of 5 pawns per person
                if (randomPieceType == 'pawn' && pawnCounter <= 4) {
                    pawnCounter++;
                }
                if (pawnCounter > 4) {
                    while (randomPieceType == 'pawn') {
                        randomIndex = Math.floor((Math.random() * this.deck.length));
                        randomPieceType = this.deck[randomIndex];
                    }
                }
                
                this.players[i].getComponent('Player').addPieceToHand(randomPieceType);
                this.deck.splice(randomIndex, 1);
            }
            this.players[i].getComponent('Player').debugPrintHand();
            console.log("PAWNS: " + pawnCounter);
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
        this.firstPlayerIndex = Math.floor((Math.random() * this.players.length));
        this.currentPlayerIndex = this.firstPlayerIndex;
        this.startTimer();
        this.players[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
    },

    // pass turn and start next turn
    passTurn () {
        this.passCounter++;
        this.currentPlayerIndex++;
        this.currentPlayerIndex = this.currentPlayerIndex % 4;
        this.startTimer();

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
        this.currentPlayerIndex++;
        this.currentPlayerIndex = this.currentPlayerIndex % 4;
        this.startTimer();

        // if everyone else passes
        // NOTE: this if shouldn't be possible
        if (this.passCounter == 3) {
            this.passCounter = 0;
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
        } else {
            this.passCounter = 0;
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(false, this.lastAttackPieceType);
        }   
    },

    startRound () {
        this.shuffleDeck();
        this.currentPlayerIndex = this.firstPlayerIndex;
        this.startTimer();
        console.log("CURRENT PLAYER INDEX: " + this.currentPlayerIndex);
        console.log("FIRST PLAYER INDEX: " + this.firstPlayerIndex);
        this.players[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
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
        var winnerIndex = -1;
        for (var i = 0; i < this.players.length; i++) {
            if (roundWinner.name == this.players[i].name) {
                if (i % 2 == 0) {
                    this.teamAScore += roundPoints;
                } else {
                    this.teamBScore += roundPoints;
                }
                winnerIndex = i;
                break;
            }
        }
        this.checkPoints(winnerIndex);
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
            var winnerIndex = -1;
            for (var i = 0; i < this.players.length; i++) {
                if (roundWinner.name == this.players[i].name) {
                    if (i % 2 == 0) {
                        this.teamAScore += roundPoints;
                        console.log
                    } else {
                        this.teamBScore += roundPoints;
                    }
                    winnerIndex = i;
                    break;
                }
            }

            this.checkPoints(winnerIndex);
        } else {
            this.endRound(roundWinner, lastPiece);
        }
    },

    // checks points and determines if game has ended
    checkPoints(winnerIndex) {
        // update score
        this.updateScore();

        if (this.teamAScore >= 100 || this.teamBScore >= 100) {
            this.endGame();
        } else {
            cc.sys.localStorage.setItem('hasEndedRoundBefore', true);
            cc.sys.localStorage.setItem('firstPlayerIndex', winnerIndex);
            cc.sys.localStorage.setItem('teamAScore', this.teamAScore);
            cc.sys.localStorage.setItem('teamBScore', this.teamBScore);
            // destroy all player nodes to stop all turn processing
            for (var i = 0; i < 4; i++) {
                this.players[i].destroy();
            }
            console.log("INGAME");
            cc.director.loadScene(cc.director.getScene().name);
        }
    },

    // updates score labels
    updateScore() {
        console.log("TEAM A SCORE: " + this.teamAScore);
        console.log("TEAM B SCORE: " + this.teamBScore);
        this.teamAScoreLabel.string = this.teamAScore.toString();
        this.teamBScoreLabel.string = this.teamBScore.toString();
        
    },

    // ends game
    endGame() {
        cc.sys.localStorage.setItem('teamAScore', this.teamAScore);
        cc.sys.localStorage.setItem('teamBScore', this.teamBScore);

        // destroy all player nodes to stop all turn processing
        for (var i = 0; i < 4; i++) {
            this.players[i].destroy();
        }

        if (this.teamAScore > this.teamBScore) {
            // team A wins
            cc.sys.localStorage.setItem('winner', 0);
        } else if (this.teamAScore < this.teamBScore) {
            // team B wins
            cc.sys.localStorage.setItem('winner', 1);
        } else {
            // draw
            // NOTE: shouldn't be possible
            cc.sys.localStorage.setItem('winner', 2);
        }

        console.log("RESULTS");
        this.scheduleOnce(function() {
            cc.director.loadScene('Results');
        }, 2);
    },

    update (dt) {
        // timer logic
        if (this.timerIsOn) {
            if (this.timer > 0) {
                
                this.timer -= dt;
                if (parseFloat(this.timerLabel.string) != Math.round(this.timer)) {
                    this.timerLabel.string = Math.round(this.timer);
                    
                }
            } else {
                this.timerIsOn = false;
                this.timerLabel.string = this.timerTime;
                if (this.players[0].getComponent('Player').isDefending){
                    if (this.timer <= 0) {
                        console.log(this.players[0].getComponent('Player').isDefending);
                        this.passTurn();
                    }
                } else {
                    this.players[0].getComponent('Player').chooseRandomPiece();
                }
            }
        }
    },

    // starts/restarts the timer
    startTimer () {
        this.timer = this.timerTime;
        this.timerIsOn = true;
    }
});
