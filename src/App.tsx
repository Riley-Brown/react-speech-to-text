import React from 'react';

import useSpeechToText, { ResultType } from './Hooks';

import micIcon from './mic.svg';

import './App.css';

export default function App() {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText
  } = useSpeechToText({
    continuous: true,
    crossBrowser: true,
    googleApiKey: process.env.REACT_APP_API_KEY,
    speechRecognitionProperties: { interimResults: true },
    useLegacyResults: false
  });

  if (error) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '100px auto',
          textAlign: 'center'
        }}
      >
        <p>
          {error}
          <span style={{ fontSize: '3rem' }}>🤷‍</span>
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '100px auto',
        textAlign: 'center'
      }}
    >
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        <img data-recording={isRecording} src={micIcon} alt="" />
      </button>
      <ul>
        {(results as ResultType[]).map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
  );
}
