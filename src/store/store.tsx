import { createStore } from "redux"
import reducers from "./reducers"

const initState: any = {
    drawer: false,
    path: "",
    collection: [],
    blur: 0
}, store = createStore(reducers, initState);

export default store;