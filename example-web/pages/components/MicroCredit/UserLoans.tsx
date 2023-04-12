import { useCelo } from '@celo/react-celo';
import { useMicroCredit } from '@impact-market/utils/useMicroCredit';
import React, { useState } from 'react';

const UserLoans = () => {
    const { userLoans, claimLoan, approve, repayLoan, getActiveLoanId, loan } = useMicroCredit();
    const { address } = useCelo();
    const [amount, setAmount] = useState('0');

    const checkLoan = async () => {
        const loanId = await getActiveLoanId((address ?? '').toString());
        await userLoans((address ?? '').toString(), loanId);
    };

    const checkWalletMetadata = async () => {
        const res = await getActiveLoanId((address ?? '').toString());
        console.log(res);
    };

    const handleRepayment = async () => {
        const token = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
        const loanId = await getActiveLoanId((address ?? '').toString());

        await approve(token, amount);
        await repayLoan(loanId, amount);
    };

    const claim = async () => {
        const loanId = await getActiveLoanId((address ?? '').toString());
        await claimLoan(loanId);
    };

    return (
        <>
            <div>
                <button onClick={checkLoan}>Check Loan</button>
            </div>
            <br />
            <div>
                <button onClick={checkWalletMetadata}>Wallet Metadata</button>
            </div>

            <br />

            <div>
                <button onClick={claim}>ClaimLoan</button>
            </div>
            <div>
                {Object.entries(loan).map(([key, value]) => (
                    <p>{`${key}: ${value}`}</p>
                ))}
            </div>

            <br />

            <input
                type="text"
                placeholder="token amount"
                value={amount}
                onChange={e => setAmount(e.currentTarget.value)}
            />
            <button onClick={handleRepayment}>Repay Loan</button>
        </>
    );
};

export default UserLoans;
