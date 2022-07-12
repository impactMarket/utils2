import { expect } from 'chai';

import { estimateRemainingFundsInDays } from '../src/estimateRemainingFundsInDays';

describe('#estimateRemainingFundsInDays()', () => {
    describe('daily', () => {
        it('no funds', () => {
            const result = estimateRemainingFundsInDays({
                // 24h
                baseInterval: 17280,
                beneficiaries: 5,
                // $1
                claimAmount: 1,
                fundsOnContract: 0
            });

            expect(result).to.equal(0);
        });
        it('low funds (1 day)', () => {
            const result = estimateRemainingFundsInDays({
                // 24h
                baseInterval: 17280,
                beneficiaries: 5,
                // $1
                claimAmount: 1,
                fundsOnContract: 5
            });

            expect(result).to.equal(1);
        });
        it('low funds (3 days)', () => {
            const result = estimateRemainingFundsInDays({
                // 24h
                baseInterval: 17280,
                beneficiaries: 5,
                // $1
                claimAmount: 1,
                fundsOnContract: 15
            });

            expect(result).to.equal(3);
        });
        it('low funds (3.2 days rounded to 3 days)', () => {
            const result = estimateRemainingFundsInDays({
                // 24h
                baseInterval: 17280,
                beneficiaries: 5,
                // $1
                claimAmount: 1,
                fundsOnContract: 17
            });

            expect(result).to.equal(3);
        });
        it('low funds (3.7 days rounded to 3 days)', () => {
            const result = estimateRemainingFundsInDays({
                // 24h
                baseInterval: 17280,
                beneficiaries: 5,
                // $1
                claimAmount: 1,
                fundsOnContract: 19
            });

            expect(result).to.equal(3);
        });
        it('enough funds (10 days)', () => {
            const result = estimateRemainingFundsInDays({
                // 24h
                baseInterval: 17280,
                beneficiaries: 5,
                // $1
                claimAmount: 1,
                fundsOnContract: 50
            });

            expect(result).to.equal(10);
        });
    });
    describe('weekly', () => {
        it('low funds (1 day)', () => {
            const result = estimateRemainingFundsInDays({
                // 24h
                baseInterval: 120960,
                beneficiaries: 5,
                // $1
                claimAmount: 7,
                fundsOnContract: 8
            });

            expect(result).to.equal(1);
        });
        it('low funds (2 days)', () => {
            const result = estimateRemainingFundsInDays({
                // 24h
                baseInterval: 120960,
                beneficiaries: 5,
                // $1
                claimAmount: 7,
                fundsOnContract: 16
            });

            expect(result).to.equal(2);
        });
    });
});
