import React, { useState, useEffect } from 'react';
import {
  Box,
  Fab,
  Link,
} from '@mui/material';
import RecipeModel from '../models/recipeModel';
import Navbar from '../components/navbar';
import FilterButton, { NO_FILTER_VALUE } from '../components/filter_button';
import SearchBar from '../components/search_bar';
import RecipeGrid from '../components/recipe_grid';
import AddIcon from '@mui/icons-material/Add';
import {Link as RouterLink} from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Homepage = props => {
  /** @type [RecipeModel?, Dispatch<RecipeModel?>] */
  const [recipes, setRecipes] = useState(null);

  /** @type [string[]?, Dispatch<string[]?>] */
  const [categories, setCategories] = useState(null);

  /** @type [EventTarget?, Dispatch<EventTarget?>] */
  const [filterAnchor, setFilterAnchor] = useState(null);

  /** @type [EventTarget?, Dispatch<EventTarget?>] */
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);


  const navigate = useNavigate();

  useEffect(async () => {
    const response = await fetch('http://localhost:8000/api/recipes/');
    const json = await response.json();
    const newRecipes = json.map((recipe) => RecipeModel.fromJson(recipe));
    setRecipes(newRecipes);
  }, []);

  useEffect(async () => {
    const response = await fetch('http://localhost:8000/api/categories/');
    const newCategories = await response.json();
    setCategories(newCategories);
  }, []);

  const onFilter = async (category) => {
    const response = (category == NO_FILTER_VALUE)
      ? await fetch(`http://localhost:8000/api/recipes/`)
      : await fetch(`http://localhost:8000/api/categories/${category}/recipes/`);

    const json = await response.json();
    const newRecipes = json.map(recipe => RecipeModel.fromJson(recipe));
    setRecipes(newRecipes);
  }

  return (
    <Box>
      <Navbar
        profileMenuAnchor={profileMenuAnchor}
        setProfileMenuAnchor={setProfileMenuAnchor}
        left_side={ <SearchBar /> }
        right_side={
          <FilterButton
            anchorEl={filterAnchor}
            filters={categories?.map(c => c.name) || []}
            onFilter={c => { onFilter(c); setFilterAnchor(null); }}
            openMenu={event => setFilterAnchor(event.currentTarget)}
            closeMenu={() => setFilterAnchor(null)}
          />
        }
      />
      <RecipeGrid recipes={recipes}/>
      {/* <Link to={'/publishRecipe'} component={RouterLink}> 
        <Fab color="primary" aria-label="add" style={
          {margin: 0, 
          right: 50,
          bottom: 50,
          position: 'fixed',
          height: 80,
          width: 80,
          }}
          onClick={() => {
            navigate('/publishRecipe');
          }}>
          <AddIcon  style={{height: 30, width: 30}}/>
        </Fab>
      </Link> */}
    </Box>
  );
}

export default Homepage;