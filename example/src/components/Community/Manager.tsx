import React from 'react';
import { useManager } from '@impact-market/utils/useManager';

const Beneficiary = () => {
    const [beneficiaryAddress, setBeneficiaryAddress] = React.useState('');
    const { addBeneficiary, canRequestFunds, requestFunds, nextRequestFundsAvailability, canUsersBeBeneficiaries } =
        useManager('0xbd6ab0e04ad0ac42cfba93a3cd84a107644b0378');

    const handleAddBeneficiary = () => {
        canUsersBeBeneficiaries([beneficiaryAddress])
            .then(() => addBeneficiary(beneficiaryAddress))
            .catch(console.error);
    };

    const RequestFundsComponent = () => {
        if (canRequestFunds) {
            return <button onClick={() => requestFunds()}>Request funds</button>;
        } else {
            return <div>Next funds request available: {nextRequestFundsAvailability.toString()}</div>;
        }
    };

    const AddBeneficiaryComponent = () => (
        <>
            <input
                type="text"
                placeholder="beneficiary address"
                value={beneficiaryAddress}
                onChange={e => setBeneficiaryAddress(e.currentTarget.value)}
            />
            <button onClick={handleAddBeneficiary}>Add beneficiary</button>
        </>
    );

    return (
        <>
            <h2>Manager</h2>
            <h3>add beneficiary</h3>
            <AddBeneficiaryComponent />
            <h3>request funds</h3>
            <RequestFundsComponent />
        </>
    );
};

export default Beneficiary;
