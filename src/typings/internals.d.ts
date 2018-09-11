declare module '*.scss';
declare module '*.tsx';

declare module 'playable' {
  interface IPlayer {}

  function create(config: any): IPlayer;
  function registerModule(moduleName: string, module: any): void;
  function registerPlaybackAdapter(adapter: any): void;
}
