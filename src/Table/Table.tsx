import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { TableStore } from './TableStore';
import Participant from './Participant';
import { TablePosition } from '../types';

interface Props {
    tableStore?: TableStore;
}

interface State {
    counter: number;
    timer: number;
    pickParticipants: boolean;
    forSwap: TablePosition | null;
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
    };

    public render() {
        const { tableStore } = this.props;

        if (!tableStore) { return null; }

        return this.renderTable(tableStore);
    }

    private renderTable = ({ participants, scoreGoal, scoreOwnGoal, score, events, undo, finishGame }: TableStore) => (
        <div className="table">
            <ul>
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
            <div>
                Away: {score.away} | Home: {score.home}
            </div>
            <div>
                time: {this.time()}
                <button onClick={this.startTimer}>
                    {this.state.timer ? 'Pause' : 'Start'}
                </button>
                <button onClick={this.resetTimer}>Reset</button>
                <button onClick={() => finishGame(this.length - this.state.counter)}>Finish game</button>
                <button onClick={undo}>Undo</button>
            </div>

            <div>
                {events.map((e, i) => <div key={i}>{e.action} {e.position}</div>)}
            </div>
        </div>
    )

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
}

export default Table;
