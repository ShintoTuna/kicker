import { observable, action } from 'mobx';
import * as firebase from 'firebase/app';
import { Player } from '../types';
import fb from '../firebase';

export class PlayerStore {
    @observable players = new Map<string, Player>();
    @observable isLoading = true;

    db: firebase.database.Reference = fb.database().ref('players/');

    constructor() {
        this.db.on('value', (players) => {
            if (players) {
                this.updatePlayers(players.val());
                this.stopLoading();
            }
        });
    }

    @action async savePlayer(player: { firstName: string; lastName: string; }) {
        await this.db.push({
            ...player,
            ratings: {
                all: [25.0, 25.0 / 3.0],
                def: [25.0, 25.0 / 3.0],
                off: [25.0, 25.0 / 3.0],
            }
        });
    }

    @action stopLoading = () => this.isLoading = false;

    @action updatePlayers(players: {}) {
        this.players = Object.keys(players).reduce(
            (m, k) => m.set(k, { ...players[k], _id: k }), new Map<string, Player>()
        );
    }

    @action findPlayer(id: string) {
        this.players.get(id);
    }
}

const playerStore = new PlayerStore();

export default playerStore;
