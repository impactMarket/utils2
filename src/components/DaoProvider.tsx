import React, { useState } from 'react';

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
};

const initialRewards: RewardsType = {
    claimable: 0,
    estimated: 0
};

const intialData: {
    balance?: BalanceType;
    rewards?: RewardsType;
    epoch?: EpochType;
    setBalance: Function;
    setEpoch: Function;
    setRewards: Function;
} = {
    balance: initialBalance,
    epoch: initialEpoch,
    rewards: initialRewards,
    setBalance: () => {},
    setEpoch: () => {},
    setRewards: () => {}
};

export const DaoContext = React.createContext(intialData);

type ProviderProps = {
    children?: any;
};

export const DaoProvider = (props: ProviderProps) => {
    const { children } = props;
    const [balance, setBalance] = useState<BalanceType>(initialBalance);
    const [epoch, setEpoch] = useState<EpochType>(initialEpoch);
    const [rewards, setRewards] = useState<RewardsType>(initialRewards);

    return (
        <DaoContext.Provider
            value={{
                balance,
                epoch,
                rewards,
                setBalance,
                setEpoch,
                setRewards
            }}
        >
            {children}
        </DaoContext.Provider>
    );
};
