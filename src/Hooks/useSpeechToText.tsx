import { useState, useEffect, useRef } from 'react';

// Not sure about these 🤷‍♂️
export interface RecorderTypes {
  record: () => void;
  start: () => Promise<MediaStream | undefined>;
  stop: () => void;
  exportWAV: (blob: any) => void;
}

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
const audioContext = new AudioContext();

const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export interface UseSpeechToTextTypes {
  googleApiKey?: string;
  continuous?: boolean;
  crossBrowser?: boolean;
  onStartSpeaking?: () => any;
  onStoppedSpeaking?: () => any;
  timeout?: number;
}

export default function useSpeechToText({
  googleApiKey,
  continuous,
  crossBrowser,
  onStartSpeaking,
  onStoppedSpeaking,
  timeout
}: UseSpeechToTextTypes) {
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<RecorderTypes>();
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');

  const timeoutId = useRef<number>();

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

          // Initialize hark for start and stop speech events
          handleSpeechEvents({ stream });
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
    if (recognition) {
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

      // Audio stopped recording or timed out
      recognition.onaudioend = () => {
        setIsRecording(false);
      };
    }
  };

  const stopCapturing = () => {
    if (!crossBrowser && isRecording && recognition) {
      recognition.stop();
    } else if (recorder && audioStream) {
      recorder.stop();
      audioStream.getAudioTracks()[0].stop();
      setIsRecording(false);
    }
  };

  const createAudioContext = ({ stream }: { stream: MediaStream }) => {
    // Create new audio context source
    let input = audioContext.createMediaStreamSource(stream);

    setAudioStream(stream);

    // Start new Recorder instance
    const Recorder = (window as any).Recorder;
    let rec: RecorderTypes = new Recorder(input, {
      numChannels: 1
    });

    rec.record();
    setRecorder(rec);

    return rec;
  };

  // Speech events for cross browser functionality
  const handleSpeechEvents = ({ stream }: { stream: MediaStream }) => {
    const harkOptions = {};
    const speechEvents = (window as any).hark(stream, harkOptions);

    // Starts Recorder.js recording
    let rec = createAudioContext({ stream });
    rec.record();

    // Create timeout to stop recording
    handleTimeout({ stream, rec });

    speechEvents.on('speaking', () => {
      if (onStartSpeaking) onStartSpeaking();

      // clear timeout
      clearTimeout(timeoutId.current);
    });

    speechEvents.on('stopped_speaking', () => {
      if (onStoppedSpeaking) onStoppedSpeaking();
      rec.stop();

      // convert audio to WAV blob
      rec.exportWAV((blob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;

          // gets raw base64 data
          audio.content = base64data.substr(base64data.indexOf(',') + 1);

          // Send base64 data string to Google Cloud API
          const response = await fetch(
            `https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            }
          );
          const responseJson = await response.json();

          // Update results state with transcribed text
          if (responseJson.results && responseJson.results.length > 0) {
            console.log(responseJson.results[0].alternatives[0].transcript);
            setResults(prevResults => [
              ...prevResults,
              responseJson.results[0].alternatives[0].transcript
            ]);
          }
        };

        // Google Cloud Config
        const audio = {
          content: ''
        };
        const config = {
          encoding: 'LINEAR16',
          languageCode: 'en-US'
        };
        const data = {
          config,
          audio
        };
      });

      if (continuous) {
        // create new audio context instance for continuous recording
        rec = createAudioContext({ stream });
      }

      // New timeout after last speech detected
      handleTimeout({ stream, rec });
    });
  };

  // Stop audio recording if timeout prop
  const handleTimeout = ({
    rec,
    stream
  }: {
    rec: RecorderTypes;
    stream: MediaStream;
  }) => {
    if (timeout) {
      // Create and set new timeout
      let newTimeoutId = window.setTimeout(() => {
        rec.stop();
        stream.getAudioTracks()[0].stop();
        setIsRecording(false);
      }, timeout);

      timeoutId.current = newTimeoutId;

      return newTimeoutId;
    }
  };

  return { results, startCapturing, stopCapturing, isRecording, error };
}
