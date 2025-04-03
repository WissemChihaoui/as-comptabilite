import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function FileManagerFilters({
  filters,
  onResetPage,
}) {


  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );



  const renderFilterName = (
    <TextField
      value={filters.state.name}
      onChange={handleFilterName}
      placeholder="Rechercher..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{ width: { xs: 1, md: 260 } }}
    />
  );

  

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1 }}
    >
      {renderFilterName}

    </Stack>
  );
}
