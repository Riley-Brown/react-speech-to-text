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
