export default (state: any, action: any) => {
    switch(action.type){
        case "toggleDrawer":
            return {
                ...state,
                drawer: action.drawer
            }
        case "updatePath":
            return{
                ...state,
                path : action.path
            }
        case "updateCollection":
            return{
                ...state,
                collection: action.collection
              }
        case "invoke":
              return{
                  ...state
              }
        default:
            return state;
    }
}