'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/Assetts.module.css';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [walletName, setWalletName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [isAmountConfirmed, setIsAmountConfirmed] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/fetchAssets');
        const data = await response.json();

        const assetsWithNetworks = data.map(asset => {
          let networks = [];

          switch (asset.symbol) {
            case 'btc':
              networks = [
                { id: 'btc-net1', name: 'BTC (Bitcoin Blockchain)', address: 'btc-bitcoin-address' },
                { id: 'btc-net2', name: 'BEP20 (Binance Smart Chain (BSC) Blockchain)', address: 'btc-BEP20-address' },
              ];
              break;
            case 'eth':
              networks = [
                { id: 'eth-net1', name: 'ERC20 (Ethereum Blockchain)', address: 'eth-erc20-address' },
              ];
              break;
            case 'usdt':
              networks = [
                { id: 'usdt-net1', name: 'USDT ERC20', address: 'usdt-erc20-address' },
                { id: 'usdt-net2', name: 'USDT TRC20', address: 'usdt-trc20-address' },
                { id: 'usdt-net3', name: 'USDT BEP20', address: 'usdt-bep20-address' },
              ];
              break;
            default:
              networks = [
                { id: 'null-network', name: 'Network1', address: 'network1-address' },
              ];
          }

          return {
            ...asset,
            networks,
          };
        });

        setAssets(assetsWithNetworks);
        setFilteredAssets(assetsWithNetworks);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchAssets();

    const token = localStorage.getItem('token');
    if (token) {
      setIsRegistered(true);
    }
  }, []);

  useEffect(() => {
    const filtered = assets.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssets(filtered);
  }, [searchTerm, assets]);

  const fetchUserIdFromToken = async () => {
    try {
      const response = await fetch('/api/getUserIdFromToken', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        return data.userId;
      } else {
        console.error('Failed to fetch user ID:', data.message);
        setMessage('Failed to fetch user ID.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user ID from token:', error);
      setMessage('Error fetching user ID.');
      return null;
    }
  };

  const handleAssetClick = (asset) => {
    if (!isRegistered) {
      setMessage('Please kindly register to get assets.');
      return;
    }

    setSelectedAsset(asset);
    setSelectedNetwork(null);
    setWalletAddress('');
    setAmount('');
    setIsAmountConfirmed(false);
  };

  const handleConfirmAmount = () => {
    if (!amount) {
      setMessage('Please enter the amount to be traded.');
      return;
    }

    setIsAmountConfirmed(true);
    setMessage(`Amount confirmed: $${amount} ${selectedAsset.symbol}`);
  };

  const handleNetworkClick = (network) => {
    if (!isAmountConfirmed) {
      setMessage('Please confirm the amount before selecting a network.');
      return;
    }

    if (!isRegistered) {
      setMessage('Please kindly register to get assets.');
      return;
    }

    setSelectedNetwork(network);
    setWalletAddress(network.address);
  };

  const handleSubmit = async () => {
    if (!isRegistered) {
      setMessage('Please kindly register to get assets.');
      return;
    }

    if (!transactionId || !walletName) {
      setMessage('Please provide both transaction ID and wallet name.');
      return;
    }

    const userId = await fetchUserIdFromToken();
    if (!userId) return;

    if (!selectedAsset || !selectedNetwork) {
      setMessage('Please select both asset and network.');
      return;
    }

    try {
      const response = await fetch(`/api/assetts/${selectedAsset.id}/${selectedNetwork.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          transactionId,
          walletName,
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit transaction');
      }

      setMessage('Transaction Process Completed. You will be credited in less than 5 mins! Check notifications on your dashboard.');

      setTimeout(() => {
        router.push('/dashboard');
      }, 3000); // 3-second delay
    } catch (error) {
      setMessage(`Failed to submit transaction: ${error.message}`);
    }
  };

  const handleGoBack = () => {
    if (selectedNetwork) {
      setSelectedNetwork(null);
    } else if (isAmountConfirmed) {
      setIsAmountConfirmed(false);
    } else if (selectedAsset) {
      setSelectedAsset(null);
    } else {
      router.push('/dashboard');
    }
  };

  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setMessage('Wallet address copied to clipboard!');
    }).catch(err => {
      setMessage('Failed to copy wallet address.');
      console.error('Copy failed:', err);
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headingPrimary}>Select an Asset</h1>
      {!isRegistered && <p className={styles.message}>Please register to proceed with asset transactions.</p>}
      <input
        type="text"
        placeholder="Search assets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      {!selectedAsset ? (
        <div>
          <button className={styles.button} onClick={() => router.push('/dashboard')}>
            Go Back to Dashboard
          </button>
          <ul className={styles.assetList}>
            {filteredAssets.map((asset) => (
              <li
                key={asset.id}
                onClick={() => handleAssetClick(asset)}
                className={styles.assetItem}
                style={{ cursor: isRegistered ? 'pointer' : 'not-allowed', opacity: isRegistered ? 1 : 0.5 }}
              >
                <Image src={asset.image} alt={asset.name} width={30} height={30} />
                {asset.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <button className={styles.button} onClick={handleGoBack}>
            Go Back
          </button>
          <h2 className={styles.headingSecondary}>{selectedAsset.name}</h2>
          {selectedNetwork ? (
            <div>
              <h4 className={styles.proof}>Send coin via the provided wallet address and enter the proof of transaction below.</h4>
              <p className={styles.walletAddress}>
                {walletAddress}
                <button className={styles.copyButton} onClick={handleCopyWalletAddress}>Copy</button>
              </p>
              <div>
                <input
                  type="text"
                  placeholder="Transaction ID from your wallet"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Name of Wallet Used"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className={styles.input}
                />
                <button className={styles.button} onClick={handleSubmit}>
                  Submit Transaction
                </button>
              </div>
              <p className={styles.message}>{message}</p>
            </div>
          ) : (
            <div>
              <h2 className={styles.headingSecondary}>Select a Network</h2>
              <div>
                {selectedAsset.networks.map((network) => (
                  <div
                    key={network.id}
                    onClick={() => handleNetworkClick(network)}
                    className={`${styles.networkItem} ${selectedNetwork?.id === network.id ? styles.selected : ''}`}
                  >
                    {network.name}
                  </div>
                ))}
                <div>
                  <input
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={styles.input}
                  />
                  <button className={styles.button} onClick={handleConfirmAmount}>
                    Confirm Amount
                  </button>
                </div>
                <p className={styles.message}>{message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
