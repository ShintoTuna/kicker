import * as React from 'react';
import { PlayedGame, PlayedParticipant } from '../types';
import { observer, inject } from 'mobx-react';
import { GamesStore } from './GamesStore';
import './Game.css';

interface Props {
    game: [string, PlayedGame];
    gamesStore?: GamesStore;
}
@inject('gamesStore')
@observer
class Game extends React.Component<Props> {
    public render() {
        const { game: [, gameObj], gamesStore } = this.props;
        const { score = { away: '-', home: '-' }, game, reverse } = gameObj;

        if (!gamesStore) { return null; }

        return (
            <div className="played-game">
                <div className="score">
                    <button disabled={true}>Delete</button>
                    <div>{score.away} : {score.home}</div>
                    <button onClick={() => gamesStore.loadGame(gameObj)}>Load</button>
                </div>
                <div className={`participants ${reverse ? 'reverse' : ''}`}>
                    {game.map((participant, i) => this.renderParticipant(participant))}
                </div>
            </div>
        );
    }

    private renderParticipant(participant: PlayedParticipant) {
        const pos = participant.position.split('_');
        const posIcon = pos[1] === 'DEF' ? 'fa-shield' : 'fa-bullseye';
        const { firstName = '-', lastName } = participant;
        return (
            <div key={participant.playerId} className={`${pos.join(' ').toLowerCase()} participant`}>
                <i className={`fa ${posIcon}`} aria-hidden="true" />
                <span className="name">{firstName} {lastName && lastName.charAt(0) + '.'}</span>
                {lastName && <span>({participant.ownGoals})</span>}
                {lastName && <span>{participant.goals}</span>}
            </div>
        );
    }
}

export default Game;
