import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import axios from 'axios'; // Import axios

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetDocuments(i) {
  const url = endpoints.documents.getByService(i);

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  // console.log(data);
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
  // console.log('files:', files)
  const formData = new FormData();
  const url = 'http://127.0.0.1:8000/api/documents/upload';

  formData.append('service_id', serviceId);
  // console.log(formData)
  formData.append('document_id', documentId);

  files.forEach((file) => {
    formData.append('file[]', file); // Append multiple files
  });

  try {
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // return response data
  } catch (error) {
    // Error handling based on your existing strategy
    if (error.response) {
      console.error('❌ Upload Error:', error.response.data);
      throw new Error(error.response.data); // Throwing an error can be caught where the function is called
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
    const response = await axios.get(`http://127.0.0.1:8000/api/user/documents/${serviceId}/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};
