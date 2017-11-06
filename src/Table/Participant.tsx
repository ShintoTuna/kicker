import * as React from 'react';
import { Participant as ParticipantInterface, TablePosition } from '../types';
import { observer } from 'mobx-react';

interface Props {
    participant: [TablePosition, ParticipantInterface];
    scoreGoal: (pos: TablePosition) => void; // TODO: change to TableStore method type
    scoreOwnGoal: (pos: TablePosition) => void; // TODO: change to TableStore method type
    swap: (pos: TablePosition) => void;
}

@observer
class Participant extends React.Component<Props> {
    public render() {
        const [pos, { player, participant: { score: { goals, ownGoals } } }] = this.props.participant;

        return (
            <li>
                {this.positionName(pos)}
                {goals} ({ownGoals})
                {player && ` ${player.firstName} ${player.lastName} `}
                <button onClick={() => this.props.scoreGoal(pos)}>Goal</button>
                <button onClick={() => this.props.scoreOwnGoal(pos)}>Own Goal</button>
                <button onClick={() => this.props.swap(pos)}>swap</button>
            </li>
        );
    }

    private positionName = (pos: TablePosition) => {
        switch (pos) {
            case TablePosition.AWAY_DEF:
                return 'Away DEF';
            case TablePosition.AWAY_OFF:
                return 'Away OFF';
            case TablePosition.HOME_DEF:
                return 'Home DEF';
            case TablePosition.HOME_OFF:
                return 'Home OFF';
            default:
                return '';
        }
    }
}

export default Participant;
