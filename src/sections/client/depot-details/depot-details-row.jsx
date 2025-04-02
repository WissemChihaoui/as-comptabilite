import { Box, Button, Card, Typography } from '@mui/material';
import React from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate, today } from 'src/utils/format-time';

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
        <Typography>{file.original_name || file.name}</Typography>
        <Typography variant="caption">{fDate(file.updated_at) || fDate(today())}</Typography>
        <Box gap={2}>
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
          <Button variant="contained" color="error" onClick={() => {
            onRemove(file)
            confirm.onFalse()
          }
        }>
            Supprimer
          </Button>
        }
      />
    </>
  );
}
