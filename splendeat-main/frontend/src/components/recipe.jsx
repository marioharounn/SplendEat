import React from "react";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useTheme } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Request from "../service/request";
import { pink } from '@mui/material/colors';

const Recipe = props => {

  /** @type {RecipeModel} */
  const recipe = props.recipe;

  const theme = useTheme();

  const navigate = useNavigate();

  const toggleHeart = async (_) => {
    if (recipe.is_favourited == undefined) {
      navigate("/login");
    } else {
      await Request.get(`/recipes/${recipe.id}/toggle_favourite/`);
      window.location.reload();
    }
  }

  return (
    <Card
      sx={{
        width: 345,
        '&:hover': {
          backgroundColor: theme.palette.divider,
        }
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: theme.palette.divider,
              color: theme.palette.text.primary
            }}
            aria-label="author avatar"
          >
            {recipe.author?.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Link to={`/recipe/${recipe.id}`} component={RouterLink} underline="hover">
            <Typography color="textPrimary" variant='h5' gutterBottom={true}>{recipe.name}</Typography>
          </Link>
        }
        subheader={
          <Grid container direction="row" spacing={1}>
            <Grid item><Chip label={recipe.last_modified.toDateString()} /></Grid>
            <Grid item><Chip icon={<RestaurantIcon />} label={recipe.portions} /></Grid>
            <Grid item><Chip icon={<AccessTimeIcon />} label={recipe.duration} /></Grid>
          </Grid>
        }
        action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
      />
      <Link to={`/recipe/${recipe.id}`} component={RouterLink} underline="hover">
        <CardMedia
          component="img"
          height="194"
          image={recipe.recipe_image}
          alt= {"Bilde av " + recipe.name}
        />
      </Link>
      <CardContent>
        <Grid container direction="row" spacing={1}>
          {
          recipe.categories.map((s) => 
            <Grid item key={`${recipe.id}-${s}`}>
              <Chip label={s} color="primary"/>
            </Grid>
          )
          }
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={toggleHeart}>
          <FavoriteIcon sx={{ color: (recipe.is_favourited || false) ? pink[300] : null }}/>
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>


  );
}

export default Recipe;