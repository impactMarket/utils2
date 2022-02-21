import { BigNumber } from 'bignumber.js';
import { frequencyToText } from './frequencyToText';

export function estimateCommunityRemainFunds(community: {
    contract: {
        baseInterval: number;
        claimAmount: BigNumber;
    };
    state: {
        beneficiaries: number;
        raised: BigNumber;
        claimed: BigNumber;
    };
}): number {
    if (community.contract === undefined || community.state === undefined) {
        return 0;
    }

    const { beneficiaries, raised, claimed } = community.state;
    const { baseInterval, claimAmount } = community.contract;
    const remaining = new BigNumber(raised).minus(new BigNumber(claimed));

    let communityLimitPerDay = new BigNumber(claimAmount).multipliedBy(
        beneficiaries
    );

    if (frequencyToText(baseInterval) === 'week') {
        communityLimitPerDay = communityLimitPerDay.div(7);
    }

    return Math.floor(remaining.div(communityLimitPerDay).toNumber());
}
