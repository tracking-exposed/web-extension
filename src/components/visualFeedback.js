import React from 'react';
import classNames from 'classnames';

const VisualFeedback = React.createClass({
    render () {
        const isPublic = this.props.event.data.visibility === 'public';
        const logo = this.props.logo;
        var badge;
        var message;

        var actionLink = "";
        var actionText = "";

        if(this.props.event.data.supporterId) {
            actionLink = 'https://facebook.tracking.exposed/realitycheck/' +  this.props.event.data.supporterId + '/recent';
            actionText = '⦑ Last activities ⦒';
        } else {
            console.log("Odd, supporterId not available");
        }

        if (isPublic) {
            badge = '✔';
            message = 'This post has been recorded';
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
                    {message} <a href={actionLink}>{actionText}</a>
                </span>
            </div>
        );
    }
});

export default VisualFeedback;
