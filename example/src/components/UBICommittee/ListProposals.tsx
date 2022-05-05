import React, { useEffect, useState } from 'react';
import { useUBICommittee } from '@impact-market/utils/useUBICommittee'
import { useContractKit, useProvider } from '@celo-tools/use-contractkit';

const ListProposals = () => {
    const provider = useProvider();
    const { address } = useContractKit();
    const { cancel, execute, getProposals, vote, quorumVotes } = useUBICommittee();
    const [proposals, setProposals] = useState<{
        id: number;
        proposer: string;
        signatures: string[];
        endBlock: number;
        description: string;
        status: number;
        votesAgainst: number;
        votesFor: number;
        votesAbstain: number;
        userHasVoted?: boolean;
    }[]>([]);
    const [blockNumber, setBlockNumber] = useState(0);

    useEffect(() => {
        if (address) {
            getProposals(5, 0, address).then((p) => setProposals(p));
            provider.getBlockNumber().then((b) => setBlockNumber(b));
        }
    }, [address]);

    const proposalComponent = (p: {
        id: number;
        proposer: string;
        signatures: string[];
        endBlock: number;
        description: string;
        status: number;
        votesAgainst: number;
        votesFor: number;
        votesAbstain: number;
        userHasVoted?: boolean;
    }) => {
        return <div key={p.id}>
            <p>{p.id} | {p.proposer}: {p.description}</p>
            {
                p.status === 2 ? <p>canceled</p> :
                    p.status === 1 ? <p>executed - userHasVoted: {p.userHasVoted?.toString()}</p> :
                        p.votesFor >= quorumVotes ? <><button onClick={() => execute(p.id)}>execute</button><button onClick={() => cancel(p.id)}>cancel</button></> :
                            p.votesAgainst >= quorumVotes ? <p>defeated</p> :
                                p.endBlock < blockNumber ? <p>expired</p> :
                                    <><button onClick={() => vote(p.id, 1)}>vote for</button><button onClick={() => vote(p.id, 0)}>vote against</button><button onClick={() => cancel(p.id)}>cancel</button></>
            }
        </div>
    }

    if (blockNumber === 0) {
        return null;
    }

    return (
        <div>
            <h3>Proposals ({quorumVotes} quorumVotes)</h3>
            {proposals.map((p) => proposalComponent(p))}
        </div>
    );
}

export default ListProposals;
