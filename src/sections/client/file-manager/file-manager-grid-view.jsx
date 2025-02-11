import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { FileManagerPanel } from './file-manager-panel';
import { FileManagerFileItem } from './file-manager-file-item';
import { FileManagerFolderItem } from './file-manager-folder-item';
import { FileManagerShareDialog } from './file-manager-share-dialog';
// import { FileManagerActionSelected } from './file-manager-action-selected';
import { FileManagerNewFolderDialog } from './file-manager-new-folder-dialog';

// ----------------------------------------------------------------------

export function FileManagerGridView({ table, dataFiltered, onDeleteItem, onOpenConfirm }) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const share = useBoolean();

  const upload = useBoolean();

  const folders = useBoolean();

  const newFolder = useBoolean();

  const containerRef = useRef(null);

  const [folderName, setFolderName] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeFolderName = useCallback((event) => {
    setFolderName(event.target.value);
  }, []);

  return (
    <>
      <Box ref={containerRef}>
        <Collapse in={!folders.value} unmountOnExit>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
          >
            {dataFiltered
              .filter((i) => i.type === 'folder')
              .map((folder) => (
                <FileManagerFolderItem
                  key={folder.id}
                  folder={folder}
                  selected={selected.includes(folder.id)}
                  onSelect={() => onSelectItem(folder.id)}
                  onDelete={() => onDeleteItem(folder.id)}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
          </Box>
        </Collapse>
      </Box>

      <FileManagerShareDialog
        open={share.value}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

      <FileManagerNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="New Folder"
        onCreate={() => {
          newFolder.onFalse();
          setFolderName('');
          console.info('CREATE NEW FOLDER', folderName);
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
      />
    </>
  );
}
