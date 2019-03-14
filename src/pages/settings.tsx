/* React */
import React, { Component } from "react"
import store from "../store/store"

/* Material UI */
import {
    IconButton,
    List,
    ListItem,
    ListItemText,
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    ExpansionPanelActions
} from '@material-ui/core'

/* Local */
import "../css/settings.css"

interface settingProps {
    title: string,
    content: string,
    button?: string,
    function?: any,
    subtitle?: string
}

class SettingPanel extends Component<settingProps,{}> {
    render(){
        return(
            <ExpansionPanel className="setting-panel">
                <ExpansionPanelSummary expandIcon={<i className="material-icons" style={{cursor:"pointer"}}>expand_more</i>}>
                    <p>{this.props.title}</p>
                    <p>{this.props.subtitle}</p>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <p>{this.props.content}</p>
                </ExpansionPanelDetails>
                {this.props.button ?
                    <ExpansionPanelActions>
                        {this.props.function ?
                        <Button color="primary" onClick={() => this.props.function()}>
                            {this.props.button}
                        </Button>
                        :
                        <Button color="primary">
                            {this.props.button}
                        </Button>
                        }
                    </ExpansionPanelActions>
                    : null
                }
            </ExpansionPanel>
        )
    }
}

interface state {
    blur:number,
    usage:any,
    quota:any
}

export default class extends Component<{},state> {
    constructor(props:any){
        super(props);
        this.state = {
            blur: 0,
            usage: 0,
            quota: 0
        }
    }

    componentDidMount(){
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then((estimate: any) => {
                if(estimate !== undefined){
                    this.setState({
                        usage: Math.round(parseInt(estimate.usage, 10) / 1048576 * 100) / 100,
                        quota: Math.round(parseInt(estimate.quota, 10) / 1048576 * 100) / 100
                    })
                } else {
                    this.setState({
                        usage: "Unable to get",
                        quota: "Unable to get"
                    })
                }
            });
        }
        store.subscribe(() => {
            let state:any = store.getState(),
                blur:number = 0;
            if(state.drawer) blur = 5;
            if(state.blur) blur = state.blur;
            this.setState({
                blur: blur
            })
        })
    }

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
                navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.info('Registered:', registration);
                }).catch(err => {
                    console.error('Registration failed: ', err);
                });
            }
        }).then(():void => {
            setInterval(() => {
                window.location.replace("/")
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
        }).then(() => {
            window.location.reload();
        })
    }

    reload = ():void => {
        window.location.reload();
    }

    addToHomescreen = ():void => {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e:any) => {
            e.preventDefault();

            deferredPrompt = e;
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then((choiceResult:any) => {
                deferredPrompt = null;
            });
        });
    }

    render(){
        let isAndroid = /(android)/i.test(navigator.userAgent);
        return(
            <>
                <div id="appbar" style={{filter: `blur(${this.state.blur}px)`}}>
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
                <div id="settings" style={{filter: `blur(${this.state.blur}px)`}}>
                    {isAndroid && !window.matchMedia('(display-mode: standalone)').matches ?
                        <SettingPanel
                            title="Add to homescreen"
                            content="Save Papership to homescreen for easier usage with offline support and native feels (Hide URL bar and Navigation bar)."
                            button="Add to homescreen"
                            function={() => this.addToHomescreen()}
                        />
                    : null
                    }
                    <SettingPanel
                        title="Storage"
                        content="Estimate storage usage and maximum storage usage"
                        button={`Using ${this.state.usage} out of ${this.state.quota} MB.`}
                    />
                    <SettingPanel 
                        title="Reload"
                        content="Reload app to from fresh start without reopen app."
                        button="Reload"
                        function={() => this.reload()}
                    />
                    <SettingPanel 
                        title="Clear Cache"
                        content="Clear all cache in localstorage and cookies"
                        button="Clear Cache"
                        function={() => this.clearCache()}
                    />
                    <SettingPanel 
                        title="Force Update"
                        content="Clear all and register new cache of PWA and force reload to update service worker."
                        button="Force Update"
                        function={() => this.cacheUpdate()}
                    />
                </div>
            </>
        )
    }
}