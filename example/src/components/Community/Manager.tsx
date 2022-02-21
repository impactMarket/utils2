import React from 'react';
import { useManager } from '@impact-market/utils/useManager';

const Beneficiary = () => {
    const [beneficiaryAddress, setBeneficiaryAddress] = React.useState('');
    const { addBeneficiary } = useManager('0x6dcf4B577309aF974216b46817e98833Ad27c0Ab');

    return (
        <>
            <h3>Manager</h3>
            <input type="text" placeholder='beneficiary address' value={beneficiaryAddress} onChange={(e) => setBeneficiaryAddress(e.currentTarget.value)} />
            <button onClick={() => addBeneficiary(beneficiaryAddress)}>Add beneficiary</button>
        </>
    )
}

export default Beneficiary
