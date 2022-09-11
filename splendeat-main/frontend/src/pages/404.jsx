import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Navbar from "../components/navbar";
import { RecipeModel } from "../models";
import Recipe from "../components/recipe";

const Page404 = props => {
  /** @type [RecipeModel?, Dispatch<RecipeModel?>] */
  const [recipe, setRecipe] = useState(null);

  useEffect(async () => {
    const response = await fetch('http://localhost:8000/api/recipes/random/');
    const json = await response.json();
    const newRecipe = RecipeModel.fromJson(json);
    setRecipe(newRecipe);
  }, []);

  return <Box>
    <Navbar />
    <Stack spacing={1} alignItems="center" justifyContent="center" minHeight="75%">
      <Typography variant='h1' color="textPrimary">4🍊4</Typography>
      <Typography variant='h5' color="textPrimary">Her var det visst tomt...</Typography>
      <Typography variant='h5' color="textPrimary">Sjekk ut denne oppskriften kanskje?</Typography>
      <br/>
      {recipe == null
        ? <CircularProgress />
        : <Recipe recipe={recipe}/>
      }
    </Stack>
  </Box>
}

export default Page404;