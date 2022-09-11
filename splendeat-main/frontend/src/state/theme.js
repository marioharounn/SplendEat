const initialState = true;

function themeReducer(state = initialState, action) {
  if (action.type == 'theme/toggle_dark_mode') {
    state = ! state;
  }
  return state;
}

export default themeReducer;