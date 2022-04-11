import { frequencyToText } from './frequencyToText';

export function estimateRemainingFundsInDays(community: {
    baseInterval: number;
    claimAmount: number;
    beneficiaries: number;
    fundsOnContract: number;
}): number {
    const { beneficiaries, fundsOnContract, baseInterval, claimAmount } = community;

    let communityLimitPerDay = claimAmount * beneficiaries;

    if (frequencyToText(baseInterval) === 'week') {
        communityLimitPerDay /= 6;
    }

    return Math.floor(fundsOnContract / communityLimitPerDay);
}
