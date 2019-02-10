import { createStore } from "redux"
import reducers from "./reducers"

const initState: any = {
    drawer: false,
    path: ""
}, store = createStore(reducers, initState);

export default store;