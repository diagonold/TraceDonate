import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import Account from './Account';
import Home from './Home';

export default function Index() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/account" component={Account} />
        </Switch>
    );
}