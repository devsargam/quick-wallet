export interface UseSolanaBalanceReturn {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface SplTokenBalance {
  mintAddress: string;
  uiAmount: number;
  symbol: string;
  name: string;
  decimals: number;
}

export interface UseSplTokenBalancesReturn {
  tokenBalances: SplTokenBalance[];
  isLoading: boolean;
  error: string | null;
}

export interface SendFormProps {
  tokenSymbol: string;
  tokenDecimals: number;
  mintAddress?: string;
  senderAddress: string;
}

export interface WalletSetupFormProps {
  onWalletSet: (wallet: WalletInfo) => void;
}

export interface BalancesViewProps {
  walletAddress: string;
  onChangeWallet: () => void;
  onSwitchWallet: () => void;
}

export interface SolanaPriceData {
  price: number;
  priceChange24h: number;
}

export interface TokenPriceData {
  price: number;
  priceChange24h: number;
}


export interface WalletInfo {
  address: string;
  name?: string;
}

export interface WalletSelectorProps {
  wallets: WalletInfo[];
  activeWallet: WalletInfo | null;
  onSelectWallet: (wallet: WalletInfo) => void;
  onAddWallet: () => void;
  onDeleteWallet: (address: string) => void;
}
