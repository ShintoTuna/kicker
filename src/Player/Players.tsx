import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { PlayerStore } from './PlayerStore';
import PlayerRow from './PlayerRow';
import PlayerAdd from './PlayerAdd';

interface Props {
    playerStore?: PlayerStore;
}

interface State {
    firstName: string;
    lastName: string;
}

@inject('playerStore')
@observer
class Players extends React.Component<Props, State> {

    state = {
        firstName: '',
        lastName: '',
    };

    public render() {
        const { playerStore } = this.props;

        if (!playerStore) { return null; }

        const { players, isLoading } = playerStore;

        return (
            <div>
                <h2>Players</h2>
                <div>
                    {!isLoading && [...players].map((player, i) =>
                        <PlayerRow player={player} key={i} />
                    )}
                    {isLoading && <div>Loading..</div>}
                </div>
                {<PlayerAdd />}
            </div>
        );
    }
}

export default Players;
