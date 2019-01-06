import React from 'react';
import config from '../../../config';
import token from '../../../token';

import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';

import { T, t } from '../../../i18n';

const bo = chrome || browser;
const InfoBox = React.createClass({

    render () {
        const realitylink = `${config.WEB_ROOT}/personal/${token.authToken.get()}/data`;
        console.log("Token retrieved composed", realitylink);
        // this is a bug, we keep retrieving "unset" because the link is composed when the 
        // browser is started, and not when the link is effectively pressed. I don't know
        // enough of React to make this happen in the right moment, that's why the line below
        // (once under the "popupHello" entry, now is here commented:
        //
        // <T tag='h3' className='popTitle' msg="popupReality" args={realitylink} />
        return (
            <Card>
                <CardHeader
                    avatar={bo.extension.getURL('fbtrex48.png')}
                    title={t('popupTitle')}
                    subtitle={t('popupSubTitle')}
                />

                <CardText>
                    <T msg="popupHello" />

                    <T msg="popupIntro" />
                    <ul>
                        <T tag='li' msg="popupChat" />
                        <T tag='li' msg="popupHighlight" />
                        <T tag='li' msg="popupPrivacy" />
                        <T tag='li' msg="popupFree" />
                    </ul>
                </CardText>
            </Card>
        );
    }

});

export default InfoBox;
