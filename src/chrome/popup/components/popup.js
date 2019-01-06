import React from 'react';
import InfoBox from './infoBox';
import Settings from './settings';

const Popup = React.createClass({

    render () {
        return (
            <div className='fbtrex--popup'>
                <Settings {...this.props} />
                <InfoBox {...this.props} />
            </div>
        );
    }
});

export default Popup;
