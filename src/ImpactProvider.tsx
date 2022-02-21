// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import type { BaseProvider } from '@ethersproject/providers';
import type { Signer } from '@ethersproject/abstract-signer';

export type EpochType = {
    endPeriod?: string;
    rewards: number;
    totalRaised: number;
    userContribution: number;
    donations: {
        user: number;
        everyone: number;
    };
    initialised: boolean;
};

const initialEpoch = {
    donations: {
        everyone: 0,
        user: 0,
    },
    endPeriod: undefined,
    initialised: false,
    rewards: 0,
    totalRaised: 0,
    userContribution: 0,
};

export type BalanceType = {
    cusd: number;
    pact: number;
};

export type RewardsType = {
    allocated: number;
    currentEpoch: number;
    claimable: number;
    estimated: number;
    initialised: boolean;
};

const initialRewards: RewardsType = {
    allocated: 0,
    claimable: 0,
    currentEpoch: 0,
    estimated: 0,
    initialised: false
};

const intialProviderData: {
    provider: BaseProvider;
    signer: Signer | null;
    address: string | null;
} = {
    // mandatory, value here doesn't matter
    address: null,
    provider: null as any,
    signer: null,
};

const intialCUSDBalanceStateData: {
    balance: number;
    setBalance: React.Dispatch<React.SetStateAction<number>>;
} = {
    balance: 0,
    setBalance: () => {}
};

const intialPACTBalanceStateData: {
    balance: number;
    setBalance: React.Dispatch<React.SetStateAction<number>>;
} = {
    balance: 0,
    setBalance: () => {}
};

const intialEpochStateData: {
    epoch: EpochType;
    setEpoch: React.Dispatch<React.SetStateAction<EpochType>>;
} = {
    epoch: initialEpoch,
    setEpoch: () => {}
};

const intialRewardsStateData: {
    rewards: RewardsType;
    setRewards: React.Dispatch<React.SetStateAction<RewardsType>>;
} = {
    rewards: initialRewards,
    setRewards: () => {}
};

export const ImpactProviderContext = React.createContext(intialProviderData);
export const CUSDBalanceContext = React.createContext(
    intialCUSDBalanceStateData
);
export const PACTBalanceContext = React.createContext(
    intialPACTBalanceStateData
);
export const EpochContext = React.createContext(intialEpochStateData);
export const RewardsContext = React.createContext(intialRewardsStateData);

type ProviderProps = {
    children?: any;
    address: string | null;
    provider: BaseProvider;
    signer: Signer | null;
};

const CUSDBalanceProvider = React.memo((props: { children?: any }) => {
    const { children } = props;
    const [cUSDBalance, setCUSDBalance] = useState<number>(0);

    return (
        <CUSDBalanceContext.Provider
            value={{
                balance: cUSDBalance,
                setBalance: setCUSDBalance
            }}
        >
            {children}
        </CUSDBalanceContext.Provider>
    );
});

const PACTBalanceProvider = React.memo((props: { children?: any }) => {
    const { children } = props;
    const [PACTBalance, setPACTBalance] = useState<number>(0);

    return (
        <PACTBalanceContext.Provider
            value={{
                balance: PACTBalance,
                setBalance: setPACTBalance
            }}
        >
            {children}
        </PACTBalanceContext.Provider>
    );
});

const EpochProvider = React.memo((props: { children?: any }) => {
    const { children } = props;
    const [epoch, setEpoch] = useState<EpochType>(initialEpoch);

    return (
        <EpochContext.Provider
            value={{
                epoch,
                setEpoch
            }}
        >
            {children}
        </EpochContext.Provider>
    );
});

const RewardsProvider = React.memo((props: { children?: any }) => {
    const { children } = props;
    const [rewards, setRewards] = useState<RewardsType>(initialRewards);

    return (
        <RewardsContext.Provider
            value={{
                rewards,
                setRewards
            }}
        >
            {children}
        </RewardsContext.Provider>
    );
});

export const ImpactProvider = (props: ProviderProps) => {
    const { children, address, provider, signer } = props;

    return (
        <ImpactProviderContext.Provider
            value={{
                address,
                provider,
                signer,
            }}
        >
            <RewardsProvider>
                <EpochProvider>
                    <PACTBalanceProvider>
                        <CUSDBalanceProvider>{children}</CUSDBalanceProvider>
                    </PACTBalanceProvider>
                </EpochProvider>
            </RewardsProvider>
        </ImpactProviderContext.Provider>
    );
};
