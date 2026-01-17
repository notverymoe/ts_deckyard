// // Copyright 2026 Natalie Baker // AGPLv3 // //

import 'bootstrap/dist/css/bootstrap.min.css';

import { render } from 'preact';
import { enableArrayMethods, enableMapSet } from 'immer';

import { loadCardsByUID } from './mtgjson/database';
import { isAsyncStatusFailure, isAsyncStatusSuccess, signalAsync } from './preact/signal_async';
import { formatError } from './util/error';

import { App } from './app';

history.scrollRestoration = "manual";
enableMapSet();
enableArrayMethods();

const database = signalAsync(loadCardsByUID());
render(<AppRoot/>, document.getElementById('app')!);

function AppRoot() {
    const dbStatus = database.value;

    if (isAsyncStatusSuccess(dbStatus)) {
        return <App db={dbStatus.value}/>;
    }

    if (isAsyncStatusFailure(dbStatus)) {
        return <>
            <h1>Database Error Occured</h1>
            <p>{formatError(dbStatus.error)}</p>
        </>;
    }

    return <h1>Loading...</h1>
}
