import * as React from 'react';
import Table from './Table/Table';
import NewGame from './Table/NewGame';
// import DevTools from 'mobx-react-devtools';
import { observer, inject } from 'mobx-react';
import { AppStore, Views } from './AppStore';
import Rankings from './Player/Rankings';

@inject('appStore')
@observer
class App extends React.Component<{ appStore?: AppStore }> {
  render() {
    const { appStore } = this.props;

    if (!appStore) { return null; }

    return (
      <div className="app">
        {this.renderView(appStore)}
        {/* <DevTools /> */}
      </div>
    );
  }

  private renderView = ({ view }: AppStore) => {
    switch (view) {
      case Views.home: return <NewGame />;
      case Views.game: return <Table />;
      case Views.rankings: return <Rankings />;
      default: return null;
    }
  }
}

export default App;
