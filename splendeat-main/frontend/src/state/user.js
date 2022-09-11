const initialState = null;

function userReducer(state = initialState, action) {
    console.log(`start state: ${state}`);

    if (action.type === "user/set") {
        state = action.user;
    }
    else if (action.type === "user/delete") {
        state = initialState;
    }
    console.log(`new state: ${state}, ${action.type}`);
    return state; 
}

export default userReducer;