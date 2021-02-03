import { useState, useRef, useEffect } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/*
WildEmitter.js is a slim little event emitter by @henrikjoreteg largely based
on @visionmedia's Emitter from UI Kit.

Why? I wanted it standalone.

I also wanted support for wildcard emitters like this:

emitter.on('*', function (eventName, other, event, payloads) {

});

emitter.on('somenamespace*', function (eventName, payloads) {

});

Please note that callbacks triggered by wildcard registered events also get
the event name as the first argument.
*/

var wildemitter = WildEmitter;

function WildEmitter() { }

WildEmitter.mixin = function (constructor) {
    var prototype = constructor.prototype || constructor;

    prototype.isWildEmitter= true;

    // Listen on the given `event` with `fn`. Store a group name if present.
    prototype.on = function (event, groupName, fn) {
        this.callbacks = this.callbacks || {};
        var hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        func._groupName = group;
        (this.callbacks[event] = this.callbacks[event] || []).push(func);
        return this;
    };

    // Adds an `event` listener that will be invoked a single
    // time then automatically removed.
    prototype.once = function (event, groupName, fn) {
        var self = this,
            hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        function on() {
            self.off(event, on);
            func.apply(this, arguments);
        }
        this.on(event, group, on);
        return this;
    };

    // Unbinds an entire group
    prototype.releaseGroup = function (groupName) {
        this.callbacks = this.callbacks || {};
        var item, i, len, handlers;
        for (item in this.callbacks) {
            handlers = this.callbacks[item];
            for (i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i]._groupName === groupName) {
                    //console.log('removing');
                    // remove it and shorten the array we're looping through
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        return this;
    };

    // Remove the given callback for `event` or all
    // registered callbacks.
    prototype.off = function (event, fn) {
        this.callbacks = this.callbacks || {};
        var callbacks = this.callbacks[event],
            i;

        if (!callbacks) return this;

        // remove all handlers
        if (arguments.length === 1) {
            delete this.callbacks[event];
            return this;
        }

        // remove specific handler
        i = callbacks.indexOf(fn);
        if (i !== -1) {
            callbacks.splice(i, 1);
            if (callbacks.length === 0) {
                delete this.callbacks[event];
            }
        }
        return this;
    };

    /// Emit `event` with the given args.
    // also calls any `*` handlers
    prototype.emit = function (event) {
        this.callbacks = this.callbacks || {};
        var args = [].slice.call(arguments, 1),
            callbacks = this.callbacks[event],
            specialCallbacks = this.getWildcardCallbacks(event),
            i,
            len,
            listeners;

        if (callbacks) {
            listeners = callbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, args);
            }
        }

        if (specialCallbacks) {
            len = specialCallbacks.length;
            listeners = specialCallbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, [event].concat(args));
            }
        }

        return this;
    };

    // Helper for for finding special wildcard event handlers that match the event
    prototype.getWildcardCallbacks = function (eventName) {
        this.callbacks = this.callbacks || {};
        var item,
            split,
            result = [];

        for (item in this.callbacks) {
            split = item.split('*');
            if (item === '*' || (split.length === 2 && eventName.slice(0, split[0].length) === split[0])) {
                result = result.concat(this.callbacks[item]);
            }
        }
        return result;
    };

};

WildEmitter.mixin(WildEmitter);

function getMaxVolume (analyser, fftBins) {
  var maxVolume = -Infinity;
  analyser.getFloatFrequencyData(fftBins);

  for(var i=4, ii=fftBins.length; i < ii; i++) {
    if (fftBins[i] > maxVolume && fftBins[i] < 0) {
      maxVolume = fftBins[i];
    }
  }
  return maxVolume;
}


