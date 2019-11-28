import React from 'react';

import useRecordMicrophone from 'Hooks/useRecordMicrophone';

export default function App() {
  const onStartSpeaking = () => {
    console.log('started speaking');
  };

  const onStoppedSpeaking = () => {
    console.log('stopped speaking');
  };

  const {
    startCapturing,
    stopCapturing,
    isRecording,
    error,
    results
  } = useRecordMicrophone({
    onStartSpeaking,
    onStoppedSpeaking,
    timeout: 5000,
    continuous: true,
    crossBrowser: false
  });

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1 onClick={isRecording ? stopCapturing : startCapturing}>
        Recording: {isRecording.toString()}
      </h1>
      <ul>
        {results.map(result => (
          <li>{result}</li>
        ))}
      </ul>
    </div>
  );
}
