import React from 'react';
import classNames from 'classnames';

import config from '../config';
import token from '../token';

const VisualFeedback = React.createClass({
    render () {
        const isPublic = this.props.event.data.visibility === 'public';
        const logo = this.props.logo;
        var badge;
        var message;

        const actionLink = `https://facebook.tracking.exposed/personal/${token.get()}/data`;
        const actionText = 'Your data';

        if (isPublic) {
            badge = '✔';
            message = 'This post has been recorded';
        } else {
            badge = '⛔️';
            message = 'This post will be kept private';
        }

        return (
            <div className={classNames('fbtrex--visual-feedback', { 'fbtrex--visibility-public': isPublic, 'fbtrex--less-info': config.settings.lessInfo })}>
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

export default VisualFeedback;
