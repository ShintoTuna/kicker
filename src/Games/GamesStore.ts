import { observable, action } from 'mobx';
import * as firebase from 'firebase/app';
import { PlayedGame, TablePosition } from '../types';
import db from '../firebase';
import tableStore from '../Table/TableStore';
import playerStore from '../Player/PlayerStore';
import appStore from '../AppStore';

export class GamesStore {
    @observable games = new Map<string, PlayedGame>();
    @observable isLoading = true;

    gamesCol = db.collection('games/');

    constructor() {
        this.gamesCol
            .orderBy('timestamp', 'desc')
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
        games.forEach((game) => {
            this.games.set(game.id, { ...game.data() } as PlayedGame);
        });
    }

    @action loadGame = (game: PlayedGame) => {
        game.game.forEach(({ position, playerId }) => {
            const player = playerStore.findPlayer(playerId);
            const oppositePos = this.getOpposite(position);

            if (player && oppositePos) {
                tableStore.addPlayer(oppositePos, player);
            }
        });

        appStore.newGame();
    }

    getOpposite = (pos: TablePosition) => {
        switch (pos) {
            case TablePosition.AWAY_DEF:
                return TablePosition.HOME_OFF;
            case TablePosition.AWAY_OFF:
                return TablePosition.HOME_DEF;
            case TablePosition.HOME_DEF:
                return TablePosition.AWAY_OFF;
            case TablePosition.HOME_OFF:
                return TablePosition.AWAY_DEF;
            default:
                return null;
        }
    }
}

export default new GamesStore();
