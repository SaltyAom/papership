/* React */
import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { Loadable, Loading, store } from "./Frequent"

import {
    Button
} from "@material-ui/core"

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
                <div onClick={e => this.props.onClick(e)} className={`dashboard-card`}>
                    <div className={`dashboard-card-title color-${this.props.color}`}>
                        <i className="material-icons">playlist_add_check</i>
                    </div>
                    <div className="dashboard-card-body-wrapper">
                        <div className="dashboard-card-body">
                            <h1>{this.props.title}</h1>
                            <div className="dashboard-card-footer">
                                <div className="dashboard-progress-wrapper">
                                    <div className="dashboard-progress-content">
                                        {`${this.props.current}`}/{`${this.props.max}`}
                                    </div>
                                    <div className="dashboard-progress-bar">
                                        <div className={`dashboard-progress color-${this.props.color}`} style={{width: `${percent}%`}}>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="contained" color="primary" className={`color-${this.props.color}`}>
                                    See <i className="material-icons">chevron_right</i>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>            
            )
        } else {
            return(
                <div onClick={e => this.redirect(e)} className={`dashboard-card`}>
                    <div className={`dashboard-card-title color-${this.props.color}`}>
                        <i className="material-icons">playlist_add_check</i>
                    </div>
                    <div className="dashboard-card-body-wrapper">
                        <div className="dashboard-card-body">
                            <h1>{this.props.title}</h1>
                            <div className="dashboard-card-footer">
                                <div className="dashboard-progress-wrapper">
                                    <div className="dashboard-progress-content">
                                        {`${this.props.current}`}/{`${this.props.max}`}
                                    </div>
                                    <div className="dashboard-progress-bar">
                                        <div className={`dashboard-progress color-${this.props.color}`} style={{width: `${percent}%`}}>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="contained" color="primary" className={`color-${this.props.color}`}>
                                    See <i className="material-icons">chevron_right</i>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}