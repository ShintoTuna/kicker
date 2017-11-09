import { observable, action } from 'mobx';
import * as firebase from 'firebase/app';
import { Player } from '../types';
import db from '../firebase';

export class PlayerStore {
    @observable players = new Map<string, Player>();
    @observable isLoading = true;

    playersCol = db.collection('players/');

    constructor() {
        this.playersCol.onSnapshot((snapshot) => {
            if (snapshot) {
                this.updatePlayers(snapshot);
                this.stopLoading();
            }
        });
    }

    @action async savePlayer(player: { firstName: string; lastName: string; }) {
        this.playersCol.add({
            ...player,
            avgs: {
                all: { games: 0, goals: 0, ownGoals: 0 },
                off: { games: 0, goals: 0, ownGoals: 0 },
                def: { games: 0, goals: 0, ownGoals: 0 },
            },
            ratings: {
                all: { mu: 25.0, sig: 25.0 / 3.0 },
                def: { mu: 25.0, sig: 25.0 / 3.0 },
                off: { mu: 25.0, sig: 25.0 / 3.0 },
            }
        });
    }

    @action stopLoading = () => this.isLoading = false;

    @action updatePlayers(players: firebase.firestore.QuerySnapshot) {
        players.forEach((player) => {
            this.players.set(player.id, { ...player.data(), _id: player.id } as Player);
        });
    }

    @action findPlayer(id: string) {
        this.players.get(id);
    }
}

const playerStore = new PlayerStore();

export default playerStore;
