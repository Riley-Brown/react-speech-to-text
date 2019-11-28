import { useState, useEffect } from 'react';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export default function useRecordMicrophone({
  onStartSpeaking,
  onStoppedSpeaking,
  timeout,
  continuous,
  crossBrowser
}) {
  const [audioStream, setAudioStream] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordingTimeout, setRecordingTimeout] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!crossBrowser && !recognition) {
      setError('Speech Recognition API is only available on Chrome');
    }
    if (!audioContext) {
      setError('Audio Context is not supported on this browser');
    }
  }, [audioContext, crossBrowser, recognition]);

  const startCapturing = () => {
    // Google Chrome Web Speech API
    if (!crossBrowser && recognition) {
      chromeSpeechRecognition();
    } else {
      // Cross Browser Speech to text using Google Cloud
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(stream => {
          setIsRecording(true);

          // starts recorder.js
          const rec = createAudioContext({ stream });

          // Initialize hark for start and stop speech events
          handleSpeechEvents({ stream, rec });

          // Clear audio capturing after timeout amount
          handleTimeout({ rec, stream });
        })
        .catch(err => {
          console.log(err);
          setError('Microphone access was denied');
        });
    }
  };

  // Chrome Speech Recognition API:
  // Only supported on Chrome browsers
  const chromeSpeechRecognition = () => {
    // Continuous recording after stopped speaking event
    if (continuous) recognition.continuous = true;

    // start recognition
    setIsRecording(true);
    recognition.start();

    // speech successfully translated into text
    recognition.onresult = e => {
      if (e.results) {
        setResults(prevResults => [
          ...prevResults,
          e.results[e.results.length - 1][0].transcript
        ]);
      }
    };

    recognition.onaudioend = () => {
      setIsRecording(false);
    };
  };

  const stopCapturing = () => {
    if (!crossBrowser && isRecording) {
      recognition.stop();
    }
  };

  const createAudioContext = ({ stream }) => {
    // Create new audio context source
    let input = audioContext.createMediaStreamSource(stream);

    // Start new Recorder instance
    const Recorder = window.Recorder;
    let rec = new Recorder(input, {
      numChannels: 1
    });
    rec.record();
    setRecorder(rec);

    return rec;
  };

  const handleSpeechEvents = ({ stream, rec }) => {
    const speechEvents = window.hark(stream);
    speechEvents.on('speaking', () => {
      if (onStartSpeaking) onStartSpeaking();
      clearInterval(recordingTimeout);
    });

    if (onStoppedSpeaking) {
      speechEvents.on('stopped_speaking', () => {
        if (onStoppedSpeaking) onStoppedSpeaking();
        rec.stop();
        handleTimeout({ stream, rec });
      });
    }
  };

  // Stop audio recording if timeout prop
  const handleTimeout = ({ rec, stream }) => {
    if (timeout) {
      let clear = window.setTimeout(() => {
        rec.stop();
        stream.getAudioTracks()[0].stop();
        setIsRecording(false);
      }, timeout);
      setRecordingTimeout(clear);
    }
  };

  return { results, startCapturing, stopCapturing, isRecording, error };
}
