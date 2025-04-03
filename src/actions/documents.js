import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from 'src/auth/context/jwt';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetDocuments(i) {
  const url = endpoints.documents.getByService(i);

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      documents: data?.documents || [],
      documentsLoading: isLoading,
      documentsError: error,
      documentsValidating: isValidating,
      documentsEmpty: !isLoading && !data?.documents.length,
    }),
    [data?.documents, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function dropFiles(files, serviceId, documentId) {
  const formData = new FormData();
  const url = 'http://127.0.0.1:8000/api/documents/upload';

  formData.append('service_id', serviceId);
  formData.append('document_id', documentId);

  files.forEach((file) => {
    formData.append('file[]', file);
  });

  try {
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Upload Error:', error.response.data);
      throw new Error(error.response.data);
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
      throw new Error('No response received');
    } else {
      console.error('❌ Upload Error:', error.message);
      throw new Error(error.message);
    }
  }
}

export const fetchDocuments = async (serviceId, id) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/user/documents/${serviceId}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};
