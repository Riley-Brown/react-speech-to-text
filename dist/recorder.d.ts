export class Recorder {
    static forceDownload(blob: any, filename: any): void;
    constructor(source: any, cfg: any);
    config: any;
    recording: boolean;
    callbacks: {
        getBuffer: never[];
        exportWAV: never[];
    };
    context: any;
    node: any;
    worker: any;
    record(): void;
    stop(): void;
    clear(): void;
    getBuffer(cb: any): void;
    exportWAV(cb: any, mimeType: any): void;
}
export default Recorder;
