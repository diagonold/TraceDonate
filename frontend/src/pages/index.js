import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import Account from './user/Account';
import SignIn from './user/SignIn';
import SignUp from './user/SignUp';
import Home from './Home';

export default function Index() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/account" component={Account} />
            <Route path="/login" component={SignIn} />
            <Route path="/register" component={SignUp} />
        </Switch>
    );
}