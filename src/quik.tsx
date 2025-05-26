import { LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { USER_WALLET_ADDRESSES_KEY, ACTIVE_WALLET_ADDRESS_KEY, USER_WALLET_ADDRESS_KEY } from "./constants";
import { WalletSetupForm } from "./components/WalletSetupForm";
import { BalancesView } from "./components/BalancesView";
import { WalletSelector } from "./components/WalletSelector";
import { WalletInfo } from "./types";
import { List } from "@raycast/api";

export default function Command() {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [activeWallet, setActiveWallet] = useState<WalletInfo | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredWallets() {
      try {
        await migrateFromLegacyWallet();

        const walletsStr = await LocalStorage.getItem<string>(USER_WALLET_ADDRESSES_KEY);

        const storedWallets: WalletInfo[] = walletsStr ? JSON.parse(walletsStr) : [];

        setWallets(storedWallets);

        const activeAddress = await LocalStorage.getItem<string>(ACTIVE_WALLET_ADDRESS_KEY);

        if (activeAddress && storedWallets.length > 0) {
          const active = storedWallets.find((wallet) => wallet.address === activeAddress) || storedWallets[0];
          setActiveWallet(active);
          // Ensure the active address is stored in case we defaulted to the first wallet
          await LocalStorage.setItem(ACTIVE_WALLET_ADDRESS_KEY, active.address);
        }
      } catch (error) {
        console.error("Failed to load wallet information:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredWallets();
  }, []);

  // Migrate from legacy wallet storage format
  const migrateFromLegacyWallet = async () => {
    try {
      const legacyWalletAddress = await LocalStorage.getItem<string>(USER_WALLET_ADDRESS_KEY);

      if (legacyWalletAddress) {
        // Check if we already have wallets in the new format
        const walletsStr = await LocalStorage.getItem<string>(USER_WALLET_ADDRESSES_KEY);

        if (!walletsStr) {
          // Create a new wallet list with the legacy wallet
          const migratedWallets: WalletInfo[] = [{ address: legacyWalletAddress }];
          await LocalStorage.setItem(USER_WALLET_ADDRESSES_KEY, JSON.stringify(migratedWallets));
          await LocalStorage.setItem(ACTIVE_WALLET_ADDRESS_KEY, legacyWalletAddress);

          // Clean up the old key (optional)
          await LocalStorage.removeItem(USER_WALLET_ADDRESS_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to migrate legacy wallet:", error);
    }
  };

  const handleAddWallet = () => {
    setShowWalletSelector(false);
    setActiveWallet(null); // This will show the wallet setup form
  };

  const handleChangeWallet = async () => {
    setShowWalletSelector(false);
    setActiveWallet(null);
  };

  const handleSwitchWallet = () => {
    setShowWalletSelector(true);
  };

  const handleSelectWallet = async (wallet: WalletInfo) => {
    await LocalStorage.setItem(ACTIVE_WALLET_ADDRESS_KEY, wallet.address);
    setActiveWallet(wallet);
    setShowWalletSelector(false);
  };

  const handleDeleteWallet = async (address: string) => {
    const updatedWallets = wallets.filter((wallet) => wallet.address !== address);
    await LocalStorage.setItem(USER_WALLET_ADDRESSES_KEY, JSON.stringify(updatedWallets));

    // If the deleted wallet was active, switch to another one
    if (activeWallet?.address === address && updatedWallets.length > 0) {
      const newActive = updatedWallets[0];
      await LocalStorage.setItem(ACTIVE_WALLET_ADDRESS_KEY, newActive.address);
      setActiveWallet(newActive);
    }

    setWallets(updatedWallets);
  };

  const handleWalletSet = async (newWallet: WalletInfo) => {
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    setActiveWallet(newWallet);
  };

  const renderContent = () => {
    if (isLoading) {
      return <List isLoading={true} searchBarPlaceholder="Loading..." />;
    }

    if (showWalletSelector) {
      return (
        <WalletSelector
          wallets={wallets}
          activeWallet={activeWallet}
          onSelectWallet={handleSelectWallet}
          onAddWallet={handleAddWallet}
          onDeleteWallet={handleDeleteWallet}
        />
      );
    }

    if (!activeWallet) {
      return <WalletSetupForm onWalletSet={handleWalletSet} />;
    }

    return (
      <BalancesView
        walletAddress={activeWallet.address}
        onChangeWallet={handleChangeWallet}
        onSwitchWallet={handleSwitchWallet}
      />
    );
  };

  return <QueryClientProvider client={queryClient}>{renderContent()}</QueryClientProvider>;
}
