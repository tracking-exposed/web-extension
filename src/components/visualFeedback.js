import React from 'react';
import classNames from 'classnames';

const VisualFeedback = React.createClass({
    render () {
        const isPublic = this.props.event.data.visibility === 'public';
        var badge;
        var message;

        if (isPublic) {
            badge = '✔';
            message = 'The content of this post will be shared with facebook.tracking.exposed.';
        } else {
            badge = '⛔️';
            message = 'The content of this post will be kept private.';
        }

        return (
            <div className={classNames('fbtrex--visual-feedback', { 'fbtrex--visibility-public': isPublic })}>
                <span className='fbtrex--badge'>
                    {badge}
                </span>
                <span className='fbtrex--message'>
                    {message} <a href='mailto:support@tracking.exposed'>Report</a>
                </span>
            </div>
        );
    }
});

export default VisualFeedback;
