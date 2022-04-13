import { frequencyToText } from './frequencyToText';

export function estimateRemainingFundsInDays(community: {
    baseInterval: number;
    claimAmount: number;
    beneficiaries: number;
    fundsOnContract: number;
}): number {
    const { beneficiaries, fundsOnContract, baseInterval, claimAmount } = community;

    if (fundsOnContract < claimAmount) {
        return 0;
    }

    let communityLimitPerDay = claimAmount * beneficiaries;

    if (frequencyToText(baseInterval) === 'week') {
        communityLimitPerDay /= 6;
    }

    return Math.max(1, Math.floor(fundsOnContract / communityLimitPerDay));
}
