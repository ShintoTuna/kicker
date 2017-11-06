import { observable, computed, action } from 'mobx';
import tableStore from './Table/TableStore';
// import { Participant, Player, TablePosition } from './types';

export enum Views { home, pickParticipants, game }

export class AppStore {
    @observable gameStarted: boolean = false;

    @computed get view(): Views {
        if (!this.gameStarted) {
            return Views.home;
        } else if (this.gameStarted && this.pickParticipants) {
            return Views.pickParticipants;
        } else if (this.gameStarted && !this.pickParticipants) {
            return Views.game;
        } else {
            return Views.game;
        }
    }

    @computed get pickParticipants() {
        return tableStore.participants.size < 4;
    }

    @action newGame = () => {
        this.gameStarted = true;
    }
}

const appStore = new AppStore();

export default appStore;
