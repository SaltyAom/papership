/* React */
import React, { Component, Fragment } from "react"
import store from "../store/store"

/* Material UI */
import {
    IconButton,
    List,
    ListItem,
    ListItemText,
    Button
} from '@material-ui/core'

/* Local */
import "../css/settings.css"

export default class extends Component {
    toggleDrawer(): void {
        store.dispatch({
            type: "toggleDrawer",
            drawer: true,
        })
    }

    cacheUpdate = async () => {
        console.log("Force update");
        navigator.serviceWorker.getRegistrations().then(registrations => {
            localStorage.clear()
            caches.keys().then(names => {
                for (let name of names)
                caches.delete(name);
            });
            for(let registration of registrations) {
                registration.unregister()
            } 
        }).then(():void => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('serviceWorker.js')
                .then(registration => {
                    console.info('Registered:', registration);
                }).catch(err => {
                    console.error('Registration failed: ', err);
                });
            }
        }).then(():void => {
            setInterval(() => {
                window.location.replace("/papership/")
            }, 1000)
        });
    }

    clearCache = ():void => {
        console.log("Clear cache");
        navigator.serviceWorker.getRegistrations().then(registrations => {
            localStorage.clear()
            caches.keys().then(names => {
                for (let name of names)
                caches.delete(name);
            });
            for(let registration of registrations) {
                registration.unregister()
            } 
        })
    }

    render(){
        return(
            <Fragment>
                <div id="appbar">
                    <div>
                        <IconButton color="primary" onClick={() => this.toggleDrawer()}>
                            <span className="material-icons">menu</span>
                        </IconButton>
                    </div>
                    <div>
                        <p id="app-title">Settings</p>
                    </div>
                    <div></div>
                </div>
                <List id="settings">
                    <ListItem button onClick={() => this.cacheUpdate()}>
                        <ListItemText primary="Force update" />
                    </ListItem>
                    <ListItem button onClick={() => this.clearCache() }>
                        <ListItemText primary="Clear cache!" />
                    </ListItem>
                </List>
            </Fragment>
        )
    }
}