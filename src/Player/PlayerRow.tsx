import * as React from 'react';
import { observer } from 'mobx-react';
import { Player } from '../types';

interface Props {
    player: [string, Player];
}

@observer
class PlayerRow extends React.Component<Props> {
    public render() {
        const [, { firstName, lastName }] = this.props.player;

        return <div>{`${firstName} ${lastName}`}</div>;
    }
}

export default PlayerRow;
