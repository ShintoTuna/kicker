import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { AppStore } from '../AppStore';

@inject('appStore')
@observer
class NewGame extends React.Component<{ appStore?: AppStore }> {
    public render() {
        const { appStore } = this.props;

        if (!appStore) { return null; }

        return (
            <div>
                <button onClick={this.handleScoreGame}>New Game</button>
                <button>Rankings</button>
            </div>
        );
    }

    private handleScoreGame = () => {
        const { appStore } = this.props;

        if (appStore) {
            appStore.newGame();
        }
    }
}

export default NewGame;
