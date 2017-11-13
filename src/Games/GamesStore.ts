import { observable, action } from 'mobx';
import * as firebase from 'firebase/app';
import { PlayedGame } from '../types';
import db from '../firebase';

export class GamesStore {
    @observable games = new Map<string, PlayedGame>();
    @observable isLoading = true;

    gamesCol = db.collection('games/');

    constructor() {
        this.gamesCol
            .orderBy('timestamp', 'asc')
            .limit(10)
            .onSnapshot((snapshot) => {
                if (snapshot) {
                    this.updateGames(snapshot);
                    this.stopLoading();
                }
            });
    }

    @action stopLoading = () => this.isLoading = false;

    @action updateGames(games: firebase.firestore.QuerySnapshot) {
        // const data: object[] = [];
        games.forEach((game) => {
            this.games.set(game.id, { ...game.data() } as PlayedGame);
            // data.push({ ...game.data(), id: game.id });
        });
        // console.log(JSON.stringify(data));
    }
}

export default new GamesStore();
