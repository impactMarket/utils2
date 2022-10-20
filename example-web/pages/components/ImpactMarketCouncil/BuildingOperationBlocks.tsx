import { BuildingOperationBlocks, useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import React, { useState } from 'react';

const Operation = (props: BuildingOperationBlocks) => {
    const { buildingOperationBlocks } = useImpactMarketCouncil();
    const [operationId, setOperationId] = useState('0');
    const [value, setValue] = useState('');

    const availableOperations = buildingOperationBlocks().map((o, i) => ({ operation: o.name, index: i }));
    const currentoperation = buildingOperationBlocks()[parseInt(operationId, 10)];

    return (
        <>
            <select value={operationId} onChange={e => setOperationId(e.currentTarget.value)}>
                {availableOperations.map(ao => (
                    <option value={ao.index.toString()}>{ao.operation}</option>
                ))}
            </select>
            {currentoperation.params.map((p, i) => (
                <label key={i}>
                    {p.description}:
                    <input type="text" value={value} onChange={(e) => setValue(e.currentTarget.value)} />
                </label>
            ))}
        </>
    );
};

const BuildingOperationsBlocks = () => {
    const { buildingOperationBlocks, propose } = useImpactMarketCouncil();
    const [operations, setOperations] = useState<BuildingOperationBlocks[]>([buildingOperationBlocks[0]]);

    const addOperation = () => {
        setOperations(o => [...o, buildingOperationBlocks[0]]);
    };

    const openProposal = async () => {
        // TODO: values need to be added
        await propose('example title', 'example description', operations);
    };

    return (
        <div>
            <h3>Building Operation Blocks</h3>
            <h4>Communities</h4>
            <button onClick={openProposal}>open proposal</button>
            <button onClick={addOperation}>add operation</button>
            <ul style={{ marginTop: 32 }}>
                {operations.map((ops, index) => (
                    <Operation key={index} {...ops} />
                ))}
            </ul>
        </div>
    );
};

export default BuildingOperationsBlocks;
