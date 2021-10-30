export interface AppMediaThumbnail {
    id: number;
    mediaContentId: number;
    url: string;
    width: number;
    height: number;
    pixelRatio: number;
}

export interface AppMediaContent {
    id: number;
    url: string;
    width: number;
    height: number;
    thumbnails?: AppMediaThumbnail[];
}

export interface UbiCommunityDailyMetrics {
    id: number;
    communityId: number;
    ssiDayAlone: number;
    ssi: number;
    ubiRate: number;
    estimatedDuration: number;
    date: Date;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface UbiCommunityState {
    communityId: number;
    claimed: string;
    claims: number;
    beneficiaries: number; // only in community
    removedBeneficiaries: number;
    managers: number;
    raised: string;
    backers: number;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface UbiOrganizationSocialMedia {
    id: number;
    organizationId: number;
    mediaType: string;
    url: string;
}

export interface UbiOrganization {
    id: number;
    name: string;
    description: string;
    logoMediaId: number;

    logo?: AppMediaContent;
    socialMedia?: UbiOrganizationSocialMedia[];
}

export interface UbiCommunityContract {
    communityId: number;
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface CommunityCampaing {
    communityId: number;
    campaignUrl: string;
}

export interface UbiCommunitySuspect {
    id: number;
    communityId: number;
    suspect: number;
    createdAt: boolean;
}

export interface UbiCommunity {
    id: number; // Note that the `null assertion` `!` is required in strict mode.
    publicId: string;
    requestByAddress: string;
    contractAddress: string | null;
    name: string;
    description: string;
    descriptionEn: string | null;
    language: string;
    currency: string;
    city: string;
    country: string;
    gps: {
        latitude: number;
        longitude: number;
    };
    email: string;
    visibility: 'public' | 'private';
    coverMediaId: number;
    status: 'pending' | 'valid' | 'removed'; // pending / valid / removed
    started: Date;

    // timestamps
    createdAt: Date;
    updatedAt: Date;

    cover?: AppMediaContent;
}

export interface CommunityAttributes extends UbiCommunity {
    metrics?: UbiCommunityDailyMetrics;
    contract?: UbiCommunityContract;
    state?: UbiCommunityState;
    suspect?: UbiCommunitySuspect;
    organization?: UbiOrganization;
}
