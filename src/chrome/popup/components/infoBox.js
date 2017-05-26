import React from 'react';

import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';

const InfoBox = React.createClass({

    render () {
        const realitylink = "https://facebook.tracking.exposed/realitycheck/" + this.props.userId + "/data";
        return (
            <Card>
                <CardHeader
                    avatar={chrome.extension.getURL('fbtrex48.png')}
                    title="Welcome to Facebook Tracking Exposed"
                    subtitle="Public Service Announcement"
                />

                <CardText>
                    <p>
                        Dear friend,<br />
                        thanks for supporting the <a href="https://facebook.tracking.exposed/" target="_blank">
                        facebook.tracking.exposed</a> initiative.
                    </p>

                    <p>
                        We care a lot about your privacy and we want to be as
                        transparent as possible, that's why:
                    </p>

                    <ul>
                        <li>
                            Your <em>Facebook newsfeed</em> highlights
                            the <strong>public posts</strong> we collect.
                        </li>
                        <li>
                            We have a <a href="https://facebook.tracking.exposed/privacy-statement" target="_blank">
                            Privacy Statement</a> that describes what data
                            we collect, and why.
                        </li>
                        <li>
                            We release only <a href="https://www.github.com/tracking-exposed/" target="_blank">
                            free, open source code</a> everyone can audit.
                        </li>
                        <li>
                            <b>Access to <a href={realitylink} target="_blank">
                            your data</a></b>, available to be downloaded or consulted (is a work in progress!). It contains what Facebook is showing you. In the 2017 will be improved with new visualizations and functionalities. 
                        </li>
                    </ul>
                </CardText>
            </Card>
        );
    }

});

export default InfoBox;
