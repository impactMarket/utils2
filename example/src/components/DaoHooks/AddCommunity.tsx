import { toToken, useDAO } from '@impact-market/utils';
import React, { useEffect, useState } from 'react';
import { impactMarket } from '../../services/impactMarket';

const Community = props => {
    const { city, country, contract, description, name, requestByAddress } = props;
    const { addCommunity } = useDAO();
    const [isLoading, setIsLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddCommunity = async () => {
        setIsLoading(true);

        const data = {
            ...contract,
            decreaseStep: toToken(0.01),
            firstManager: requestByAddress,
            managerBlockList: [],
            maxTranche: toToken(10000),
            minTranche: toToken(100),
            proposalDescription: `${name} | ${city}, ${country} - ${description}`
        };

        console.log(data);

        const response = await addCommunity(data)

        console.log(response);

        if (response?.status) {
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

            setCommunities(response?.data || []);
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
