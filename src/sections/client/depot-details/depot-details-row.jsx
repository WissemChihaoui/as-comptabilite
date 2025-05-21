import React from 'react';

import { Box, Card, Button, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, today } from 'src/utils/format-time';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';

export default function DepotDetailsRow({ file, onRemove }) {
  const confirm = useBoolean();

  return (
    <>
      <Card
        sx={{
          p: 3,
          height: 250,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <FileThumbnail
          slotProps={{
            icon: {
              width: 80,
              height: 'auto'
            },
            img: {
              width: 200
            }
          }}
          sx={{ width: 1, height: 'auto' }}
          file={`${file.original_name?.split('.').pop()}` || 'pdf'}
        />
        <Typography
          noWrap
          sx={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 15,
            fontWeight: 500,
          }}
          textAlign='center'
        >
          {file.original_name || file.name}
        </Typography>
        <Typography textAlign='center' variant="caption">{fDate(file.updated_at) || fDate(today())}</Typography>
        <Box gap={2} display="flex" justifyContent='center'>
          {/* <TextField label="Nom de fichier" fullWidth /> */}
          <Button sx={{ mt: 2 }} variant="contained" color="error" onClick={() => confirm.onTrue()}>
            Supprimer
          </Button>
        </Box>
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={`Êtes-vous sûr de vouloir supprimer ${file.original_name || file.name}?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onRemove(file);
              confirm.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
    </>
  );
}
