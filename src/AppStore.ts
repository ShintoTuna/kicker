import { observable, action } from 'mobx';

export enum Views {
    home = 'home',
    pickParticipants = 'pickParticipants',
    game = 'game',
    rankings = 'rankings',
}

export class AppStore {
    @observable view = Views.home;

    @action newGame = () => {
        this.view = Views.game;
    }

    @action goHome = () => {
        this.view = Views.home;
    }

    @action showRankings = () => {
        this.view = Views.rankings;
    }
}

const appStore = new AppStore();

export default appStore;
