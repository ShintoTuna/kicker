import { observable, computed } from 'mobx';
import { TablePosition, GameEvent, GameActions } from '../types';

export default class ParticipantStore {
    @observable position: TablePosition;
    @observable events: GameEvent[];

    constructor(pos: TablePosition, events: GameEvent[]) {
        this.position = pos;
        this.events = events;
    }

    @computed get score() {
        return this.events.reduce(
            (mem, e: GameEvent) => {
                if (e.position == this.position) {
                    const { goals, ownGoals } = mem;

                    if (e.action === GameActions.SCORE_GOAL) {
                        return { goals: goals + 1, ownGoals };
                    }

                    if (e.action === GameActions.SCORE_OWN_GOAL) {
                        return { goals, ownGoals: ownGoals + 1 };
                    }
                }
                return mem;
            },
            { goals: 0, ownGoals: 0 }
        );
    }
}
