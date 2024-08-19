'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Assetts.module.css';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [walletName, setWalletName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(''); // Amount to be traded
  const [isAmountConfirmed, setIsAmountConfirmed] = useState(false); // Track amount confirmation
  const [isRegistered, setIsRegistered] = useState(false); // Track registration status
  const router = useRouter(); // For redirection

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/fetchAssets');
        const data = await response.json();

        // Networks for each asset
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
            //Will add More assets and their networks as needed
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
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchAssets();

    // Check registration status
    const token = localStorage.getItem('token');
    if (token) {
      setIsRegistered(true); // User is registered only if token is present
    }
  }, []);

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
    setSelectedNetwork(null); // Reset network
    setWalletAddress(''); // Reset wallet address
    setAmount(''); // Reset amount
    setIsAmountConfirmed(false); // Reset amount confirmation
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

    // Validate selectedAsset and selectedNetwork are not null
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

      const result = await response.json();
      setMessage('Transaction Process Completed. You will be credited in less than 5 mins!');
      console.log(result);
    } catch (error) {
      setMessage(`Failed to submit transaction: ${error.message}`);
    }
  };

  const handleGoBack = () => {
    if (selectedNetwork) {
      setSelectedNetwork(null); // Go back to the networks list
    } else if (isAmountConfirmed) {
      setIsAmountConfirmed(false); // Go back to the amount confirmation step
    } else if (selectedAsset) {
      setSelectedAsset(null); // Go back to the assets list
    } else {
      router.push('/dashboard'); // Go back to the dashboard
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headingPrimary}>Select an Asset</h1>
      {!isRegistered && <p className={styles.message}>Please register to proceed with asset transactions.</p>}
      {!selectedAsset ? (
        <div>
          <button className={styles.button} onClick={() => router.push('/dashboard')}>
            Go Back to Dashboard
          </button>
          <ul className={styles.assetList}>
            {assets.map((asset) => (
              <li
                key={asset.id}
                onClick={() => handleAssetClick(asset)}
                className={styles.assetItem}
                style={{ cursor: isRegistered ? 'pointer' : 'not-allowed', opacity: isRegistered ? 1 : 0.5 }}
              >
                <img
                  src={asset.logo}
                  alt={asset.name}
                  width={30}
                  height={30}
                  className={styles.assetImage}
                />
                {asset.name} ({asset.symbol})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <button className={styles.button} onClick={handleGoBack}>
            Go Back
          </button>
          {!isAmountConfirmed ? (
            <div>
              <h3 className={styles.headingSecondary}>Confirm Trade Amount in $</h3>
              <input
                type="number"
                placeholder="Enter the dollar equivalent of the amount to be traded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.input}
              />
              <button className={styles.button} onClick={handleConfirmAmount}>
                Confirm Amount
              </button>
              {message && <p className={styles.message}>{message}</p>}
            </div>
          ) : (
            <div>
              <h3 className={styles.headingSecondary}>{selectedAsset.name} Networks</h3>
              <ul className={styles.assetList}>
                {selectedAsset.networks.map((network) => (
                  <li
                    key={network.id}
                    onClick={() => handleNetworkClick(network)}
                    className={`${styles.networkItem} ${selectedNetwork?.id === network.id ? styles.selected : ''}`}
                  >
                    {network.name}
                  </li>
                ))}
              </ul>

              {selectedNetwork && walletAddress && ( // Check if selectedNetwork is not null before rendering
                <div>
                  <h4 className={styles.headingSecondary}>
                    Send {selectedAsset.name} via {selectedNetwork.name} Network
                  </h4>
                  <p className={styles.wad}>Wallet Address: {walletAddress}</p>
                  <button
                    className={styles.button}
                    onClick={() => navigator.clipboard.writeText(walletAddress)}
                  >
                    Copy Wallet Address
                  </button>
                  <div>
                    <h3 className={styles.proof}>Enter Transaction Proof Here</h3>
                    <input
                      type="text"
                      placeholder="Enter your Transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Enter your Wallet Name"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      className={styles.input}
                    />
                    <button className={styles.button} onClick={handleSubmit}>
                      Complete Transaction
                    </button>
                  </div>
                  {message && <p className={styles.message}>{message}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
