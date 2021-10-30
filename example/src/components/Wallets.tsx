import React, { useEffect, useState } from 'react'
import { getWalletsBalance } from '@impact-market/utils';

const blankWalletState = { celo: 0, ethereum: 0 };

const Wallets = () => {
    const [balance, setBalance] = useState(blankWalletState);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const getBalance = async () => {
            try {
                const balance = await getWalletsBalance({
                    etherscanApiKey: '<ETHERSCAN_API_KEY>',
                    wallets: {
                        bitcoin: '<BTC_WALLET_ADDRESS>',
                        celo: '<CELO_WALLET_ADDRESS>',
                        ethereum: '<ETH_WALLET_ADDRESS>'
                    }
                 });

                setBalance(balance);
                setIsLoading(false);
            } catch (error) {
                console.log(error);

                setIsLoading(false);
            }
        }

        getBalance();
    }, []);

    return (
        <div>
            <h1>Wallets balance</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <p><strong>Ethereum</strong> - {balance?.ethereum || 0}</p>
                    <p><strong>Celo</strong> - {balance?.celo || 0}</p>
                </div>
            )}
        </div>
    )
}

export default Wallets;
