# React Hooks to transcribe microphone input to text.

This hook supports cross browser speech to text if the `crossBrowser: true` prop is passed.

By default, the `SpeechRecognition` web API is used which is currently only supported by Chrome browsers.

The `SpeechRecognition` API does not require any additional setup or API keys, everything works out of the box.

# Cross Browser Support

If cross-browser support is needed, the `crossBrowser: true` prop must be passed. A [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/) API key is needed.

This hook makes use of a customized version of `Recorder.js` for recording audio, down-sampling the audio `sampleRate` to <= 48000hz, and converting that audio to WAV format.

The hook then converts the WAV audio blob returned from `Recorder.js` and converts it into a `base64` string using the `FileReader` API. This is all needed in order to POST audio data to the Google Cloud Speech-to-Text REST API and get transcribed text returned all on the front-end.

# Arguments

Arguments passed to `useRecordMicrophone()` invocation

### `timeout`

Sets amount in milliseconds to stop recording microphone input after last detected speech event.

**Note**: `timeout` is only applied when `crossBrowser: true` arg is passed, else Chrome's Speech Recognition automatically stops recording after a certain amount of time.

- Type: `Number`
- Required: `false`
- Default: `undefined`

<hr>

### `continuous`

Sets whether or not to keep recording microphone input after speech results are returned

- Type: `Boolean`
- Required: `false`
- Default: `undefined`

<hr>

### `onStartSpeaking`

Callback function invoked on speech detection event.

- Type: `Func`
- Required: `false`
- Default: `undefined`

<hr>

### `onStopSpeaking`

Callback function invoked on speech stopped event.

- Type: `Func`
- Required: `false`
- Default: `undefined`

<hr>

### `crossBrowser`

Boolean to enable speech to text functionality on Chrome, Firefox, and Edge major browsers

**Note**: `googleApiKey` is required if using `crossBrowser` mode.

- Type: `Boolean`
- Required: `false`
- Default: `false`

<hr>

### `googleApiKey`

API key used for Google Cloud Speech to text API for cross browser speech to text functionality.

- Type: `String`
- Required: `true` if `crossBrowser`
- Default: `undefined`

<hr>

# Returned Values

Values returns by the `useRecordMicrophone()` invocation

ex: `const { results } = useRecordMicrophone()

### `results`

Transcribed text from speech on successful speech-to-text transcription.

- Type: `Array` of `String`
- Default: `[]`

<hr>

### `startCapturing`

Function to start microphone input recording. Will prompt user with microphone access permission if not previously granted.

- Type: `Func`

<hr>

### `stopCapturing`

Function to stop microphone input recording.

- Type: `Func`

<hr>

### `isRecording`

Boolean to detect if an active recording is occurring.

- Type: `Boolean`
- Default: `false`

<hr>

### `error`

Error string if feature is not supported on current browser

- Type: `String`
- Default: `null`

<hr>

# Hook Usage

### Non cross-browser Chrome only usage:

```JSX
import React from 'react';
import useRecordMicrophone from 'Hooks/useRecordMicrophone';

export default function AnyComponent() {
  const {
    startCapturing,
    stopCapturing,
    isRecording,
    results,
    error
  } = useRecordMicrophone({
    timeout: 10000,
    continuous: true
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopCapturing : startCapturing}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map(result => (
          <li>{result}</li>
        ))}
      </ul>
    </div>
  );
}
```
