// hooks/useContacts.js
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useContacts = () => {
  const queryClient = useQueryClient();

  const addContact = useMutation({
    mutationFn: async ({ profileId, nickname = '' }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              contact_profile: profileId,
              nickname,
              frequency: 0,
              favorite: false,
              status: 'active'
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    }
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ contactId, isFavorite }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contacts/${contactId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              favorite: isFavorite
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    }
  });

  return { addContact, toggleFavorite };
};