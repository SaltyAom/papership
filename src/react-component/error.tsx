/* React */
import React, { Component, Fragment } from "react"
import store from "../store/store"

/* Navigation */
import { Link } from "react-router-dom"

/* Material UI */
import Button from '@material-ui/core/Button'

interface state {
    blur:number
}

export default class Dashboard extends Component<{},state> {
    constructor(props:any){
        super(props);
        this.state = {
            blur:0
        }
    }

    componentDidMount(){
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

    render(){
        return(
            <div id="err" style={{filter: `blur(${this.state.blur}px)`}}>
                <span className="material-icons">error</span>
                <h2>
                    Unexpected Page
                </h2>
                <Button variant="contained" color="primary" className="title-button">
                    <Link to="/">
                        Return
                    </Link>
                </Button>
            </div>
        )
    }
}