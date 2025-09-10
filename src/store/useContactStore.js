// src/store/useContactStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useContactStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      // Contacts state
      contacts: [],
      
      // Groups state
      groups: [],
      
      // Prompt templates state
      promptTemplates: [],
      
      // Scheduled calls state
      scheduledCalls: [],

      // Scheduled calls state
      scheduledGroupCalls: [],

      // Auth actions
      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Nesprávny email alebo heslo');
          }
          
          const data = await response.json();
          set({ user: data.user || data, isAuthenticated: true, loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await fetch('http://localhost:8000/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            contacts: [],
            promptTemplates: [],
            scheduledCalls: []
          });
        }
      },
      
      fetchCurrentUser: async () => {
        try {
          const response = await fetch('http://localhost:8000/api/auth/me', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Not authenticated');
          }
          
          const user = await response.json();
          set({ user, isAuthenticated: true });
          return user;
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
      
      // Contacts actions
      fetchContacts: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/contacts/', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch contacts');
          }
          
          const contacts = await response.json();
          // Преобразуем теги из строки в массив если нужно
          const processedContacts = contacts.map(contact => ({
            ...contact,
            tags: Array.isArray(contact.tags) ? contact.tags : 
                  (typeof contact.tags === 'string' ? contact.tags.split(',').filter(t => t) : [])
          }));
          set({ contacts: processedContacts, loading: false });
        } catch (error) {
          console.error('Error fetching contacts:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      addContact: async (contactData) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/contacts/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to add contact');
          }
          
          const newContact = await response.json();
          // Преобразуем теги
          const processedContact = {
            ...newContact,
            tags: Array.isArray(newContact.tags) ? newContact.tags : []
          };
          set((state) => ({
            contacts: [...state.contacts, processedContact],
            loading: false
          }));
          return processedContact;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      updateContact: async (id, updatedContact) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/contacts/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to update contact');
          }
          
          const contact = await response.json();
          // Преобразуем теги
          const processedContact = {
            ...contact,
            tags: Array.isArray(contact.tags) ? contact.tags : []
          };
          set((state) => ({
            contacts: state.contacts.map((c) => 
              c.id === id ? processedContact : c
            ),
            loading: false
          }));
          return processedContact;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      deleteContact: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/contacts/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to delete contact');
          }
          
          set((state) => ({
            contacts: state.contacts.filter((c) => c.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Groups actions
      fetchGroups: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/groups/groups/', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch groups');
          }
          
          const groups = await response.json();
          set({ groups, loading: false });
        } catch (error) {
          console.error('Error fetching groups:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      addGroup: async (groupData) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/groups/groups/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to add group');
          }
          
          const newGroup = await response.json();
          set((state) => ({
            groups: [...state.groups, newGroup],
            loading: false
          }));
          return newGroup;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      updateGroup: async (id, groupData) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/groups/groups/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to update group');
          }
          
          const group = await response.json();
          set((state) => ({
            groups: state.groups.map((g) => 
              g.id === id ? group : g
            ),
            loading: false
          }));
          return group;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      deleteGroup: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/groups/groups/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to delete group');
          }
          
          set((state) => ({
            groups: state.groups.filter((g) => g.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Group members actions
      addGroupMember: async (groupId, memberData) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/groups/groups/${groupId}/members`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to add group member');
          }
          
          const newMember = await response.json();
          
          // Обновляем группу с новым участником
          const updatedGroup = await fetch(`http://localhost:8000/api/groups/groups/${groupId}`, {
            credentials: 'include',
          }).then(res => res.json());
          
          set((state) => ({
            groups: state.groups.map((g) => 
              g.id === groupId ? updatedGroup : g
            ),
            loading: false
          }));
          
          return newMember;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      removeGroupMember: async (groupId, memberId) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/groups/groups/${groupId}/members/${memberId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to remove group member');
          }
          
          // Обновляем группу без участника
          const updatedGroup = await fetch(`http://localhost:8000/api/groups/groups/${groupId}`, {
            credentials: 'include',
          }).then(res => res.json());
          
          set((state) => ({
            groups: state.groups.map((g) => 
              g.id === groupId ? updatedGroup : g
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      addScheduledGroupCall: async (callData) => {
        try {
          set({ loading: true, error: null });
          
          console.log('Scheduling group call with ', callData);
          
          const response = await fetch('http://localhost:8000/api/scheduled-group-calls/scheduled-group-calls/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(callData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Server error response:', errorData);
            throw new Error(errorData.detail || `HTTP ${response.status}: Failed to schedule group call`);
          }
          
          const newCall = await response.json();
          console.log('Scheduled group call result:', newCall);
          
          set((state) => ({
            scheduledCalls: [...state.scheduledCalls, newCall],
            loading: false
          }));
          
          return newCall;
        } catch (error) {
          console.error('Error scheduling group call:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // 🎯 Функция для получения запланированных звонков групп
      fetchScheduledGroupCalls: async () => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch('http://localhost:8000/api/scheduled-group-calls/scheduled-group-calls/', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to fetch scheduled group calls');
          }
          
          const calls = await response.json();
          set({ scheduledCalls: calls, loading: false });
          return calls;
        } catch (error) {
          console.error('Error fetching scheduled group calls:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // 🎯 Функция для обновления запланированных звонков групп
      updateScheduledGroupCall: async (id, callData) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`http://localhost:8000/api/scheduled-group-calls/scheduled-group-calls/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(callData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to update scheduled group call');
          }
          
          const call = await response.json();
          set((state) => ({
            scheduledCalls: state.scheduledCalls.map((c) => 
              c.id === id ? call : c
            ),
            loading: false
          }));
          return call;
        } catch (error) {
          console.error('Error updating scheduled group call:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // 🎯 Функция для удаления запланированных звонков групп
      deleteScheduledGroupCall: async (id) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`http://localhost:8000/api/scheduled-group-calls/scheduled-group-calls/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to delete scheduled group call');
          }
          
          set((state) => ({
            scheduledCalls: state.scheduledCalls.filter((c) => c.id !== id),
            loading: false
          }));
        } catch (error) {
          console.error('Error deleting scheduled group call:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Tags actions
      addTag: async (contactId, tag) => {
        try {
          const state = get();
          const contact = state.contacts.find(c => c.id === contactId);
          if (!contact) return;
          
          const updatedTags = [...(contact.tags || []), tag];
          await state.updateContact(contactId, { ...contact, tags: updatedTags });
        } catch (error) {
          console.error('Error adding tag:', error);
        }
      },
      
      removeTag: async (contactId, tag) => {
        try {
          const state = get();
          const contact = state.contacts.find(c => c.id === contactId);
          if (!contact) return;
          
          const updatedTags = (contact.tags || []).filter(t => t !== tag);
          await state.updateContact(contactId, { ...contact, tags: updatedTags });
        } catch (error) {
          console.error('Error removing tag:', error);
        }
      },
      
      // Prompt templates actions
      fetchPromptTemplates: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/prompt-templates/', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to fetch prompt templates');
          }
          
          const templates = await response.json();
          set({ promptTemplates: templates, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      
      addPromptTemplate: async (templateData) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/prompt-templates/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(templateData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to add prompt template');
          }
          
          const newTemplate = await response.json();
          set((state) => ({
            promptTemplates: [...state.promptTemplates, newTemplate],
            loading: false
          }));
          return newTemplate;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      updatePromptTemplate: async (id, updatedTemplate) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/prompt-templates/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTemplate),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to update prompt template');
          }
          
          const template = await response.json();
          set((state) => ({
            promptTemplates: state.promptTemplates.map((t) => 
              t.id === id ? template : t
            ),
            loading: false
          }));
          return template;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      deletePromptTemplate: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/prompt-templates/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to delete prompt template');
          }
          
          set((state) => ({
            promptTemplates: state.promptTemplates.filter((t) => t.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Scheduled calls actions
      fetchScheduledCalls: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/scheduled-calls/', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to fetch scheduled calls');
          }
          
          const calls = await response.json();
          set({ scheduledCalls: calls, loading: false });
        } catch (error) {
          console.error('Error fetching scheduled calls:', error);
          set({ error: error.message, loading: false });
        }
      },

      fetchUpcomingCalls: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/scheduled-calls/upcoming', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to fetch upcoming calls');
          }
          
          const calls = await response.json();
          set({ scheduledCalls: calls, loading: false });
        } catch (error) {
          console.error('Error fetching upcoming calls:', error);
          set({ error: error.message, loading: false });
        }
      },

      addScheduledCall: async (callData) => {
        try {
          set({ loading: true, error: null });
          
          console.log('Sending scheduled call data:', callData);
          
          const response = await fetch('http://localhost:8000/api/scheduled-calls/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(callData),
            credentials: 'include',
          });
          
          // Проверяем статус ответа
          if (!response.ok) {
            // Получаем детали ошибки
            let errorDetail = 'Failed to schedule call';
            
            try {
              const errorData = await response.json();
              console.error('Server error response:', errorData);
              
              // Проверяем разные форматы ошибок
              if (errorData.detail) {
                if (typeof errorData.detail === 'string') {
                  errorDetail = errorData.detail;
                } else if (Array.isArray(errorData.detail)) {
                  errorDetail = errorData.detail.join(', ');
                } else if (typeof errorData.detail === 'object') {
                  // Детальная валидация по полям
                  const validationErrors = [];
                  for (const [field, messages] of Object.entries(errorData.detail)) {
                    if (Array.isArray(messages)) {
                      validationErrors.push(`${field}: ${messages.join(', ')}`);
                    } else {
                      validationErrors.push(`${field}: ${messages}`);
                    }
                  }
                  errorDetail = validationErrors.join('; ');
                }
              } else {
                errorDetail = JSON.stringify(errorData);
              }
            } catch (parseError) {
              errorDetail = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorDetail);
          }
          
          const newCall = await response.json();
          set((state) => ({
            scheduledCalls: [...state.scheduledCalls, newCall],
            loading: false
          }));
          return newCall;
        } catch (error) {
          console.error('Error adding scheduled call:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateScheduledCall: async (id, callData) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/scheduled-calls/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(callData),
            credentials: 'include',
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to update scheduled call');
          }

          const call = await response.json();

          set((state) => ({
            scheduledCalls: state.scheduledCalls.map((c) =>
              c.id === id ? call : c
            ),
            loading: false,
          }));

          return call;
        } catch (error) {
          console.error('Error updating scheduled call:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteScheduledCall: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/scheduled-calls/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to delete scheduled call');
          }

          set((state) => ({
            scheduledCalls: state.scheduledCalls.filter((c) => c.id !== id),
            loading: false,
          }));
        } catch (error) {
          console.error('Error deleting scheduled call:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },


      // Twilio calls actions
      makeImmediateCall: async (callData) => {
        try {
          set({ loading: true, error: null });
          
          console.log('Making immediate call with data:', callData);
          
          const response = await fetch('http://localhost:8000/api/twilio-calls/initiate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(callData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Twilio call error response:', errorData);
            throw new Error(errorData.detail || `HTTP ${response.status}: Failed to initiate call`);
          }
          
          const result = await response.json();
          console.log('Twilio call result:', result);
          
          set({ loading: false });
          return result;
        } catch (error) {
          console.error('Error making immediate call:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Dialogs actions
      fetchContactDialogs: async (contactId) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`http://localhost:8000/api/contacts/${contactId}/dialogs`, {
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to fetch contact dialogs');
          }
          
          const dialogs = await response.json();
          set({ loading: false });
          return dialogs;
        } catch (error) {
          console.error('Error fetching contact dialogs:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      addContactDialog: async (contactId, dialogData) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`http://localhost:8000/api/contacts/${contactId}/dialogs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dialogData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Failed to add contact dialog');
          }
          
          const newDialog = await response.json();
          set({ loading: false });
          return newDialog;
        } catch (error) {
          console.error('Error adding contact dialog:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'contact-storage',
      partialize: (state) => ({ 
        contacts: state.contacts,
        promptTemplates: state.promptTemplates,
        scheduledCalls: state.scheduledCalls
      }),
    }
  )
)

export default useContactStore