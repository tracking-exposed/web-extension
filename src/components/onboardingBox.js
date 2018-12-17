import React from 'react';

import _ from 'lodash';
import { T, t } from '../i18n';

const OnboardingBox = React.createClass({

    /*
                    <p className="fbtrex--opt-in">
                        {t('dataReuseDesc')}
                        <a href="https://facebook.tracking.exposed/data" target="_blank">documented and transparent</a>
                        .
                    </p>
                    <div className="clickable">
                        <span className='default-opt-out' id='data-reuse-button'>
                            {t('dataReuseButton')}
                            <br/>
                            {t('dataReuseButton2')}
                        </span>
                        <input type="checkbox" id="data-reuse-checkbox" />
                    </div>

                    <h2 className="fbtrex--next fbtrex--info" id="ccDesc">{t('optInAtLeast')}</h2>
     */

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

                    <div className="clickable" id="info-diet-button">
                        <span className='asterisk-default' id='info-diet-asterisk'>* </span>
                        <span>
                            {t('infoDietButton')}
                        </span>
                        <span className="pretendCheckbox" id="info-diet-checkbox">☐ </span>
                    </div>

                    <h2 className="continue-default" id="closeContinue">{t('closeAndContinue')}→</h2>
                </div>

                <div className='fbtrex--onboarding-collapsed fbtrex--hide'>
                    {t('onboardingReduced')} <button className='fbtrex--onboarding-toggle'>{t('onboardingReopen')}</button>
                </div>

            </div>
        );
    }

});

export default OnboardingBox;
