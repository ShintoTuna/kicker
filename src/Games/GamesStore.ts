import { observable, action } from 'mobx';
import * as firebase from 'firebase/app';
import { PlayedGame } from '../types';
import db from '../firebase';

export class GamesStore {
    @observable games = new Map<string, PlayedGame>();
    @observable isLoading = true;

    gamesCol = db.collection('games/');

    constructor() {
        this.gamesCol.orderBy('timestamp', 'desc').limit(5).onSnapshot((snapshot) => {
            if (snapshot) {
                this.updateGames(snapshot);
                this.stopLoading();
            }
        });
    }

    @action stopLoading = () => this.isLoading = false;

    @action updateGames(games: firebase.firestore.QuerySnapshot) {
        games.forEach((game) => {
            this.games.set(game.id, { ...game.data() } as PlayedGame);
        });
    }
}

export default new GamesStore();
