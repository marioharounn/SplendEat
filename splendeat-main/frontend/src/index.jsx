import React, {useEffect} from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Homepage from './pages/homepage'
import Login from './pages/auth/login';
import RecipeDetails from './pages/recipeDetails';
import Page404 from './pages/404';
import Register from './pages/auth/register';
import NewRecipepage from './pages/newRecipepage';
import './style/style.css';
import Favoritepage from './pages/favoritepage';
import mainReducer from './state/main';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import UserModel from './models/userModel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { green } from '@mui/material/colors'; 

let root = document.getElementById('django-root');
if (root == null) { root = document.getElementById('root'); }

const store = createStore(
  mainReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const MainComponent = props => {
  const themeIsDark = useSelector(state => state.themeIsDark);
  const dispatch = useDispatch();

  useEffect(async () => {
    const response = await fetch('http://localhost:8000/api/user/me/');
    if (response.ok) {
      const json = await response.json();
      const newUser = UserModel.fromJson(json);
      dispatch({
        type: "user/set",
        user: newUser,
      })
    }
    else {
      dispatch({
        type: "user/delete",
      })
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: themeIsDark ? "dark" : "light",
      primary: green,
      background: {
        ...(!themeIsDark && {
          default: '#F7EDDC',
          paper: '#FFFFFF'
        }),
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100%',
        backgroundColor: theme.palette.background.default,
        }}>
      <BrowserRouter>
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        /> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipe/:recipeID" element={<RecipeDetails/>} />
          <Route path="/favorites" element={<Favoritepage/>} />
          <Route path="/404" element={<Page404 />}/>
          <Route path="*" element={<Navigate replace to="/404"/>} />
          <Route path="/publishRecipe" element= {<NewRecipepage/>} />
        </Routes>
      </BrowserRouter>
      </Box>
    </ThemeProvider>
  )
}

render(<Provider store={store}> <MainComponent/> </Provider>, root);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

reportWebVitals();
