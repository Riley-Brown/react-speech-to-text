import { GoogleCloudRecognitionConfig } from './GoogleCloudRecognitionConfig';
export interface SpeechRecognitionProperties {
    grammars?: SpeechGrammarList;
    interimResults?: boolean;
    lang?: string;
    maxAlternatives?: number;
}
export interface UseSpeechToTextTypes {
    continuous?: boolean;
    crossBrowser?: boolean;
    googleApiKey?: string;
    googleCloudRecognitionConfig?: GoogleCloudRecognitionConfig;
    onStartSpeaking?: () => any;
    onStoppedSpeaking?: () => any;
    speechRecognitionProperties?: SpeechRecognitionProperties;
    timeout?: number;
    useOnlyGoogleCloud?: boolean;
}
export default function useSpeechToText({ continuous, crossBrowser, googleApiKey, googleCloudRecognitionConfig, onStartSpeaking, onStoppedSpeaking, speechRecognitionProperties, timeout, useOnlyGoogleCloud }: UseSpeechToTextTypes): {
    results: string[];
    startSpeechToText: () => Promise<void>;
    stopSpeechToText: () => void;
    isRecording: boolean;
    error: string;
};
