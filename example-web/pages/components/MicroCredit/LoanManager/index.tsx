import React from 'react';
import { useLoanManager } from '@impact-market/utils/useLoanManager';
import AddLoan from './AddLoan';
import RemoveLoan from './RemoveLoan';
import ChangeLoanManager from './ChangeLoanManager';

const LoanManager = () => {
    const { managerDetails, isReady } = useLoanManager();

    return (
        <div>
            <h2>Loan Manager</h2>
            <p>isReady {isReady.toString()}</p>
            <h4>Details</h4>
            <div>
                {Object.entries(managerDetails).map(([key, value]) => (
                    <p key={key}>{`${key}: ${value}`}</p>
                ))}
            </div>
            <AddLoan />
            <RemoveLoan />
            <ChangeLoanManager />
        </div>
    );
};

export default LoanManager;
