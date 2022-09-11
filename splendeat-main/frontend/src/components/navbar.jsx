import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import UserModel from '../models/userModel';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';
import Request from '../service/request';

export const USER_MENU_ID = 'primary-search-account-menu';
const UserMenu = props => {
  const navigate = useNavigate();

  const user = props.user;

  const logout = async () => {
    await fetch('http://localhost:8000/api/auth/logout/');
    window.location.reload();
  }

  const login = () => navigate("/login");

  return (
    <Menu
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={USER_MENU_ID}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={props.anchorEl != null}
      onClose={props.closeMenu}
    >
      {/* <MenuItem onClick={closeMenu}>Profile</MenuItem> */}
      {
        (user?.is_staff || false) && <MenuItem onClick={(_) => window.location.assign("/admin/")}>Admin panel</MenuItem>
      }
      {(user == null)
        ? <MenuItem onClick={(_) => login()}>Login</MenuItem>
        : <MenuItem onClick={(_) => logout()}>Logout</MenuItem>
      }
    </Menu>
  );
};

const HamburgerMenu = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const user = props.user;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /****** Menu Items ******/

  const favourites = <MenuItem
    onClick={() => {
      handleClose();
      navigate('/favorites');
    }}
  >
    Mine favoritter
  </MenuItem>;

  const posts = <MenuItem
    onClick={() => {
      handleClose();
      navigate('/404');
    }}
  >
    Mine innlegg
  </MenuItem>;

  return (
    <Box>
      <IconButton
        size="large"
        edge="start"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => navigate('/')}>Hovedside</MenuItem>
        {user != null && favourites}
        {user != null && posts}
      </Menu>
    </Box>
  );
}

const Navbar = props => {
  let [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  if (props.hasOwnProperty('profileMenuAnchor') && props.hasOwnProperty('setProfileMenuAnchor')) {
    [profileMenuAnchor, setProfileMenuAnchor] = [props.profileMenuAnchor, props.setProfileMenuAnchor];
  }

  const dispatch = useDispatch();
  const theme = useTheme();

  const closeProfileMenu = () => setProfileMenuAnchor(null);
  const openProfileMenu = event => setProfileMenuAnchor(event.currentTarget);


  const [user, setUser] = useState(null);

  useEffect(async () => {
    const response = await fetch('http://localhost:8000/api/user/me/');
    if (response.ok) {
      const json = await response.json();
      const newUser = UserModel.fromJson(json);
      setUser(newUser);
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" enableColorOnDark={true}>
        <Toolbar>

          {/*************/}
          {/* Left Side */}
          {/*************/}

          <HamburgerMenu user={user} />

          <Link to="/" component={RouterLink} underline="hover">
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: theme.palette.text.primary
              }}
            >
              SplendEat
            </Typography>
          </Link>

          {props.left_side || <span></span>}

          {/**********/}
          {/* Middle */}
          {/**********/}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            {/**************/}
            {/* Right Side */}
            {/**************/}

            {props.right_side || <span></span>}

            <IconButton
              size="large"
              edge="end"
              onClick={_ => dispatch({ type: 'theme/toggle_dark_mode' })}
            >
              <DarkModeIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={USER_MENU_ID}
              aria-haspopup="true"
              onClick={openProfileMenu}
            >
              {(user != null)
                ? <Typography variant="h6">{user.username}</Typography>
                : <AccountCircle />
              }
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <UserMenu user={user} anchorEl={profileMenuAnchor} closeMenu={closeProfileMenu} />
    </Box>
  );
}

export default Navbar;