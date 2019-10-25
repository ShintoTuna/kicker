import * as React from 'react';
import { PlayerStore } from './PlayerStore';
import { formatRating, formatGoals, formatWins } from '../utils';
import { RankingPos, RankingType, Player } from '../types';
import { observer, inject } from 'mobx-react';
import SectionTitle from './SectionTitle';

interface Props {
    playerStore?: PlayerStore;
}

interface State {
    sort: RankingType;
    pos: RankingPos;
}

@inject('playerStore')
@observer
class Rankings extends React.Component<Props, State> {
    state = {
        sort: 'rating' as RankingType,
        pos: 'all' as RankingPos,
    };

    public render() {
        const { playerStore } = this.props;

        if (!playerStore) { return null; }

        const { isLoading } = playerStore;

        const players = playerStore.getSortedPlayers(this.state.pos, this.state.sort);
        // const players = playerStore.players;

        return (
            <div className="rankings">
                <SectionTitle title="Rankings" />
                <ul className="tabs">
                    {this.renderTab('all', 'Overall')}
                    {this.renderTab('off', 'Offence')}
                    {this.renderTab('def', 'Defence')}
                </ul>
                {isLoading ? <div>Loading ..</div> :

                    <table>
                        <thead>
                            <tr>
                                <th>Player</th>
                                {this.renderHeaderRow('rating', 'R')}
                                {this.renderHeaderRow('winPercent', 'W')}
                                {this.renderHeaderRow('avgGoals', 'AG')}
                                {this.renderHeaderRow('avgOwnGoals', 'AOG')}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from(players.entries()).map(([id, player], i) =>
                                (<tr key={id}>
                                    <td>{player.firstName} {player.lastName}</td>
                                    {this.renderValue('rating', player)}
                                    {this.renderValue('winPercent', player)}
                                    {this.renderValue('avgGoals', player)}
                                    {this.renderValue('avgOwnGoals', player)}
                                </tr>)
                            )}
                        </tbody>
                    </table>}
                <span className="legend">
                    R - rating, W - win percentage, AGS - average goals scored, AOG - averege own goals scored
                    </span>
            </div>
        );
    }
    private renderHeaderRow = (type: RankingType, label: string) =>
        <th className={this.typeCN(type)} onClick={() => this.setSort(type)}>{label}</th>

    private posCN = (pos: RankingPos) => this.state.pos === pos ? 'pos' : '';

    private typeCN = (type: RankingType) => this.state.sort === type ? 'sort' : '';

    private renderValue = (type: RankingType, player: Player) => {

        let value: number | string;

        switch (type) {
            case 'rating':
                value = formatRating(player.ratings[this.state.pos]);
                break;
            case 'avgGoals':
                value = formatGoals(player.avgs[this.state.pos]);
                break;
            case 'avgOwnGoals':
                value = formatGoals(player.avgs[this.state.pos], true);
                break;
            case 'gamesPlayed':
                value = player.avgs[this.state.pos].games;
                break;
            case 'winPercent':
                value = formatWins(player.avgs[this.state.pos].games, player.avgs[this.state.pos].wins) + '%';
                break;
            default:
                value = 0;
        }

        return (
            <td className={`num ${this.typeCN(type)}`}>{value}</td>
        );
    }

    private renderTab = (pos: RankingPos, label: string) => (
        <li>
            <span
                className={this.posCN(pos)}
                onClick={() => this.onTabChange(pos)}
            >
                {label}
            </span>
        </li>
    )

    private onTabChange = (p: RankingPos) => {
        this.setState({ pos: p });
    }

    private setSort = (type: RankingType) => {
        this.setState({ sort: type });
    }
}

export default Rankings;
