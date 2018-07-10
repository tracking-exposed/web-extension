import React from 'react';

import _ from 'lodash';
import { T, t } from '../i18n';

const OnboardingBox = React.createClass({

    render () {
        const publicKey = this.props.publicKey;

        return (
            <div className='fbtrex--onboarding'>

                <div className='fbtrex--onboarding-box'>

                    <T tag='h1' msg='onboardingTitle' />

                    <p className="fbtrex--opt-in">
                        {t('infoDietDesc')}
                        <a href="https://facebook.tracking.exposed/privacy-statement" target="_blank">privacy statement</a>
                        .
                    </p>
                    <button className='default-opt-out' id='info-diet-button'>
                        {t('infoDietButton')}
                    </button>

                    <p className="fbtrex--opt-in">
                        {t('dataReuseDesc')}
                        <a href="https://facebook.tracking.exposed/data" target="_blank">documented and transparent</a>
                        .
                    </p>

                    <button className='default-opt-out' id='data-reuse-button'>
                        {t('dataReuseButton')}
                    </button>

                    <h2 className="fbtrex--next" id="cc">Close and Continue →</h2>
                    <h2 className="fbtrex--next fbtrex--info" id="ccDesc">(You should opt-in at least at the first button to get rid of this box)</h2>

                </div>

                <div className='fbtrex--onboarding-collapsed fbtrex--hide'>
                    {t('onboardingReduced')} <button className='fbtrex--onboarding-toggle'>{t('onboardingReopen')}</button>
                </div>

            </div>
        );
    }

});

export default OnboardingBox;
