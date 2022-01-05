import React, { useEffect } from 'react';
import WalletConnection from '../WalletConnection';
import { getAddCommunityProposals } from '@impact-market/utils';

const Subgraph = () => {
    const [addCommunityProposals, setAddCommunityProposals] = React.useState<
        {
            id: string;
            endBlock: number;
            status: number;
        }[]
    >([]);

    useEffect(() => {
        const loadAddCommunityProposals = async () => {
            const r = await getAddCommunityProposals({first: 5, skip: 0});
            setAddCommunityProposals(r);
        }
        loadAddCommunityProposals();
    }, []);

    return (
        <WalletConnection title="Subgraph">
            <ul>
                {addCommunityProposals.map((p) => <li style={{ marginTop: 16 }}>
                    {p.id}
                </li>)}
            </ul>
        </WalletConnection>
    );
}

export default Subgraph;
