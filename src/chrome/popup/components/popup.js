import React from 'react';
import InfoBox from './infoBox';
import Settings from './settings';

const bo = chrome || browser;
const Popup = React.createClass({

    render () {
        return (
            <div className='fbtrex--popup'>
                <InfoBox {...this.props} />
                <Settings {...this.props} />
            </div>
        );
    }
});

export default Popup;
