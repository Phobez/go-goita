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
        masterVolumeBar: {
            default: null,
            type: cc.Slider
        },
        bgmVolumeBar: {
            default: null,
            type: cc.Slider
        },
        sfxVolumeBar: {
            default: null,
            type: cc.Slider
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var masterVolume = cc.sys.localStorage.getItem("masterVol");
        
        if (masterVolume === null) {
            cc.sys.localStorage.setItem("masterVol", 1);
        } else {
            this.masterVolumeBar.progress = masterVolume;
        }

        var bgmVolume = cc.sys.localStorage.getItem("bgmVol");

        if (bgmVolume === null) {
            cc.sys.localStorage.setItem("bgmVol", 1);
        } else {
            this.bgmVolumeBar.progress = bgmVolume * masterVolume;
        }

        var sfxVolume = cc.sys.localStorage.getItem("sfxVol");

        if (sfxVolume === null) {
            cc.sys.localStorage.setItem("sfxVol", 1);
        } else {
            this.sfxVolumeBar.progress = sfxVolume * masterVolume;
        }
    },

    updateVolume (event, key) {
        switch (key) {
            case "bgmVol":
            case "sfxVol":
                var masterVolume = cc.sys.localStorage.getItem("masterVol");
                if (event.progress > masterVolume) {
                    event.progress = masterVolume;
                }
                break;
        }
        cc.sys.localStorage.setItem(key, event.progress);
    },

    updateSubVolumes (event) {
        var bgmVolume = cc.sys.localStorage.getItem("bgmVol");
        this.bgmVolumeBar.progress = bgmVolume * event.progress;
        cc.sys.localStorage.setItem("bgmVol", this.bgmVolumeBar.progress);
        var sfxVolume = cc.sys.localStorage.getItem("sfxVol");
        this.sfxVolumeBar.progress = sfxVolume * event.progress;
        cc.sys.localStorage.setItem("sfxVol", this.sfxVolumeBar.progress);
    }
    // update (dt) {},
});
