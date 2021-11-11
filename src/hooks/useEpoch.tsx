import { useContractKit, useProvider } from '@celo-tools/use-contractkit';
import React, { useEffect } from 'react';
import { DaoContext } from '../components/DaoProvider';
import toNumber from '../helpers/toNumber';
import { useContracts } from './useContracts';

export const useEpoch = () => {
    const provider = useProvider();
    const { address, initialised } = useContractKit();
    const { donationMiner: donationMinerContract } = useContracts();
    const { epoch, setEpoch } = React.useContext(DaoContext);

    const updateEpoch = async () => {
        try {
            if (
                !address ||
                !initialised ||
                !donationMinerContract ||
                !provider
            ) {
                return;
            }

            const donationMiner = donationMinerContract.connect(provider);

            const currentBlock = await provider.getBlockNumber();
            const period = await donationMiner.rewardPeriodCount();

            const response = await donationMiner.rewardPeriods(period);

            const { rewardAmount, endBlock, donationsAmount } = response || {};

            // calculate remaining time until the end block, in seconds.
            // If the end block was in the past, add another epoch.
            const blocksPerDay = 12 * 60 * 24; // ~ amount of blocks in a day
            const blockTime =
                (endBlock.toNumber() -
                    currentBlock +
                    (currentBlock > endBlock.toNumber() ? blocksPerDay : 0)) *
                5000;

            const endPeriod = new Date(new Date().getTime() + blockTime);

            const amount = await donationMiner.rewardPeriodDonorAmount(
                period,
                address
            );
            const userContribution = toNumber(amount);
            const rewards = toNumber(rewardAmount);
            const totalRaised = toNumber(donationsAmount);

            setEpoch({
                endPeriod: endPeriod.toISOString(),
                rewards,
                totalRaised,
                userContribution
            });
        } catch (error) {
            console.log(`Error getting epoch data...\n${error}`);
        }
    };

    useEffect(() => {
        updateEpoch();
    }, [donationMinerContract, provider]);

    return { epoch, updateEpoch };
};
