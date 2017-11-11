import * as React from 'react';
import { PlayerStore } from './PlayerStore';
import { formatRating, formatGoals } from '../utils';
import { RankingPos, RankingType, Player } from '../types';
import { observer, inject } from 'mobx-react';
import SectionTitle from './SectionTitle';

interface Props {
    playerStore?: PlayerStore;
}

interface State {
    sort: RankingPos;
    type: RankingType;
}

@inject('playerStore')
@observer
class Rankings extends React.Component<Props, State> {
    state = {
        sort: 'all' as RankingPos,
        type: 'rating' as RankingType,
    };

    public render() {
        const { playerStore } = this.props;

        if (!playerStore) { return null; }

        const { isLoading } = playerStore;

        const players = playerStore.getSortedPlayers(this.state.sort, this.state.type);

        return (
            <div className="rankings">
                <SectionTitle title="Rankings" />
                <ul className="tabs">
                    {this.renderTab('rating', 'Rating')}
                    {this.renderTab('goals', 'Goals')}
                    {this.renderTab('ownGoals', 'OwnGoals')}
                </ul>
                {isLoading ? <div>Loading ..</div> :

                    <table>
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th className={this.sortCN('all')} onClick={() => this.setSort('all')}>ALL</th>
                                <th className={this.sortCN('off')} onClick={() => this.setSort('off')}>OFF</th>
                                <th className={this.sortCN('def')} onClick={() => this.setSort('def')}>DEF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from(players.entries()).map(([id, player], i) =>
                                (<tr key={id}>
                                    <td>{player.firstName} {player.lastName}</td>
                                    {this.renderValue('all', player)}
                                    {this.renderValue('off', player)}
                                    {this.renderValue('def', player)}
                                </tr>)
                            )}
                        </tbody>
                    </table>}
            </div>
        );
    }

    private sortCN = (pos: RankingPos) => this.state.sort === pos ? 'sort' : '';

    private typeCN = (type: RankingType) => this.state.type === type ? 'type' : '';

    private renderValue = (pos: RankingPos, player: Player) => {

        let value: number;

        switch (this.state.type) {
            case 'rating':
                value = formatRating(player.ratings[pos]);
                break;
            case 'goals':
                value = formatGoals(player.avgs[pos]);
                break;
            case 'ownGoals':
                value = formatGoals(player.avgs[pos], true);
                break;
            default:
                value = 0;
        }

        return (
            <td className={`num ${this.sortCN(pos)}`}>{value}</td>
        );
    }

    private renderTab = (type: RankingType, label: string) => (
        <li>
            <a
                className={this.typeCN(type)}
                href="#"
                onClick={() => this.onTabChange(type)}
            >
                {label}
            </a>
        </li>
    )

    private onTabChange = (t: RankingType) => {
        this.setState({ type: t });
    }

    private setSort = (pos: RankingPos) => {
        this.setState({ sort: pos });
    }
}

export default Rankings;
