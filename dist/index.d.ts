export interface UseSpeechToTextTypes {
    continuous?: boolean;
    crossBrowser?: boolean;
    googleApiKey?: string;
    onStartSpeaking?: () => any;
    onStoppedSpeaking?: () => any;
    timeout?: number;
}
export default function useSpeechToText({ continuous, crossBrowser, googleApiKey, onStartSpeaking, onStoppedSpeaking, timeout }: UseSpeechToTextTypes): {
    results: string[];
    startSpeechToText: () => Promise<void>;
    stopSpeechToText: () => void;
    isRecording: boolean;
    error: string;
};
