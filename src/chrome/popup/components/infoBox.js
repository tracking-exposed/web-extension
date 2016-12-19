import React from 'react';

const InfoBox = React.createClass({

    render () {
        return (
            <div className='fbtrex--popup'>
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
                </ul>

                <p>
                    What about visualizations?
                    Bear with us! We are working to collect data from our
                    supporters and we have no visualization ready yet.
                </p>
            </div>
        );
    }
});

export default InfoBox;
