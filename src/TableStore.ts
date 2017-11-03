import { observable, action, computed } from 'mobx';
import { Participant, Player, TablePosition } from './types';

export class TableStore {
    @observable participants = new Map<TablePosition, Participant>();
    @observable gameStarted = false;

    @action addPlayer(position: TablePosition, player: Player) {
        this.participants.set(position, {
            player,
            goals: 0,
            ownGoals: 0,
        });
    }

    @computed get score() {
        const awayDef = this.participants.get(TablePosition.AWAY_DEF);
        const awayOff = this.participants.get(TablePosition.AWAY_OFF);
        const homeDef = this.participants.get(TablePosition.HOME_DEF);
        const homeOff = this.participants.get(TablePosition.HOME_OFF);

        const away
            = (awayDef ? awayDef.goals : 0)
            + (awayOff ? awayOff.goals : 0)
            + (homeOff ? homeOff.ownGoals : 0)
            + (homeDef ? homeDef.ownGoals : 0)
            ;

        const home
            = (homeOff ? homeOff.goals : 0)
            + (homeDef ? homeDef.goals : 0)
            + (awayDef ? awayDef.ownGoals : 0)
            + (awayOff ? awayOff.ownGoals : 0)
            ;

        return { home, away };
    }

    @action scoreGoal(position: TablePosition) {
        const participant = this.participants.get(position);

        if (participant) {
            participant.goals++;
        }
    }

    @action scoreOwnGoal(position: TablePosition) {
        const participant = this.participants.get(position);

        if (participant) {
            participant.ownGoals++;
        }
    }
}

const tableStore = new TableStore();

// const player1: Player = { firstName: 'Donnie', lastName: 'Abner', _id: '5' };
// const player1: Player = { firstName: 'Jerold', lastName: 'Beatrix', _id: '1' };
// const player2: Player = { firstName: 'Toni', lastName: 'Patton', _id: '2' };
// const player3: Player = { firstName: 'Kelli', lastName: 'Read', _id: '3' };
// const player4: Player = { firstName: 'Claire', lastName: 'Jerrod', _id: '4' };

// tableStore.addPlayer(TablePosition.AWAY_DEF, player1);
// tableStore.addPlayer(TablePosition.AWAY_OFF, player2);
// tableStore.addPlayer(TablePosition.HOME_DEF, player3);
// tableStore.addPlayer(TablePosition.HOME_OFF, player4);

export default tableStore;
