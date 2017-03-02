import React from 'react';
import classNames from 'classnames';

import config from '../config';

const VisualFeedback = React.createClass({
    render () {
        const isPublic = this.props.event.data.visibility === 'public';
        const logo = this.props.logo;
        var badge;
        var message;

        const actionLink = `https://facebook.tracking.exposed/realitycheck/${config.userId}/recent`;
        const actionText = '⦑ Last activities ⦒';

        if (isPublic) {
            badge = '✔';
            message = 'This post has been recorded';
        } else {
            badge = '⛔️';
            message = 'The content of this post will be kept private.';
        }

        return (
            <div className={classNames('fbtrex--visual-feedback', { 'fbtrex--visibility-public': isPublic, 'fbtrex--less-info': config.settings.lessInfo })}>
                <h1>
                    <img src={logo} />
                    facebook.tracking.exposed
                </h1>
                <span className='fbtrex--badge'>
                    {badge}
                </span>
                <span className='fbtrex--message'>
                    {message} <a target='_blank' href={actionLink}>{actionText}</a>
                </span>
            </div>
        );
    }
});

export default VisualFeedback;
