import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { AppStore } from '../AppStore';
import './NewGame.css';

@inject('appStore')
@observer
class NewGame extends React.Component<{ appStore?: AppStore }> {
    public render() {
        const { appStore } = this.props;

        if (!appStore) { return null; }

        return (
            <div className="new-game">
                <button className="start" onClick={appStore.newGame}>New Game</button>
                <button onClick={appStore.showRankings}>Rankings</button>
            </div>
        );
    }
}

export default NewGame;
