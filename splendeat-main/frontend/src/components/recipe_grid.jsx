import React from 'react';
import {
  CircularProgress,
  Grid,
} 
from '@mui/material';
import Recipe from './recipe';

const RecipeGrid = props => {

    const recipeList = props.recipes?.map((recipe) =>
        <Grid item key={recipe.name}>
            <Recipe recipe={recipe} />
        </Grid>
    );

    return (
    <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        rowSpacing={5}
        columnSpacing={5}
        padding={5}
      >
        { recipeList != undefined
          ? recipeList
          : <Grid item><CircularProgress/></Grid>
        }
      </Grid>
    );
};


export default RecipeGrid;
