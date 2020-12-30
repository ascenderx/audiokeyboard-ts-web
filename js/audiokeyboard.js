"use strict";
class AudioKeyboard {
    constructor(channelCount, keyStepMap = {}) {
        this.keyStepMap = {};
        this.transposeWidth = 0;
        this.activeChannels = [];
        if (channelCount < 1) {
            throw `Invalid channel count "${channelCount}". Must be a positive integer.`;
        }
        AudioKeyboardChannel.generatePool(channelCount, 'square');
        for (let key in keyStepMap) {
            this.keyStepMap[key] = keyStepMap[key];
        }
    }
    playKeyNote(key, volume = AudioKeyboardChannel.MAX_VOLUME) {
        if (!(key in this.keyStepMap)) {
            throw `Key ${key} is not bound to a note.`;
        }
        for (let channel of this.activeChannels) {
            if (channel.key === key) {
                return;
            }
        }
        let step = this.keyStepMap[key];
        let frequency = AudioKeyboardChannel.stepToFrequency(step + this.transposeWidth);
        let channel = AudioKeyboardChannel.getInstance()
            || this.activeChannels.shift()
            || null;
        if (channel === null) {
            return;
        }
        this.activeChannels.push(channel);
        channel.enabled = true;
        channel.key = key;
        channel.frequency = frequency;
        channel.volume = volume;
    }
    releaseKeyNote(key) {
        if (!(key in this.keyStepMap)) {
            throw `Key ${key} is not bound to a note.`;
        }
        for (let c = 0; c < this.activeChannels.length; c++) {
            let channel = this.activeChannels[c];
            if (channel.key === key) {
                channel.silence();
                AudioKeyboardChannel.returnInstance(channel);
                this.activeChannels.splice(c, 1);
                return;
            }
        }
    }
}
