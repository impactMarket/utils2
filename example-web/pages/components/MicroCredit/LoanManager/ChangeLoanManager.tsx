import React, { useState } from 'react';
import { useLoanManager } from '@impact-market/utils/useLoanManager';

const ChangeLoanManager = () => {
    const { changeLoanManager } = useLoanManager();
    const [userAddress, setUserAddress] = useState('');
    const [newLoanManager, setNewLoanManager] = useState('');

    const handleChangeLoanManager = async () => {
        await changeLoanManager([userAddress], newLoanManager);
    };

    return (
        <div>
            <h3>Change Loan Manager</h3>
            <form onSubmit={handleChangeLoanManager}>
                <input
                    type="text"
                    value={userAddress}
                    onChange={e => setUserAddress(e.target.value)}
                    placeholder="Enter User Address"
                />
                <input
                    type="text"
                    value={newLoanManager}
                    onChange={e => setNewLoanManager(e.target.value)}
                    placeholder="Enter New Loan Manager Address"
                />
                <button type="submit">Change Loan Manager</button>
            </form>
        </div>
    );
};

export default ChangeLoanManager;
