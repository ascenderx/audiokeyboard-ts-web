"use strict";
class AudioKeyboard {
    constructor(channelCount) {
        this.transposeWidth = 0;
        this.channelPool = [];
        this.activeChannels = {};
        if (channelCount < 1) {
            throw `Invalid channel count "${channelCount}". Must be a positive integer.`;
        }
        for (let c = 0; c < channelCount; c++) {
            let channel = new AudioKeyboardChannel();
            channel.waveform = 'square';
            this.channelPool.push(channel);
        }
    }
    playKeyNote(key, volume = AudioKeyboardChannel.MAX_VOLUME) {
        if (!(key in AudioKeyboard.KEY_STEP_MAP)) {
            throw `Key ${key} is not bound to a note.`;
        }
        if (key in this.activeChannels) {
            return;
        }
        let step = AudioKeyboard.KEY_STEP_MAP[key];
        let frequency = AudioKeyboardChannel.stepToFrequency(step);
        let channel = this.channelPool.pop();
        if (channel === undefined) {
            return;
        }
        this.activeChannels[key] = channel;
        channel.enabled = true;
        channel.frequency = frequency;
        channel.volume = volume;
    }
    releaseKeyNote(key) {
        if (!(key in AudioKeyboard.KEY_STEP_MAP)) {
            throw `Key ${key} is not bound to a note.`;
        }
        if (!(key in this.activeChannels)) {
            return;
        }
        let channel = this.activeChannels[key];
        this.channelPool.push(channel);
        delete this.activeChannels[key];
        channel.silence();
    }
}
AudioKeyboard.KEY_STEP_MAP = {
    'z': -9,
    's': -8,
    'x': -7,
    'd': -6,
    'c': -5,
    'v': -4,
    'g': -3,
    'b': -2,
    'h': -1,
    'n': 0,
    'j': 1,
    'm': 2,
    ',': 3,
    'l': 4,
    '.': 5,
    ';': 6,
    '/': 7,
    'q': 3,
    '2': 4,
    'w': 5,
    '3': 6,
    'e': 7,
    'r': 8,
    '5': 9,
    't': 10,
    '6': 11,
    'y': 12,
    '7': 13,
    'u': 14,
    'i': 15,
    '9': 16,
    'o': 17,
    '0': 18,
    'p': 19,
    '[': 20,
    '=': 21,
    ']': 22,
    '\\': 24,
};
