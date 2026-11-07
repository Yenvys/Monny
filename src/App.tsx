import React, { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { RecapView } from './components/RecapView';
import { SettingsView } from './components/SettingsView';
import { BottomNav, type NavTab } from './components/BottomNav';
import { TransactionModal } from './components/TransactionModal';
import { AppSplashScreen } from './components/AppSplashScreen';
import type { Transaction } from './types';

export const AppContent: React.FC = () => {
  const { currency, language } = useWallet();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTxForEdit, setSelectedTxForEdit] = useState<Transaction | null>(null);

  const handleOpenAddModal = () => {
    setSelectedTxForEdit(null);
    setIsModalOpen(true);
  };

  const handleSelectTransaction = (tx: Transaction) => {
    setSelectedTxForEdit(tx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTxForEdit(null);
  };

  return (
    <div
      key={`app-${language}-${currency}`}
      className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex justify-center transition-colors duration-200"
    >
      {/* Animated App Splash / Launch Screen (plays only once on app startup) */}
      <AppSplashScreen />

      <div className="w-full max-w-md min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 border-x border-neutral-200 dark:border-neutral-900 shadow-xl relative">
        {/* Sticky App Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 px-4 py-4 pb-28 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddModal={handleOpenAddModal}
              onGoToTransactions={() => setActiveTab('transactions')}
              onSelectTransaction={handleSelectTransaction}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionHistoryView onSelectTransaction={handleSelectTransaction} />
          )}

          {activeTab === 'recap' && <RecapView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Modal for New or Edit Transaction */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={selectedTxForEdit}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
