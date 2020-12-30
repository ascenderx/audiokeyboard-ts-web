"use strict";
class AudioKeyboardChannel {
    constructor() {
        this.oscillator = null;
        this.gain = null;
        this._enabled = false;
        this._frequency = 0;
        this._volume = AudioKeyboardChannel.MIN_VOLUME;
        this._silenced = true;
        this._waveform = "sine";
        this.key = null;
    }
    static stepToFrequency(step, baseFrequency = AudioKeyboardChannel.NOTE_A4) {
        return baseFrequency * (2 ** (step / 12));
    }
    static generatePool(size, waveform = 'sine') {
        if (size < 1) {
            throw `Invalid pool size ${size}. Must be a positive number.`;
        }
        for (let c = 0; c < size; c++) {
            let channel = new AudioKeyboardChannel();
            channel.waveform = waveform;
            AudioKeyboardChannel.POOL.push(channel);
        }
        this.POOL_INITIALIZED = true;
    }
    static getInstance() {
        return AudioKeyboardChannel.POOL.pop() || null;
    }
    static returnInstance(channel) {
        AudioKeyboardChannel.POOL.push(channel);
    }
    static get poolSize() {
        return AudioKeyboardChannel.POOL.length;
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
            this.oscillator.type = this._waveform;
            this.gain.connect(AudioKeyboardChannel.CONTEXT.destination);
            this.gain.gain.value = this._volume;
            this.oscillator.start();
        }
        else if (this._enabled && !value) {
            if (this.oscillator !== null) {
                this.oscillator.stop();
            }
            this._silenced = true;
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
        this._silenced = value === AudioKeyboardChannel.MIN_VOLUME;
    }
    silence() {
        if (!this._enabled) {
            return;
        }
        this.volume = AudioKeyboardChannel.MIN_VOLUME;
    }
    get silenced() {
        return this._silenced;
    }
    get waveform() {
        return this._waveform;
    }
    set waveform(value) {
        this._waveform = value;
        if (this.oscillator !== null) {
            this.oscillator.type = value;
        }
    }
}
AudioKeyboardChannel.NOTE_A4 = 440;
AudioKeyboardChannel.MIN_VOLUME = 0.00001;
AudioKeyboardChannel.MAX_VOLUME = 1.00000;
AudioKeyboardChannel.CONTEXT = null;
AudioKeyboardChannel.POOL_INITIALIZED = false;
AudioKeyboardChannel.POOL = [];
