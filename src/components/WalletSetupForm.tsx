import { Form, ActionPanel, Action, showToast, Toast, LocalStorage } from "@raycast/api";
import { useState } from "react";
import { WalletSetupFormProps, WalletInfo } from "../types";
import { validateSolanaAddress } from "../utils/formatters";
import { USER_WALLET_ADDRESSES_KEY, ACTIVE_WALLET_ADDRESS_KEY } from "../constants";

export function WalletSetupForm({ onWalletSet }: WalletSetupFormProps) {
  const [address, setAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);

  async function handleSubmit() {
    const { isValid, error: validationError } = validateSolanaAddress(address);
    if (!isValid) {
      setError(validationError);
      return;
    }
    setError(undefined);

    try {
      // Get existing wallets or initialize empty array
      const existingWalletsStr = await LocalStorage.getItem<string>(USER_WALLET_ADDRESSES_KEY);
      const existingWallets: WalletInfo[] = existingWalletsStr ? JSON.parse(existingWalletsStr) : [];

      // Check if wallet already exists
      if (existingWallets.some((wallet) => wallet.address === address)) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Wallet Already Exists",
          message: "This wallet address is already in your list",
        });
        return;
      }

      // Add new wallet
      const newWallet: WalletInfo = {
        address,
        name: name.trim() || undefined,
      };

      const updatedWallets = [...existingWallets, newWallet];

      // Save wallets
      await LocalStorage.setItem(USER_WALLET_ADDRESSES_KEY, JSON.stringify(updatedWallets));

      // Set as active wallet
      await LocalStorage.setItem(ACTIVE_WALLET_ADDRESS_KEY, address);

      await showToast({
        style: Toast.Style.Success,
        title: "Wallet Added",
        message: "Your Solana wallet has been added",
      });

      onWalletSet(newWallet);
    } catch (error) {
      console.error("Failed to save wallet:", error);
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Save Wallet",
        message: "An error occurred while saving your wallet",
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Wallet" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Add a Solana wallet to check balances and prepare transactions." />
      <Form.TextField
        id="walletAddress"
        title="Solana Wallet Address"
        placeholder="Enter public wallet address"
        value={address}
        error={error}
        onChange={setAddress}
        onBlur={() => {
          const { isValid, error: validationError } = validateSolanaAddress(address);
          setError(isValid ? undefined : validationError);
        }}
      />
      <Form.TextField
        id="walletName"
        title="Wallet Name (Optional)"
        placeholder="Enter a name for this wallet"
        value={name}
        onChange={setName}
      />
    </Form>
  );
}
