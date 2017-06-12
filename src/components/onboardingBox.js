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

                    <T tag='p' className='fbtrex--copypaste' msg='onboardingCopyPaste' args={publicKey} />
                    <T tag='p' className='fbtrex--note' msg='onboardingNote' />

                    <p>
                        <T tag='button' className='fbtrex--onboarding-toggle' msg='onboardingReduceBox' />
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
