import React from 'react';

import _ from 'lodash';
import update from 'immutability-helper';

import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { t } from '../../../i18n';

import db from '../../db';

export default class Settings extends React.Component {

    constructor (props) {
        super(props);

        db
            .get(props.userId + '/settings', {tagId: '', isStudyGroup: false, lessInfo: false})
            .then(settings => this.setState({
                oldSettings: _.cloneDeep(settings),
                settings: settings
            }));
    }

    saveSettings () {
        const settings = _.cloneDeepWith(this.state.settings, value => _.isString(value) ? _.trim(value) : value);

        db
            .set(this.props.userId + '/settings', settings)
            .then(() => this.setState(update(this.state, {oldSettings: {$set: _.cloneDeep(settings)},
                                                          settings: {$set: settings},
                                                          reloadBrowser: {$set: true}})));

        bo.tabs.reload();
    }

    resetSettings () {
        this.setState(update(this.state, {settings: {$set: _.cloneDeep(this.state.oldSettings)}}));
    }

    render () {
        if (!this.state) {
            return null;
        }

        console.log('settings', this.state.settings);
        const state = this.state;

        const dirty = !_.isEqual(state.settings, state.oldSettings);

        return (
            <Card>
                <CardHeader title={t('settingsTitle')} />

                <CardText>
                    <div>
                        <Checkbox
                            label={t('settingsStudyGroup')}
                            labelPosition="left"
                            checked={state.settings.isStudyGroup}
                            onCheck={(_, val) => this.setState(update(state, {settings: {isStudyGroup: {$set: val}}}))} />

                        {state.settings.isStudyGroup &&
                        <TextField
                            hintText={t('settingsTagId')}
                            value={state.settings.tagId}
                            onChange={(_, val) => this.setState(update(state, {settings: {tagId: {$set: val }}}))}
                        />
                        }
                    </div>

                    <div>
                        <Checkbox
                            label={t('settingsHideBanner')}
                            labelPosition="left"
                            checked={state.settings.lessInfo}
                            onCheck={(_, val) =>
                                this.setState(update(state, {settings: {lessInfo: {$set: val }}}))}
                            />
                    </div>

                    {dirty &&
                    <CardActions>
                        <RaisedButton
                            label={t('settingsSaveAndReload')}
                            primary={true}
                            onClick={this.saveSettings.bind(this)}
                        />
                        <RaisedButton
                            label={t('settingsCancel')}
                            secondary={true}
                            onClick={this.resetSettings.bind(this)}
                        />
                    </CardActions>
                    }

                </CardText>
            </Card>
        );
    }

};
