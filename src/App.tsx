import * as React from 'react';
import Table from './Table/Table';
import NewGame from './Table/NewGame';
import Players from './Player/Players';
import DevTools from 'mobx-react-devtools';
import { observer, inject } from 'mobx-react';
import { AppStore, Views } from './AppStore';

@inject('appStore')
@observer
class App extends React.Component<{ appStore?: AppStore }> {
  render() {
    const { appStore } = this.props;

    if (!appStore) { return null; }

    return (
      <div className="App">
        {this.renderView(appStore)}
        <DevTools />
      </div>
    );
  }

  private renderView = ({ view }: AppStore) => {
    switch (view) {
      case Views.home: return <NewGame />;
      case Views.game: return <Table />;
      case Views.pickParticipants: return <Players />;
      default: return null;
    }
  }
}

export default App;
