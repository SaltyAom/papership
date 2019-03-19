import React, { Component } from "react"
import { Loadable, Loading, store } from "./Frequent"

const IconButton = Loadable({
    loader: () => import("@material-ui/core/IconButton"),
    loading: Loading    
})
interface props {
    function?: any,
    icon?: string,
    title?: string,
    blur?: number
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
            <div id="appbar" style={{filter:`blur(${this.props.blur}px)`}}>
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
                    </IconButton> : <></> }
                </div>
            </div>
        )
     }
}