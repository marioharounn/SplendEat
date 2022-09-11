import React, { useState } from "react";
import {
    Alert,
    AlertTitle,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    Stack,
  } from '@mui/material';
  import Request from '../service/request';
  import { useFormik } from 'formik';
  import * as yup from 'yup';
  import { useTheme } from '@mui/material/styles';
  import { useNavigate } from "react-router-dom";
  
  const AddIngredientForm = () => {

    const [error, setError] = useState(null);

    const theme = useTheme();

    const navigate = useNavigate();

    const validationIngredientSchema = yup.object({
        ingredientName: yup
        .string('Ingrediensnavn')
        .min(2, "Minst 2 tegn")
        .max(20, "Maks 20 tegn")
        .required(),
        amount: yup
        .number('Mengde')
        .positive()
        .required(),
        unit: yup
        .string('Enhet')
        .required(),
    })

    const ingredientFormik = useFormik({
        initialValues: {
            ingredientName: '',
            amount: '',
            unit: '',
        },
        validationSchema: validationIngredientSchema,
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

    return (
        <Stack direction="row" alignItems="center" justifyContent="center">
            <TextField
            margin="normal"
            required
            multiline
            label="Navn på ingrediens"
            input="true"
            type="text"
            name="ingredientName"
            value={ingredientFormik.values.instruction}
            onChange={ingredientFormik.handleChange}
            error={ingredientFormik.touched.ingredientName && Boolean(ingredientFormik.errors.ingredientName)}
            helperText={ingredientFormik.touched.ingredientName && ingredientFormik.errors.ingredientName}
            /> 
            <TextField
            margin="normal"
            required
            label="Mengde"
            input="true"
            type="number"
            name="amount"
            value={ingredientFormik.values.amount}
            onChange={ingredientFormik.handleChange}
            error={ingredientFormik.touched.amount && Boolean(ingredientFormik.errors.amount)}
            helperText={ingredientFormik.touched.amount && ingredientFormik.errors.amount}
            /> 
            <TextField
            margin="normal"
            required
            label="Enhet"
            input="true"
            type="text"
            name="unit"
            value={ingredientFormik.values.unit}
            onChange={ingredientFormik.handleChange}
            error={ingredientFormik.touched.unit && Boolean(ingredientFormik.errors.unit)}
            helperText={ingredientFormik.touched.unit && ingredientFormik.errors.unit}
            /> 
        </Stack>
    );

  };

export default AddIngredientForm

