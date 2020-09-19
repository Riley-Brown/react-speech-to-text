# React Hooks to transcribe microphone input to text.

This hook supports cross browser speech to text if the `crossBrowser: true` prop is passed.

By default, the `SpeechRecognition` web API is used which is currently only supported by Chrome browsers.

The `SpeechRecognition` API does not require any additional setup or API keys, everything works out of the box.

# Live Demo

As of 09/19/20 cross-browser speech to text tested and working on Chrome, firefox, Safari for Mac, iOS 13 and 14 Safari. Have not tested on Android but should work on chromium based android browsers.

Unfortunately does not work on firefox or chrome on iOS due to apple only supporting `getUserMedia` on safari (thanks apple 💩)

https://trusting-perlman-d246f0.netlify.app/

# Cross Browser Support

If cross-browser support is needed, the `crossBrowser: true` prop must be passed. A [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/) API key is needed.

This hook makes use of a customized version of `recorder.js` for recording audio, down-sampling the audio `sampleRate` to <= 48000hz, and converting that audio to WAV format.

The hook then converts the WAV audio blob returned from `recorder.js` and converts it into a `base64` string using the `FileReader` API. This is all needed in order to POST audio data to the Google Cloud Speech-to-Text REST API and get transcribed text returned all on the front-end.

Also used is `hark.js` for detecting start and stopped speech events for browsers that don't support the `SpeechRecognition` API. If the `SpeechRecognition` API is available, `SpeechRecognition` API handles start and stop speech events automatically.

# Basic Hook usage

```JSX
  const {
    startSpeechToText,
    stopSpeechToText,
    isRecording,
    results,
    error
  } = useSpeechToText({
    timeout: 10000,
    continuous: true
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map(result => (
          <li>{result}</li>
        ))}
      </ul>
    </>
  );
```

# Arguments

Arguments passed to `useSpeechToText` invocation

### `timeout`

Sets amount in milliseconds to stop recording microphone input after last detected speech event.

**Note**: `timeout` is only applied when `crossBrowser: true` arg is passed and using browser that does not support `SpeechRecognition` API, else Chrome's Speech Recognition automatically stops recording after a certain amount of time.

- Type: `number`
- Required: `false`
- Default: `undefined`

<hr>

### `continuous`

Sets whether or not to keep recording microphone input after speech results are returned

- Type: `boolean`
- Required: `false`
- Default: `undefined`

<hr>

### `onStartSpeaking`

Callback function invoked on speech detection event. **Only invoked on browsers that do not support `SpeechRecognition` API**

- Type: `() => any`
- Required: `false`
- Default: `undefined`

<hr>

### `onStopSpeaking`

Callback function invoked on speech stopped event. **Only invoked on browsers that do not support `SpeechRecognition` API**

- Type: `() => any`
- Required: `false`
- Default: `undefined`

<hr>

### `crossBrowser`

Boolean to enable speech to text functionality on browsers that do not support the `SpeechRecognition` API. Firefox, Safari, iOS Safari etc.

**Note**: `googleApiKey` is required if using `crossBrowser` mode.

- Type: `boolean`
- Required: `false`
- Default: `false`

<hr>

### `googleApiKey`

API key used for Google Cloud Speech to text API for cross browser speech to text functionality.

- Type: `string`
- Required: `true` if `crossBrowser`
- Default: `undefined`

<hr>

# Returned Values

Values returns by the `useSpeechToText()` invocation

ex: `const { results } = useSpeechToText()`

### `results`

Transcribed text from speech on successful speech-to-text transcription.

- Type: `string[]`
- Default: `[]`

<hr>

### `startSpeechToText`

Function to start microphone input recording. Will prompt user with microphone access permission if not previously granted.

- Type: `() => Promise<void>`

<hr>

### `stopSpeechToText`

Function to stop microphone input recording.

- Type: `() => void`

<hr>

### `isRecording`

Boolean to detect if an active recording is occurring.

- Type: `boolean`
- Default: `false`

<hr>

### `error`

Error string if feature is not supported on current browser

- Type: `string`
- Default: `''`

<hr>

# Hook Usage

### Non cross-browser Chrome only usage:

```JSX
import React from 'react';
import useSpeechToText from 'Hooks/useSpeechToText';

export default function AnyComponent() {
  const {
    startSpeechToText,
    stopSpeechToText,
    isRecording,
    results,
    error
  } = useSpeechToText({
    timeout: 10000,
    continuous: true
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
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

### Cross-Browser usage

Same as above example with slightly different args

```JSX
  const {
    startSpeechToText,
    stopSpeechToText,
    isRecording,
    results,
    error
  } = useSpeechToText({
    timeout: 10000,
    continuous: true,
    crossBrowser: true,
    googleApiKey: YOUR_GOOGLE_CLOUD_API_KEY_HERE
  });
```
