/* React */
import React, { Component, Fragment } from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"

/* Store */
import store from "../store/store"
import Dexie from "dexie"

/* Material UI */
import { 
    Fab,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    Button,
    Dialog,
    TextField,
    IconButton
} from "@material-ui/core"

/* Component */
import Error from "../react-component/error"

/* Local */
import "../css/collection.css"

/* Side Component */
interface sideProps {
    color: string,
    collection: string,
    type: string,
    progress: any,
    current: string
}

class CollectionLanding extends Component<sideProps, {}> {
    constructor(props: sideProps){
        super(props);
    }

    render(){
        let progress = this.props.progress.min / this.props.progress.max * 100
        return(
            <Fragment>
                <h1 id="collection-name">{this.props.collection}</h1>
                <p id="collection-type">{this.props.type}</p>
                <div id="collection-landing">
                    <div id="type-icon">
                        <span className={`material-icons collection-${this.props.color}`}>playlist_add_check</span>
                    </div>
                    <div id="collection-progress-wrapper">
                        <div id="collection-title-wrapper">
                            <p className={`collection-title collection-${this.props.color}`}>
                            {this.props.current ?
                            <>{this.props.current}</>
                            :
                            <>No todo left</>
                            }
                            </p>
                            <p className={`collection-title collection-${this.props.color}`}>
                                {this.props.progress.min}/{this.props.progress.max}
                            </p>
                        </div>
                        <div id="collection-progress-bar">
                            <div 
                                id="collection-progress" 
                                className={`collection-gradient-${this.props.color}`}
                                style={{width: `${progress}%`}}
                            ></div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

interface collectionProps {
    name: string,
    color: string,
    collection: string,
    check: boolean,
    edit: boolean,
    reloadFunction: any,
    uid: number
}

interface collectionState {
    check: boolean
}

/* Collection Component */
class CollectionList extends Component<collectionProps, collectionState> {
    constructor(props: collectionProps){
        super(props);
        this.state = {
            check: this.props.check
        }
    }

    toggle = async () => {
        const document = new Dexie("document");
        document.version(1).stores({
            todo: "++id, objective, check, category"
        });

        document.table("todo").where({id: this.props.uid}).modify({
            check: !this.state.check
        }).then(() => {
            store.dispatch({
                type: "invoke"
            })
            this.setState({
                check: !this.state.check
            })
        })
    }
    
    render(){
        if(this.props.edit){
            return(
                <ListItem 
                    button 
                    divider
                    onClick={() => this.toggle()}
                >
                    <span className="collection-red material-icons" style={{marginRight: "10px"}} onClick={() => this.props.reloadFunction(this.props.uid)}>
                        remove_circle
                    </span>
                    {this.state.check ?
                        <Fragment>
                            <Checkbox
                                checked={this.state.check}
                                color="primary"
                                className={`collection-check-${this.props.color}`}
                            />
                            <ListItemText className="strike-through" primary={this.props.name} />
                        </Fragment>
                        :
                        <Fragment>
                            <Checkbox
                                checked={this.state.check}
                                color="primary"
                            />
                            <ListItemText primary={this.props.name} />
                        </Fragment>
                    }
                </ListItem>
            )
        } else {
            return(
                <ListItem 
                    button 
                    divider
                    onClick={() => this.toggle()}
                >
                    {this.state.check ?
                        <Fragment>
                            <Checkbox
                                checked={this.state.check}
                                color="primary"
                                className={`collection-check-${this.props.color}`}
                            />
                            <ListItemText className="strike-through" primary={this.props.name} />
                        </Fragment>
                        :
                        <Fragment>
                            <Checkbox
                                checked={this.state.check}
                                color="primary"
                            />
                            <ListItemText primary={this.props.name} />
                        </Fragment>
                    }
                </ListItem>
            )
        }
    }
}

/* Main Component */
interface props extends RouteComponentProps {}

interface state {
    collection: string,
    color: string,
    type: string,
    check: boolean,
    dialog: boolean,
    objective: string,
    documentData: any,
    edit: boolean,
    progress: any,
    blur: number,
    current: string
}

class Collection extends Component<props, state> {
    constructor(props: props){
        super(props);
        this.state = {
            collection: store.getState().collection,
            color: "",
            type: "",
            check: false,
            dialog: false,
            objective: "",
            documentData: [],
            edit: false,
            progress: {
                min: 0,
                max: 0
            },
            blur: 0,
            current: ""
        }
    }

    componentWillMount(){
        if(this.state.collection === undefined) return;
        const collection = new Dexie("collection");
        collection.version(1).stores({
            category: "++id, name, color"
        });
        collection.table("category").where({name: this.state.collection}).toArray(data => {
            if(data[0] === undefined) return;
            this.setState({
                color: data[0].color,
                type: data[0].type
            })
        })
        this.loadDocument();
    }

    componentDidMount(){
        store.subscribe(async () => {
            if(this.state.collection !== undefined){
                const document = new Dexie("document");
                await document.version(1).stores({
                    todo: "++id, objective, check, category"
                });
                document.table("todo").where({
                    "category": this.state.collection
                }).toArray(async arr => {
                    let iter:number = 0;
                    this.setState({
                        current: ""
                    })
                    await arr.map((data, index) => {
                        if(this.state.current === "" && data.check === false){
                            this.setState({
                                current: data.objective
                            })
                        }
                        if(data.check === true) return ++iter
                    })
                    this.setState({
                        progress:{
                            min: iter,
                            max: arr.length
                        }
                    })
                })
            }
            let state:any = store.getState();
            if(this.state.blur === state.blur) return;
            let blur:number = 0
            if(state.drawer) blur = 5;
            if(state.blur) blur = state.blur;
            this.setState({
                blur: blur
            })
        })
    }

    loadDocument = async () => {
        if(this.state.collection === undefined) return;

        const document = new Dexie("document");
        document.version(1).stores({
            todo: "++id, objective, check, category"
        });

        document.table("todo").where({"category": this.state.collection}).toArray(async arr => {
            await this.setState({
                documentData: [],
                current: ""
            })
            if(arr[0] === undefined) return;

            let iter:number = 0;
            await arr.map((data, index) => {
                if(this.state.current === "" && data.check == false){
                    this.setState({
                        current: data.objective
                    })
                }
                this.setState(prevState => ({
                    documentData: [...prevState.documentData, data]
                }))
                if(data.check === true) return ++iter
            })
            this.setState({
                progress: {
                    min: iter,
                    max: arr.length
                }
            })
        })
    }

    toggleEdit = (): void => {
        this.setState({
            edit: !this.state.edit
        })
    }

    dialog = (bool: boolean): void => {
        this.setState({
            dialog: bool
        })
    }

    handleObjective = (event:any): void => {
        this.setState({
            objective: event.target.value
        })
    }

    addNewObjective = async (e: any) => {
        e.preventDefault();

        this.setState({
            objective: ""
        })

        const document = new Dexie("document");
        document.version(1).stores({
            todo: "++id, objective, check, category"
        });

        await document.table("todo").add({
            objective: this.state.objective,
            category: this.state.collection,
            check: false,
        })
        this.loadDocument();
        this.dialog(false);
    }

    delete = async(param:number) => {
        const document = new Dexie("document");
        document.version(1).stores({
            todo: "++id, objective, check, category"
        });

        await document.table("todo").where({
            category: this.state.collection,
            id: param
        }).delete();
        this.loadDocument();
    }

    render(){
        if(this.state.collection === undefined){
            return <Error />
        } else if(this.props.history.action === "POP"){
            return <Error />
        } else if(this.state.color === "") {
            return null;
        } else {
            return(
                <Fragment>
                    <div id="appbar" style={{filter: `blur(${this.state.blur}px)`}}>
                        <div>
                            <IconButton onClick={() => this.props.history.goBack()}>
                                <span className={`material-icons collection-${this.state.color}`}>arrow_back</span>
                            </IconButton>
                        </div>
                        <div></div>
                        <div>
                            <Button onClick={() => this.toggleEdit()} className={`collection-${this.state.color}`}>
                                <span className={`collection-${this.state.color}`}>
                                    Edit
                                </span>
                            </Button>
                        </div>
                    </div>

                    <Fab 
                        id="fab" 
                        color="primary" 
                        className={`collection-background-${this.state.color}`}
                        onClick={() => this.dialog(true)}
                        style={{filter: `blur(${this.state.blur}px)`}}
                    >
                        <span className="material-icons" style={{color: "white"}}>add</span>
                    </Fab>
                    <Dialog
                        fullScreen
                        open={this.state.dialog}
                        onClose={() => this.dialog(true)}
                        aria-labelledby="form-dialog-title"
                    >
                        <div id="collection-appbar" style={{filter: `blur(${this.state.blur}px)`}}>
                            <div>
                                <IconButton onClick={() => this.dialog(false)}>
                                    <span className={`material-icons collection-${this.state.color}`}>
                                        close
                                    </span>
                                </IconButton>
                            </div>
                            <div className={`collection-${this.state.color}`}>{this.state.collection}</div>
                            <div></div>
                        </div>
                        <form 
                            id="collection-create-container" 
                            action="" 
                            method="POST"
                            onSubmit={e => this.addNewObjective(e)}
                            style={{filter: `blur(${this.state.blur}px)`}}
                        >
                            <TextField
                                autoFocus
                                margin="normal"
                                label="What are you planning to do?"
                                type="text"
                                fullWidth
                                onChange={e => this.handleObjective(e)}
                                value={this.state.objective}
                                className={`collection-textfield-${this.state.color}`}
                            />
                            <Button 
                                color="primary" 
                                variant="contained" 
                                className={`collection-gradient-${this.state.color}`}
                                fullWidth
                                size="large"
                                style={{marginTop: "15px"}}
                                type="submit"
                            >
                                Add plan
                            </Button>
                        </form>
                    </Dialog>
                    <div id="collection" style={{filter: `blur(${this.state.blur}px)`}}>
                        <CollectionLanding
                            color={this.state.color} 
                            collection={this.state.collection} 
                            type={this.state.type}
                            progress={this.state.progress}
                            current={this.state.current}
                        />
                        <List id="collection-list">
                            {this.state.documentData.map((data: any, index: number) => 
                                <CollectionList 
                                    key={index}
                                    uid={data.id}
                                    name={data.objective} 
                                    check={data.check} 
                                    color={this.state.color} 
                                    collection={this.state.collection} 
                                    edit={this.state.edit}
                                    reloadFunction={(param:any) => this.delete(param)}
                                />
                            )}
                            {this.state.documentData[0] === undefined ? 
                                <p id="collection-info">There's no plan left</p> 
                                : null
                            }
                        </List>
                    </div>
                </Fragment>
            )
        }
    }
}

export default withRouter<props>(Collection);