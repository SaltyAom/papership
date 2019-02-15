/* React */
import React, { Component, Fragment } from "react"
import Dexie from "dexie"
import store from "../store/store"

/* Material UI */
import { 
    Button,
    TextField,
    Select,
    Dialog,
    MenuItem,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    DialogContentText, 
    InputLabel,
    OutlinedInput
} from "@material-ui/core"

/* Component */
import Card from "./dashboard-card"
import Appbar from "./appbar"

/* Local */
import "../css/dashboard.css"

interface state {
    dialog: boolean,
    selector: boolean,
    selectorValue: string,
    color: string,
    title: string,
    collection: any,
    collectionType: string,
    typeSelector: boolean
}

export default class extends Component<{}, state> {
    constructor(props: any) {
        super(props);
        this.state = {
            dialog: false,
            selector: false,
            selectorValue: "",
            color: "",
            title: "",
            collection: [],
            collectionType: "",
            typeSelector: false
        }
    }

    componentWillMount():void {
        this.loadCollection();
    }

    componentWillUpdate(nextProps:any, nextState:any): void {
        if(nextState.selectorValue === this.state.selectorValue) return;
        switch(nextState.selectorValue){
            case "red":
                this.setState({
                    color: "#e03a3e"
                })
                break;
            case "green":
                this.setState({
                    color: "#61bb46"
                })
                break;
            case "blue":
                this.setState({
                    color: "#007aff"
                })
                break;
            case "pink":
                this.setState({
                    color: "#ff2d55"
                })
                break;
            case "violet":
                this.setState({
                    color: "#963d97"
                })
                break;
            default:
                break;
        }
    }

    dialog = (bool:boolean): void => {
        this.setState({
            dialog: bool
        })
        if(bool){
            store.dispatch({
                type: "blur",
                blur: 5
            })
        } else {
            store.dispatch({
                type: "blur",
                blur: 0
            })
        }
    }
    
    toggleSelector = (bool: boolean) => {
        this.setState({
            selector: bool
        })
    }

    toggleTypeSelector = (bool: boolean) => {
        this.setState({
            typeSelector: bool
        })
    }

    selectorChange = (event:any): void => {
        this.setState({ selectorValue: event.target.value });
    }

    typeSelectorChange = (event:any): void => {
        this.setState({ collectionType: event.target.value })
    }

    handleTitle = (event:any): void => {
        this.setState({
            title: event.target.value
        })
    }

    newCollection = (e:any): void => {
        e.preventDefault();
        if(this.state.selectorValue === "" || this.state.selectorValue === "" || this.state.collectionType === "") return;
        store.dispatch({
            type: "blur",
            blur: 0
        })

        this.setState({
            selector:false,
            dialog: false,
            selectorValue: "",
            title: "",
            color: "",
            collectionType: ""
        })
        const collection = new Dexie("collection")
        collection.version(1).stores({
            category: "++id, name, color, type"
        })
        collection.table("category").put({
            name: this.state.title,
            color: this.state.selectorValue,
            type: this.state.collectionType
        })
        this.loadCollection();
    }

    loadCollection():void {
        const collection = new Dexie("collection")
        collection.version(1).stores({
            category: "++id, name, color, type"
        })
        collection.table("category").orderBy("id").toArray(data => {
            this.setState({
                collection: data
            })
        })
    }

    render(){
        return(
            <Fragment>
                <Appbar icon="add" function={() => this.dialog(true)} />
                <div id="main">
                    <div id="dashboard-slider">
                        { this.state.collection.map((data: any, index:number) => 
                            <Card title={`${data.name}`} color={`${data.color}`} current={0} max={0} key={index} />
                        ) }
                        { (this.state.collection[0] === undefined) ? 
                            <Fragment>
                                <Card color="red" title="New category" current={1} max={2} guide={true} onClick={() => this.dialog(true)} />
                                <Card color="green" title="Guidance" current={2} max={2} guide={true} />
                            </Fragment> : 
                            <Fragment></Fragment> }
                        <div id="dashboard-end"></div>
                    </div>
                </div>
                <Dialog id="dashboard-dialog" open={this.state.dialog} aria-labelledby="Add new category">
                    <form action="" method="POST" onSubmit={e => this.newCollection(e)}>
                        <DialogTitle id="form-dialog-title">New Category</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="normal"
                                label="Category Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                onChange={e => this.handleTitle(e)}
                                value={this.state.title}
                                style={{marginTop:"20px",marginBottom:"0px"}}
                            />
                            <FormControl style={{width: "100%"}} variant="outlined">
                                <InputLabel htmlFor="Color selection" style={{marginTop:"14px"}}>Color</InputLabel>
                                <Select
                                    style={{marginTop: "15px", color: this.state.color }}

                                    open={this.state.selector}
                                    onOpen={() => this.toggleSelector(true)}
                                    onClose={() => this.toggleSelector(false)}

                                    value={this.state.selectorValue}
                                    onChange={e => this.selectorChange(e)}
                                    fullWidth
                                    required

                                    input={
                                        <OutlinedInput
                                            labelWidth={40}
                                            name="age"
                                        />
                                    }

                                    inputProps={{
                                        name: "color"
                                    }}
                                >
                                    <MenuItem value="red" style={{color: "#e03a3e", fontWeight:"bold"}}>
                                        Red
                                    </MenuItem>
                                    <MenuItem value="green" style={{color: "#61bb46", fontWeight:"bold"}}>
                                        Green
                                    </MenuItem>
                                    <MenuItem value="blue" style={{color: "#007aff", fontWeight:"bold"}}>
                                        Blue
                                    </MenuItem>
                                    <MenuItem value="pink" style={{color: "#ff2d55", fontWeight:"bold"}}>
                                        Pink
                                    </MenuItem>
                                    <MenuItem value="violet" style={{color: "#963d97", fontWeight:"bold"}}>
                                        Violet
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl style={{width: "100%"}} variant="outlined">
                                <InputLabel htmlFor="Type" style={{marginTop:"14px"}}>Type</InputLabel>
                                <Select
                                    style={{marginTop: "15px" }}

                                    open={this.state.typeSelector}
                                    onOpen={() => this.toggleTypeSelector(true)}
                                    onClose={() => this.toggleTypeSelector(false)}

                                    value={this.state.collectionType}
                                    onChange={e => this.typeSelectorChange(e)}
                                    fullWidth
                                    required

                                    input={
                                        <OutlinedInput
                                            labelWidth={35}
                                            name="age"
                                        />
                                    }

                                    inputProps={{
                                        name: "collectionType"
                                    }}
                                >
                                    <MenuItem value="Time-based" disabled>
                                        Time-based
                                    </MenuItem>
                                    <MenuItem value="Todo Lists">
                                        Todo lists
                                    </MenuItem>
                                    <MenuItem value="Schedule" disabled>
                                        Schedule
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={() => this.dialog(false)}>
                                Cancel
                            </Button>
                            <Button color="primary" type="submit">
                                New category
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Fragment>
        )
    }
}