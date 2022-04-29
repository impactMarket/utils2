import { useDAO } from '@impact-market/utils/useDAO';
import React from 'react';

const CreateProposal = () => {
    const { proposal } = useDAO();

    return (
        <button onClick={proposal}>proposal</button>
    )
};

export default CreateProposal;
