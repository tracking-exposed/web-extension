import React from 'react';
import classNames from 'classnames';

const VisualFeedback = React.createClass({
    render () {
        const isPublic = this.props.event.data.visibility === 'public';
        const logo = this.props.logo;
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
                <h1>
                    <img src={logo} />
                    facebook.tracking.exposed
                </h1>
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
