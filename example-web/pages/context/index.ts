import { BaseProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { createContext } from 'react';

const intialData: {
    provider: BaseProvider;
    signer: Signer | null;
    address: string | null;
} = {
    provider: null as any, // mandatory, value here doesn't matter
    signer: null,
    address: null
};
export const ImpactMarketContext = createContext(intialData);