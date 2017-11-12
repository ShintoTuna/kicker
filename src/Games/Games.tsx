import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { GamesStore } from './GamesStore';
import Game from './Game';

interface Props {
    gamesStore?: GamesStore;
}

@inject('gamesStore')
@observer
class Games extends React.Component<Props> {
    public render() {
        const { gamesStore } = this.props;

        if (!gamesStore) { return null; }

        const { games, isLoading } = gamesStore;

        return (
            <div className="games">

                {isLoading ? <span>Loading games ..</span> :
                    Array.from(games.entries()).map((game, i) => <Game key={i} game={game} />)}
            </div>
        );
    }
}

export default Games;
