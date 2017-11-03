import * as React from 'react';
import Table from './Table';
import Players from './Player/Players';
import DevTools from 'mobx-react-devtools';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Table />
        <Players />
        <DevTools />
      </div>
    );
  }
}

export default App;
