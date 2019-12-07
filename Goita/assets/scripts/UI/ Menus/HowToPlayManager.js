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
        pages: {
            default: [],
            type: cc.Node
        },
        pageNumberText: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.currIndex = 0;
        this.pages[this.currIndex].active = true;
        this.maxPageNumber = parseInt(this.pages.length);
        this.updatePageNumberText();
    },

    nextPage() {
        this.currIndex++;
        if (this.currIndex >= this.pages.length) {
            this.currIndex = 0;
            this.pages[this.currIndex].active = true;
            this.pages[this.pages.length - 1].active = false;
        } else {
            this.pages[this.currIndex].active = true;
            this.pages[this.currIndex - 1].active = false;
        }
        
        this.updatePageNumberText();
    },

    prevPage() {
        this.currIndex--;
        if (this.currIndex < 0) {
            this.currIndex = this.pages.length - 1;
            this.pages[this.currIndex].active = true;
            this.pages[0].active = false;
        } else {
            this.pages[this.currIndex].active = true;
            this.pages[this.currIndex + 1].active = false;
        }
        
        this.updatePageNumberText();
    },

    updatePageNumberText: function() {
        this.pageNumberText.string = parseInt(this.currIndex + 1) + "/" + this.maxPageNumber;
    }

    // update (dt) {},
});
