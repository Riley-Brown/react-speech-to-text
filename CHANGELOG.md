# 0.7.0

- Add new `useLegacyResults` hook arg to opt into new array of objects results
- Add new array of objects results containing timestamp, transcript and speechBlob properties for each speech result
- Add default `timeout` value of 10000
- Add default `speechRecognitionProperties` value of `{ interimResults: true }` for displaying realtime speech to text result

It is recommended to opt into new results by passing `useLegacyResults: false` as the legacy array of string results will be completely removed in a future version

# 0.6.0

- Added functionality to return real-time speech result while speaking for `SpeechRecognition` web API

Hook now returns an `interimResult` variable which is a string and will be updated as you speak if opting in using the speech recognition properties config of `speechRecognitionProperties: { interimResults: true }`

ex:

```JSX
 const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    interimResult
  } = useSpeechToText({
    continuous: true,
    crossBrowser: true,
    googleApiKey: process.env.REACT_APP_API_KEY,
    timeout: 10000,
    speechRecognitionProperties: { interimResults: true }
  });

  return (
     <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
  )
```

- When SpeechRecognition result event returns `isFinal`, the `interimResult` value will be set to `undefined`, this allows you to conditionally display the real-time interimResult while speech is in progress, then display the final result from the results array once result is final

![Demo](demo.gif)
