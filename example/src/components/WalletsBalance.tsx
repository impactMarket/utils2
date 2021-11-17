import React, { useEffect, useState } from 'react'
import { getWalletsBalance } from '@impact-market/utils';

const blankWalletState = { celo: 0, ethereum: 0 };

const wallets = {
    etherscanApiKey: '<ETHERSCAN_API_KEY>',
    wallets: {
        bitcoin: '<BITCOIN_ADDRESS>',
        celo: '<CELO_ADDRESS>',
        ethereum: '<ETHEREUM_ADDRESS>'
    }
}

const WalletsBalance = () => {
    const [balance, setBalance] = useState(blankWalletState);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const getBalance = async () => {
            try {
                const balance = await getWalletsBalance(wallets);

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
            <h2>Wallets balance</h2>
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

export default WalletsBalance;
