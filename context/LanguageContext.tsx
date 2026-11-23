'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Global Header
    'search_placeholder': 'Search vouchers, customers, orders...',
    'hq_indicator': 'Afri-Techs Guinée (HQ - Conakry)',
    'live_db': 'Live DB',
    'system_notifications': 'System Notifications',
    'new_notifications': '3 New',
    'toggle_sidebar': 'Toggle Sidebar',
    'toggle_fullscreen': 'Toggle Fullscreen',
    'switch_language': 'Switch Language',
    'english': 'English',
    'french': 'Français',
    'my_account': 'My Account',
    'access_rights': 'Access Rights',

    // Core Sidebar Navigation
    'core_modules': 'Core Modules',
    'admin_overview': 'Admin Overview',
    'crm_module': 'CRM Module',
    'procurement_module': 'Procurement Module',
    'accounts_module': 'Accounts Module',
    'companies': 'Companies',
    'administration': 'Administration',
    'sign_out': 'Sign Out',
    'finance': 'Finance',
    'sales': 'Sales',
    'supply': 'Supply',

    // Dashboard Overview
    'current_month_orders': 'Current Month Orders',
    'active_sales_orders': 'Active sales orders',
    'total_customers': 'Total Customers',
    'registered_client_accounts': 'Registered client accounts',
    'pending_quotation_action': 'Pending For Action - Quotation',
    'pending_delivery_action': 'Pending For Action - Delivery',
    'view_in_crm': 'View in CRM',
    'view_compliance': 'View Compliance',
    'date': 'Date',
    'customer': 'Customer',
    'enquiry_ref': 'Enquiry Ref',
    'sales_order': 'Sales Order',
    'lpo_ref': 'LPO Ref',

    // Common CRUD & Actions
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'close': 'Close',
    'search': 'Search',
    'filter': 'Filter',
    'actions': 'Actions',
    'sl_no': 'Sl no',
    'code': 'Code',
    'name': 'Name',
    'status': 'Status',
    'unit': 'Unit',
    'quantity': 'Quantity',
    'price': 'Price',
    'stock': 'Stock',
    'in_stock': 'In Stock',
    'low_stock': 'Low Stock',
    'out_of_stock': 'Out of Stock',
    'total': 'Total',
    'amount': 'Amount',

    // CRM Tabs
    'products': 'Products',
    'product_head': 'Product Head',
    'customer_creation': 'Customer Creation',
    'sales_quotation': 'Sales Quotation',
    'delivery_note': 'Delivery Note',
    'cash_invoice': 'Cash Invoice',
    'credit_invoice': 'Credit Invoice',
    'sales_return': 'Sales Return',
    'pro_forma_invoice': 'Pro Forma Invoice',

    // Procurement Tabs
    'vendor': 'Vendor',
    'material_requisition': 'Material Requisition',
    'purchase_order': 'Purchase Order',
    'material_received_note': 'Material Received Note',
    'purchase_voucher': 'Purchase Voucher',
    'purchase_return': 'Purchase Return',

    // Accounts Tabs
    'chart_of_accounts': 'Chart of Accounts',
    'account_heads': 'Account Heads',
    'receipt_voucher': 'Receipt Voucher',
    'payment_voucher': 'Payment Voucher',
    'journal_voucher': 'Journal Voucher',
    'petty_cash': 'Petty Cash'
  },
  fr: {
    // Top Bar & Global Header
    'search_placeholder': 'Rechercher pièces, clients, commandes...',
    'hq_indicator': 'Afri-Techs Guinée (Siège - Conakry)',
    'live_db': 'BD Directe',
    'system_notifications': 'Notifications Système',
    'new_notifications': '3 Nouvelles',
    'toggle_sidebar': 'Basculer le menu latéral',
    'toggle_fullscreen': 'Plein écran',
    'switch_language': 'Changer de langue',
    'english': 'English',
    'french': 'Français',
    'my_account': 'Mon Compte',
    'access_rights': 'Droits d’Accès',

    // Core Sidebar Navigation
    'core_modules': 'Modules Principaux',
    'admin_overview': 'Tableau de Bord',
    'crm_module': 'Module CRM & Ventes',
    'procurement_module': 'Module Approvisionnement',
    'accounts_module': 'Module Comptabilité',
    'companies': 'Entreprises',
    'administration': 'Administration',
    'sign_out': 'Déconnexion',
    'finance': 'Finance',
    'sales': 'Ventes',
    'supply': 'Achats',

    // Dashboard Overview
    'current_month_orders': 'Commandes du Mois',
    'active_sales_orders': 'Commandes de vente actives',
    'total_customers': 'Total Clients',
    'registered_client_accounts': 'Comptes clients enregistrés',
    'pending_quotation_action': 'En Attente d’Action - Devis',
    'pending_delivery_action': 'En Attente d’Action - Livraison',
    'view_in_crm': 'Voir dans le CRM',
    'view_compliance': 'Voir la Conformité',
    'date': 'Date',
    'customer': 'Client',
    'enquiry_ref': 'Réf. Demande',
    'sales_order': 'Bon de Commande',
    'lpo_ref': 'Réf. Bon de Commande',

    // Common CRUD & Actions
    'add': 'Ajouter',
    'edit': 'Modifier',
    'delete': 'Supprimer',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'close': 'Fermer',
    'search': 'Rechercher',
    'filter': 'Filtrer',
    'actions': 'Actions',
    'sl_no': 'N°',
    'code': 'Code',
    'name': 'Nom',
    'status': 'Statut',
    'unit': 'Unité',
    'quantity': 'Quantité',
    'price': 'Prix',
    'stock': 'Stock',
    'in_stock': 'En Stock',
    'low_stock': 'Stock Faible',
    'out_of_stock': 'Rupture',
    'total': 'Total',
    'amount': 'Montant',

    // CRM Tabs
    'products': 'Produits',
    'product_head': 'Catégories Produits',
    'customer_creation': 'Création Client',
    'sales_quotation': 'Devis de Vente',
    'delivery_note': 'Bordereau de Livraison',
    'cash_invoice': 'Facture Comptant',
    'credit_invoice': 'Facture à Crédit',
    'sales_return': 'Retour sur Vente',
    'pro_forma_invoice': 'Facture Pro Forma',

    // Procurement Tabs
    'vendor': 'Fournisseurs',
    'material_requisition': 'Demande d’Achat',
    'purchase_order': 'Bon de Commande Achat',
    'material_received_note': 'Bon de Réception',
    'purchase_voucher': 'Facture d’Achat',
    'purchase_return': 'Retour Fournisseur',

    // Accounts Tabs
    'chart_of_accounts': 'Plan Comptable',
    'account_heads': 'Comptes Principaux',
    'receipt_voucher': 'Pièce d’Encaissement',
    'payment_voucher': 'Pièce de Paiement',
    'journal_voucher': 'Pièce de Journal',
    'petty_cash': 'Petite Caisse'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('afri_lang') as Language;
      if (stored === 'en' || stored === 'fr') {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      // fallback to English
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('afri_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'fr' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
