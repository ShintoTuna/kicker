import * as React from 'react';
import { PlayedGame, PlayedParticipant } from '../types';
import './Game.css';

interface Props {
    game: [string, PlayedGame];
}

class Game extends React.Component<Props> {
    public render() {
        const { game: [, gameObj] } = this.props;

        return (
            <div className="played-game">
                <div className="score">
                    {gameObj.score.away} | {gameObj.score.home}
                </div>
                <div className="participants">
                    {gameObj.game.map((participant, i) => this.renderParticipant(participant))}
                </div>
            </div>
        );
    }

    private renderParticipant(participant: PlayedParticipant) {
        const pos = participant.position.split('_');
        const posIcon = pos[1] === 'DEF' ? 'fa-shield' : 'fa-bullseye';
        return (
            <div key={participant.player._id} className={`${pos.join(' ').toLowerCase()} participant`}>
                <i className={`fa ${posIcon}`} aria-hidden="true" />
                <span className="name">{participant.player.firstName} {participant.player.lastName.charAt(0)}.</span>
                <span>({participant.ownGoals})</span>
                <span>{participant.goals}</span>
            </div>
        );
    }
}

export default Game;
