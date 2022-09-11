import React, { useState } from "react";
import {
    Alert,
    AlertTitle,
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Stack,
    IconButton,
  } from '@mui/material';
  import AddIcon from '@mui/icons-material/Add';
  import Request from '../service/request';
  import { useFormik } from 'formik';
  import * as yup from 'yup';
  import Navbar from '../components/navbar';
  import { useTheme } from '@mui/material/styles';
  import { useNavigate } from "react-router-dom";
  import AddIngredientForm from "../components/addIngredientForm";


  const NewRecipepage = () => {

    const [error, setError] = useState(null);

    const theme = useTheme();

    const navigate = useNavigate();

    const validationRecipeSchema = yup.object({
        recipeName: yup
            .string('Navn på oppskrift')
            .min(2, "Minst 2 tegn")
            .max(50, "Maks 50 tegn")
            .required("Brukernavn kreves"),
        description: yup
            .string('Beskrivelse av oppskriften')
            .max(1000, "Maks 1000 tegn"),
        duration: yup
            .number('Tid i minutter')
            .positive()
            .required()
            .integer(),
        portions: yup
            .number('Antall porsjoner')
            .positive()
            .required()
            .integer(),
        instruction: yup  
            .string('Fremgangsmåte')
            .min(10, "Minst 10 tegn")
            .max(5000, "Maks 5000 tegn"),
        picture: yup
            .object()
            .shape({file: yup.mixed()}),
    })

    const recipeFormik = useFormik({
        initialValues: {
            recipeName: '',
            description: '',
            duration: '',
            portions: '',
            instruction: '',
            picture: '',
        },
        validationSchema: validationRecipeSchema,
        onSubmit: async (values) => {
            try {
                const result = await Request.post('/', values);
                navigate('/', {replace: true});
            } catch (res) {
                console.error(res);
                const error = await res.json();
                setError({title: `HTTP ERROR ${res.status}`, body: `${JSON.stringify(error, null, 2)}`});
            }
        }
    })

    const errorComponent = message =>
    <Box sx={{ p: 2 }}>
      <Alert severity="error">
        <AlertTitle>{message.title}</AlertTitle>
        {message.body}
      </Alert>
    </Box>;

    return (
        <Box>
            <Navbar />
            <Box>
                <CssBaseline />
                <Stack direction="column" alignItems="center" justifyContent="center" >
                    <Typography component="h1" variant="h4" mt={5} >
                        Opprett en ny oppskrift!
                    </Typography>
                    <Box 
                    component="form" 
                    onSubmit={recipeFormik.handleSubmit} 
                    sx={{ mt: 1, width: 1000}}>
                        <TextField
                        margin="normal"
                        fullWidth
                        required
                        multiline
                        label="Navn på oppskrift"
                        input="true"
                        type="text"
                        name="recipeName"
                        value={recipeFormik.values.recipeName}
                        onChange={recipeFormik.handleChange}
                        error={recipeFormik.touched.recipeName && Boolean(recipeFormik.errors.recipeName)}
                        helperText={recipeFormik.touched.recipeName && recipeFormik.errors.username}
                        />
                        <br/>
                        <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Tid i minutter"
                        input="true"
                        type="number"
                        name="duration"
                        value={recipeFormik.values.duration}
                        onChange={recipeFormik.handleChange}
                        error={recipeFormik.touched.duration && Boolean(recipeFormik.errors.duration)}
                        helperText={recipeFormik.touched.duration && recipeFormik.errors.duration}
                        />
                        <br/>
                        <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Antall porsjoner"
                        input="true"
                        type="number"
                        name="portions"
                        value={recipeFormik.values.portions}
                        onChange={recipeFormik.handleChange}
                        error={recipeFormik.touched.portions && Boolean(recipeFormik.errors.portions)}
                        helperText={recipeFormik.touched.portions && recipeFormik.errors.portions}
                        />
                        <br/>
                        <TextField
                        margin="normal"
                        fullWidth
                        required
                        multiline
                        rows="4"
                        label="Beskrivelse av oppskrift"
                        input="true"
                        type="text"
                        name="description"
                        value={recipeFormik.values.description}
                        onChange={recipeFormik.handleChange}
                        error={recipeFormik.touched.description && Boolean(recipeFormik.errors.description)}
                        helperText={recipeFormik.touched.description && recipeFormik.errors.description}
                        />
                        <br/>
                        <TextField
                        margin="normal"
                        fullWidth
                        required
                        multiline
                        rows="8"
                        label="Fremgangsmåte"
                        input="true"
                        type="text"
                        name="instruction"
                        value={recipeFormik.values.instruction}
                        onChange={recipeFormik.handleChange}
                        error={recipeFormik.touched.instruction && Boolean(recipeFormik.errors.instruction)}
                        helperText={recipeFormik.touched.instruction && recipeFormik.errors.instruction}
                        /> 
                        </Box> 
                        <br/>
                        <Button variant="contained">
                            Last opp bilde!
                        </Button>
                        <br/>
                        <Stack direction="row" alignItems="center" justifyContent="center">
                            <Typography component="h2" variant="h6" align="center">
                                Ingredienser
                            </Typography>
                            <IconButton aria-label="add" variant="contained" color="primary">
                                <AddIcon />
                            </IconButton>
                        </Stack>
                        <AddIngredientForm/>
                        <AddIngredientForm/>
                        <AddIngredientForm/>
                    <br/>
                    <Button variant="contained">
                        Publiser!
                    </Button>
                    <br/>
                </Stack>
            </Box>
        </Box>
    );

  };

  export default NewRecipepage;