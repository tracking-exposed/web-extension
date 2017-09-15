import React from 'react';

import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';

import { T, t } from '../../../i18n';

const bo = chrome || browser;
const InfoBox = React.createClass({

    render () {
        const realitylink = 'https://facebook.tracking.exposed/realitycheck/' + this.props.userId + '/data';

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
                        <T tag='li' msg="popupHighlight" />
                        <T tag='li' msg="popupPrivacy" />
                        <T tag='li' msg="popupFree" />
                        <T tag='li' msg="popupReality" args={realitylink} />
                    </ul>
                </CardText>
            </Card>
        );
    }

});

export default InfoBox;
