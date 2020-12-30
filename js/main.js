"use strict";
const KEY_STEP_MAP = {
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
let audioKeyboard = new AudioKeyboard(5, KEY_STEP_MAP);
window.addEventListener('load', (_) => {
    window.addEventListener('keydown', (event) => {
        if (event.key in KEY_STEP_MAP) {
            audioKeyboard.playKeyNote(event.key, 0.01);
        }
    });
    window.addEventListener('keyup', (event) => {
        if (event.key in KEY_STEP_MAP) {
            audioKeyboard.releaseKeyNote(event.key);
        }
    });
});
