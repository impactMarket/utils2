// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { Signer } from '@ethersproject/abstract-signer';
import { Web3Provider } from '@ethersproject/providers';

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
    initialised?: boolean;
};

const initialRewards: RewardsType = {
    claimable: 0,
    estimated: 0,
    initialised: false
};

const intialData: {
    provider: Web3Provider;
    signer: Signer | null;
    address: string | null;
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
    provider: Web3Provider;
    signer: Signer | null;
};

export const ImpactMarketProvider = (props: ProviderProps) => {
    const { children, address, provider, signer } = props;
    const [balance, setBalance] = useState<BalanceType>(initialBalance);
    const [epoch, setEpoch] = useState<EpochType>(initialEpoch);
    const [rewards, setRewards] = useState<RewardsType>(initialRewards);

    return (
        <ImpactMarketContext.Provider
            value={{
                provider,
                signer,
                address,
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
