import React, { Component } from "react"
import { Redirect } from "react-router-dom"

export default class extends Component {
    render(){
        return(
            <Redirect push to="/" />
        )
    }
}