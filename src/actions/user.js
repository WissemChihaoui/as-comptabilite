import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import axios from 'axios';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import { fAdd, fDate } from 'src/utils/format-time';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetUser() {
  const url = endpoints.auth.me;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  // console.log(data)
  const memorizedValue = useMemo(
    () => ({
      userData: data || [],
    }),
    [data]
  );

  return memorizedValue;
}

export function usePutRecords() {
  const updateRecords = async ({ demenagement, adresse, situation }) => {
    const date = fDate(demenagement);
    try {
      const url = 'http://127.0.0.1:8000/api/user/profile'; // Use correct API path
      const params = { date, adresse, situation };

      // console.log("Updating records with:", params);

      const res = await axios.put(url, params, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`, // Ensure the user is authenticated
          'Content-Type': 'application/json',
        },
      });

      // Mutate the SWR cache to update the user info after the change
      mutate(endpoints.auth.me);

      return res.data;
    } catch (error) {
      console.error('Error updating user records:', error);
      throw error;
    }
  };
  const updateMatricule = async ({ matricule }) => {
    try {
      const url = 'http://127.0.0.1:8000/api/user/profile/matricule';
      const params = { matricule };

      // console.log("Updating records with:", params);

      const res = await axios.put(url, params, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
          'Content-Type': 'application/json',
        },
      });

      mutate(endpoints.auth.me);

      return res.data;
    } catch (error) {
      console.error('Error updating user records:', error);
      throw error;
    }
  };

  return { updateRecords, updateMatricule };
}
