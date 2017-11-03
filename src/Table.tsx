import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { TableStore } from './TableStore';
import Participant from './Participant';

interface Props {
    tableStore?: TableStore;
}

interface State {
    counter: number;
    timer: number;
}

@inject('tableStore')
@observer
class Table extends React.Component<Props, State> {
    time = 5;
    state = {
        counter: this.time,
        timer: 0,
    };

    public render() {
        const { tableStore } = this.props;

        if (!tableStore) { return null; }

        return (
            <div className="table">
                <ul>
                    {[...tableStore.participants].map((participant, i) =>
                        participant && <Participant
                            key={i}
                            participant={participant}
                            scoreGoal={(p) => tableStore.scoreGoal(p)}
                            scoreOwnGoal={(p) => tableStore.scoreOwnGoal(p)}
                        />
                    )}
                </ul>
                <div>
                    Away: {tableStore.score.away} | Home: {tableStore.score.home}
                </div>
                <div>
                    time: {this.state.counter}
                    <button onClick={this.startTimer}>Start</button>
                    <button onClick={this.stopTimer}>Stop</button>
                </div>
            </div>
        );
    }

    private startTimer = () => {
        let timer = window.setInterval(this.tick, 1000);

        this.setState({ timer });
    }

    private stopTimer = () => {
        this.setState({ counter: this.time });

        clearInterval(this.state.timer);
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
}

export default Table;
