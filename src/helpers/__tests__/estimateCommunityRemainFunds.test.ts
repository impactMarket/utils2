import { expect } from 'chai';
import { UbiCommunity } from '../../types';

import { estimateCommunityRemainFunds } from '../estimateCommunityRemainFunds';

const baseCommunity: UbiCommunity = {
    name: 'test',
    id: 0,
    publicId: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    city: '',
    country: '',
    currency: '',
    language: '',
    contractAddress: '',
    coverMediaId: 0,
    email: '',
    gps: { latitude: 0, longitude: 0 },
    requestByAddress: '',
    started: new Date(),
    status: 'valid',
    visibility: 'public',
    descriptionEn: ''
};

const baseContract = {
    communityId: 0,
    createdAt: new Date(),
    updatedAt: new Date()
};

const baseState = {
    backers: 0,
    claims: 0,
    communityId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    managers: 1,
    removedBeneficiaries: 0
};

describe('#estimateCommunityRemainFunds()', () => {
    describe('daily', () => {
        it('no funds', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    baseInterval: 86400, // 24h
                    incrementInterval: 300, // 5m
                    claimAmount: '1000000000000000000', // $1
                    maxClaim: '500000000000000000000' // $500
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000', // $5
                    raised: '5000000000000000000' // $5
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(0);
        });
        it('low funds (1 day)', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    baseInterval: 86400, // 24h
                    incrementInterval: 300, // 5m
                    claimAmount: '1000000000000000000', // $1
                    maxClaim: '500000000000000000000' // $500
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000', // $5
                    raised: '10000000000000000000' // $10
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(1);
        });
        it('low funds (3 days)', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    baseInterval: 86400, // 24h
                    incrementInterval: 300, // 5m
                    claimAmount: '1000000000000000000', // $1
                    maxClaim: '500000000000000000000' // $500
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000', // $5
                    raised: '20000000000000000000' // $10
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(3);
        });
        it('low funds (3.2 days rounded to 3 days)', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    baseInterval: 86400, // 24h
                    incrementInterval: 300, // 5m
                    claimAmount: '1000000000000000000', // $1
                    maxClaim: '500000000000000000000' // $500
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000', // $5
                    raised: '22000000000000000000' // $10
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(3);
        });
        it('low funds (3.7 days rounded to 3 days)', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    baseInterval: 86400, // 24h
                    incrementInterval: 300, // 5m
                    claimAmount: '1000000000000000000', // $1
                    maxClaim: '500000000000000000000' // $500
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000', // $5
                    raised: '24000000000000000000' // $10
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(3);
        });
        it('enough funds (10 days)', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    baseInterval: 86400, // 24h
                    incrementInterval: 300, // 5m
                    claimAmount: '1000000000000000000', // $1
                    maxClaim: '500000000000000000000' // $500
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000', // $5
                    raised: '55000000000000000000' // $10
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(10);
        });
    });
    describe('weekly', () => {
        it('low funds (1 day)', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    baseInterval: 604800, // 1w
                    incrementInterval: 1800, // 30m
                    claimAmount: '7000000000000000000', // $7
                    maxClaim: '500000000000000000000' // $500
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '35000000000000000000', // $35
                    raised: '41000000000000000000' // $41
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(1);
        });
        it('low funds (2 days)', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    baseInterval: 604800, // 1w
                    incrementInterval: 1800, // 30m
                    claimAmount: '7000000000000000000', // $7
                    maxClaim: '500000000000000000000' // $500
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '35000000000000000000', // $35
                    raised: '43000000000000000000' // $43
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(1);
        });
    });
});
