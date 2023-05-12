import { CaskSDK } from '@caskprotocol/sdk';
import { ExternalProvider, TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { ImpactProviderContext } from './ImpactProvider';
import { networksId } from './config';
import React, { useContext, useEffect } from 'react';

type SubscriptionPlanType = {
    price: string;
    planId: number;
    period: number;
    name: string;
    gracePeriod: number;
};

function getProviderAddress(networkId: number): string {
    let providerAddress = '';

    switch (networkId) {
        case networksId.CeloAlfajores:
            providerAddress = '0x7110b4Df915cb92F53Bc01cC9Ab15F51e5DBb52F';
            break;
        case networksId.CeloMainnet:
            providerAddress = '0xd9CA091aF9A1716249dFbFD01Aa2ed47D47ea5C3';
            break;
    }

    return providerAddress;
}

export const useCaskFi = (ipfs: { pinataApiKey: string; pinataApiSecret: string }) => {
    const { connection, networkId } = useContext(ImpactProviderContext);
    const [isReady, setIsReady] = React.useState(false);
    const [cask, setCask] = React.useState<any>(null);

    useEffect(() => {
        const load = async () => {
            const cask_ = new CaskSDK({
                connections: {
                    signer: new Web3Provider(connection.web3.currentProvider as ExternalProvider).getSigner()
                },
                // environment: CaskSDK.environments.TESTNET,
                // initialChainId: CaskSDK.chains.CELO_TESTNET.chainId,
                environment: CaskSDK.environments.PRODUCTION,
                initialChainId: CaskSDK.chains.CELO_MAINNET.chainId,
                ipfs
            });

            await cask_.init();

            setCask(cask_);
            setIsReady(true);
        };

        load();
    }, []);

    /**
     * Get plans
     * @returns {Promise<SubscriptionPlanType[]>} Plans
     * @example
     * const plans = await getPlans();
     * console.log(plans);
     * // [
     * //   {
     * //     price: '1000000000000000000',
     * //     planId: 1,
     * //     period: 2592000,
     * //     name: 'Basic',
     * //     gracePeriod: 86400
     * //   }
     * // ]
     */
    const getPlans = async (): Promise<SubscriptionPlanType[]> => {
        const providerAddress = getProviderAddress(networkId);
        const providerProfile = await cask.subscriptionPlans.loadProfile({ address: providerAddress });

        return Object.entries(providerProfile.plans).map(([, plan]) => plan) as SubscriptionPlanType[];
    };

    const getConsumerSubscriptionsDetails = async () => {
        const subscriptions = await cask.subscriptions.getConsumerSubscriptions();
        const result = [];

        for (let i = 0; i < subscriptions.length; i++) {
            const subscription = await cask.subscriptions.get(subscriptions[i]);

            result.push(subscription);
        }

        return result;
    };

    /**
     * Subscribe a plan
     * @param {number} planId Plan id to subscribe
     * @returns {Promise<any>} Subscription details
     */
    const subscribe = (planId: number): Promise<any> => {
        const providerAddress = getProviderAddress(networkId);

        return cask.subscriptions.create({
            planId,
            provider: providerAddress
        });
    };

    /**
     * Unsubscribe a plan
     * @param {number} subscriptionId Subscription id to unsubscribe
     * @returns {Promise<TransactionResponse>} TransactionResponse
     */
    const unsubscribe = (subscriptionId: number): Promise<TransactionResponse> =>
        cask.subscriptions.cancel(subscriptionId);

    /**
     * Set funding source to personal wallet
     * @returns {Promise<TransactionResponse>} TransactionResponse
     */
    const changeFundingSource = (): Promise<TransactionResponse> => cask.vault.setFundingSource({ fundingSource: 1 });

    return {
        changeFundingSource,
        getConsumerSubscriptionsDetails,
        getPlans,
        isReady,
        subscribe,
        unsubscribe
    };
};
