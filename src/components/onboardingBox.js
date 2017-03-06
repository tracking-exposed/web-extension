import React from 'react';

const OnboardingBox = React.createClass({

    render () {
        const publicKey = this.props.publicKey;

        return (
            <div className='fbtrex--onboarding'>
                <div className='fbtrex--onboarding-box'>
                    <h1>Yay!! Welcome to facebook.tracking.exposed!</h1>
                    <p>This is awesome, thanks for contributing. One last thing before we start. We need you to post your public key, so we can associate it with your contributions. Copy and paste the following message as new <strong>public post</strong>:</p>
                    <p className='fbtrex--copypaste'>
                      Personalisation Algorithms are a collective issue, and can
                      only be collectively addressed; today I am joining
                      https://facebook.tracking.exposed and this technical
                      this message is necessary to link my account to the following key: {publicKey}
                    </p>
                    <p className='fbtrex--note'>
                      If you do not want to show this message on your wall for whatever reason, we understand; just wait a minute and then you can safely delete it. After we retrieve your key this box will disappear. 
                      If something does not work, contact us on our <a href="https://www.facebook.com/personalizationalgorithm">facebook page</a> or open an <a href="https://github.com/tracking-exposed/web-extension/issues"> issue on github</a>.
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
