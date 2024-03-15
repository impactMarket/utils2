import { ApolloCache } from '@apollo/client/cache/core/cache';
import { BaseProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { Connection } from '@celo/connect';
import { ImpactMarketSubgraph, ImpactMarketUBIManagementSubgraph } from './subgraphs';
import { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types';
import { RetryLink } from '@apollo/client/link/retry/retryLink';
import { WalletClient } from 'wagmi';
import React, { useState } from 'react';

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
        user: 0
    },
    endPeriod: undefined,
    initialised: false,
    rewards: 0,
    totalRaised: 0,
    userContribution: 0
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
    donation?: number;
    initialised: boolean;
};

export type StakingType = {
    allocated: number;
    userAPR: number;
    generalAPR: number;
    claimableUnstaked: number;
    estimateClaimableRewardByStaking: number;
    initialised: boolean;
    stakedAmount: number;
    totalStaked: number;
    unstakeCooldown: number;
};

const initialRewards: RewardsType = {
    allocated: 0,
    claimable: 0,
    currentEpoch: 0,
    estimated: 0,
    initialised: false
};

const intialProviderData: {
    address: string | null;
    defaultFeeCurrency?: string;
    connection?: Connection;
    signer: WalletClient | null;
    networkId: number;
    jsonRpcUrl: string;
    provider: BaseProvider;
    subgraph: ImpactMarketSubgraph;
    ubiManagementSubgraph: ImpactMarketUBIManagementSubgraph;
} = {
    // mandatory, value here doesn't matter
    address: null,
    jsonRpcUrl: null as any,
    networkId: null as any,
    provider: null as any,
    signer: null as any,
    subgraph: null as any,
    ubiManagementSubgraph: null as any
};

const initialStaking: StakingType = {
    allocated: 0,
    claimableUnstaked: 0,
    estimateClaimableRewardByStaking: 0,
    generalAPR: 0,
    initialised: false,
    stakedAmount: 0,
    totalStaked: 0,
    unstakeCooldown: 0,
    userAPR: 0
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

const intialStakingStateData: {
    staking: StakingType;
    setStaking: React.Dispatch<React.SetStateAction<StakingType>>;
} = {
    setStaking: () => {},
    staking: initialStaking
};

export const ImpactProviderContext = React.createContext(intialProviderData);
export const CUSDBalanceContext = React.createContext(intialCUSDBalanceStateData);
export const PACTBalanceContext = React.createContext(intialPACTBalanceStateData);
export const EpochContext = React.createContext(intialEpochStateData);
export const RewardsContext = React.createContext(intialRewardsStateData);
export const StakingContext = React.createContext(intialStakingStateData);

type ProviderProps = {
    children?: any;
    address: string | null;
    /**
     * @deprecated Use `signer` instead
     */
    connection?: Connection;
    signer: WalletClient | null;
    jsonRpc: string;
    networkId: number;
    defaultFeeCurrency?: string;
    apolloClientOptions?: {
        retry?: RetryLink.Options;
        cache?: ApolloCache<NormalizedCacheObject>;
    };
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

const StakingProvider = React.memo((props: { children?: any }) => {
    const { children } = props;
    const [staking, setStaking] = useState<StakingType>(initialStaking);

    return (
        <StakingContext.Provider
            value={{
                setStaking,
                staking
            }}
        >
            {children}
        </StakingContext.Provider>
    );
});

export const ImpactProvider = (props: ProviderProps) => {
    const { children, address, jsonRpc, signer, networkId, apolloClientOptions, defaultFeeCurrency, connection } =
        props;

    return (
        <ImpactProviderContext.Provider
            value={{
                address,
                connection,
                defaultFeeCurrency,
                jsonRpcUrl: jsonRpc,
                networkId,
                provider: new StaticJsonRpcProvider(jsonRpc),
                signer,
                subgraph: new ImpactMarketSubgraph(networkId, apolloClientOptions),
                ubiManagementSubgraph: new ImpactMarketUBIManagementSubgraph(
                    new StaticJsonRpcProvider(jsonRpc),
                    networkId,
                    apolloClientOptions
                )
            }}
        >
            <StakingProvider>
                <RewardsProvider>
                    <EpochProvider>
                        <PACTBalanceProvider>
                            <CUSDBalanceProvider>{children}</CUSDBalanceProvider>
                        </PACTBalanceProvider>
                    </EpochProvider>
                </RewardsProvider>
            </StakingProvider>
        </ImpactProviderContext.Provider>
    );
};
