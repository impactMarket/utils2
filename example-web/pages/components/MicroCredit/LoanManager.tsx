import React from 'react';
import { useLoanManager } from '@impact-market/utils/useLoanManager';

const LoanManager = () => {
    const { managerDetails, isReady, addLoans } = useLoanManager();

    const addNewLoan = async () => {
        await addLoans([
            {
                amount: 0.1,
                claimDeadline: 1697218340,
                dailyInterest: 0.2,
                period: 10368000,
                userAddress: '0x7b4dc2044e5aD7b858D399439a55c2a3781Ca2DC',
            }
        ]);
    };

    return (
        <>
            <div>
                <p>isReady {isReady.toString()}</p>
                <button onClick={addNewLoan}>AddNewLoan</button>
            </div>
            <div>
                {Object.entries(managerDetails).map(([key, value]) => (
                    <p>{`${key}: ${value}`}</p>
                ))}
            </div>
        </>
    );
};

export default LoanManager;
