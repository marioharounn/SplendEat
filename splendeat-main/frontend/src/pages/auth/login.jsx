import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Paper,
  Typography,
  Container,
  Stack,
  CssBaseline,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Request from '../../service/request';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Navbar from '../../components/navbar';
import { useTheme } from '@mui/material/styles';
import {Link as RouterLink} from "react-router-dom";


const Login = () => {

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();

  const validationSchema = yup.object({
    username: yup
      .string('Brukernavn')
      .test(
        "Bruker eksisterer",
        "Denne brukeren finnes ikke. Har du skrevet inn riktig brukernavn?",
        async (username) => await Request.get(`/user/${username}/exists/`)
      )
      .required('Brukernavn kreves'),
    password: yup
      .string('Passord')
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
        const result = await Request.post('/auth/login/', values);
        navigate("/", { replace: true });
      } catch (res) {
        console.error(res);
        const error = await res.json();
        setError({ title: `HTTP ERROR ${res.status}`, body: `${JSON.stringify(error, null, 2)}` });
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
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Logg inn
              </Typography>
              <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                <div>
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
                </div>
                <div>
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
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  color="primary"
                >
                  Logg inn
                </Button>
              </Box>
              <Box>
                <Link to={'/register'} component={RouterLink} underline="hover">
                  Registrer deg her!
                </Link>
              </Box>
            </Box>
            {error != null && errorComponent(error)}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default Login;