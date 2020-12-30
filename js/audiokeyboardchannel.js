"use strict";
class AudioKeyboardChannel {
    constructor() {
        this.oscillator = null;
        this.gain = null;
        this._enabled = false;
        this._frequency = 0;
        this._volume = AudioKeyboardChannel.MIN_VOLUME;
        this._active = false;
        this.key = null;
    }
    static stepToFrequency(step, baseFrequency = AudioKeyboardChannel.NOTE_A4) {
        return baseFrequency * (2 ** (step / 12));
    }
    static generatePool(size) {
        if (size < 1) {
            throw `Invalid pool size ${size}. Must be a positive number.`;
        }
        for (let c = 0; c < size; c++) {
            let channel = new AudioKeyboardChannel();
            AudioKeyboardChannel.POOL.push(channel);
        }
    }
    static getInstance() {
        for (let channel of AudioKeyboardChannel.POOL) {
            if (!channel._active) {
                channel._active = true;
                return channel;
            }
        }
        return null;
    }
    static returnInstance(channel) {
        channel._active = false;
    }
    static get POOL_SIZE() {
        return AudioKeyboardChannel.POOL.length;
    }
    static get WAVEFORM() {
        return AudioKeyboardChannel._WAVEFORM;
    }
    static set WAVEFORM(value) {
        for (let channel of AudioKeyboardChannel.POOL) {
            if (channel.oscillator !== null) {
                channel.oscillator.type = value;
            }
        }
        AudioKeyboardChannel._WAVEFORM = value;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        if (!this._enabled && value) {
            if (AudioKeyboardChannel.CONTEXT === null) {
                AudioKeyboardChannel.CONTEXT = new AudioContext();
            }
            this.oscillator = AudioKeyboardChannel.CONTEXT.createOscillator();
            this.gain = AudioKeyboardChannel.CONTEXT.createGain();
            this.oscillator.connect(this.gain);
            this.oscillator.frequency.value = this._frequency;
            this.oscillator.type = AudioKeyboardChannel._WAVEFORM;
            this.gain.connect(AudioKeyboardChannel.CONTEXT.destination);
            this.gain.gain.value = this._volume;
            this.oscillator.start();
        }
        else if (this._enabled && !value) {
            if (this.oscillator !== null) {
                this.oscillator.stop();
            }
            this._active = true;
            this.oscillator = null;
            this.gain = null;
        }
        this._enabled = value;
    }
    get frequency() {
        return this._frequency;
    }
    set frequency(value) {
        if (value < 0) {
            throw `Invalid frequency "${value}". Must be a non-negative number.`;
        }
        this._frequency = value;
        if (this.oscillator !== null) {
            this.oscillator.frequency.value = value;
        }
    }
    get volume() {
        return this._volume;
    }
    set volume(value) {
        if (value < AudioKeyboardChannel.MIN_VOLUME || value > AudioKeyboardChannel.MAX_VOLUME) {
            throw `Invalid volume "${value}". Must be between ` +
                `${AudioKeyboardChannel.MIN_VOLUME} and ${AudioKeyboardChannel.MAX_VOLUME}, inclusive.`;
        }
        this._volume = value;
        if (this.gain !== null) {
            this.gain.gain.value = value;
        }
    }
    silence() {
        if (!this._enabled) {
            return;
        }
        this.volume = AudioKeyboardChannel.MIN_VOLUME;
    }
    get active() {
        return this._active;
    }
}
AudioKeyboardChannel.NOTE_A4 = 440;
AudioKeyboardChannel.MIN_VOLUME = 0.00001;
AudioKeyboardChannel.MAX_VOLUME = 1.00000;
AudioKeyboardChannel.CONTEXT = null;
AudioKeyboardChannel.POOL = [];
AudioKeyboardChannel._WAVEFORM = "sine";
