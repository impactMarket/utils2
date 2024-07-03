import React, { useState } from 'react';
import { useLoanManager } from '@impact-market/utils/useLoanManager';

const AddLoan = () => {
    const { addLoans } = useLoanManager();

    const [amount, setAmount] = useState('');
    const [claimDeadline, setClaimDeadline] = useState('');
    const [dailyInterest, setDailyInterest] = useState('');
    const [period, setPeriod] = useState('');
    const [userAddress, setUserAddress] = useState('');

    const addNewLoan = async () => {
        await addLoans([
            {
                amount: parseFloat(amount),
                claimDeadline: parseInt(claimDeadline, 10),
                dailyInterest: parseInt(dailyInterest, 10),
                period: parseInt(period, 10),
                userAddress
            }
        ]);
    };

    return (
        <div>
            <h3>Add Loan</h3>
            <form onSubmit={addNewLoan}>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
                <input
                    type="number"
                    value={claimDeadline}
                    onChange={e => setClaimDeadline(e.target.value)}
                    placeholder="Claim Deadline"
                />
                <input
                    type="number"
                    value={dailyInterest}
                    onChange={e => setDailyInterest(e.target.value)}
                    placeholder="Daily Interest"
                />
                <input type="number" value={period} onChange={e => setPeriod(e.target.value)} placeholder="Period" />
                <input
                    type="text"
                    value={userAddress}
                    onChange={e => setUserAddress(e.target.value)}
                    placeholder="User Address"
                />
                <button type="submit">Add New Loan</button>
            </form>
        </div>
    );
};

export default AddLoan;
