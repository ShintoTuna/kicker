import * as React from 'react';
import { Participant as ParticipantInterface, TablePosition } from './types';
import { observer } from 'mobx-react';

interface Props {
    participant: [TablePosition, ParticipantInterface];
    scoreGoal: (pos: TablePosition) => void; // TODO: change to TableStore method type
    scoreOwnGoal: (pos: TablePosition) => void; // TODO: change to TableStore method type
}

@observer
class Participant extends React.Component<Props> {
    public render() {
        const [pos, { goals, ownGoals, player }] = this.props.participant;

        return (
            <li>
                {goals} ({ownGoals})
                {player && ` ${player.firstName} ${player.lastName} `}
                <button onClick={() => this.props.scoreGoal(pos)}>Goal</button>
                <button onClick={() => this.props.scoreOwnGoal(pos)}>Own Goal</button>
            </li>
        );
    }
}

export default Participant;