var audioContextType;
if (typeof window !== 'undefined') {
  audioContextType = window.AudioContext || window.webkitAudioContext;
}
// use a single audio context due to hardware limits
var audioContext = null;
var hark = function(stream, options) {
  var harker = new wildemitter();

  // make it not break in non-supported browsers
  if (!audioContextType) return harker;

  //Config
  var options = options || {},
      smoothing = (options.smoothing || 0.1),
      interval = (options.interval || 50),
      threshold = options.threshold,
      play = options.play,
      history = options.history || 10,
      running = true;

  // Ensure that just a single AudioContext is internally created
  audioContext = options.audioContext || audioContext || new audioContextType();

  var sourceNode, fftBins, analyser;

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = smoothing;
  fftBins = new Float32Array(analyser.frequencyBinCount);

  if (stream.jquery) stream = stream[0];
  if (stream instanceof HTMLAudioElement || stream instanceof HTMLVideoElement) {
    //Audio Tag
    sourceNode = audioContext.createMediaElementSource(stream);
    if (typeof play === 'undefined') play = true;
    threshold = threshold || -50;
  } else {
    //WebRTC Stream
    sourceNode = audioContext.createMediaStreamSource(stream);
    threshold = threshold || -50;
  }

  sourceNode.connect(analyser);
  if (play) analyser.connect(audioContext.destination);

  harker.speaking = false;

  harker.suspend = function() {
    return audioContext.suspend();
  };
  harker.resume = function() {
    return audioContext.resume();
  };
  Object.defineProperty(harker, 'state', { get: function() {
    return audioContext.state;
  }});
  audioContext.onstatechange = function() {
    harker.emit('state_change', audioContext.state);
  };

  harker.setThreshold = function(t) {
    threshold = t;
  };

  harker.setInterval = function(i) {
    interval = i;
  };

  harker.stop = function() {
    running = false;
    harker.emit('volume_change', -100, threshold);
    if (harker.speaking) {
      harker.speaking = false;
      harker.emit('stopped_speaking');
    }
    analyser.disconnect();
    sourceNode.disconnect();
  };
  harker.speakingHistory = [];
  for (var i = 0; i < history; i++) {
      harker.speakingHistory.push(0);
  }

  // Poll the analyser node to determine if speaking
  // and emit events if changed
  var looper = function() {
    setTimeout(function() {

      //check if stop has been called
      if(!running) {
        return;
      }

      var currentVolume = getMaxVolume(analyser, fftBins);

      harker.emit('volume_change', currentVolume, threshold);

      var history = 0;
      if (currentVolume > threshold && !harker.speaking) {
        // trigger quickly, short history
        for (var i = harker.speakingHistory.length - 3; i < harker.speakingHistory.length; i++) {
          history += harker.speakingHistory[i];
        }
        if (history >= 2) {
          harker.speaking = true;
          harker.emit('speaking');
        }
      } else if (currentVolume < threshold && harker.speaking) {
        for (var i = 0; i < harker.speakingHistory.length; i++) {
          history += harker.speakingHistory[i];
        }
        if (history == 0) {
          harker.speaking = false;
          harker.emit('stopped_speaking');
        }
      }
      harker.speakingHistory.shift();
      harker.speakingHistory.push(0 + (currentVolume > threshold));

      looper();
    }, interval);
  };
  looper();

  return harker;
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var WORKER_ENABLED = !!(commonjsGlobal === commonjsGlobal.window && commonjsGlobal.URL && commonjsGlobal.Blob && commonjsGlobal.Worker);

function InlineWorker(func, self) {
  var _this = this;
  var functionBody;

  self = self || {};

  if (WORKER_ENABLED) {
    functionBody = func.toString().trim().match(
      /^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/
    )[1];

    return new commonjsGlobal.Worker(commonjsGlobal.URL.createObjectURL(
      new commonjsGlobal.Blob([ functionBody ], { type: "text/javascript" })
    ));
  }

  function postMessage(data) {
    setTimeout(function() {
      _this.onmessage({ data: data });
    }, 0);
  }

  this.self = self;
  this.self.postMessage = postMessage;

  setTimeout(func.bind(self, self), 0);
}

InlineWorker.prototype.postMessage = function postMessage(data) {
  var _this = this;

  setTimeout(function() {
    _this.self.onmessage({ data: data });
  }, 0);
};

var inlineWorker = InlineWorker;

class Recorder {
  constructor(source, cfg) {
    this.config = {
      bufferLen: 4096,
      numChannels: 1,
      mimeType: 'audio/wav',
      ...cfg
    };
    this.recording = false;
    this.callbacks = {
      getBuffer: [],
      exportWAV: []
    };
    this.context = source.context;
    this.node = (
      this.context.createScriptProcessor || this.context.createJavaScriptNode
    ).call(
      this.context,
      this.config.bufferLen,
      this.config.numChannels,
      this.config.numChannels
    );

    this.node.onaudioprocess = (e) => {
      if (!this.recording) return;

      var buffer = [];
      for (var channel = 0; channel < this.config.numChannels; channel++) {
        buffer.push(e.inputBuffer.getChannelData(channel));
      }
      this.worker.postMessage({
        command: 'record',
        buffer: buffer
      });
    };

    source.connect(this.node);
    this.node.connect(this.context.destination); //this should not be necessary

    let self = {};
    this.worker = new inlineWorker(function () {
      let recLength = 0,
        recBuffers = [],
        sampleRate,
        numChannels;

      this.onmessage = function (e) {
        switch (e.data.command) {
          case 'init':
            init(e.data.config);
            break;
          case 'record':
            record(e.data.buffer);
            break;
          case 'exportWAV':
            exportWAV(e.data.type);
            break;
          case 'getBuffer':
            getBuffer();
            break;
          case 'clear':
            clear();
            break;
        }
      };

      let newSampleRate;

      function init(config) {
        sampleRate = config.sampleRate;
        numChannels = config.numChannels;
        initBuffers();

        if (sampleRate > 48000) {
          newSampleRate = 48000;
        } else {
          newSampleRate = sampleRate;
        }
      }

      function record(inputBuffer) {
        for (var channel = 0; channel < numChannels; channel++) {
          recBuffers[channel].push(inputBuffer[channel]);
        }
        recLength += inputBuffer[0].length;
      }

      function exportWAV(type) {
        let buffers = [];
        for (let channel = 0; channel < numChannels; channel++) {
          buffers.push(mergeBuffers(recBuffers[channel], recLength));
        }
        let interleaved;
        if (numChannels === 2) {
          interleaved = interleave(buffers[0], buffers[1]);
        } else {
          interleaved = buffers[0];
        }

        // converts sample rate to 48000 if higher than 48000
        let downSampledBuffer = downSampleBuffer(interleaved, newSampleRate);

        let dataview = encodeWAV(downSampledBuffer);
        let audioBlob = new Blob([dataview], { type: type });

        this.postMessage({ command: 'exportWAV', data: audioBlob });
      }

      function getBuffer() {
        let buffers = [];
        for (let channel = 0; channel < numChannels; channel++) {
          buffers.push(mergeBuffers(recBuffers[channel], recLength));
        }
        this.postMessage({ command: 'getBuffer', data: buffers });
      }

      function clear() {
        recLength = 0;
        recBuffers = [];
        initBuffers();
      }

      function initBuffers() {
        for (let channel = 0; channel < numChannels; channel++) {
          recBuffers[channel] = [];
        }
      }

      function mergeBuffers(recBuffers, recLength) {
        let result = new Float32Array(recLength);
        let offset = 0;
        for (let i = 0; i < recBuffers.length; i++) {
          result.set(recBuffers[i], offset);
          offset += recBuffers[i].length;
        }
        return result;
      }

      function interleave(inputL, inputR) {
        let length = inputL.length + inputR.length;
        let result = new Float32Array(length);

        let index = 0,
          inputIndex = 0;

        while (index < length) {
          result[index++] = inputL[inputIndex];
          result[index++] = inputR[inputIndex];
          inputIndex++;
        }
        return result;
      }

      function floatTo16BitPCM(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, input[i]));
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
      }

      function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      // Down sample buffer before WAV encoding
      function downSampleBuffer(buffer, rate) {
        if (rate == sampleRate) {
          return buffer;
        }
        if (rate > sampleRate) {
          throw 'downsampling rate show be smaller than original sample rate';
        }
        var sampleRateRatio = sampleRate / rate;
        var newLength = Math.round(buffer.length / sampleRateRatio);
        var result = new Float32Array(newLength);
        var offsetResult = 0;
        var offsetBuffer = 0;
        while (offsetResult < result.length) {
          var nextOffsetBuffer = Math.round(
            (offsetResult + 1) * sampleRateRatio
          );
          // Use average value of skipped samples
          var accum = 0,
            count = 0;
          for (
            var i = offsetBuffer;
            i < nextOffsetBuffer && i < buffer.length;
            i++
          ) {
            accum += buffer[i];
            count++;
          }
          result[offsetResult] = accum / count;
          // Or you can simply get rid of the skipped samples:
          // result[offsetResult] = buffer[nextOffsetBuffer];
          offsetResult++;
          offsetBuffer = nextOffsetBuffer;
        }
        return result;
      }

      function encodeWAV(samples) {
        let buffer = new ArrayBuffer(44 + samples.length * 2);
        let view = new DataView(buffer);

        /* RIFF identifier */
        writeString(view, 0, 'RIFF');
        /* RIFF chunk length */
        view.setUint32(4, 36 + samples.length * 2, true);
        /* RIFF type */
        writeString(view, 8, 'WAVE');
        /* format chunk identifier */
        writeString(view, 12, 'fmt ');
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw) */
        view.setUint16(20, 1, true);
        /* channel count */
        view.setUint16(22, numChannels, true);
        /* sample rate */
        view.setUint32(24, newSampleRate, true);
        /* byte rate (sample rate * block align) */
        view.setUint32(28, newSampleRate * 4, true);
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, numChannels * 2, true);
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        writeString(view, 36, 'data');
        /* data chunk length */
        view.setUint32(40, samples.length * 2, true);

        floatTo16BitPCM(view, 44, samples);

        return view;
      }
    }, self);

    this.worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        numChannels: this.config.numChannels
      }
    });

    this.worker.onmessage = (e) => {
      let cb = this.callbacks[e.data.command].pop();
      if (typeof cb == 'function') {
        cb(e.data.data);
      }
    };
  }

  record() {
    this.recording = true;
  }

  stop() {
    this.recording = false;
  }

  clear() {
    this.worker.postMessage({ command: 'clear' });
  }

  getBuffer(cb) {
    cb = cb || this.config.callback;
    if (!cb) throw new Error('Callback not set');

    this.callbacks.getBuffer.push(cb);

    this.worker.postMessage({ command: 'getBuffer' });
  }

  exportWAV(cb, mimeType) {
    mimeType = mimeType || this.config.mimeType;
    cb = cb || this.config.callback;
    if (!cb) throw new Error('Callback not set');

    this.callbacks.exportWAV.push(cb);

    this.worker.postMessage({
      command: 'exportWAV',
      type: mimeType
    });
  }

  static forceDownload(blob, filename) {
    let url = (window.URL || window.webkitURL).createObjectURL(blob);
    let link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    let click = document.createEvent('Event');
    click.initEvent('click', true, true);
    link.dispatchEvent(click);
  }
}

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
async function startRecording({
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
function stopRecording({ exportWAV, wavCallback }) {
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

var isEdgeChromium = navigator.userAgent.indexOf('Edg/') !== -1;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition;
// Chromium edge currently has a broken implementation
// of the web speech API and does not return any results
if (!isEdgeChromium && SpeechRecognition) {
    recognition = new SpeechRecognition();
}
function useSpeechToText(_a) {
    var _this = this;
    var continuous = _a.continuous, crossBrowser = _a.crossBrowser, googleApiKey = _a.googleApiKey, onStartSpeaking = _a.onStartSpeaking, onStoppedSpeaking = _a.onStoppedSpeaking, timeout = _a.timeout;
    var _b = useState(false), isRecording = _b[0], setIsRecording = _b[1];
    var audioContextRef = useRef();
    var _c = useState([]), results = _c[0], setResults = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var timeoutId = useRef();
    var mediaStream = useRef();
    useEffect(function () {
        var _a;
        if (!crossBrowser && !recognition) {
            setError('Speech Recognition API is only available on Chrome');
        }
        if (!((_a = navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia)) {
            setError('getUserMedia is not supported on this device/browser :(');
        }
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }
    }, []);
    // Chrome Speech Recognition API:
    // Only supported on Chrome browsers
    var chromeSpeechRecognition = function () {
        if (recognition) {
            // Continuous recording after stopped speaking event
            if (continuous)
                recognition.continuous = true;
            // start recognition
            recognition.start();
            // speech successfully translated into text
            recognition.onresult = function (e) {
                if (e.results) {
                    setResults(function (prevResults) { return __spreadArrays(prevResults, [
                        e.results[e.results.length - 1][0].transcript
                    ]); });
                }
            };
            recognition.onaudiostart = function () { return setIsRecording(true); };
            // Audio stopped recording or timed out.
            // Chrome speech auto times-out if no speech after a while
            recognition.onaudioend = function () {
                setIsRecording(false);
            };
        }
    };
    var startSpeechToText = function () { return __awaiter(_this, void 0, void 0, function () {
        var stream, speechEvents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (recognition) {
                        chromeSpeechRecognition();
                        return [2 /*return*/];
                    }
                    if (!crossBrowser) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, startRecording({
                            errHandler: function () { return setError('Microphone permission was denied'); },
                            audioContext: audioContextRef.current
                        })];
                case 1:
                    stream = _a.sent();
                    // Stop recording if timeout
                    if (timeout) {
                        handleRecordingTimeout();
                    }
                    // stop previous mediaStream track if exists
                    if (mediaStream.current) {
                        mediaStream.current.getAudioTracks()[0].stop();
                    }
                    // Clones stream to fix hark bug on Safari
                    mediaStream.current = stream.clone();
                    speechEvents = hark(mediaStream.current, {
                        audioContext: audioContextRef.current
                    });
                    speechEvents.on('speaking', function () {
                        if (onStartSpeaking)
                            onStartSpeaking();
                        // Clear previous recording timeout on every speech event
                        clearTimeout(timeoutId.current);
                    });
                    speechEvents.on('stopped_speaking', function () {
                        var _a;
                        if (onStoppedSpeaking)
                            onStoppedSpeaking();
                        setIsRecording(false);
                        (_a = mediaStream.current) === null || _a === void 0 ? void 0 : _a.getAudioTracks()[0].stop();
                        // Stops current recording and sends audio string to google cloud.
                        // recording will start again after google cloud api
                        // call if `continuous` prop is true. Until the api result
                        // returns, technically the microphone is not being captured again
                        stopRecording({
                            exportWAV: true,
                            wavCallback: function (blob) {
                                return handleBlobToBase64({ blob: blob, continuous: continuous || false });
                            }
                        });
                    });
                    setIsRecording(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var stopSpeechToText = function () {
        var _a;
        if (recognition) {
            recognition.stop();
        }
        else {
            setIsRecording(false);
            (_a = mediaStream.current) === null || _a === void 0 ? void 0 : _a.getAudioTracks()[0].stop();
            stopRecording({
                exportWAV: true,
                wavCallback: function (blob) { return handleBlobToBase64({ blob: blob, continuous: false }); }
            });
        }
    };
    var handleRecordingTimeout = function () {
        timeoutId.current = window.setTimeout(function () {
            var _a;
            setIsRecording(false);
            (_a = mediaStream.current) === null || _a === void 0 ? void 0 : _a.getAudioTracks()[0].stop();
            stopRecording({ exportWAV: false });
        }, timeout);
    };
    var handleBlobToBase64 = function (_a) {
        var blob = _a.blob, continuous = _a.continuous;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () { return __awaiter(_this, void 0, void 0, function () {
            var base64data, sampleRate, audio, config, data, googleCloudRes, googleCloudJson;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        base64data = reader.result;
                        sampleRate = (_a = audioContextRef.current) === null || _a === void 0 ? void 0 : _a.sampleRate;
                        // Google only accepts max 48000 sample rate: if
                        // greater recorder js will down-sample to 48000
                        if (sampleRate && sampleRate > 48000) {
                            sampleRate = 48000;
                        }
                        audio = { content: '' };
                        config = {
                            encoding: 'LINEAR16',
                            languageCode: 'en-US',
                            sampleRateHertz: sampleRate
                        };
                        data = {
                            config: config,
                            audio: audio
                        };
                        // Gets raw base 64 string data
                        audio.content = base64data.substr(base64data.indexOf(',') + 1);
                        return [4 /*yield*/, fetch("https://speech.googleapis.com/v1/speech:recognize?key=" + googleApiKey, {
                                method: 'POST',
                                body: JSON.stringify(data)
                            })];
                    case 1:
                        googleCloudRes = _c.sent();
                        return [4 /*yield*/, googleCloudRes.json()];
                    case 2:
                        googleCloudJson = _c.sent();
                        // Update results state with transcribed text
                        if (((_b = googleCloudJson.results) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                            setResults(function (prevResults) { return __spreadArrays(prevResults, [
                                googleCloudJson.results[0].alternatives[0].transcript
                            ]); });
                        }
                        if (continuous) {
                            startSpeechToText();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
    };
    return { results: results, startSpeechToText: startSpeechToText, stopSpeechToText: stopSpeechToText, isRecording: isRecording, error: error };
}

export default useSpeechToText;
//# sourceMappingURL=index.js.map
