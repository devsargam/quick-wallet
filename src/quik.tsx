import { LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { USER_WALLET_ADDRESS_KEY } from "./constants";
import { WalletSetupForm } from "./components/WalletSetupForm";
import { BalancesView } from "./components/BalancesView";

export default function Command() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredWalletAddress() {
      try {
        const storedAddress = await LocalStorage.getItem<string>(USER_WALLET_ADDRESS_KEY);
        setWalletAddress(storedAddress || null);
      } catch (error) {
        console.error("Failed to load wallet address:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredWalletAddress();
  }, []);

  const handleChangeWallet = async () => {
    await LocalStorage.removeItem(USER_WALLET_ADDRESS_KEY);
    setWalletAddress(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading || !walletAddress ? (
        <WalletSetupForm onWalletSet={setWalletAddress} />
      ) : (
        <BalancesView walletAddress={walletAddress} onChangeWallet={handleChangeWallet} />
      )}
    </QueryClientProvider>
  );
}
