import { create } from 'zustand'

const useContactStore = create((set) => ({
  contacts: [
    { id: 1, name: 'Ján Novák', phone: '+421 901 234 567', email: 'jan@example.com', company: 'ABC s.r.o.' },
  ],

  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts, { ...contact, id: Date.now() }],
    })),

  updateContact: (id, updatedContact) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updatedContact } : c)),
    })),

  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),
}))

export default useContactStore