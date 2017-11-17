import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { TableStore } from './TableStore';
import Participant from './Participant';
import { TablePosition, GameActions } from '../types';
import Players from '../Player/Players';
import './Table.css';

interface Props {
    tableStore?: TableStore;
}

interface State {
    counter: number;
    timer: number;
    pickParticipants: boolean;
    forSwap: TablePosition | null;
    showLog: boolean;
}

@inject('tableStore')
@observer
class Table extends React.Component<Props, State> {
    length = 7 * 60;
    state = {
        counter: this.length,
        timer: 0,
        pickParticipants: false,
        forSwap: null,
        showLog: true,
    };

    public render() {
        const { tableStore } = this.props;

        if (!tableStore) { return null; }

        return tableStore.pickParticipants ? <Players /> : this.renderTable(tableStore);
    }

    private renderTable = (tableStore: TableStore) => {
        const {
            participants, scoreGoal, scoreOwnGoal, score, events,
            undo, cancelGame, sidesReverse, switchSides,
        } = tableStore;

        return (
            <div className="table">
                <div className={`timer ${this.state.counter <= 0 ? 'blink' : ''}`}>
                    <button onClick={this.resetTimer}>
                        <i className={`fa fa-lg fa-refresh`} aria-hidden="true" />
                    </button>
                    <span>{this.time()}</span>
                    <button onClick={this.startTimer}>
                        <i className={`fa fa-lg ${!this.state.timer ? 'fa-play' : 'fa-pause'}`} aria-hidden="true" />
                    </button>
                </div>
                <div className={`score ${sidesReverse ? 'reverse' : ''}`}>
                    <span className="away">{score.away}</span>
                    <span className="home">{score.home}</span>
                </div>
                <ul className={`game ${sidesReverse ? 'reverse' : ''}`}>
                    {Array.from(participants.entries()).map((participant, i) =>
                        participant && <Participant
                            key={i}
                            participant={participant}
                            scoreGoal={(p) => scoreGoal(p)}
                            scoreOwnGoal={(p) => scoreOwnGoal(p)}
                            swap={this.forSwap}
                        />
                    )}
                </ul>

                <div className="controls">
                    <button onClick={cancelGame}>Cancel</button>
                    <button onClick={undo}>Undo</button>
                    <button onClick={switchSides}>Switch Sides</button>
                    <button
                        className="finish"
                        onClick={this.finishGame}
                    >
                        Finish game
                    </button>
                </div>
                {events.length > 0 && <div className={`events ${this.state.showLog ? 'show' : ''}`}>
                    {events.reverse().map((e, i) => {
                        const player = participants.get(e.position);

                        if (player && player.player) {
                            const name = `${player.player.firstName} ${player.player.lastName.charAt(0)}.`;
                            const action  = e.action === GameActions.SCORE_GOAL ? 'scored GOAL!' : 'scored OWN goal!';
                            return <div key={i}>{`${name} ${action}`}</div>;
                        }
                        return null;
                    })}
                </div>}
            </div>
        );
    }

    private forSwap = (pos: TablePosition) => {
        const { tableStore } = this.props;
        const { forSwap } = this.state;
        if (tableStore) {
            if (forSwap && (pos !== forSwap)) {
                tableStore.swapPositions(forSwap, pos);
                this.setState({ forSwap: null });
            } else {
                this.setState({ forSwap: pos });
            }
        }

    }

    private startTimer = () => {
        if (!this.state.timer) {
            let timer = window.setInterval(this.tick, 1000);
            this.setState({ timer });
        } else {
            clearInterval(this.state.timer);
            this.setState({ timer: 0 });
        }
    }

    private resetTimer = () => {
        clearInterval(this.state.timer);

        this.setState({
            counter: this.length,
            timer: 0,
        });
    }

    private tick = () => {
        const { counter } = this.state;

        if (counter <= 0) {
            clearInterval(this.state.timer);
        } else {
            this.setState({
                counter: counter - 1
            });
        }
    }

    private time() {
        const time = this.state.counter;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        const minStr = minutes < 10 ? '0' + minutes : minutes;
        const secStr = seconds < 10 ? '0' + seconds : seconds;

        return `${minStr}:${secStr}`;
    }

    private finishGame = () => {
        const { tableStore } = this.props;
        const time = this.length - this.state.counter;

        if (tableStore) {
            this.resetTimer();
            tableStore.finishGame(time, tableStore.sidesReverse);
        }
    }
}

export default Table;
