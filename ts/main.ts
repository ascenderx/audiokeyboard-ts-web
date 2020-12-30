let audioKeyboard = new AudioKeyboard(5);

window.addEventListener('load', (_: Event): void => {
  window.addEventListener('keydown', (event: KeyboardEvent): void => {
    if (event.key in AudioKeyboard.KEY_STEP_MAP) {
      audioKeyboard.playKeyNote(event.key, 0.01);
    }
  });

  window.addEventListener('keyup', (event: KeyboardEvent): void => {
    if (event.key in AudioKeyboard.KEY_STEP_MAP) {
      audioKeyboard.releaseKeyNote(event.key);
    }
  });
});
