import { expect } from 'chai';

import { estimateCommunityRemainFunds } from '../src/estimateCommunityRemainFunds';

const baseCommunity = {
    city: '',
    contractAddress: '',
    country: '',
    coverMediaId: 0,
    createdAt: new Date(),
    currency: '',
    description: '',
    descriptionEn: '',
    email: '',
    gps: { latitude: 0, longitude: 0 },
    id: 0,
    language: '',
    name: 'test',
    publicId: '',
    requestByAddress: '',
    started: new Date(),
    status: 'valid',
    updatedAt: new Date(),
    visibility: 'public'
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
    managers: 1,
    removedBeneficiaries: 0,
    updatedAt: new Date()
};

describe('#estimateCommunityRemainFunds()', () => {
    describe('daily', () => {
        it('no funds', () => {
            const community = {
                ...baseCommunity,
                contract: {
                    ...baseContract,
                    // 24h
                    baseInterval: 17280,
                    // $1
                    claimAmount: '1000000000000000000',
                    // 5m
                    incrementInterval: 60,
                    // $500
                    maxClaim: '500000000000000000000'
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000',
                    raised: '5000000000000000000'
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
                    baseInterval: 17280,
                    claimAmount: '1000000000000000000',
                    incrementInterval: 60,
                    maxClaim: '500000000000000000000'
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000',
                    raised: '10000000000000000000'
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
                    baseInterval: 17280,
                    claimAmount: '1000000000000000000',
                    incrementInterval: 60,
                    maxClaim: '500000000000000000000'
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000',
                    raised: '20000000000000000000'
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
                    baseInterval: 17280,
                    claimAmount: '1000000000000000000',
                    incrementInterval: 60,
                    maxClaim: '500000000000000000000'
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000',
                    raised: '22000000000000000000'
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
                    baseInterval: 17280,
                    claimAmount: '1000000000000000000',
                    incrementInterval: 60,
                    maxClaim: '500000000000000000000'
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000',
                    raised: '24000000000000000000'
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
                    baseInterval: 17280,
                    claimAmount: '1000000000000000000',
                    incrementInterval: 60,
                    maxClaim: '500000000000000000000'
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '5000000000000000000',
                    raised: '55000000000000000000'
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
                    baseInterval: 120960,
                    claimAmount: '7000000000000000000',
                    incrementInterval: 360,
                    maxClaim: '500000000000000000000'
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '35000000000000000000',
                    raised: '41000000000000000000'
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
                    baseInterval: 120960,
                    claimAmount: '7000000000000000000',
                    incrementInterval: 360,
                    maxClaim: '500000000000000000000'
                },
                state: {
                    ...baseState,
                    beneficiaries: 5,
                    claimed: '35000000000000000000',
                    raised: '43000000000000000000'
                }
            };

            const result = estimateCommunityRemainFunds(community);

            expect(result).to.equal(1);
        });
    });
});
