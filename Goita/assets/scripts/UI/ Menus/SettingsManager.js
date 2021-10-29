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
        const masterVolume = cc.sys.localStorage.getItem("masterVol");

        this.masterVolumeBar.progress = masterVolume;

        const bgmVolume = cc.sys.localStorage.getItem("bgmVol");

        this.bgmVolumeBar.progress = bgmVolume / masterVolume;

        const sfxVolume = cc.sys.localStorage.getItem("sfxVol");

        this.sfxVolumeBar.progress = sfxVolume / masterVolume;
    },

    /**
     * Updates the value of the volume specified by key.
     * If updating BGM or SFX volume, the value is multiplied by the Master volume first.
     * 
     * @param {cc.Slider} event - Slider which triggered the event.
     * @param {string} key - Key of the volume to update.
     */
    updateVolume (event, key) {
        let newVol = event.progress;

        if (key === "bgmVol" || key === "sfxVol") {
            newVol *= cc.sys.localStorage.getItem("masterVol");
        }

        cc.sys.localStorage.setItem(key, newVol);
    },

    /**
     * Updates the values of the BGM and SFX volumes by multiplying their current value with the Master volume value.
     * 
     * @param {cc.Slider} event - Slider of the Master volume which triggered the event.
     */
    updateSubVolumes (event) {
        cc.sys.localStorage.setItem("bgmVol", this.bgmVolumeBar.progress * event.progress);

        cc.sys.localStorage.setItem("sfxVol", this.sfxVolumeBar.progress * event.progress);
    }
    // update (dt) {},
});
