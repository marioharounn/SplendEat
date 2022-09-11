import React, { useEffect, useState, Dispatch } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  Grid,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
  TextField,
} from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import { useParams, useNavigate, Outlet } from "react-router-dom";
import RecipeModel from '../models/recipeModel';
import Navbar from '../components/navbar';
import Request from '../service/request';
import { pink } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';


const RecipeDetails = props => {
  /** @type [RecipeModel?, Dispatch<RecipeModel?>] */
  const [recipe, setRecipe] = useState(props?.recipe || null);

  const [comment, setComment] = useState("");

  const params = useParams();

  const navigate = useNavigate();

  const theme = useTheme();

  const toggleHeart = async (_) => {
    if (recipe.is_favourited == undefined) {
      navigate("/login");
    }
    else {
      await Request.get(`/recipes/${recipe.id}/toggle_favourite/`);
      window.location.reload();
    }
  }

  const getRecipe = async () => {
    if (params.recipe == null && params.recipeID != null) {
      const res = await fetch(`http://localhost:8000/api/recipes/${params.recipeID}/`);
      const json = await res.json()
      setRecipe(RecipeModel.fromJson(json));
    }
  };

  const onPublishComment = async (_) => {
    await Request.post(`/comments/`, { 'recipeID': recipe.id, 'comment': comment });
    window.location.reload();
  }


  useEffect(() => getRecipe(), []);

  if (recipe == null) {
    return <Box>
      <Navbar />
      <Box className="center">
        <CircularProgress />
      </Box>
    </Box>
  }

  const listIngredients = recipe.ingredients.map((d) => <li key={d.name + d.amount + d.unit}>{d.name}:  {parseInt(d.amount)} {d.unit}</li>);

  const listComments = recipe.comments.map((c) =>
    <Paper key={c.id} sx={{
      backgroundColor: theme.palette.divider,
      w: '30%',
      p: '10',
      m: '10',
      overflow: 'hidden',
      overflowWrap: 'break-word'
    }}>
      <Box sx={{ mb: '10' }}>
        <Typography variant='h6'>{c.author.username}</Typography>
        <Typography variant='caption'>{c.created_on.toLocaleDateString()}</Typography>
      </Box>
      <Typography variant='body1' >
        {c.body}
      </Typography>
    </Paper>);

  return (
    <Box>
      <Navbar />
      <Box style={{ position: "relative" }}>
        <CssBaseline />
        <Typography
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textShadow: "black 5px 5px 10px",
          }}
          variant="h1"
          color="white"
        >
          {recipe.name}
        </Typography>
        <Box
          component='img'
          width='100%'
          height='50vh'
          overflow='hidden'
          src={recipe.recipe_image}
          style={{ objectFit: 'cover' }}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ m: 2 }}>
        <Chip icon={<CalendarTodayIcon />} label={recipe.publish_date.toDateString()} />
        <Chip icon={<ModeEditIcon />} label={recipe.last_modified.toDateString()} />
        <Chip icon={<RestaurantIcon />} label={recipe.portions} />
        <Chip icon={<AccessTimeIcon />} label={recipe.duration} />
        {
          recipe.categories.map((s, i) =>
            <Grid item key={i}>
              <Chip label={s} color="primary" />
            </Grid>
          )
        }
        <Rating
          name="read-only"
          value={recipe.rating}
          onChange={(_, newValue) =>
            Request.post(`/recipes/${recipe.id}/rate/`, { 'rating': newValue })
              .then(_ => getRecipe())
          }
        />
        <IconButton aria-label="add to favorites" onClick={toggleHeart}>
          <FavoriteIcon sx={{ color: (recipe.is_favourited || false) ? pink[300] : null }} />
        </IconButton>
      </Stack>
      <Stack>

      </Stack>

      <Grid container spacing={1} justifyContent="space-evenly">
        <Grid item xs={3}>
          <Typography variant="h4" mt={3} mb={3}>
            Ingredienser
          </Typography>
          <Typography variant='body1' mt={3}>
            {listIngredients}
          </Typography>
        </Grid>
        <Grid item xs={7} marginBottom="50px">
          <Box>
            <Typography variant="h5" mt={3}>
              {recipe.description}
            </Typography>
            <Typography variant="h4" mt={3} mb={3}>
              Fremgangsmåte
            </Typography>
            <Typography variant="body1" >
              {recipe.instruction}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} justifyContent="center" mb="20px">
          <Box style={{ margin: "0 auto", width: "75%", height: "auto" }}>
            <Typography variant="h4" >
              Kommentarer:
            </Typography>
            <Paper>
              <Box style={{ margin: "10px 10px 30px" }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                {/* <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> */}
                <TextField id="input-with-sx" label="Legg til en kommentar" variant="standard" onInput={(e) => setComment(e.target.value)} />
                <Button variant="contained" color="primary" style={{ marginLeft: "10px" }} onClick={onPublishComment}>
                  Publiser
                </Button>
              </Box>
              <Box>
                {listComments}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ height: '25%' }} />
      <Outlet />
    </Box>
  );
}



export default RecipeDetails;
