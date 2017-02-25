import React from 'react';

import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import update from 'immutability-helper';

import db from '../../db';

export default class Settings extends React.Component {

    constructor (props) {
        super(props);
        db.get(props.userId + '/settings', {tagId: null, lessInfo: false})
          .then(settings => this.setState({oldSettings: settings,
                                           settings: Object.assign({}, settings),
                                           showTagId: settings.tagId !== null,
                                           dirty: false}));
    }

    saveSettings () {
        const userId = this.props.userId;
        db.set(userId + '/settings', this.state.settings);
        this.setState({dirty: false});
    }

    resetSettings () {
    }

    render () {
        if (!this.state) {
            return null;
        }

        /* Keeping temporarly out of visibilty */
        return null;
        /* ----------------------------------- */

        const state = this.state;
        console.log(state.settings);

        return (
            <Card>
                <CardHeader title="Settings" />

                <CardText>
                    <div>
                        <Checkbox
                            label="I'm part of a study group"
                            labelPosition="left"
                            checked={state.showTagId}
                            onCheck={(_, val) => this.setState({showTagId: val})} />

                        {state.showTagId &&
                        <TextField
                            hintText="Tag ID"
                            value={state.settings.tagId}
                            onChange={(_, val) =>
                                this.setState(update(state,
                                    {dirty: {$set: true}, settings: { tagId: { $set: val }}}))}
                        />
                        }
                    </div>

                    <div>
                        <Checkbox
                            label="Hide the banner on top of the posts"
                            labelPosition="left"
                            checked={state.settings.lessInfo}
                            onCheck={(_, val) =>
                                this.setState(update(state,
                                    {dirty: {$set: true}, settings: { lessInfo: { $set: val }}}))}
                            />
                    </div>

                    {state.dirty &&
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
