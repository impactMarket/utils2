import React, { useState } from 'react';
import { useCelo } from '@celo/react-celo';
import { useMicroCredit } from '@impact-market/utils/useMicroCredit';

const UserLoans = () => {
    const { userLoans, claimLoan, approve, repayLoan } = useMicroCredit();
    const { address } = useCelo();
    const [credit, setCredit] = useState({
        amountBorrowed: 0,
        amountRepayed: 0,
        currentDebt: 0,
        dailyInterest: 0,
        period: 0
    });
    const [amount, setAmount] = useState('0');

    const checkLoan = async () => {
        const res = await userLoans((address ?? '').toString(), '0');

        if (res) setCredit(res);
    };

    const handleRepayment = async () => {
        const token = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
        const loanId = '0';

        const approval = await approve(token, amount);
        console.log(approval);

        const repay = await repayLoan(loanId, amount);
        console.log(repay);
    };

    return (
        <>
            <div>
                <button onClick={checkLoan}>Check Loan</button>
            </div>

            <br />

            <div>
                <button onClick={async () => await claimLoan('0')}>ClaimLoan</button>
            </div>
            <div>
                {Object.entries(credit).map(([key, value]) => (
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
