import React from 'react';
import { useManager } from '@impact-market/utils/useManager';

const Beneficiary = () => {
    const [beneficiaryAddress, setBeneficiaryAddress] = React.useState('');
    const { addBeneficiary } = useManager('0xbd6ab0e04ad0ac42cfba93a3cd84a107644b0378');

    return (
        <>
            <h3>Manager</h3>
            <input type="text" placeholder='beneficiary address' value={beneficiaryAddress} onChange={(e) => setBeneficiaryAddress(e.currentTarget.value)} />
            <button onClick={() => addBeneficiary(beneficiaryAddress)}>Add beneficiary</button>
        </>
    )
}

export default Beneficiary
