import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Wrapper from './components/ReactPlayabe';

class Child extends React.Component {
  static dependencies = ['screen'];

  render() {
    return (
      <span
        style={{
          zIndex: 300,
          position: 'absolute',
          top: '10px',
          left: '5px',
          color: 'rgb(255, 255, 255)',
        }}
      >
        TEST
      </span>
    );
  }
}

function App() {
  return (
    <Wrapper
      width={760}
      height={428}
      src="http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_10mb.mp4"
    >
      <Child />
    </Wrapper>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
