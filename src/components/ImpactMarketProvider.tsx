// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { Signer } from '@ethersproject/abstract-signer';
import { BaseProvider } from '@ethersproject/providers';
import { getContracts } from '../utils/contracts';
import { toNumber } from '../helpers/toNumber';
import {
    getClaimableRewards,
    getEstimatedClaimableRewards,
    getLastEpochsDonations,
    updateEpochData,
    updateUserContributionData
} from '../hooks/updater';

export type EpochType = {
    endPeriod?: string;
    rewards?: number;
    totalRaised?: number;
    userContribution?: number;
};

const initialEpoch = {
    endPeriod: undefined,
    rewards: 0,
    totalRaised: 0,
    userContribution: 0
};

export type BalanceType = {
    cusd?: number;
    pact?: number;
};

const initialBalance: BalanceType = {
    cusd: 0,
    pact: 0
};

export type RewardsType = {
    claimable?: number;
    estimated?: number;
    donations: {
        user: number;
        everyone: number;
    };
    initialised?: boolean;
};

const initialRewards: RewardsType = {
    claimable: 0,
    estimated: 0,
    donations: {
        user: 0,
        everyone: 0
    },
    initialised: false
};

const intialData: {
    provider: BaseProvider;
    signer: Signer | null;
    address: string | null;
    balance?: BalanceType;
    rewards?: RewardsType;
    epoch?: EpochType;
    updatePACTBalance: any;
    updateCUSDBalance: any;
    updateRewards: any;
    updateEpoch: any;
} = {
    provider: null as any, // mandatory, value here doesn't matter
    signer: null,
    address: null,
    balance: initialBalance,
    epoch: initialEpoch,
    rewards: initialRewards,
    updatePACTBalance: () => {},
    updateCUSDBalance: () => {},
    updateRewards: () => {},
    updateEpoch: () => {}
};

export const ImpactMarketContext = React.createContext(intialData);

type ProviderProps = {
    children?: any;
    address: string | null;
    provider: BaseProvider;
    signer: Signer | null;
};

export const ImpactMarketProvider = (props: ProviderProps) => {
    const { children, address, provider, signer } = props;
    const [balance, setBalance] = useState<BalanceType>(initialBalance);
    const [epoch, setEpoch] = useState<EpochType>(initialEpoch);
    const [rewards, setRewards] = useState<RewardsType>(initialRewards);

    const updatePACTBalance = async () => {
        const { pact: pactContract } = await getContracts(provider);
        if (!address || !pactContract?.provider) {
            return;
        }

        try {
            const [pactBalance] = await Promise.all([
                pactContract?.balanceOf(address)
            ]);

            const pact = toNumber(pactBalance);

            return setBalance((balance: BalanceType) => ({
                ...balance,
                pact
            }));
        } catch (error) {
            console.log(`Error getting balance...\n${error}`);
        }
    };

    const updateCUSDBalance = async () => {
        const { cusd, donationMiner } = await getContracts(provider);
        if (!address || !donationMiner?.provider || !cusd?.provider) {
            return;
        }

        try {
            const cUSDBalance = await cusd?.balanceOf(address);
            const cUSD = toNumber(cUSDBalance);

            return setBalance((balance: BalanceType) => ({
                ...balance,
                cusd: cUSD
            }));
        } catch (error) {
            console.log(`Error getting balance...\n${error}`);
        }
    };

    const updateRewards = async () => {
        if (!address) {
            return;
        }
        const { donationMiner } = await getContracts(provider);
        const [estimated, claimable, donations] = await Promise.all([
            getEstimatedClaimableRewards(donationMiner, address),
            getClaimableRewards(donationMiner, address),
            getLastEpochsDonations(donationMiner, address),
            updatePACTBalance!()
        ]);

        setRewards((rewards: RewardsType) => ({
            ...rewards,
            estimated,
            claimable,
            donations,
            initialised: true
        }));
    };

    const updateEpoch = async () => {
        if (!address) {
            return;
        }
        const [epochData, userContributionData] = await Promise.all([
            updateEpochData(provider),
            updateUserContributionData(provider, address)
        ]);
        setEpoch((epoch: EpochType) => ({
            ...epoch,
            ...epochData,
            ...userContributionData
        }));
    };

    return (
        <ImpactMarketContext.Provider
            value={{
                provider,
                signer,
                address,
                balance,
                epoch,
                rewards,
                updatePACTBalance,
                updateCUSDBalance,
                updateRewards,
                updateEpoch
            }}
        >
            {children}
        </ImpactMarketContext.Provider>
    );
};
