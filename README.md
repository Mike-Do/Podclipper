# Podclipper

Podclipper is a Chrome extension that allows users to capture audio playing on the current tab for the Goodpods platform. The extension makes use of the Web Audio API, Recorder.s libary, and the LAME MP3 encoder.

Hotkeys for Windows:
 - Ctrl + Shift + S: Start capture on current tab
 - Ctrl + Shift + X: Stop capture on current tab

Hotkeys for Mac:
 - Command + Shift + U: Start capture on current tab
 - Control + Shift + X: Stop capture on current tab

 ## Getting Started

**To get started, follow the instructions below**

To get a local copy up and running follow these steps.

- git clone the repo

```
git clone https://github.com/Mike-Do/Podclipper.git && cd Podclipper
```

- Install all the required packages with

```
npm install
```

To install in Chrome

- Navigate to chrome://extensions
- Toggle "Developer mode" on.
- Click "Load unpacked."
- Upload the dist folder to chrome
- The extension should now be available for use