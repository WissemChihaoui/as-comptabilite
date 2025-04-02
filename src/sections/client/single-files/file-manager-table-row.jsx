import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';

import { fDate, fTime } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { dropFiles } from 'src/actions/documents';
import { Upload } from 'src/components/upload';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { STORAGE_KEY } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export function FileManagerTableRow({ row, selected, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const [file, setFile] = useState([]);

  // console.log('file',file)

  const openUpload = useBoolean();

  const details = useBoolean();

  const confirm = useBoolean();

  const handleClick = useDoubleClick({
    click: () => {
      openUpload.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleDrop = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    setFile(newFile);
  }, []);
  const fetchDocumentDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/documents/${row.id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      });
      setFile(response.data); // Set the fetched document details
    } catch (err) {
      console.error(err);
    }
  }, [row.id]); // Dependencies to re-create the function if row.id changes
  
  useEffect(() => {
    if (row.id) {
      fetchDocumentDetails();
    }
  }, [row.id,fetchDocumentDetails]);

  // console.log(file)

  const handleSubmit = async () => {
    if (!file || file.length === 0) {
      console.error('No file selected');
      return;
    }

    try {
      const response = await dropFiles([file], row.service_id, row.id); // Calling dropFiles for a single file
      // console.log("✅ Upload Successful:", response);
      toast.success('Succès du téléchargement')
      openUpload.onFalse(); // Close dialog or reset any relevant state
      fetchDocumentDetails();
    } catch (error) {
      toast.error('Erreur de téléchargement');
    }
  };
  const defaultStyles = {
    borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
  };

  const deleteFile = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/documents/${file.id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
          'Content-Type': 'application/json',
        },
      });

      // Execute the parent callback for deleting the document from the state

      setFile({});
      confirm.onFalse();
      toast.info('Document deleted successfully.');
    } catch (error) {
      toast.info('Failed to delete document.');
      console.error(error);
    }
  };
  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': { backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20 },
          },
          [`& .${tableCellClasses.root}`]: { ...defaultStyles },
          ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
        }}
      >
        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={`${file.original_name?.split('.').pop()}` || 'pdf'} />

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              <ListItemText
                primary={row.name}
                secondary={file.original_name}
                primaryTypographyProps={{ typography: 'body2' }}
                secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
              />
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {file.original_name?.split('.').pop()}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(file.created_at)}
            secondary={fTime(file.created_at)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          
          <IconButton color='error' onClick={()=>confirm.onTrue()}>
            <Iconify icon="tabler:trash" />
          </IconButton>
        </TableCell>
      </TableRow>

      

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir effacer ?"
        action={
          <Button variant="contained" color="error" onClick={() => deleteFile()}>
            Supprimer
          </Button>
        }
      />

      <Dialog open={openUpload.value} onClose={openUpload.onFalse}>
        <DialogTitle>Ajouter un fichier à {row.name}</DialogTitle>
        <DialogContent>
          <Upload
            onDrop={handleDrop}
            // value={file}
            placeholder={
              <Stack spacing={0.5} alignItems="center">
                <Iconify icon="eva:cloud-upload-fill" width={40} />
                <Typography variant="body2">Upload file</Typography>
              </Stack>
            }
            sx={{ mb: 3, py: 2.5, flexGrow: 1, height: 'auto' }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleSubmit()} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
