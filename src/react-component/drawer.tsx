/* React */
import React, { Component, Fragment } from 'react'
import store from "../store/store"

/* Material UI */
import { 
    SwipeableDrawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@material-ui/core"

/* Navigation */
import { Link, withRouter, RouteComponentProps } from "react-router-dom"

/* Local */
import "../css/drawer.css"

/* Side Component */
interface sideProps {
    title: string,
    to: string,
    icon: string
}

interface sideState {
    path: string
}

class SideComponent extends Component<sideProps, sideState> {
    constructor(props: sideProps){
        super(props);
        this.state = {
            path: ""
        }
    }

    componentWillMount(){
        store.subscribe(() => {
            let state = store.getState();
            if(state.path === this.state.path) return;
            this.setState({
                path: state.path
            })
        })
    }

    componentWillUnMount(){
        store.subscribe(() => {})
    }

    render(){
        if(this.state.path === this.props.to){
            return(
                <ListItem button className="link-container current-route">
                    <Link to={this.props.to} className='link'>
                        <ListItemIcon>
                            <span className="material-icons">{this.props.icon}</span>
                        </ListItemIcon>
                        <ListItemText primary={this.props.title} />
                    </Link>
                </ListItem>
            )
        } else {
            return(
                <ListItem button className="link-container">
                    <Link to={this.props.to} className='link'>
                        <ListItemIcon>
                            <span className="material-icons">{this.props.icon}</span>
                        </ListItemIcon>
                        <ListItemText primary={this.props.title} />
                    </Link>
                </ListItem>
            )
        }
    }
}

/* Main Component */
interface props extends RouteComponentProps {}

interface state {
    drawer: boolean,
}

class Drawer extends Component<props, state> {
    constructor(props: props){
        super(props);
        this.state = {
            drawer: false,
        }
    }

    componentWillMount(){
        this.props.history.listen((location, action) => {
            store.dispatch({
                type: "updatePath",
                path: location.pathname
            })
        })
    }

    componentDidMount(){
        store.subscribe(() => {
            let state = store.getState()
            this.setState({
                drawer: state.drawer
            })
        })
    }

    componentWillUnmount(){
        store.subscribe(() => {})
    }

    toggleDrawer = (bool: boolean): void => {
        store.dispatch({
            type: "toggleDrawer",
            drawer: bool,
        })
    }

    render() {
        const sideList = (
            <div style={{width: "250px"}}>
                <List>
                    <SideComponent title="Dashboard" to="/" icon="dashboard" />
                </List>
                <Divider />
                <List>
                    <SideComponent title="Settings" to="/settings" icon="settings" />
                </List>
            </div>
        )

        return (
            <Fragment>
                <SwipeableDrawer
                    id="drawer"
                    anchor="left"

                    disableSwipeToOpen={true}
                    open={this.state.drawer}
                    onOpen={() => this.toggleDrawer(true)}
                    onClose={() => this.toggleDrawer(false)}
                >
                    <div
                        tabIndex={0}
                        role="button"
                        style={{width: "250px"}}
                        onClick={() => this.toggleDrawer(false)}
                        onKeyDown={() => this.toggleDrawer(false)}
                    >
                        {sideList}
                    </div>
                </SwipeableDrawer>
            </Fragment>
        );
    }
}

export default withRouter<props>(Drawer)