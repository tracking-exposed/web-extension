import React from 'react';
import classNames from 'classnames';

import config from '../config';
import token from '../token';

const AnomalyReport = React.createClass({
    render () {
        const logo = this.props.logo;
        const actionLink = `${config.WEB_ROOT}/personal/${token.get()}/anomaly`;
        const actionText = 'know more'
        const badge = '⚠';
        const message = "fbTREX is not working for you, we want to fix this.";

        return (
            <div className={classNames('fbtrex--visual-feedback', 'fbtrex--anomaly')}>
                <span className='fbtrex--badge'>
                    {badge}
                </span>
                <span className='fbtrex--message'>
                    {message} 
                </span>
                <span className='fbtrex--logo'>
                    <img src={logo} />
                </span>
                <span className='fbtrex--message'>
                    <a target='_blank' href={actionLink}>{actionText}</a>
                </span>
            </div>
        );
    }
});

export default AnomalyReport;
