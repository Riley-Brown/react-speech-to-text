declare enum AudioEncoding {
    ENCODING_UNSPECIFIED = 0,
    LINEAR16 = 1,
    FLAC = 2,
    MULAW = 3,
    AMR = 4,
    AMR_WB = 5,
    OGG_OPUS = 6,
    SPEEX_WITH_HEADER_BYTE = 7
}
/** Properties of a SpeechContext. */
interface ISpeechContext {
    /** SpeechContext phrases */
    phrases?: string[] | null;
}
/** Properties of a SpeakerDiarizationConfig. */
interface ISpeakerDiarizationConfig {
    /** SpeakerDiarizationConfig enableSpeakerDiarization */
    enableSpeakerDiarization?: boolean | null;
    /** SpeakerDiarizationConfig minSpeakerCount */
    minSpeakerCount?: number | null;
    /** SpeakerDiarizationConfig maxSpeakerCount */
    maxSpeakerCount?: number | null;
    /** SpeakerDiarizationConfig speakerTag */
    speakerTag?: number | null;
}
/** Properties of a RecognitionMetadata. */
interface IRecognitionMetadata {
    /** RecognitionMetadata interactionType */
    interactionType?: InteractionType | keyof typeof InteractionType | null;
    /** RecognitionMetadata industryNaicsCodeOfAudio */
    industryNaicsCodeOfAudio?: number | null;
    /** RecognitionMetadata microphoneDistance */
    microphoneDistance?: MicrophoneDistance | keyof typeof MicrophoneDistance | null;
    /** RecognitionMetadata originalMediaType */
    originalMediaType?: OriginalMediaType | keyof typeof OriginalMediaType | null;
    /** RecognitionMetadata recordingDeviceType */
    recordingDeviceType?: RecordingDeviceType | keyof typeof RecordingDeviceType | null;
    /** RecognitionMetadata recordingDeviceName */
    recordingDeviceName?: string | null;
    /** RecognitionMetadata originalMimeType */
    originalMimeType?: string | null;
    /** RecognitionMetadata audioTopic */
    audioTopic?: string | null;
}
/** InteractionType enum. */
declare enum InteractionType {
    INTERACTION_TYPE_UNSPECIFIED = 0,
    DISCUSSION = 1,
    PRESENTATION = 2,
    PHONE_CALL = 3,
    VOICEMAIL = 4,
    PROFESSIONALLY_PRODUCED = 5,
    VOICE_SEARCH = 6,
    VOICE_COMMAND = 7,
    DICTATION = 8
}
/** MicrophoneDistance enum. */
declare enum MicrophoneDistance {
    MICROPHONE_DISTANCE_UNSPECIFIED = 0,
    NEARFIELD = 1,
    MIDFIELD = 2,
    FARFIELD = 3
}
/** OriginalMediaType enum. */
declare enum OriginalMediaType {
    ORIGINAL_MEDIA_TYPE_UNSPECIFIED = 0,
    AUDIO = 1,
    VIDEO = 2
}
/** RecordingDeviceType enum. */
declare enum RecordingDeviceType {
    RECORDING_DEVICE_TYPE_UNSPECIFIED = 0,
    SMARTPHONE = 1,
    PC = 2,
    PHONE_LINE = 3,
    VEHICLE = 4,
    OTHER_OUTDOOR_DEVICE = 5,
    OTHER_INDOOR_DEVICE = 6
}
export interface GoogleCloudRecognitionConfig {
    /** RecognitionConfig encoding */
    encoding?: AudioEncoding | keyof typeof AudioEncoding | null;
    /** RecognitionConfig sampleRateHertz */
    sampleRateHertz?: number | null;
    /** RecognitionConfig audioChannelCount */
    audioChannelCount?: number | null;
    /** RecognitionConfig enableSeparateRecognitionPerChannel */
    enableSeparateRecognitionPerChannel?: boolean | null;
    /** RecognitionConfig languageCode */
    languageCode?: string | null;
    /** RecognitionConfig maxAlternatives */
    maxAlternatives?: number | null;
    /** RecognitionConfig profanityFilter */
    profanityFilter?: boolean | null;
    /** RecognitionConfig speechContexts */
    speechContexts?: ISpeechContext[] | null;
    /** RecognitionConfig enableWordTimeOffsets */
    enableWordTimeOffsets?: boolean | null;
    /** RecognitionConfig enableAutomaticPunctuation */
    enableAutomaticPunctuation?: boolean | null;
    /** RecognitionConfig diarizationConfig */
    diarizationConfig?: ISpeakerDiarizationConfig | null;
    /** RecognitionConfig metadata */
    metadata?: IRecognitionMetadata | null;
    /** RecognitionConfig model */
    model?: string | null;
    /** RecognitionConfig useEnhanced */
    useEnhanced?: boolean | null;
}
export {};
