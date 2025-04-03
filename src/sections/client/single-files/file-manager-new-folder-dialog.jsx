import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';

export function FileManagerNewFolderDialog({
  open,
  onClose,
  serviceId, // Pass serviceId as a prop
  title = 'Upload files',
  onUploadSuccess, // Callback to refresh file list after upload
  ...other
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('service_id', serviceId);

      files.forEach((file, index) => {
        formData.append('file', file);
        formData.append('document_id', index + 1); // Replace with actual document ID logic
      });

      const response = await axios.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      console.info('Upload Success:', response.data);
      onUploadSuccess?.(); // Refresh file list after upload
      onClose();
    } catch (error) {
      console.error('Upload Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: 3 }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
