import { toNumber } from '@impact-market/utils/toNumber';
import { frequencyToText } from '@impact-market/utils/frequencyToText';
import { toToken } from '@impact-market/utils/toToken';
import { useUBICommittee } from '@impact-market/utils/useUBICommittee';
import React, { useEffect, useState } from 'react';
import { impactMarket } from '../../services/impactMarket';

const Community = (props: any) => {
    const { id, name, description, contract, requestByAddress, ambassadorAddress } = props;
    const { addCommunity } = useUBICommittee();
    const [isLoading, setIsLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddCommunity = async () => {
        setIsLoading(true);

        const response = await addCommunity({
            ...contract,
            ambassador: ambassadorAddress,
            decreaseStep: toToken(0.01),
            managers: [requestByAddress],
            maxTranche: toToken(5, { EXPONENTIAL_AT: 25 }),
            minTranche: toToken(1),
            proposalTitle: `[New Community] ${name}`,
            proposalDescription: `## Description:\n${description}\n\nUBI Contract Parameters:\nClaim Amount: ${toNumber(contract.claimAmount)}\nMax Claim: ${toNumber(contract.maxClaim)}\nBase Interval: ${frequencyToText(contract.baseInterval)}\nIncrement Interval: ${contract.incrementInterval * 5 / 60} minutes\n\n\nMore details: ${process.env.BASE_URL}/communities/${id}`
        })

        console.log(response);

        if (typeof(response) ===  'number') {
            setIsAdded(true);
        }

        setIsLoading(false);
    }

    return (
        <li>
            <h5 style={{ display: 'flex', width: 600 }}>
                <span>{name} - {requestByAddress}</span>
                {isLoading && <span>...is loading!</span>}
                {!isAdded && <button disabled={isLoading} onClick={handleAddCommunity} style={{ marginLeft: 'auto' }}>Add</button>}
            </h5>
        </li>
    )
}

const AddCommunity = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        const getCommunities = async () => {
            setIsLoading(true);
            const response = await impactMarket.getPendingCommunities();

            setCommunities(response?.data.rows || []);
            setIsLoading(false);
        }

        getCommunities();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!communities && !isLoading) {
        return (
            <div>
                <h3>No communities</h3>
            </div>
        )
    }

    return (
        <div>
            <h3>Add Community</h3>
            <h4>Communities</h4>
            <ul style={{ marginTop: 32 }}>
                {communities.map((community, index) => <Community key={index} {...community} />)}
            </ul>
        </div>
    )
};

export default AddCommunity;
