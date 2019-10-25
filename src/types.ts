import ParticipantStore from './Table/ParticipantStore';

export enum TablePosition {
    AWAY_DEF = 'AWAY_DEF',
    AWAY_OFF = 'AWAY_OFF',
    HOME_DEF = 'HOME_DEF',
    HOME_OFF = 'HOME_OFF',
}

export type RankingPos = 'off' | 'def' | 'all';

export type RankingType = 'rating' | 'avgGoals' | 'avgOwnGoals' | 'gamesPlayed' | 'winPercent';

export interface Rating {
    mu: number;
    sig: number;
}

export interface Goals {
    games: number;
    goals: number;
    ownGoals: number;
    wins: number;
}

export interface Player {
    _id: string;
    firstName: string;
    lastName: string;
    avgs: { all: Goals, off: Goals, def: Goals };
    ratings: { all: Rating, def: Rating, off: Rating };
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

export interface PreparedGame {
    position: TablePosition;
    playerId: string;
    goals: number;
    ownGoals: number;
}

export interface PlayedParticipant {
    goals: number;
    ownGoals: number;
    position: TablePosition;
    avgs: { all: Goals, off: Goals, def: Goals };
    ratings: { all: Rating, def: Rating, off: Rating };
    adjustedRatings: { all: Rating, def: Rating, off: Rating };
    firstName: string;
    lastName: string;
    playerId: string;
}

export interface PlayedGame {
    game: PlayedParticipant[];
    length: number;
    reverse: boolean;
    score: {
        home: number;
        away: number;
    };
    timestamp: {
        seconds: string;
        nanoseconds: string;
    };
}