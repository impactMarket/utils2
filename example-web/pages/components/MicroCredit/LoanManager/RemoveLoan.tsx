import React, { useState } from 'react';
import { useLoanManager } from '@impact-market/utils/useLoanManager';

const RemoveLoan = () => {
    const { cancelLoans } = useLoanManager();
    const [userAddress, setUserAddress] = useState('');
    const [loanId, setLoanId] = useState('');

    const handleCancelLoan = async () => {
        await cancelLoans([
            {
                userAddress,
                loanId: parseInt(loanId, 10)
            }
        ]);
    };

    return (
        <div>
            <h3>Cancel Loan</h3>
            <form onSubmit={handleCancelLoan}>
                <input
                    type="text"
                    value={userAddress}
                    onChange={e => setUserAddress(e.target.value)}
                    placeholder="Enter User Address"
                />
                <input
                    type="text"
                    value={loanId}
                    onChange={e => setLoanId(e.target.value)}
                    placeholder="Enter Loan ID"
                />
                <button type="submit">Cancel Loan</button>
            </form>
        </div>
    );
};

export default RemoveLoan;
