import Recorder from './recorder';

let microphoneStream; // stream from getUserMedia()
let rec = Recorder; // Recorder.js object
let input; // MediaStreamAudioSourceNode we'll be recording

/**
 *
 * @param {{
 * audioContext: AudioContext
 * errHandler?: () => void
 * onStreamLoad?: () => void
 * }}
 * @returns {Promise<MediaStream>}
 */
export async function startRecording({
  audioContext,
  errHandler,
  onStreamLoad,
}) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    if (onStreamLoad) {
      onStreamLoad();
    }

    /*  assign stream for later use  */
    microphoneStream = stream;

    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);

    rec = new Recorder(input);

    // start the recording process
    rec.record();

    return stream;
  } catch (err) {
    console.log(err);

    if (errHandler) {
      errHandler();
    }
  }
}

/**
 *
 * @param {{
 * exportWAV: boolean
 * wavCallback?: (blob: Blob) => void
 * }}
 */
export function stopRecording({ exportWAV, wavCallback }) {
  // stop recorder.js recording
  rec.stop();

  // stop microphone access
  microphoneStream.getAudioTracks()[0].stop();

  // create the wav blob
  if (exportWAV && wavCallback) {
    rec.exportWAV((blob) => wavCallback(blob));
  }

  rec.clear();
}
