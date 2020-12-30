class AudioKeyboardChannel {
  public static readonly NOTE_A4 = 440;
  public static readonly MIN_VOLUME = 0.00001;
  public static readonly MAX_VOLUME = 1.00000;
  private static CONTEXT: AudioContext | null = null;
  private static POOL: AudioKeyboardChannel[] = [];
  private static _WAVEFORM: OscillatorType = "sine";
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private _enabled: boolean = false;
  private _frequency: number = 0;
  private _volume: number = AudioKeyboardChannel.MIN_VOLUME;
  private _active: boolean = false;
  public key: string | null = null;

  public static stepToFrequency(step: number, baseFrequency: number = AudioKeyboardChannel.NOTE_A4): number {
    return baseFrequency * (2**(step/12));
  }

  public static generatePool(size: number): void {
    if (size < 1) {
      throw `Invalid pool size ${size}. Must be a positive number.`;
    }

    for (let c = 0; c < size; c++) {
      let channel: AudioKeyboardChannel = new AudioKeyboardChannel();
      AudioKeyboardChannel.POOL.push(channel);
    }
  }

  public static getInstance(): AudioKeyboardChannel | null {
    for (let channel of AudioKeyboardChannel.POOL) {
      if (!channel._active) {
        channel._active = true;
        return channel;
      }
    }
    return null;
  }

  public static returnInstance(channel: AudioKeyboardChannel): void {
    channel._active = false;
  }

  public static get POOL_SIZE(): number {
    return AudioKeyboardChannel.POOL.length;
  }

  public static get WAVEFORM(): OscillatorType {
    return AudioKeyboardChannel._WAVEFORM;
  }

  public static set WAVEFORM(value: OscillatorType) {
    for (let channel of AudioKeyboardChannel.POOL) {
      if (channel.oscillator !== null) {
        channel.oscillator.type = value;
      }
    }
    AudioKeyboardChannel._WAVEFORM = value;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
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
    } else if (this._enabled && !value) {
      if (this.oscillator !== null) {
        this.oscillator.stop();
      }

      this._active = true;
      this.oscillator = null;
      this.gain = null;
    }
    this._enabled = value;
  }

  public get frequency(): number {
    return this._frequency;
  }

  public set frequency(value: number) {
    if (value < 0) {
      throw `Invalid frequency "${value}". Must be a non-negative number.`;
    }

    this._frequency = value;
    if (this.oscillator !== null) {
      this.oscillator.frequency.value = value;
    }
  }

  public get volume(): number {
    return this._volume;
  }

  public set volume(value: number) {
    if (value < AudioKeyboardChannel.MIN_VOLUME || value > AudioKeyboardChannel.MAX_VOLUME) {
      throw `Invalid volume "${value}". Must be between ` +
        `${AudioKeyboardChannel.MIN_VOLUME} and ${AudioKeyboardChannel.MAX_VOLUME}, inclusive.`;
    }

    this._volume = value;
    if (this.gain !== null) {
      this.gain.gain.value = value;
    }
  }

  public silence(): void {
    if (!this._enabled) {
      return;
    }
    this.volume = AudioKeyboardChannel.MIN_VOLUME;
  }

  public get active(): boolean {
    return this._active;
  }
}
