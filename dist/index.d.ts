/// <reference types="react" />
import { GoogleCloudRecognitionConfig } from './GoogleCloudRecognitionConfig';
export interface SpeechRecognitionProperties {
    grammars?: SpeechGrammarList;
    interimResults?: boolean;
    lang?: string;
    maxAlternatives?: number;
}
export declare type ResultType = {
    speechBlob?: Blob;
    timestamp: number;
    transcript: string;
};
export interface UseSpeechToTextTypes {
    continuous?: boolean;
    crossBrowser?: boolean;
    googleApiKey?: string;
    googleCloudRecognitionConfig?: GoogleCloudRecognitionConfig;
    onStartSpeaking?: () => any;
    onStoppedSpeaking?: () => any;
    speechRecognitionProperties?: SpeechRecognitionProperties;
    timeout?: number;
    useLegacyResults?: boolean;
    useOnlyGoogleCloud?: boolean;
}
export default function useSpeechToText({ continuous, crossBrowser, googleApiKey, googleCloudRecognitionConfig, onStartSpeaking, onStoppedSpeaking, speechRecognitionProperties, timeout, useOnlyGoogleCloud, useLegacyResults }: UseSpeechToTextTypes): {
    error: string;
    interimResult: string | undefined;
    isRecording: boolean;
    results: string[] | ResultType[];
    setResults: import("react").Dispatch<import("react").SetStateAction<ResultType[]>>;
    startSpeechToText: () => Promise<void>;
    stopSpeechToText: () => void;
};
