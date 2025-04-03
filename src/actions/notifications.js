import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import axios from 'axios';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetNotifications() {
  const url = endpoints.notification.user;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memorizedValue = useMemo(
    () => ({
      notificationsData: data,
      notificationsLoading: isLoading,
      notificationsError: error,
      notificationsValidating: isValidating,
      notificationsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  console.log(data); // shows correctly the notifications

  return memorizedValue;
}

export async function handleAllRead() {
  try {
    const response = await axios.patch(
      'http://127.0.0.1:8000/api/notifications/read',
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      }
    );

    console.log('Notifications marked as read:', response.data);
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
}

export async function handleRead(id) {
    try {
        const response = await axios.patch(
            `http://127.0.0.1:8000/api/notifications/read/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
                  },
            }
        );
        console.log('Notification marked as read:', response.data);
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}
