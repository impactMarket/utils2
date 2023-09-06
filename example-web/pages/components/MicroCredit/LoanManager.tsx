import React from 'react';
import { useLoanManager } from '../../../../useLoanManager';

const LoanManager = () => {
    const { managerDetails, isReady } = useLoanManager();

    // const addNewLoan = async () => {
    //     await addLoans([
    //         {
    //             amount: 15,
    //             claimDeadline: 1627776000,
    //             dailyInterest: 0.2,
    //             period: 30,
    //             userAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    //         }
    //     ]);
    // };

    return (
        <>
            <div>
                <p>isReady {isReady.toString()}</p>
                {/* <button onClick={addNewLoan}>AddNewLoan</button> */}
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
