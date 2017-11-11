import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { PlayerStore } from './PlayerStore';
import { TableStore } from '../Table/TableStore';
import { Player } from '../types';
import PlayerRow from './PlayerRow';
import PlayerAdd from './PlayerAdd';
import SectionTitle from './SectionTitle';
import './Players.css';

interface Props {
    playerStore?: PlayerStore;
    tableStore?: TableStore;
}

interface State {
    firstName: string;
    lastName: string;
    selectForGame: boolean;
}

@inject('playerStore')
@inject('tableStore')
@observer
class Players extends React.Component<Props, State> {

    state = {
        firstName: '',
        lastName: '',
        selectForGame: false,
    };

    public render() {
        const { playerStore } = this.props;

        if (!playerStore) { return null; }

        const { players, isLoading } = playerStore;

        return (
            <div className="player-select">
                <SectionTitle title="Select Players" />
                <div>
                    {!isLoading && Array.from(players.entries()).map(([id, player]) =>
                        <PlayerRow
                            key={id}
                            player={player}
                            id={id}
                            action={this.selectAction}
                        />
                    )}
                    {isLoading && <div>Loading..</div>}
                </div>
                <h3>Add player</h3>
                <PlayerAdd />
            </div>
        );
    }

    private selectAction = (player: Player) => {
        const { tableStore } = this.props;

        if (tableStore && tableStore.participants.size < 4) {
            tableStore.addPlayerRandomly(player);

            return true;
        }

        return false;
    }
}

export default Players;
