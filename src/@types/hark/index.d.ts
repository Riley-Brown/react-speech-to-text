// Hark option types on definitely typed are missing audioContext type
// These types are copied from definitely type + added audioContext option type

declare module 'hark' {
  export default hark;
}

declare function hark(
  stream: HTMLAudioElement | HTMLVideoElement | MediaStream,
  option?: hark.Option
): hark.Harker;

declare namespace hark {
  interface Option {
    audioContext?: AudioContext;
    history?: number;
    interval?: number;
    play?: boolean;
    smoothing?: number;
    threshold?: number;
  }

  interface Harker {
    speaking: boolean;
    suspend(): Promise<void>;
    resume(): Promise<void>;
    readonly state: AudioContextState;
    setThreshold(t: number): void;
    setInterval(i: number): void;
    stop(): void;
    speakingHistory: number[];

    on(event: 'speaking' | 'stopped_speaking', listener: () => void): void;
    on(
      event: 'volume_change',
      listener: (currentVolume: number, threshold: number) => void
    ): void;
    on(
      event: 'state_change',
      listener: (state: AudioContextState) => void
    ): void;
  }
}
