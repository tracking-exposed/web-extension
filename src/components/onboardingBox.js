import React from 'react';

import { T, t } from '../i18n';

const OnboardingBox = React.createClass({

    render () {
        const publicKey = this.props.publicKey;

        return (
            <div className='fbtrex--onboarding'>
                <div className='fbtrex--onboarding-box'>
                    <T tag='h1' msg='onboardingTitle' />
                    <T msg='onboardingIntro' />

                    <p className='fbtrex--copypaste'>
                        {t('onboardingCopyPaste', publicKey)}
                    </p>

                    <T className='fbtrex--note' msg='onboardingNote' />

                    <p>
                        <button className='fbtrex--onboarding-toggle'>
                            {t('onboardingReduceBox')}
                        </button>
                    </p>
                </div>

                <div className='fbtrex--onboarding-collapsed fbtrex--hide'>
                    {t('onboardingReduced')} <button className='fbtrex--onboarding-toggle'>{t('onboardingReopen')}</button>
                </div>
            </div>
        );
    }
});

export default OnboardingBox;
