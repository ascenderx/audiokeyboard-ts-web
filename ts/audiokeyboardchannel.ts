class AudioKeyboardChannel {
  public static readonly NOTE_A4 = 440;
  public static readonly MIN_VOLUME = 0.00001;
  public static readonly MAX_VOLUME = 1.00000;
  private static CONTEXT: AudioContext | null = null; 
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private _enabled: boolean = false;
  private _frequency: number = 0;
  private _volume: number = AudioKeyboardChannel.MIN_VOLUME;
  private _silenced: boolean = true;
  private _waveform: OscillatorType = "sine";

  public static stepToFrequency(step: number, baseFrequency: number = AudioKeyboardChannel.NOTE_A4): number {
    return baseFrequency * (2**(step/12));
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
      this.oscillator.type = this._waveform;
      this.gain.connect(AudioKeyboardChannel.CONTEXT.destination);
      this.gain.gain.value = this._volume;

      this.oscillator.start();
    } else if (this._enabled && !value) {
      if (this.oscillator !== null) {
        this.oscillator.stop();
      }

      this._silenced = true;
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
    this._silenced = value === AudioKeyboardChannel.MIN_VOLUME;
  }

  public silence(): void {
    if (!this._enabled) {
      return;
    }
    this.volume = AudioKeyboardChannel.MIN_VOLUME;
  }

  public get silenced(): boolean {
    return this._silenced;
  }

  public get waveform(): OscillatorType {
    return this._waveform;
  }

  public set waveform(value: OscillatorType) {
    this._waveform = value;
    if (this.oscillator !== null) {
      this.oscillator.type = value;
    }
  }
}
