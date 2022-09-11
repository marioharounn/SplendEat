import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Typography,
} from '@mui/material';
import Navbar from '../components/navbar';
import SearchBar from '../components/search_bar';
import RecipeGrid from '../components/recipe_grid';
import UserModel from '../models/userModel';

const Favoritepage = props => {
    const [user, setUser] = useState(null);
    
    useEffect(async () => {
      const response = await fetch('http://localhost:8000/api/user/me/');
      if (response.ok) {
        const json = await response.json();
        const newUser = UserModel.fromJson(json);
        newUser.favorites.forEach(r => r.is_favourited = true);
        setUser(newUser);
      }
      else if (response.status==403) {
        setUser(false)
      }
    }, []);

    if (user == null) {
      return <div className='center'>
        <CircularProgress />
      </div>;
    } else if (user == false) {
      window.location.assign("/login")
    }
  
    return (
      <div>
        <Navbar left_side={ <SearchBar /> } />
        <Typography 
          variant="h4"
          mt={5} 
          align="center"
          color="textPrimary"
        >
          Mine favoritter
        </Typography>
        <RecipeGrid recipes={user.favorites}/>;
      </div>
    );


}


export default Favoritepage