let keyStepMap: { [key: string]: number } = {};
Object.keys(KEY_MAP).map((key) => {
  keyStepMap[key] = KEY_MAP[key].step;
});

let audioKeyboard = new AudioKeyboard(5, keyStepMap);

window.addEventListener('load', (_: Event): void => {
  window.addEventListener('keydown', (event: KeyboardEvent): void => {
    if (event.key in KEY_MAP) {
      audioKeyboard.playKeyNote(event.key, 0.01);
      let note = KEY_MAP[event.key].note;
      document.getElementById(`key${note}`)?.classList.add('key-down');
    }
  });

  window.addEventListener('keyup', (event: KeyboardEvent): void => {
    if (event.key in KEY_MAP) {
      audioKeyboard.releaseKeyNote(event.key);
      let note = KEY_MAP[event.key].note;
      document.getElementById(`key${note}`)?.classList.remove('key-down');
    }
  });
});
