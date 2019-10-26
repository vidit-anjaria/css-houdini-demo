async function paintW() {
    await CSS.paintWorklet.addModule("js/myWorklet.js");
}
paintW();