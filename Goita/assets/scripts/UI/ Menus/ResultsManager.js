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
        resultLabel: {
            default: null,
            type: cc.Label
        },
        teamAScoreLabel: {
            default: null,
            type: cc.Label
        },
        teamBScoreLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var winner = cc.sys.localStorage.getItem('winner');

        if (winner == 0) {
            this.resultLabel.string = 'YOU WIN';
        } else if (winner == 1) {
            this.resultLabel.string = 'YOU LOSE';
        }

        var teamAScore = cc.sys.localStorage.getItem('teamAScore');
        var teamBScore = cc.sys.localStorage.getItem('teamBScore');

        this.teamAScoreLabel.string = teamAScore.toString();
        this.teamBScoreLabel.string = teamBScore.toString();
    },

    start () {

    },

    returnToMainMenu() {
        cc.director.loadScene('MainMenu');
    },

    playAgain() {
        cc.sys.localStorage.setItem('hasEndedRoundBefore', false);
        cc.sys.localStorage.setItem('firstPlayerIndex', -1);
        cc.sys.localStorage.setItem('teamAScore', 0);
        cc.sys.localStorage.setItem('teamBScore', 0);
        cc.sys.localStorage.setItem('winner', 0);
        cc.director.loadScene('InGame');
    }

    // update (dt) {},
});
