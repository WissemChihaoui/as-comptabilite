import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Link, Tooltip } from '@mui/material';
// import { Link } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { FileManagerShareDialog } from './file-manager-share-dialog';
import { FileManagerFileDetails } from './file-manager-file-details';
import { FileManagerNewFolderDialog } from './file-manager-new-folder-dialog';

// ----------------------------------------------------------------------

export function FileManagerFolderItem({ sx, folder, selected, onSelect, onDelete, ...other }) {
  const { copy } = useCopyToClipboard();

  const share = useBoolean();

  const popover = usePopover();

  const confirm = useBoolean();

  const details = useBoolean();

  const checkbox = useBoolean();

  const editFolder = useBoolean();

  const favorite = useBoolean(folder.isFavorited);

  const [inviteEmail, setInviteEmail] = useState('');

  const [folderName, setFolderName] = useState(folder.name);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeFolderName = useCallback((event) => {
    setFolderName(event.target.value);
  }, []);

  const handleCopy = useCallback(() => {
    toast.success('Copied!');
    copy(folder.url);
  }, [copy, folder.url]);

  const renderIcon = (
    <Box
      sx={{ width: 36, height: 36 }}
    >
      {(checkbox.value || selected) && onSelect ? (
        <Checkbox
          checked={selected}
          onClick={onSelect}
          icon={<Iconify icon="eva:radio-button-off-fill" />}
          checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/icons/files/ic-folder.svg`}
          sx={{ width: 1, height: 1 }}
        />
      )}
    </Box>
  );
  const renderText = (
    <Tooltip title={folder.name}>
      <ListItemText
        onClick={details.onTrue}
        primary={folder.name}
        secondary={
          <>
            {fData(folder.size)}
            <Box
              component="span"
              sx={{
                mx: 0.75,
                width: 2,
                height: 2,
                borderRadius: '50%',
                bgcolor: 'currentColor',
              }}
            />
            {folder.totalFiles} files
          </>
        }
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle1', textOverflow: 'ellipsis', maxWidth: '200px' }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          alignItems: 'center',
          typography: 'caption',
          color: 'text.disabled',
          display: 'inline-flex',
        }}
      />
    </Tooltip>
  );

  return (
    <>
      <Link component={RouterLink} href={paths.dashboard.declarationImpotDrop(folder.id)}>
        <Paper
          variant="outlined"
          sx={{
            gap: 1,
            p: 2.5,
            maxWidth: 222,
            display: 'flex',
            borderRadius: 2,
            cursor: 'pointer',
            position: 'relative',
            bgcolor: 'transparent',
            flexDirection: 'column',
            alignItems: 'flex-start',
            ...((checkbox.value || selected) && {
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.customShadows.z20,
            }),
            ...sx,
          }}
          {...other}
        >
          {renderIcon}
          {renderText}
        </Paper>
      </Link>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
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
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              editFolder.onTrue();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <FileManagerFileDetails
        item={folder}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={() => {
          details.onFalse();
          onDelete();
        }}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={folder.shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <FileManagerNewFolderDialog
        open={editFolder.value}
        onClose={editFolder.onFalse}
        title="Edit Folder"
        onUpdate={() => {
          editFolder.onFalse();
          setFolderName(folderName);
          console.info('UPDATE FOLDER', folderName);
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
