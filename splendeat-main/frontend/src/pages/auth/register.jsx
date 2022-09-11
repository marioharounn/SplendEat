import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Paper,
  Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Request from '../../service/request';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Navbar from '../../components/navbar';
import { useTheme } from '@mui/material/styles';
import {Link as RouterLink} from "react-router-dom";

const Register = () => {

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const theme  = useTheme();

  const validationSchema = yup.object({
    username: yup
      .string('Brukernavn')
      .min(2, "Minst 2 tegn")
      .max(30, "Maks 30 tegn")
      .test(
        "Unikt brukernavn",
        "Dette brukernavnet har allerede blitt tatt. Prøv et annet",
        async (username) => !(await Request.get(`/user/${username}/exists/`))
      )
      .required('Brukernavn kreves'),
    password: yup
      .string('Passord')
      .min(8, 'Passordet må ha minst 8 tegn')
      .max(200, 'Passordet kan maks ha 200 tegn')
      .required('Passord kreves'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await Request.post('/auth/register/', values);
        navigate("/", { replace: true });
      } catch (res) {
        console.error(res);
        const error = await res.json();
        setError({title: `HTTP ERROR ${res.status}`, body: `${JSON.stringify(error, null, 2)}`});
      }
    }
  });

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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Stack alignItems="center" justifyContent="center" height={"75%"}>
          <Paper 
            sx={{
              borderRadius: theme.shape.borderRadius,
              p: 5,
            }}
            component="main"
          >
            <Box
              sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }} >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Registrer bruker
              </Typography>
              <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Brukernavn"
                  input="true"
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  color="primary"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Passord"
                  input="true"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  color="primary"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  color="primary"
                >
                  Registrer bruker
                </Button>
              </Box>
              <Box>
              <Link to={'/login'} component={RouterLink} underline="hover">
                Logg inn her!
              </Link>
              </Box>
            </Box>
            
            {error != null && errorComponent(error)}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Register;