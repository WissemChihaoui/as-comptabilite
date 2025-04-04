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

export function useGetUser() {
  const url = endpoints.auth.me;

  const { data } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      userData: data || [],
    }),
    [data]
  );

  return memoizedValue;
}

export function useGetUsers(){
  const url = endpoints.users.all;

  const { data } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      usersData: data ?? [],
    }),
    [data]
  );

  return memoizedValue;
}

export function usePutRecords() {
  const updateRecords = async ({ demenagement, adresse, situation }) => {
    try {
      const url = 'http://127.0.0.1:8000/api/user/profile';
      const params = { demenagement, adresse, situation };

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
  const updateMatricule = async ({ matricule }) => {
    try {
      const url = 'http://127.0.0.1:8000/api/user/profile/matricule';
      const params = { matricule };

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
