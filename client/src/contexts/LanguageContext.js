import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language translations
const translations = {
  lv: {
    // Common
    common: {
      loading: 'Ielādē...',
      save: 'Saglabāt',
      cancel: 'Atcelt',
      delete: 'Dzēst',
      edit: 'Rediģēt',
      add: 'Pievienot',
      search: 'Meklēt',
      filter: 'Filtrēt',
      sort: 'Kārtot',
      close: 'Aizvērt',
      confirm: 'Apstiprināt',
      back: 'Atpakaļ',
      next: 'Tālāk',
      previous: 'Iepriekšējais',
      submit: 'Iesniegt',
      reset: 'Atiestatīt',
      yes: 'Jā',
      no: 'Nē',
      ok: 'Labi',
      error: 'Kļūda',
      success: 'Veiksmīgi',
      warning: 'Brīdinājums',
      info: 'Informācija'
    },
    
    // Navigation
    navigation: {
      dashboard: 'Informācijas panelis',
      meters: 'Siltinātāji',
      bills: 'Rēķini',
      news: 'Ziņas',
      calendar: 'Kalendārs',
      feedback: 'Atsauksmes',
      parking: 'Autostāvvieta',
      admin: 'Administrācija',
      profile: 'Profils',
      logout: 'Izrakstīties'
    },
    
    // Dashboard
    dashboard: {
      title: 'Informācijas panelis',
      welcome: 'Laipni lūdzam',
      quickActions: 'Ātrās darbības',
      recentActivity: 'Pēdējā aktivitāte',
      upcomingEvents: 'Gaidāmie notikumi',
      pendingBills: 'Gaidāmie rēķini',
      unreadNews: 'Nelasītās ziņas'
    },
    
    // Meters
    meters: {
      title: 'Siltinātāji',
      addReading: 'Pievienot rādījumu',
      readingHistory: 'Rādījumu vēsture',
      meterType: 'Siltinātāja tips',
      currentReading: 'Pašreizējais rādījums',
      previousReading: 'Iepriekšējais rādījums',
      consumption: 'Patēriņš',
      date: 'Datums',
      submitReading: 'Iesniegt rādījumu'
    },
    
    // Bills
    bills: {
      title: 'Rēķini',
      pending: 'Gaidāmi',
      paid: 'Samaksāti',
      overdue: 'Kavēti',
      amount: 'Summa',
      dueDate: 'Termiņš',
      status: 'Statuss',
      paymentMethod: 'Maksājuma veids',
      payNow: 'Maksāt tagad',
      paymentHistory: 'Maksājumu vēsture'
    },
    
    // News
    news: {
      title: 'Ziņas',
      readMore: 'Lasīt vairāk',
      published: 'Publicēts',
      category: 'Kategorija',
      priority: 'Prioritāte',
      important: 'Svarīgi',
      announcement: 'Paziņojums',
      maintenance: 'Uzturēšana',
      event: 'Notikums'
    },
    
    // Calendar
    calendar: {
      title: 'Kalendārs',
      today: 'Šodien',
      month: 'Mēnesis',
      week: 'Nedēļa',
      day: 'Diena',
      addEvent: 'Pievienot notikumu',
      eventDetails: 'Notikuma detaļas',
      startTime: 'Sākuma laiks',
      endTime: 'Beigu laiks',
      allDay: 'Visu dienu'
    },
    
    // Feedback
    feedback: {
      title: 'Atsauksmes',
      submitFeedback: 'Iesniegt atsauksmi',
      type: 'Tips',
      category: 'Kategorija',
      description: 'Apraksts',
      priority: 'Prioritāte',
      status: 'Statuss',
      open: 'Atvērts',
      inProgress: 'Procesā',
      resolved: 'Atrisināts',
      closed: 'Aizvērts'
    },
    
    // Parking
    parking: {
      title: 'Autostāvvieta',
      spaceNumber: 'Vietas numurs',
      status: 'Statuss',
      available: 'Brīva',
      occupied: 'Aizņemta',
      reserved: 'Rezervēta',
      assignedTo: 'Piešķirta',
      accessPass: 'Piekļuves karte',
      generatePass: 'Ģenerēt karti'
    },
    
    // Admin
    admin: {
      title: 'Administrācija',
      users: 'Lietotāji',
      addUser: 'Pievienot lietotāju',
      editUser: 'Rediģēt lietotāju',
      deleteUser: 'Dzēst lietotāju',
      systemSettings: 'Sistēmas iestatījumi',
      reports: 'Pārskati',
      backups: 'Dublējumi'
    },
    
    // Profile
    profile: {
      title: 'Profils',
      personalInfo: 'Personiskā informācija',
      changePassword: 'Mainīt paroli',
      preferences: 'Iestatījumi',
      language: 'Valoda',
      notifications: 'Paziņojumi',
      security: 'Drošība'
    }
  },
  
  en: {
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      close: 'Close',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information'
    },
    
    // Navigation
    navigation: {
      dashboard: 'Dashboard',
      meters: 'Meters',
      bills: 'Bills',
      news: 'News',
      calendar: 'Calendar',
      feedback: 'Feedback',
      parking: 'Parking',
      admin: 'Admin',
      profile: 'Profile',
      logout: 'Logout'
    },
    
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      upcomingEvents: 'Upcoming Events',
      pendingBills: 'Pending Bills',
      unreadNews: 'Unread News'
    },
    
    // Meters
    meters: {
      title: 'Meters',
      addReading: 'Add Reading',
      readingHistory: 'Reading History',
      meterType: 'Meter Type',
      currentReading: 'Current Reading',
      previousReading: 'Previous Reading',
      consumption: 'Consumption',
      date: 'Date',
      submitReading: 'Submit Reading'
    },
    
    // Bills
    bills: {
      title: 'Bills',
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      amount: 'Amount',
      dueDate: 'Due Date',
      status: 'Status',
      paymentMethod: 'Payment Method',
      payNow: 'Pay Now',
      paymentHistory: 'Payment History'
    },
    
    // News
    news: {
      title: 'News',
      readMore: 'Read More',
      published: 'Published',
      category: 'Category',
      priority: 'Priority',
      important: 'Important',
      announcement: 'Announcement',
      maintenance: 'Maintenance',
      event: 'Event'
    },
    
    // Calendar
    calendar: {
      title: 'Calendar',
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      addEvent: 'Add Event',
      eventDetails: 'Event Details',
      startTime: 'Start Time',
      endTime: 'End Time',
      allDay: 'All Day'
    },
    
    // Feedback
    feedback: {
      title: 'Feedback',
      submitFeedback: 'Submit Feedback',
      type: 'Type',
      category: 'Category',
      description: 'Description',
      priority: 'Priority',
      status: 'Status',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed'
    },
    
    // Parking
    parking: {
      title: 'Parking',
      spaceNumber: 'Space Number',
      status: 'Status',
      available: 'Available',
      occupied: 'Occupied',
      reserved: 'Reserved',
      assignedTo: 'Assigned To',
      accessPass: 'Access Pass',
      generatePass: 'Generate Pass'
    },
    
    // Admin
    admin: {
      title: 'Administration',
      users: 'Users',
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      systemSettings: 'System Settings',
      reports: 'Reports',
      backups: 'Backups'
    },
    
    // Profile
    profile: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      changePassword: 'Change Password',
      preferences: 'Preferences',
      language: 'Language',
      notifications: 'Notifications',
      security: 'Security'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('lv');
  const [t] = useState(() => {
    return (key, params = {}) => {
      const keys = key.split('.');
      let value = translations[currentLanguage];
      
      for (const k of keys) {
        if (value && value[k]) {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }
      
      // Replace parameters in translation
      if (typeof value === 'string') {
        Object.keys(params).forEach(param => {
          value = value.replace(`{${param}}`, params[param]);
        });
      }
      
      return value;
    };
  });

  // Change language
  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('language', language);
    }
  };

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    translations: translations[currentLanguage]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
