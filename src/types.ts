export enum TablePosition {
    AWAY_DEF, AWAY_OFF, HOME_DEF, HOME_OFF,
}

export interface Player {
    _id: string;
    firstName: string;
    lastName: string;
}

export interface Participant {
    goals: number;
    ownGoals: number;
    player?: Player;
}