import ParticipantStore from './Table/ParticipantStore';

export enum TablePosition {
    AWAY_DEF = 'AWAY_DEF',
    AWAY_OFF = 'AWAY_OFF',
    HOME_DEF = 'HOME_DEF',
    HOME_OFF = 'HOME_OFF',
}

export interface Player {
    _id: string;
    firstName: string;
    lastName: string;
    ratings: {
        all: number[];
        off: number[];
        def: number[];
    };
}

export interface Participant {
    player?: Player;
    participant: ParticipantStore;
}

export enum GameActions {
    SCORE_GOAL = 'SCORE_GOAL',
    SCORE_OWN_GOAL = 'SCORE_OWN_GOAL',
}

export interface GameEvent {
    action: GameActions;
    position: TablePosition;
}

export interface Game {
    position: TablePosition;
    player: Player;
    goals: number;
    ownGoals: number;
}
