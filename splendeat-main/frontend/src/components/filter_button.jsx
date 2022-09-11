import React from 'react';
import {
  Menu,
  Radio,
  FormControlLabel,
  CircularProgress,
  RadioGroup,
  IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export const NO_FILTER_VALUE = 'NONE';

export const FILTER_BUTTON_ID = 'primary-search-filter-menu';

const FilterMenu = props => { 
  const {anchorEl, closeMenu, filters, onFilter} = props;

  if (filters == null) {
    return <div className='center'>
      <CircularProgress />
    </div>;
  }

  const radioButton = (value, label) =>
    <FormControlLabel
      sx={{ marginLeft: 1, marginRight: 3}}
      value={value}
      control={<Radio />}
      label={label}
      key={value}
    />;

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={FILTER_BUTTON_ID}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={anchorEl != null}
      onClose={closeMenu}
    >
      <RadioGroup
        onChange = {event => onFilter(event.target.value)}
        defaultValue={NO_FILTER_VALUE}
      >
        { radioButton(NO_FILTER_VALUE, "(No filter)") }
        { filters.map(c => radioButton(c,c)) }
      </RadioGroup>
    </Menu>
  );
}

const FilterButton = props => {
  const {openMenu} = props;

  return (
    <div>
      <IconButton 
        size="large" 
        aria-controls={FILTER_BUTTON_ID}
        aria-haspopup="true"
        onClick={openMenu}
      >
        <FilterListIcon /> 
      </IconButton>
      <FilterMenu {...props}/>
    </div>
  );
}

export default FilterButton;