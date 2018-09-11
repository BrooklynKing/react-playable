declare module '*.scss';
declare module '*.tsx';

declare module 'playable' {
  type MediaSource = string | IMediaSource | Array<string | IMediaSource>;

  interface IMediaSource {
    url: string;
    type: string;
  }

  interface IPlayer {
    setWidth(width: number): void;
    setHeight(height: number): void;
    setFillAllSpace(fillAllSpace: boolean): void;
    setTitle(title: string): void;
    setPoster(url: string): void;

    attachToElement(element: HTMLElement): void;

    setSrc(src: MediaSource): void;

    destroy(): void;
  }

  function create(config: any): IPlayer;
  function registerModule(moduleName: string, module: any): void;
  function registerPlaybackAdapter(adapter: any): void;
}
