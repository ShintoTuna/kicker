import ParticipantStore from './Table/ParticipantStore';

export enum TablePosition {
    AWAY_DEF, AWAY_OFF, HOME_DEF, HOME_OFF,
}

export interface Player {
    _id: string;
    firstName: string;
    lastName: string;
}

export interface Participant {
    player?: Player;
    participant: ParticipantStore;
}

export enum GameActions {
    SCORE_GOAL, SCORE_OWN_GOAL,
}

export interface GameEvent {
    action: GameActions;
    position: TablePosition;
}
