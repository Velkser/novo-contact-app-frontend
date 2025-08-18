import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useContactStore = create(
  persist(
    (set, get) => ({
      contacts: [
        { 
          id: 1, 
          name: 'Ján Novák', 
          phone: '+421 901 234 567', 
          email: 'jan@example.com', 
          company: 'ABC s.r.o.',
          script: 'Hello, this is calling from ABC company. I wanted to discuss your recent order...',
          tags: ['customer', 'vip'],
          dialogs: [
            {
              id: 1,
              date: '2024-01-15 14:30',
              messages: [
                { role: 'agent', text: 'Hello, this is calling from ABC company. I wanted to discuss your recent order.' },
                { role: 'client', text: 'Yes, I received it yesterday. Everything is fine, thank you.' },
                { role: 'agent', text: 'Great! Do you have any questions about the product?' },
                { role: 'client', text: 'No, everything is clear. The product works as expected.' }
              ]
            },
            {
              id: 2,
              date: '2024-01-20 10:15',
              messages: [
                { role: 'agent', text: 'Good morning! I\'m calling to inform you about our new promotion.' },
                { role: 'client', text: 'Oh, that sounds interesting. What do you have?' },
                { role: 'agent', text: 'We have 20% discount on all our services this month.' },
                { role: 'client', text: 'That\'s great! I\'ll definitely check it out.' }
              ]
            }
          ]
        },
      ],

      addContact: (contact) =>
        set((state) => ({
          contacts: [...state.contacts, { 
            ...contact, 
            id: Date.now(),
            script: contact.script || '',
            tags: contact.tags || [],
            dialogs: []
          }],
        })),

      updateContact: (id, updatedContact) =>
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updatedContact } : c)),
        })),

      deleteContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),

      updateContactScript: (id, script) =>
        set((state) => ({
          contacts: state.contacts.map((c) => 
            c.id === id ? { ...c, script } : c
          ),
        })),

      addTag: (contactId, tag) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === contactId && !c.tags.includes(tag)
              ? { ...c, tags: [...c.tags, tag] }
              : c
          ),
        })),

      removeTag: (contactId, tag) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === contactId
              ? { ...c, tags: c.tags.filter(t => t !== tag) }
              : c
          ),
        })),
    }),
    {
      name: 'contact-storage',
      partialize: (state) => ({ contacts: state.contacts }),
    }
  )
)

export default useContactStore