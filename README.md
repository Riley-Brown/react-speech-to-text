### React Hooks to translate microphone input to text.

This hook supports cross browser speech to text if the `crossBrowser: true` prop is passed.

By default, the `SpeechRecognition` web API is used which is currently only supported by Chrome browsers.

The `SpeechRecognition` API does not require any additional setup or API keys, everything works out of the box.

### Cross Browser Support

If cross-browser support is needed, the `crossBrowser: true` prop must be passed. A [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/) API key is needed.

This hook makes use of a customized version of `Recorder.js` for recording audio, down-sampling the audio `sampleRate` to <= 48000hz, and converting that audio to WAV format.

The hook then converts the WAV audio blob returned from `Recorder.js` and converts it into a `base64` string using the `FileReader` API. This is all needed in order to POST audio data to the Google Cloud Speech-to-Text REST API and get transcribed text returned all on the front-end.
