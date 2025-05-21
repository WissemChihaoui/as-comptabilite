import axios from 'axios';
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from 'src/auth/context/jwt';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetForms() {
  const url = endpoints.forms.all;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      forms: data ?? [],
      formsLoading: isLoading,
      formsError: error,
      formsValidating: isValidating,
      formsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useDeleteForm() {
  const deleteForm = async (id) => {
    try {
      const url = `http://127.0.0.1:8000/api/forms/${id}`; // API endpoint

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      }); // Send DELETE request

      // Invalidate and re-fetch forms list after deletion
      mutate(endpoints.forms.all);
      mutate(endpoints.forms.myForms);

      return { success: true, message: 'Form deleted successfully' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete form' };
    }
  };

  return { deleteForm };
}

export function useUpdateForm() {
  const updateForm = async (id, status, note) => {
    try {
      const url = `http://127.0.0.1:8000/api/forms/${id}`;

      const response = await axios.patch(
        url,
        { status, note },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
          },
        }
      );

      // Revalidate the form list after successful update
      mutate(endpoints.forms.all);
      mutate(endpoints.forms.myForms);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update form status',
      };
    }
  };

  return { updateForm };
}

export function useGetForm(id) {
  const url = id ? [endpoints.forms.get(id)] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      form: data?.form,
      formLoading: isLoading,
      formError: error,
      formValidating: isValidating,
    }),
    [data?.form, isLoading, error, isValidating]
  );

  return memoizedValue;
}

export function useGetStatistics() {
  const url = endpoints.statistics.get;

  const { data, isLoading } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      totalUsers: data?.totalUsers,
      totalForms: data?.totalForms,
      totalDocuments: data?.totalDocuments,
      usersMonthly: data?.usersMonthly,
      formsMonthly: data?.formsMonthly,
      documentsMonthly: data?.documentsMonthly,
      loading: isLoading,
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function useGetMyForms() {
  const url = endpoints.forms.myForms;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
   const memoizedValue = useMemo(
    () => ({
      forms: data ?? [],
      formsLoading: isLoading,
      formsError: error,
      formsValidating: isValidating,
      formsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
