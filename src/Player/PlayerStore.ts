import { observable, action } from 'mobx';
import * as firebase from 'firebase/app';
import { Player, RankingPos, RankingType } from '../types';
import { formatRating, formatGoals } from '../utils';
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
                all: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
                off: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
                def: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
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

    @action getSortedPlayers = (pos: RankingPos, type: RankingType) => {
        type P = [string, Player];

        const sorts = {
            rating: (a: P, b: P) => formatRating(b[1].ratings[pos]) - formatRating(a[1].ratings[pos]),
            goals: (a: P, b: P) => formatGoals(b[1].avgs[pos]) - formatGoals(a[1].avgs[pos]),
            ownGoals: (a: P, b: P) => formatGoals(b[1].avgs[pos], true) - formatGoals(a[1].avgs[pos], true),
        };

        const playersArray: P[] = Array.from(this.players.entries())
            .sort(sorts[type]);

        return new Map<string, Player>(playersArray);
    }
}

const playerStore = new PlayerStore();

export default playerStore;
