"use strict";
let keyStepMap = {};
Object.keys(KEY_MAP).map((key) => {
    keyStepMap[key] = KEY_MAP[key].step;
});
let audioKeyboard = new AudioKeyboard(5, keyStepMap);
window.addEventListener('load', (_) => {
    window.addEventListener('keydown', (event) => {
        var _a;
        if (event.key in KEY_MAP) {
            audioKeyboard.playKeyNote(event.key, 0.01);
            let note = KEY_MAP[event.key].note;
            (_a = document.getElementById(`key${note}`)) === null || _a === void 0 ? void 0 : _a.classList.add('key-down');
        }
    });
    window.addEventListener('keyup', (event) => {
        var _a;
        if (event.key in KEY_MAP) {
            audioKeyboard.releaseKeyNote(event.key);
            let note = KEY_MAP[event.key].note;
            (_a = document.getElementById(`key${note}`)) === null || _a === void 0 ? void 0 : _a.classList.remove('key-down');
        }
    });
});
