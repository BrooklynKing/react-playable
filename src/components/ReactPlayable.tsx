import React from 'react';
import ReactDOM from 'react-dom';

import {
  bool,
  array,
  number,
  string,
  func,
  oneOfType,
  object,
} from 'prop-types';

import {
  create,
  registerModule,
  registerPlaybackAdapter,
  //@ts-ignore
} from 'playable/dist/src/index';

interface IProps {
  width?: number;
  height?: number;
  fillAllSpace?: boolean;

  src?: any;

  title?: string;
  poster?: string;

  modules?: any;
  playbackAdapters?: any[];

  onInit?: (player: any) => {};
}

interface IState {
  isMounted: boolean;
}

interface IExtendedStatelessComponent extends React.StatelessComponent {
  dependencies?: string[];
}

interface IExtendedComponent extends React.ComponentClass {
  dependencies?: string[];
}

export default class ReactPlayable extends React.PureComponent<IProps, IState> {
  static propTypes: React.ValidationMap<IProps> = {
    width: number, // Width of player
    height: number, // Height of player
    fillAllSpace: bool, // Alow player to fill all available space

    src: oneOfType([string, array]), // Same as in playable

    title: string,
    poster: string,

    modules: object,
    playbackAdapters: array,

    onInit: func,
  };

  private _player: any;
  private _$wrapper: HTMLElement;

  constructor(props: IProps) {
    super(props);

    this.state = {
      isMounted: false,
    };
  }

  componentDidMount() {
    const {
      modules,
      playbackAdapters,

      width,
      height,
      fillAllSpace,
      src,
      title,
      poster,

      onInit,
    } = this.props;

    this.registerModules(modules);
    this.registerPlaybackAdapters(playbackAdapters);

    this._player = create({
      width,
      height,
      fillAllSpace,
      src,
      title,
      poster,
    });

    this._player.attachToElement(this._$wrapper);

    onInit && onInit(this._player);

    this.setState({
      isMounted: true,
    });
  }

  componentDidUpdate(prevProps: IProps) {
    const { width, height, fillAllSpace, src, title, poster } = this.props;

    if (width !== prevProps.width) {
      this._player.setWidth(width);
    }

    if (height !== prevProps.height) {
      this._player.setHeight(height);
    }

    if (fillAllSpace !== prevProps.fillAllSpace) {
      this._player.setFillAllSpace(fillAllSpace);
    }

    if (src !== prevProps.src) {
      this._player.setSrc(src);
    }

    if (title !== prevProps.title) {
      this._player.setTitle(src);
    }

    if (poster !== prevProps.poster) {
      this._player.setPoster(src);
    }
  }

  componentWillUnmount() {
    this._player.destroy();
    this._player = null;
  }

  registerModules(modules: any = {}) {
    Object.keys(modules).forEach(moduleName =>
      registerModule(moduleName, modules[moduleName]),
    );
  }

  registerPlaybackAdapters(adapters: any[] = []) {
    adapters.forEach(adapter => registerPlaybackAdapter(adapter));
  }

  setWrapperRef = (element: HTMLElement) => {
    this._$wrapper = element;
  };

  getExtendedChildren() {
    const { children } = this.props;

    return React.Children.map(children, child => {
      if (
        !child ||
        typeof child === 'string' ||
        typeof child === 'number' ||
        typeof child.type === 'string'
      ) {
        return child;
      }

      const constructor: IExtendedComponent | IExtendedStatelessComponent =
        child.type;

      if (constructor.dependencies) {
        const modules = constructor.dependencies.reduce(
          (resolvedModules: any, moduleName: string) => {
            resolvedModules[moduleName] = this._player._scope.resolve(
              moduleName,
            );

            return resolvedModules;
          },
          {},
        );
        return React.cloneElement(child, modules);
      }

      return child;
    });
  }

  renderChildren() {
    return ReactDOM.createPortal(
      this.getExtendedChildren(),
      this._player._defaultModules.rootContainer.getElement(),
    );
  }

  render() {
    const styles = this.props.fillAllSpace
      ? { width: '100%', height: '100%' }
      : {};

    return (
      <section
        data-hook="react-playable"
        ref={this.setWrapperRef}
        style={styles}
      >
        {this.state.isMounted ? this.renderChildren() : null}
      </section>
    );
  }
}
