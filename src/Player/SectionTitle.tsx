import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { AppStore } from '../AppStore';

interface Props {
    appStore?: AppStore;
    title: string;
}

@inject('appStore')
@observer
class SectionTitle extends React.Component<Props> {
    public render() {
        const { title, appStore } = this.props;

        if (!appStore) { return null; }

        return (
            <div className="section-title">
                <button onClick={appStore.goHome}>
                    <i className="fa fa-chevron-left" aria-hidden="true" />
                </button>
                <h2>{title}</h2>
            </div>
        );
    }
}

export default SectionTitle;
