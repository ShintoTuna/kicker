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
                <button onClick={() => this.handleScoreGame(appStore)}>New Game</button>
                <button onClick={() => this.showRankings(appStore)}>Rankings</button>
            </div>
        );
    }

    private handleScoreGame = (appStore: AppStore) => appStore.newGame();

    private showRankings = (appStore: AppStore) => appStore.rankings();
}

export default NewGame;
