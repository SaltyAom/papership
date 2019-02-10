/* React */
import React, { Component, Fragment } from "react"
import store from "../store/store"

/* Navigation */
import { Link } from "react-router-dom"

/* Material UI */
import Button from '@material-ui/core/Button'


export default class Dashboard extends Component {
    render(){
        return(
            <div id="err">
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