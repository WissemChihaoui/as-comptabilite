import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { dropFiles } from 'src/actions/documents';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Upload, UploadBox } from 'src/components/upload';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { STORAGE_KEY } from 'src/auth/context/jwt';

import { FileManagerShareDialog } from './file-manager-share-dialog';
import { FileManagerFileDetails } from './file-manager-file-details';

// ----------------------------------------------------------------------

export function FileManagerTableRow({ row, selected, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const [file, setFile] = useState([]);

  // console.log(file)

  const { copy } = useCopyToClipboard();

  const openUpload = useBoolean();

  const [inviteEmail, setInviteEmail] = useState('');

  const favorite = useBoolean(row.isFavorited);

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      openUpload.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles); // Store the selected file(s)
  }, []);

  // console.log(file)

  const handleCopy = useCallback(() => {
    toast.success('Copied!');
    copy(row.url);
  }, [copy, row.url]);

  // const { upload, uploading, uploadError, uploadResponse } = useUploadDoc();

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/documents/${row.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
          },
        });
        setFile({ name: response.data.original_name }); // Set the fetched document details
      } catch (err) {
        console.error(err);
      }
    };

    if (row.id) {
      // Only fetch if row.id exists
      fetchDocumentDetails();
    }
  }, [row.id]);

  const handleSubmit = async () => {
    if (!file || file.length === 0) {
      console.error('No file selected');
      return;
    }

    const selectedFile = file[0]; // Extract the file
    try {
      const response = await dropFiles([selectedFile], row.service_id, row.id); // Calling dropFiles for a single file
      // console.log("✅ Upload Successful:", response);
      openUpload.onFalse(); // Close dialog or reset any relevant state
    } catch (error) {
      console.error('❌ Upload Error:', error.message);
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
      await axios.delete(`http://127.0.0.1:8000/api/documents/${row.id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      });

      // Execute the parent callback for deleting the document from the state

      setFile('');
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
            <FileThumbnail file={`${file.name?.split('.').pop()}` || 'pdf'} />

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
                secondary={file.name}
                primaryTypographyProps={{ typography: 'body2' }}
                secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
              />
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {file.name?.split('.').pop()}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(row.createdAt)}
            secondary={fTime(row.createdAt)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={file.length}
            onChange={favorite.onToggle}
            sx={{ p: 0.75 }}
          />

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {/* <MenuItem
            onClick={() => {
              popover.onClose();
              handleCopy();
            }}
          >
            <Iconify icon="eva:link-2-fill" />
            Copy Link
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              share.onTrue();
            }}
          >
            <Iconify icon="solar:share-bold" />
            Share
          </MenuItem> */}

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <FileManagerFileDetails
        item={row}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={row.shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

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
