import { CaskSDK } from '@caskprotocol/sdk';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
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
            providerAddress = '';
            break;
    }

    return providerAddress;
}

export const useCaskFi = () => {
    const { address, connection, networkId } = useContext(ImpactProviderContext);
    const [fundingSource, setFundingSource] = React.useState(-1);

    const cask = new CaskSDK({
        connections: {
            signer: new Web3Provider(connection.web3.currentProvider as ExternalProvider).getSigner()
        },
        environment: CaskSDK.environments.TESTNET,
        initialChainId: CaskSDK.chains.CELO_TESTNET.chainId,
        ipfs: {
            pinataApiKey: '',
            pinataApiSecret: ''
        }
    });

    useEffect(() => {
        const load = async () => {
            await cask.init();
            
            const fundingSource_ = await cask.vault.getFundingSource(address);
            
            setFundingSource(fundingSource_.fundingSource);
            



            // const providerAddress = '0x7110b4Df915cb92F53Bc01cC9Ab15F51e5DBb52F';
            // const providerProfile = await cask.subscriptionPlans.loadProfile({ address: providerAddress });

            // console.log({ providerProfile });
            // const planInfo = providerProfile.getPlan(planId);

            // console.log(`Subscribing to plan ${planInfo.name}`)

            // await cask.vault.setFundingSource({ fundingSource: 1 });
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

        return providerProfile.plans as SubscriptionPlanType[];
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

        return cask.subscriptions.getConsumerSubscriptions({
            planId,
            provider: providerAddress
        });
    };

    /**
     * Unsubscribe a plan
     * @param {number} subscriptionId Subscription id to unsubscribe
     * @returns {Promise<any>} Transaction details
     */
    const unsubscribe = (subscriptionId: number): Promise<any> =>
        cask.subscriptions.getConsumerSubscriptions(subscriptionId);

    /**
     * Set funding source to personal wallet
     * @returns {Promise<void>} void
     */
    const changeFundingSource = (): Promise<void> => cask.vault.setFundingSource({ fundingSource: 1 });

    return {
        changeFundingSource,
        fundingSource,
        getConsumerSubscriptionsDetails,
        getPlans,
        subscribe,
        unsubscribe
    };
};
