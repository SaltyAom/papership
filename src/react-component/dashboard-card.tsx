/* React */
import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import store from "../store/store"

import ButtonBase from '@material-ui/core/ButtonBase';

interface props {
    title: string,
    color: string,
    current: number,
    max: number,
    guide?: boolean,
    onClick?: any
}

interface state {
    redirect: boolean
}

export default class extends Component<props,state> {
    constructor(props: any){
        super(props);
        this.state = {
            redirect: false
        }
    }

    redirect = (e: any):void => {
        if(this.props.guide) return;
        this.setState({
            redirect:true
        })
        store.dispatch({
            type: "updateCollection",
            collection: this.props.title
        })
    }

    render(){
        let percent = ( this.props.current / this.props.max ) * 100;
        if(this.state.redirect){
            return(
                <Redirect push to="/collection" />
            )
        }
        if(this.props.onClick){
            return(
                <ButtonBase onClick={e => this.props.onClick()} className={`dashboard-card ${this.props.color}`}>
                    <h1>{this.props.title}</h1>
                    <div>
                        <h6>{`${this.props.current}`}/{`${this.props.max}`}</h6>
                        <div className="dashboard-progress-bar">
                            <div style={{width: `${percent}%`}}></div>
                        </div>
                    </div>
                </ButtonBase>
            )
        } else {
            return(
                <ButtonBase onClick={e => this.redirect(e)} className={`dashboard-card ${this.props.color}`}>
                    <h1>{this.props.title}</h1>
                    <div>
                    <h6>{`${this.props.current}`}/{`${this.props.max}`}</h6>
                        <div className="dashboard-progress-bar">
                            <div style={{width: `${percent}%`}}></div>
                        </div>
                    </div>
                </ButtonBase>
            )
        }
    }
}