import { List, ActionPanel, Action, Icon, Color, showToast, Toast, confirmAlert, Alert } from "@raycast/api";
import { WalletSelectorProps, WalletInfo } from "../types";
import { formatSolanaAddress } from "../utils/formatters";

export function WalletSelector({
  wallets,
  activeWallet,
  onSelectWallet,
  onAddWallet,
  onDeleteWallet,
}: WalletSelectorProps) {
  const handleDeleteWallet = async (wallet: WalletInfo) => {
    // Don't allow deleting if it's the only wallet
    if (wallets.length <= 1) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Cannot Delete",
        message: "You need at least one wallet",
      });
      return;
    }

    const confirmed = await confirmAlert({
      title: "Delete Wallet",
      message: `Are you sure you want to delete ${wallet.name || formatSolanaAddress(wallet.address)}?`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      onDeleteWallet(wallet.address);
    }
  };

  return (
    <List navigationTitle="Switch Wallet" searchBarPlaceholder="Search wallets...">
      {wallets.map((wallet) => (
        <List.Item
          key={wallet.address}
          title={wallet.name || formatSolanaAddress(wallet.address)}
          subtitle={wallet.name ? formatSolanaAddress(wallet.address) : ""}
          icon={
            wallet.address === activeWallet?.address
              ? { source: Icon.Checkmark, tintColor: Color.Green }
              : { source: Icon.Wallet }
          }
          actions={
            <ActionPanel>
              <Action
                title="Select Wallet"
                onAction={() => onSelectWallet(wallet)}
                shortcut={{ modifiers: ["cmd"], key: "return" }}
              />
              <Action
                title="Delete Wallet"
                icon={{ source: Icon.Trash, tintColor: Color.Red }}
                shortcut={{ modifiers: ["ctrl"], key: "x" }}
                onAction={() => handleDeleteWallet(wallet)}
                style={Action.Style.Destructive}
              />
            </ActionPanel>
          }
        />
      ))}
      <List.Item
        title="Add New Wallet"
        icon={{ source: Icon.Plus, tintColor: Color.Blue }}
        actions={
          <ActionPanel>
            <Action title="Add Wallet" onAction={onAddWallet} />
          </ActionPanel>
        }
      />
    </List>
  );
}
