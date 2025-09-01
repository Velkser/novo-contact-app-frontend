// src/store/useContactStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useContactStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      
      // Contacts state
      contacts: [],
      loading: false,
      error: null,
      
      // Prompt templates state
      promptTemplates: [],
      
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
            promptTemplates: []
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
            throw new Error('Failed to add contact');
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
            throw new Error('Failed to update contact');
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
            throw new Error('Failed to delete contact');
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
            throw new Error('Failed to fetch prompt templates');
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
            throw new Error('Failed to add prompt template');
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
            throw new Error('Failed to update prompt template');
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
            throw new Error('Failed to delete prompt template');
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
      // Scheduled calls state
      scheduledCalls: [],

      // Scheduled calls actions
      fetchScheduledCalls: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:8000/api/scheduled-calls/', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch scheduled calls');
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
            throw new Error('Failed to fetch upcoming calls');
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
          const response = await fetch('http://localhost:8000/api/scheduled-calls/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(callData),
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Failed to schedule call');
          }
          
          const newCall = await response.json();
          set((state) => ({
            scheduledCalls: [...state.scheduledCalls, newCall],
            loading: false
          }));
          return newCall;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateScheduledCall: async (id, updatedCall) => {
         try {
          console.log('Sending update request:', updatedCall); // Для отладки
          set({ loading: true, error: null });
          const response = await fetch(`http://localhost:8000/api/scheduled-calls/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCall),
            credentials: 'include',
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
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
          console.error('Error in updateScheduledCall:', error);
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
            throw new Error('Failed to delete scheduled call');
          }
          
          set((state) => ({
            scheduledCalls: state.scheduledCalls.filter((c) => c.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'contact-storage',
      partialize: (state) => ({ 
        // Не сохраняем чувствительные данные в localStorage
        contacts: state.contacts,
        promptTemplates: state.promptTemplates
      }),
    }
  )
)

export default useContactStore