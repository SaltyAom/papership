/* React */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

/* Navigator */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

/* Material Icon */
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { blue } from "@material-ui/core/colors"

/* React Component */
import Drawer from "./react-component/drawer"
import Dashboard from "./react-component/dashboard"
import Collection from "./react-component/collection"
import Settings from "./react-component/settings"
import Error from "./react-component/error"
import Redirect from "./react-component/redirect"

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
}

class App extends Component<{}, state> {
    render(){
        return(
            <Router>
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
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));