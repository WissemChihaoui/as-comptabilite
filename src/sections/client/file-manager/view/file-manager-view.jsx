import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { FILE_TYPE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { fileFormat } from 'src/components/file-thumbnail';
import { EmptyContent } from 'src/components/empty-content';
import { useTable, rowInPage, getComparator } from 'src/components/table';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { FileManagerTable } from '../file-manager-table';
import { FileManagerFilters } from '../file-manager-filters';
import { FileManagerFiltersResult } from '../file-manager-filters-result';
import { FileManagerGridView } from '../file-manager-grid-view';

// ----------------------------------------------------------------------

export function FileManagerView({ folders }) {
  const table = useTable({ defaultRowsPerPage: 10 });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(folders);

  const filters = useSetState({
    name: '',
    type: [],
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.type.length > 0 ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteItem = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      totalResults={dataFiltered.length}
      onResetPage={table.onResetPage}
    />
  );

  return (
    <>
      <Stack spacing={2.5} >
        {canReset && renderResults}
      </Stack>
      <Typography mb={2} variant="h6">Information générale</Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>Date de déménagement</InputLabel>
          <DatePicker sx={{ width: '100%'}}/>
        </Grid>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>Résidence actuelle</InputLabel>
          <TextField fullWidth/>
        </Grid>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>Situation familiale</InputLabel>
          <Select fullWidth>
            <MenuItem value="Célébataire">Célébataire</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Stack py={2} alignItems="flex-end">
        <Button variant='contained' color='primary'>Valider</Button>
      </Stack>
      <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
      <Typography mb={2} variant="h6">Documents à fournir</Typography>
      {notFound ? (
        <EmptyContent filled sx={{ py: 10 }} />
      ) : (
        <>
          <FileManagerGridView
            table={table}
            dataFiltered={dataFiltered}
            onDeleteRow={handleDeleteItem}
            notFound={notFound}
            onOpenConfirm={confirm.onTrue}
          />
        </>
      )}
      <Stack my={2} alignItems="flex-start">
        <Button variant='contained' color='primary'>Envoyer ma demande</Button>
      </Stack>
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  return inputData;
}
