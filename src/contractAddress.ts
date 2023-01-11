import { networksId } from './config';

type Contracts = {
    Ambassadors: string;
    cUSD: string;
    cEUR: string;
    CELO: string;
    DonationMiner: string;
    CommunityAdmin: string;
    LearnAndEarn: string;
    PACTDelegate: string;
    PACTDelegator: string;
    PACTToken: string;
    SPACTToken: string;
    MerkleDistributor: string;
    Treasury: string;
    ImpactLabs: string;
    ImpactMarketCouncil: string;
    IDO: string;
    Staking: string;
};
export const ContractAddresses = new Map<number, Contracts>([
    [
        networksId.CeloAlfajores,
        {
            Ambassadors: '0xF7f1675e5A6fa5D2dd4F3b534a59B5B6Ef866221',
            CELO: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
            CommunityAdmin: '0x1c33D75bcE52132c7a0e220c1C338B9db7cf3f3A',
            DonationMiner: '0x09Cdc8f50994F63103bc165B139631A6ad18EF49',
            IDO: '0x0000000000000000000000000000000000000000',
            ImpactLabs: '0x60c631E7FB4224ad3C0E4BdA0610Dd10CE77756b',
            ImpactMarketCouncil: '0x8b32bd23638A2AbDB5D1eA504D2A56c0488AEDDa',
            LearnAndEarn: '0x959eFf854990948B5F5d46986cd8C5B906741114',
            MerkleDistributor: '0xcbB604155ba079499AC638211d4aa0E10711f718',
            PACTDelegate: '0xf266997E9feDd2dF6B8B8CaA710c148643b38C3b',
            PACTDelegator: '0x5c27e2600a3eDEF53DE0Ec32F01efCF145419eDF',
            PACTToken: '0x73A2De6A8370108D43c3C80430C84c30df323eD2',
            SPACTToken: '0x6732B3e5643dEBfaB7d1570f313271dD9E24c58C',
            Staking: '0x2Bdd85857eDd9A4fAA72b663536189e38D8E3C71',
            Treasury: '0xB0deEE097B5227C5E6bbE787665e4e62b4fE85f3',
            cEUR: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
            cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'
        }
    ],
    [
        networksId.CeloMainnet,
        {
            Ambassadors: '0x25f58d8C2522dC7E0C53cF8163C837De2415Ba51',
            CELO: '0x471EcE3750Da237f93B8E339c536989b8978a438',
            CommunityAdmin: '0xd61c407c3A00dFD8C355973f7a14c55ebaFDf6F9',
            DonationMiner: '0x1C51657af2ceBA3D5492bA0c5A17E562F7ba6593',
            IDO: '0xBbA4ED9462ABDb4010Bb12881895fb1E77284B6b',
            ImpactLabs: '0x767DA1d208DDA5bc517dcd4ba2A83591D68A5535',
            ImpactMarketCouncil: '0xF2CA11DA5c3668DD48774f3Ce8ac09aFDc24aF3E',
            LearnAndEarn: '0x496F7De1420ad52659e257C7Aa3f79a995274dbc',
            MerkleDistributor: '0xd2b20e06C19e7b7E7E385b0F1386Cdde8C6dCd2B',
            PACTDelegate: '0xAeEd98C1c5C268C3E23672166Ea0Bde908C90624',
            PACTDelegator: '0x8f8BB984e652Cb8D0aa7C9D6712Ec2020EB1BAb4',
            PACTToken: '0x46c9757C5497c5B1f2eb73aE79b6B67D119B0B58',
            SPACTToken: '0xFC39D3f2cBE4D5efc21CE48047bB2511ACa5cAF3',
            Staking: '0x1751e740379FC08b7f0eF6d49183fc0931Bd8179',
            Treasury: '0xa302dd52a4a85e6778E6A64A0E5EB0e8C76463d6',
            cEUR: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
            cUSD: '0x765de816845861e75a25fca122bb6898b8b1282a'
        }
    ]
]);
