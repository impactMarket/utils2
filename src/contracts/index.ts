export const cusdContractAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
export const pactContractAddress = '0xAb0EE41B8d3540d6145E2Eb58B84a55142aac345';

export const ContractAddresses = new Map<
    number,
    {
        DonationMiner: string;
        CommunityAdmin: string;
        PACTDelegate: string;
        PACTDelegator: string;
    }
>([
    [
        44787,
        {
            DonationMiner: '0xF50A9aa0013AeF09C640547823542F1c7Bc2DA03',
            CommunityAdmin: '0x66d377462fa7B240dEA63BbDD299C44Df737BC9C',
            PACTDelegate: '0x55fbea12B9d2E50c820cd6983398C3b9e88Cdc4c',
            PACTDelegator: '0x6b69e79B899e634092384Be1d09a41B6f4886a6e'
        }
    ]
]);
