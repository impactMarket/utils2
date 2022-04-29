import React from 'react';
import { useAmbassador } from '@impact-market/utils/useAmbassador';

const Beneficiary = () => {
    const [managerAddressAdd, setManagerAddressAdd] = React.useState('');
    const [managerAddressRemove, setManagerAddressRemove] = React.useState('');
    const { addManager, removeManager } = useAmbassador();
    const communityAddress = '0xBd6Ab0E04ad0AC42CFBA93a3Cd84A107644B0378';

    return (
        <>
            <h3>Ambassador</h3>
            <input type="text" placeholder='manager address' value={managerAddressAdd} onChange={(e) => setManagerAddressAdd(e.currentTarget.value)} />
            <button onClick={() => addManager(communityAddress, managerAddressAdd)}>Add manager</button>
            <br />
            <input type="text" placeholder='manager address' value={managerAddressRemove} onChange={(e) => setManagerAddressRemove(e.currentTarget.value)} />
            <button onClick={() => removeManager(communityAddress, managerAddressRemove)}>Remove manager</button>
        </>
    )
}

export default Beneficiary
