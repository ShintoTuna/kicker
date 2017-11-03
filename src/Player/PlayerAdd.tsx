import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { PlayerStore } from './PlayerStore';
import { observable, action } from 'mobx';

interface Props { playerStore?: PlayerStore; }

@inject('playerStore')
@observer
class PlayerAdd extends React.Component<Props> {
    @observable firstName = '';
    @observable lastName = '';

    render() {
        return (
            <div>
                <input
                    type="text"
                    name="firstName"
                    value={this.firstName}
                    onChange={this.onFirstNameChange}
                    placeholder="First Name"
                />
                <input
                    type="text"
                    name="lastName"
                    value={this.lastName}
                    onChange={this.onLastNameChange}
                    placeholder="Last Name"
                />

                <button onClick={this.addPlayer}>Add</button>
            </div>
        );
    }

    @action onFirstNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { value } = e.target as HTMLInputElement;
        this.firstName = value;
    }

    @action onLastNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { value } = e.target as HTMLInputElement;
        this.lastName = value;
    }

    @action addPlayer = () => {
        const { playerStore } = this.props;

        if (this.firstName && this.lastName && playerStore) {
            playerStore.savePlayer({
                firstName: this.firstName,
                lastName: this.lastName,
            });

            this.firstName = '';
            this.lastName = '';
        }
    }
}

export default PlayerAdd;