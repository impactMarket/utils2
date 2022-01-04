// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { Signer } from '@ethersproject/abstract-signer';
import { BaseProvider } from '@ethersproject/providers';
import { getContracts } from '../utils/contracts';
import { PACTDelegate } from '../types/contracts/PACTDelegate';
import { Contract } from '@ethersproject/contracts';
import { PACTToken } from '../types/contracts/PACTToken';

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
    cusdAllowance?: number;
    cusd?: number;
    pact?: number;
};

const initialBalance: BalanceType = {
    cusdAllowance: 0,
    cusd: 0,
    pact: 0
};

export type RewardsType = {
    claimable?: number;
    estimated?: number;
    initialised?: boolean;
};

const initialRewards: RewardsType = {
    claimable: 0,
    estimated: 0,
    initialised: false
};

type ContractsType = {
    addresses?: {
        communityAdmin?: string;
        cusd?: string;
        delegate?: string;
        delegator?: string;
        donationMiner?: string;
        pactToken?: string;
        merkleDistributor?: string;
    };
    cusd?: Contract;
    delegate?: Contract & PACTDelegate;
    donationMiner?: Contract;
    pact?: Contract & PACTToken;
    merkleDistributor?: Contract;
};

const initialContractsState = {
    addresses: undefined,
    cusd: undefined,
    delegate: undefined,
    donationMiner: undefined,
    pact: undefined,
    merkleDistributor: undefined
};

const intialData: {
    provider: BaseProvider;
    signer: Signer | null;
    address: string | null;
    contracts: ContractsType;
    balance?: BalanceType;
    rewards?: RewardsType;
    epoch?: EpochType;
    setBalance: Function;
    setEpoch: Function;
    setRewards: Function;
} = {
    provider: null as any, // mandatory, value here doesn't matter
    signer: null,
    address: null,
    contracts: initialContractsState,
    balance: initialBalance,
    epoch: initialEpoch,
    rewards: initialRewards,
    setBalance: () => {},
    setEpoch: () => {},
    setRewards: () => {}
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
    const [contracts, setContracts] = useState<ContractsType>(
        initialContractsState
    );
    const [balance, setBalance] = useState<BalanceType>(initialBalance);
    const [epoch, setEpoch] = useState<EpochType>(initialEpoch);
    const [rewards, setRewards] = useState<RewardsType>(initialRewards);

    useEffect(() => {
        const getContractsInstances = async () => {
            setContracts(await getContracts(provider, signer));
        };

        if (provider) {
            getContractsInstances();
        }
    }, [provider, signer]);

    return (
        <ImpactMarketContext.Provider
            value={{
                provider,
                signer,
                address,
                contracts,
                balance,
                epoch,
                rewards,
                setBalance,
                setEpoch,
                setRewards
            }}
        >
            {children}
        </ImpactMarketContext.Provider>
    );
};
