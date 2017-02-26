import React from 'react';

import _ from 'lodash';
import update from 'immutability-helper';

import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import db from '../../db';

export default class Settings extends React.Component {

    constructor (props) {
        super(props);
        db
            .get(props.userId + '/settings', {tagId: '', isStudyGroup: false, lessInfo: false})
            .then(settings => this.setState({
                oldSettings: settings,
                settings: _.cloneDeep(settings)
            }));
    }

    saveSettings () {
        const newSettings = _.cloneDeepWith(this.state.settings, value => _.isString(value) ? _.trim(value): value);
        db.set(this.props.userId + '/settings', this.state.settings)
          .then(() => this.setState(update(this.state, {oldSettings: {$set: this.state.settings}})));
    }

    resetSettings () {
        this.setState(update(this.state, {settings: {$set: this.state.oldSettings}}));
    }

    render () {
        if (!this.state) {
            return null;
        }

        /* Keeping temporarly out of visibilty */
        return null;
        /* ----------------------------------- */

        const state = this.state;

        const showTagId = state.settings.tagId !== null;
        const dirty = !_.isEqual(state.settings, state.oldSettings);

        return (
            <Card>
                <CardHeader title="Settings" />

                <CardText>
                    <div>
                        <Checkbox
                            label="I'm part of a study group"
                            labelPosition="left"
                            checked={state.isStudyGroup}
                            onCheck={(_, val) => this.setState({showTagId: val})} />

                        {state.showTagId &&
                        <TextField
                            hintText="Tag ID"
                            value={state.settings.tagId}
                            onChange={(_, val) => this.setState(update(state, { settings: { tagId: { $set: val }}}))}
                        />
                        }
                    </div>

                    <div>
                        <Checkbox
                            label="Hide the banner on top of the posts"
                            labelPosition="left"
                            checked={state.settings.lessInfo}
                            onCheck={(_, val) =>
                                this.setState(update(state, { settings: { lessInfo: { $set: val }}}))}
                            />
                    </div>

                    {dirty &&
                    <CardActions>
                        <RaisedButton
                            label="Save"
                            primary={true}
                            onClick={this.saveSettings.bind(this)}
                        />
                        <RaisedButton
                            label="Cancel"
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
