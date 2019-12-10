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
        lastAttackPiece: ''
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // init
        this.deck = [];
        this.currentPlayer;
        this.lastAttackPlayer;
        this.passCounter = 0;
        this.teamAScore = 0;
        this.teamBScore = 0;
    },

    start () {
        this.shuffleDeck();
        this.chooseFirstPlayer();
    },

    shuffleDeck () {
        this.fillDeck();
        
        // go through all players
        for(var i = 0; i < 4; i++) {
            // this.players[i].getComponent('Player').setPlayerToHand();
            // give each player 8 pieces
            for(var j = 0; j < 8; j++) {
                // choose random piece from deck
                var randomIndex = Math.floor((Math.random() * this.deck.length));
                var randomPieceType = this.deck[randomIndex];
                this.players[i].getComponent('Player').addPieceToHand(randomPieceType);
                this.deck.splice(randomIndex, 1);
            }
            console.log(this.players[i].name + "'s Deck: " + this.players[i].getComponent('Player').hand);
        }
    },

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

    chooseFirstPlayer () {
        // choose a random player to start the game
        // this.firstPlayerIndex = Math.floor((Math.random() * this.players.length));
        // TEMPORARY:
        this.firstPlayerIndex = 0;
        this.players[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
        this.currentPlayerIndex = this.firstPlayerIndex;
    },

    passTurn () {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
        if (this.passCounter == 3) {
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
            this.passCounter = 0;
        }
        this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(false, this.lastAttackPieceType);
    },

    advanceTurn (attackPieceType) {
        this.lastAttackPieceType = attackPieceType;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
        // if pass counter is 3 or more,
        // start player turn with isFlipped true
        if (this.passCounter == 3) {
            this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(true, '');
            this.passCounter = 0;
        }
        this.players[this.currentPlayerIndex].getComponent('Player').startPlayerTurn(false, this.lastAttackPieceType);
    },

    addPassCounter() {
        this.passCounter++;
    },

    startRound() {
        this.shuffleDeck();
        this.lastAttackPiece = null;
        this.players[this.firstPlayerIndex].getComponent('Player').startPlayerTurn(true, this.lastAttackPiece);
    },

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

    endRoundWithDouble(roundWinner, secondLastPiece, lastPiece) {
        // if two last pieces are same piece
        // get double points
        if (secondLastPiece === lastPiece) {
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
        console.log("ROUND ENDED.");
        if (this.teamAScore >= 100 || this.teamBScore >= 100) {
            // end game
        } else {
            // this.startRound();
        }
    },

    endGame() {
        if (this.teamAScore > this.teamBScore) {
            // team A wins
        } else if (this.teamAScore < this.teamBScore) {
            // team B wins
        } else {
            // draw
        }
    }

    //update (dt) {},
});
