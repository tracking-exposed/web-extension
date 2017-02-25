import React from 'react';

const OnboardingBox = React.createClass({

    render () {
        const publicKey = this.props.publicKey;

        return (
            <div className='fbtrex--onboarding'>
                <div className='fbtrex--onboarding-box'>
                    <h1>Welcome to facebook.tracking.exposed!</h1>
                    <p>To get started, copy and paste the following message to a new <strong>public post</strong>:</p>
                    <p className='fbtrex--copypaste'>
                      Personalisation Algorithms are a collective issue, and can
                      only be collectively addressed; today I am joining
                      https://facebook.tracking.exposed and this technical
                      message is necessary to link my account to this key: {publicKey}
                    </p>
                    <p className='fbtrex--note'>
                      This box will disappear after we successfully retrieve your key. 
                      If something do not work, contact us on our <a href="https://www.facebook.com/personalizationalgorithm">facebook page</a> or open an <a href="https://github.com/tracking-exposed/web-extension/issues"> issue on github</a>.
                    </p>
                    <p>
                        <button className='fbtrex--onboarding-toggle'>Close box.</button>
                    </p>
                </div>

                <div className='fbtrex--onboarding-collapsed fbtrex--hide'>
                    facebook.tracking.exposed onboarding is not completed yet. <button className='fbtrex--onboarding-toggle'>More info.</button>
                </div>
            </div>
        );
    }
});

export default OnboardingBox;
