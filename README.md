# Novo Contact App — Frontend

Moderná webová aplikácia na správu kontaktov a uskutočňovanie hovorov. Táto časť predstavuje **frontend** postavený na **React + Vite** s čistým a responzívnym UI.

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-4-646CFF?logo=vite&logoColor=white" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-store-0F766E" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 📋 Obsah
- [🚀 Funkcie](#-funkcie)
- [⚙️ Technológie](#️-technológie)
- [📁 Štruktúra projektu](#-štruktúra-projektu)
- [🛠️ Inštalácia a spustenie](#️-inštalácia-a-spustenie)
- [🏗️ Architektúra](#️-architektúra)
- [📄 Stránky a komponenty](#-stránky-a-komponenty)
- [🗃️ Store (Zustand)](#️-store-zustand)
- [🎯 Funkcionality detailne](#-funkcionality-detailne)
- [🚀 Budúce vylepšenia](#-budúce-vylepšenia)
- [📞 Kontakt](#-kontakt)
- [📄 Licencia](#-licencia)

---

## 🚀 Funkcie
- 📇 **Správa kontaktov** – CRUD operácie (vytvoriť/čítať/upraviť/mazať)
- 🔍 **Vyhľadávanie** – filtrovanie podľa všetkých atribútov
- 🏷️ **Tagy** – kategorizácia kontaktov pomocou tagov
- 📜 **Agent Scripty** – možnosť pridania skriptu pre hovory
- 📚 **História hovorov** – záznamy predchádzajúcich interakcií
- 📊 **Štatistika** – prehľad aktivít pre každý kontakt
- 💾 **Perzistentné úložisko** – dáta v prehliadači (localStorage)
- 🎨 **Moderný UI** – responzívny dizajn s animáciami (Framer Motion)

---

## ⚙️ Technológie
- **React 18** – knižnica pre tvorbu užívateľského rozhrania  
- **Vite** – moderný build nástroj a development server  
- **TailwindCSS** – utility‑first CSS framework  
- **Zustand** – jednoduchý state management  
- **React Router** – navigácia medzi stránkami  
- **Framer Motion** – animácie a prechody  
- **localStorage** – perzistentné úložisko dát  

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 📁 Štruktúra projektu
```
src/
├── components/
│   ├── ContactList.jsx     # Zoznam kontaktov s animáciami
│   └── Navbar.jsx          # Navigačný panel
├── pages/
│   ├── Home.jsx            # Hlavná stránka s vyhľadávaním
│   ├── AddContact.jsx      # Formulár pre pridanie kontaktu
│   ├── EditContact.jsx     # Formulár pre úpravu kontaktu
│   └── ViewContact.jsx     # Detailný pohľad na kontakt
├── store/
│   └── useContactStore.js  # Zustand store pre správu kontaktov
├── App.jsx                 # Hlavná aplikácia s routingom
└── main.jsx                # Vstupný bod aplikácie
```

---

## 🛠️ Inštalácia a spustenie

### Požiadavky
- Node.js **16+**
- **npm** alebo **yarn**

### Krok 1: Klonovanie repozitára
```bash
git clone <url-repozitara>
cd novo-contact_app-frontend
```

### Krok 2: Inštalácia závislostí
```bash
npm install
# alebo
yarn
```

### Krok 3: Spustenie vývojového servera
```bash
npm run dev
# alebo
yarn dev
```
Aplikácia bude dostupná na `http://localhost:5173`.

### Krok 4: Build pre produkciu
```bash
npm run build
# alebo
yarn build
```

---

## 🏗️ Architektúra

### Frontend stack
- **React + Vite** – rýchly development a build  
- **TailwindCSS** – konzistentný dizajnový systém  
- **Zustand** – jednoduchý state management bez boilerplate  
- **React Router** – deklaratívna navigácia  
- **localStorage** – perzistencia dát v prehliadači  

### Dátový tok
1. **UI komponenty** → interakcia používateľa  
2. **Store (Zustand)** → správa stavu aplikácie  
3. **localStorage** → perzistentné ukladanie dát  
4. **Komponenty** → re‑render pri zmene stavu  

> _Tip:_ Jednoduchá architektúra bez backendu je ideálna pre PoC a menšie projekty.

---

## 📄 Stránky a komponenty

### 🏠 Home stránka (`/`)
**Funkcie:**
- Zobrazenie všetkých kontaktov v mriežke
- Vyhľadávanie podľa mena, telefónu, emailu, spoločnosti a tagov
- Tlačidlo **„Pridať kontakt”**
- Animovaný zoznam kontaktov (Framer Motion)
- Responzívny dizajn

**Komponenty:**
- `ContactList` – zoznam kontaktov
- `Navbar` – navigácia

### ➕ Add Contact (`/add`)
Formulár pre pridanie nového kontaktu

**Funkcie:**
- Validácia povinných polí (meno, telefón)
- Validácia formátu telefónu a emailu
- Pridanie tagov a agent skriptu
- Zrušenie a návrat na hlavnú stránku

**Položky formulára:**
- Meno a priezvisko *(povinné)*  
- Telefónne číslo *(povinné)*  
- Email *(voliteľné)*  
- Spoločnosť *(voliteľné)*  
- Tagy *(voliteľné)*  
- Agent Script *(voliteľné)*  

### ✏️ Edit Contact (`/edit/:id`)
**Funkcie:**
- Predvyplnenie existujúcich údajov
- Rovnaká validácia ako pri pridávaní
- Úprava tagov a agent skriptu
- Uloženie zmien alebo zrušenie

### 👁️ View Contact (`/view/:id`)
**Funkcie:**
- Avatar (generovaný z iniciál)
- Základné informácie (meno, telefón, email, spoločnosť)
- Zobrazenie tagov s pridávaním/odstraňovaním
- Štatistika hovorov
- Agent Script s možnosťou úpravy
- História hovorov s detailmi
- Akcie: telefonát, SMS, email
- Navigácia späť a na úpravu

---

## 🗃️ Store (Zustand)

`useContactStore.js` – centrálny state management pre kontakty

**Stav:**
- `contacts: Contact[]` – pole všetkých kontaktov

**Metódy:**
- `addContact(contact)` – pridanie kontaktu
- `updateContact(id, updatedContact)` – aktualizácia
- `deleteContact(id)` – odstránenie
- `updateContactScript(id, script)` – aktualizácia skriptu
- `addTag(contactId, tag)` – pridanie tagu
- `removeTag(contactId, tag)` – odstránenie tagu

**Štruktúra kontaktu:**
```javascript
{
  id: number,
  name: string,
  phone: string,
  email: string,
  company: string,
  script: string,
  tags: string[],
  dialogs: [
    {
      id: number,
      date: string,
      messages: [
        {
          role: 'agent' | 'client',
          text: string
        }
      ]
    }
  ]
}
```

---

## 🎯 Funkcionality detailne

### 📇 Správa kontaktov (CRUD)
**Vytvorenie:**
- Formulár s validáciou
- Automatické generovanie ID
- Uloženie do **store** a **localStorage**

**Čítanie:**
- Zobrazenie v zozname
- Detailný pohľad
- Filtrovanie a vyhľadávanie

**Úprava:**
- Predvyplnené údaje
- Validácia zmien
- Aktualizácia v **store** a **localStorage**

**Mazanie:**
- Potvrdenie pred zmazaním
- Odstránenie z UI a store

### 🔍 Vyhľadávanie a filtrovanie
- Case‑insensitive vyhľadávanie
- Viac polí naraz (meno, email, tel., spoločnosť, tagy)
- Okamžité výsledky počas písania
- Zobrazenie počtu nájdených výsledkov

### 🏷️ Systém tagov
- Pridanie/odstránenie tagov
- Zobrazenie v zozname a detaile
- Vyhľadávanie podľa tagov

### 📜 Agent Scripty
- Pridanie a úprava skriptov
- Zobrazenie v detaile kontaktu
- Podpora viacriadkového textu

### 📚 História hovorov
- Chronologické zobrazenie
- Správy podľa roly (agent/client)
- Zobrazenie dátumu
- Príklady dialógov (mock data)

### 📊 Štatistika
Zobrazené údaje:
- Celkový počet hovorov
- Dátum posledného hovoru
- Počet priradených tagov

### 💾 Perzistencia dát
- Automatické ukladanie do **localStorage**
- Načítanie pri štarte aplikácie
- Synchronizácia medzi záložkami

### 🎨 UI/UX vlastnosti
- Responzívny dizajn
- Animácie (Framer Motion)
- Konzistentná farebná schéma
- Ikony pre lepšiu orientáciu
- Validácia formulárov s chybami
- Hover efekty a prechody

---



## 📞 Kontakt
Pre otázky alebo spätnú väzbu píšte na: **vielkinserhii@gmail.com**

---

## 📄 Licencia
MIT License – pozri súbor **LICENSE** pre detaily.
