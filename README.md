# React Hook to transcribe microphone input into text.

![Demo](demo.gif)

This hook supports cross browser speech to text if the `crossBrowser: true` prop is passed.

By default, the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition">SpeechRecognition API</a> is used which is currently only supported by Chrome browsers.

The SpeechRecognition API does not require any additional setup or API keys, everything works out of the box.

# Why use this package?

- Written in TypeScript with full type support
- 0 dependencies
- Simple APIs
- Cross-browser optional support
- Small bundle size 11.9kB **(4.7kB gzipped)**

# Install

```
npm i react-hook-speech-to-text
```

```
yarn add react-hook-speech-to-text
```

# Live Demo

https://trusting-perlman-d246f0.netlify.app/

As of 02/02/20 cross-browser speech to text tested and working on Chrome, firefox, Safari for Mac, iOS 13 and 14 Safari. Have not tested on Android but should work on chromium based android browsers.

Unfortunately does not work on firefox or chrome on iOS due to apple only supporting `getUserMedia` on safari (thanks apple 💩)

# Cross Browser Support

If cross-browser support is needed, the `crossBrowser: true` prop must be passed. A [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/) API key is needed.

This hook makes use of a customized version of `recorder.js` for recording audio, down-sampling the audio `sampleRate` to <= 48000hz, and converting that audio to WAV format.

The hook then converts the WAV audio blob returned from `recorder.js` and converts it into a `base64` string using the `FileReader` API. This is all needed in order to POST audio data to the Google Cloud Speech-to-Text REST API and get transcribed text returned all on the front-end.

Also used is `hark.js` for detecting start and stopped speech events for browsers that don't support the `SpeechRecognition` API. If the `SpeechRecognition` API is available, `SpeechRecognition` API handles start and stop speech events automatically.

# Hook usage

```JSX
import React from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

export default function AnyComponent() {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
  );
}
```

# Cross-browser mode

Same code as above with `crossBrowser: true` and `googleApiKey` props passed

```JSX
  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    crossBrowser: true,
    googleApiKey: YOUR_GOOGLE_CLOUD_API_KEY_HERE,
    useLegacyResults: false
});
```

# Arguments

Arguments passed to `useSpeechToText` invocation

### `timeout`

Sets amount in milliseconds to stop recording microphone input after last detected speech event.

**Note**: `timeout` is only applied when `crossBrowser: true` arg is passed and using browser that does not support `SpeechRecognition` API, else Chrome's Speech Recognition automatically stops recording after a certain amount of time.

- Type: `number`
- Required: `false`
- Default: `10000`

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
- Required: `true` if `crossBrowser` or `useOnlyGoogleCloud`
- Default: `undefined`

<hr>

### `googleCloudRecognitionConfig`

**Thanks to https://github.com/iwgx for the suggestion https://github.com/Riley-Brown/react-speech-to-text/issues/2**

Optional config object to have more control over the google cloud speech settings. These options will only be passed if using `crossBrowser: true` on browsers not supporting SpeechRecognition API, or on all browsers if passing `useOnlyGoogleCloud: true`. All options can be found here https://cloud.google.com/speech-to-text/docs/reference/rest/v1/RecognitionConfig

- Type: `GoogleCloudRecognitionConfig`
- Required: `false`
- Default: `undefined`

ex:

```jsx
const { results } = useSpeechToText({
  crossBrowser: true,
  googleApiKey: process.env.REACT_APP_API_KEY,
  googleCloudRecognitionConfig: {
    languageCode: 'en-US'
  }
});
```

<hr>

### `speechRecognitionProperties`

Optional object of properties to have more control over Google Chrome's SpeechRecognition API. These properties only apply on browsers that support Google Chrome's SpeechRecognition API. All properties can be found here https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#properties

- Type: `SpeechRecognitionProperties`
- Required: `false`
- Default: `{ interimResults: true }`

ex:

```jsx
const { results, interimResult } = useSpeechToText({
  speechRecognitionProperties: {
    lang: 'en-US',
    interimResults: true // Allows for displaying real-time speech results
  }
});
```

<hr>

### `useOnlyGoogleCloud`

Boolean to force use of google cloud engine speech-to-text even on browsers that support built in SpeechRecognition API. By default, this package will try to use SpeechRecognition where available since it is free for Chrome and will provide faster results than the cross-browser google cloud engine speech-to-text method. Overwrite this functionality if you want to only use google cloud for more consistent functionality.

Note: if setting to true, you must pass a valid google cloud speech to text API key or no results will be returned.

- Type: `boolean`
- Required: `false`
- Default: `false`

<hr>

### `useLegacyResults`

Boolean to return legacy array of string results or the new array of object results. Recommended to pass `useLegacyResults: false` as the legacy array of strings results will be removed in a future version.

- Type: `boolean`
- Required: `false`
- Default: `false`

<hr>

# Returned Values

Values returns by the `useSpeechToText()` hook

ex: `const { results } = useSpeechToText()`

### `results`

Transcribed text from speech on successful speech-to-text transcription.

- Type: `string[] | ResultType[]`
- Default: `[]`

```typescript
type ResultType = {
  speechBlob?: Blob;
  timestamp: number;
  transcript: string;
};
```

**Important**: When passing `useLegacyResults: false`, results will return the new `ResultType[]` array of objects. It is recommended to opt into the new results ASAP as the legacy results will be completely removed in a future version.

Note: `speechBlob` will only be returned when using google cloud speech to text API as Chrome's SpeechRecognition API does not provide access to the captured microphone data

<hr>

### `setResults`

React setState function to manually set the results state array

**Thanks to https://github.com/marharyta for the suggestion https://github.com/Riley-Brown/react-speech-to-text/issues/12**

- Type: `React.Dispatch<React.SetStateAction<ResultType[]>>`

<hr>

### `interimResult`

Real-time speech result only for `SpeechRecognition` web API if opting-in using `speechRecognitionProperties: { interimResults: true }` config prop. Will update using the partial results returned from the web API and gets set back to `undefined` on final speech result.

- Type: `string` | `undefined`
- Default: `undefined`

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

# Running project locally

```
npm run start
```

# Building project locally

Code will be output to the `/dist` folder using rollup bundler

```
npm run build
```

# Contributing

Feel free to open an issue on the repo with any bugs or feature requests, or fork and create a PR with fixes, features or improvements.
