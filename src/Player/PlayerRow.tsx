import * as React from 'react';
import { observer } from 'mobx-react';
import { Player } from '../types';

interface Props {
    player: Player;
    id: string;
    action: (player: Player) => boolean;
}

interface State {
    isSelected: boolean;
}

@observer
class PlayerRow extends React.Component<Props, State> {
    state = {
        isSelected: false,
    };

    public render() {
        const { player: { firstName, lastName } } = this.props;
        const style = { border: this.state.isSelected ? '2px dashed black' : '' };

        return (
            <div onClick={this.handleSelect} style={style}>
                {`${firstName} ${lastName}`}
            </div>
        );
    }

    private handleSelect = () => {
        if (!this.state.isSelected) {
            const isSelected = this.props.action(this.props.player);
            this.setState({ isSelected });
        }
    }
}

export default PlayerRow;
