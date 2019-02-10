import React, { Component, Fragment } from "react"
import store from "../store/store"
import { IconButton } from "@material-ui/core"

interface props {
    function?: any,
    icon?: string,
    title?: string
}

export default class extends Component<props, {}> {
    toggleDrawer(): void {
        store.dispatch({
            type: "toggleDrawer",
            drawer: true,
        })
    }

    render(){
        return(
            <div id="appbar">
                <div>
                    <IconButton color="primary" onClick={() => this.toggleDrawer()}>
                        <span className="material-icons">menu</span>
                    </IconButton>
                </div>
                <div>
                    <p id="app-title">{this.props.title !== undefined ? this.props.title : "Papership" }</p>
                </div>
                <div>
                    {this.props.icon !== undefined ?
                    <IconButton color="primary" onClick={() => this.props.function()}>
                        <span className="material-icons">{this.props.icon}</span>
                    </IconButton> : <Fragment></Fragment> }
                </div>
            </div>
        )
     }
}