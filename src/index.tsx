/* React */
import React, { Component, Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { Loadable, Loading } from "./react-component/Frequent"

/* Navigator */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

/* Material UI */
const MuiThemeProvider = lazy(() => import('@material-ui/core/styles/MuiThemeProvider'));
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { blue } from "@material-ui/core/colors"

const Drawer = Loadable({
    loader: () => import("./react-component/drawer" /* webpackChunkName: "drawer" */),
    loading: Loading
}),
Dashboard = Loadable({
    loader: () => import("./pages/dashboard" /* webpackChunkName: "dashboard" */),
    loading: Loading
}),
Collection = Loadable({
    loader: () => import("./pages/collection" /* webpackChunkName: "collection" */),
    loading: Loading
}),
Settings = Loadable({
    loader: () => import("./pages/settings" /* webpackChunkName: "settings" */),
    loading: Loading
}),
Error = Loadable({
    loader: () => import("./react-component/error" /* webpackChunkName: "error" */),
    loading: Loading
});

/* CSS */
import "./material-icon/material-icons.css"
import "./css/init.css"
import "./css/main.css"
import "./css/dev.css"

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
        main: "#fafafa"
    }
  },
  typography: {
    useNextVariants: true,
  }
});

interface state {
    blur:number
}

class App extends Component<{}, state> {
    constructor(props:any){
        super(props);
    }

    render(){
        return(
            <Router>
                <Suspense fallback={<Loading />}>
                    <MuiThemeProvider theme={theme}>
                        { process.env.NODE_ENV === "development" ?                    
                            <div id="dev">
                                <div id="title">Development</div>
                                <div id="line"></div>
                            </div>
                        : null }

                        <Drawer />

                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/settings" component={Settings} />
                            <Route path="/collection" component={Collection} />
                            <Route component={Error} />
                        </Switch>

                    </MuiThemeProvider>
                </Suspense>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('papership'));