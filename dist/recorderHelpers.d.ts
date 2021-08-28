/**
 *
 * @param {{
 * audioContext: AudioContext
 * errHandler?: () => void
 * onStreamLoad?: () => void
 * }}
 * @returns {Promise<MediaStream>}
 */
export function startRecording({ audioContext, errHandler, onStreamLoad, }: {
    audioContext: AudioContext;
    errHandler?: () => void;
    onStreamLoad?: () => void;
}): Promise<MediaStream>;
/**
 *
 * @param {{
 * exportWAV: boolean
 * wavCallback?: (blob: Blob) => void
 * }}
 */
export function stopRecording({ exportWAV, wavCallback }: {
    exportWAV: boolean;
    wavCallback?: ((blob: Blob) => void) | undefined;
}): void;
