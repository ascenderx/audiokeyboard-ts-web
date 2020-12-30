class AudioKeyboard {
  public readonly keyStepMap: { [key: string]: number } = {}; 
  public transposeWidth: number = 0;
  private activeChannels: AudioKeyboardChannel[] = [];

  public constructor(channelCount: number, keyStepMap: { [key: string]: number } = {}) {
    if (channelCount < 1) {
      throw `Invalid channel count "${channelCount}". Must be a positive integer.`;
    }
    AudioKeyboardChannel.WAVEFORM = "square";
    AudioKeyboardChannel.generatePool(channelCount);
    for (let key in keyStepMap) {
      this.keyStepMap[key] = keyStepMap[key];
    }
  }

  public playKeyNote(key: string, volume: number = AudioKeyboardChannel.MAX_VOLUME): void {
    if (!(key in this.keyStepMap)) {
      throw `Key ${key} is not bound to a note.`;
    }
    for (let channel of this.activeChannels) {
      if (channel.key === key) {
        return;
      }
    }
    let step: number = this.keyStepMap[key];
    let frequency: number = AudioKeyboardChannel.stepToFrequency(step + this.transposeWidth);
    let channel: AudioKeyboardChannel | null = AudioKeyboardChannel.getInstance()
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

  public releaseKeyNote(key: string): void {
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
