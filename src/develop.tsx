//@ts-ignore
import { UI_EVENTS } from 'playable';
import React from 'react';
import ReactDOM from 'react-dom';

import ReactPlayable from './components/ReactPlayable/ReactPlayable.tsx';

function Child() {
  return (
    <span
      style={{
        zIndex: 300,
        position: 'absolute',
        top: '70px',
        left: '5px',
        color: 'rgb(255, 255, 255)',
        backgroundColor: 'black',
        fontSize: '16px',
        lineHeight: '16px',
        padding: '5px 7px',
      }}
    >
      FUNCTION COMPONENT TEST
    </span>
  );
}

class Child2 extends React.Component {
  static dependencies = ['eventEmitter'];

  state = {
    isVisible: true,
  };

  constructor(props: any) {
    super(props);
    const { eventEmitter } = props;

    eventEmitter.on(UI_EVENTS.MAIN_BLOCK_HIDE, () => {
      this.setState({
        isVisible: false,
      });
    });
    eventEmitter.on(UI_EVENTS.MAIN_BLOCK_SHOW, () => {
      this.setState({
        isVisible: true,
      });
    });
  }

  render() {
    return this.state.isVisible ? (
      <span
        style={{
          zIndex: 300,
          position: 'absolute',
          top: '100px',
          right: '5px',
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'red',
          fontSize: '20px',
          lineHeight: '20px',
          padding: '5px 7px',
        }}
      >
        SHOW/HIDE WITH MAIN UI BLOCK
      </span>
    ) : null;
  }
}

class App extends React.Component {
  update = () => this.forceUpdate();

  render() {
    return (
      <>
        <ReactPlayable
          width={760}
          height={428}
          title="MY VIDEO!"
          src="http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_10mb.mp4"
        >
          <Child />
          <Child2 />
        </ReactPlayable>
        <button onClick={this.update}>Rerender wrapper</button>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('player-wrapper'));
