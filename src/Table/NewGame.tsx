import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { AppStore } from '../AppStore';
import Games from '../Games/Games';
import './NewGame.css';

@inject('appStore')
@observer
class NewGame extends React.Component<{ appStore?: AppStore }> {
    public render() {
        const { appStore } = this.props;

        if (!appStore) { return null; }

        return (
            <div>
                <div className="new-game">
                    <button className="start" onClick={appStore.newGame}>New Game</button>
                    <button onClick={appStore.showRankings}>Rankings</button>
                </div>
                <Games />
            </div>
        );
    }
}

export default NewGame;
