import { expect } from 'chai';
import { chooseMediaThumbnail } from '../chooseMediaThumbnail';

describe('#chooseMediaThumbnail()', () => {
    it('exact match (size)', () => {
        const result = chooseMediaThumbnail(
            {
                id: 0,
                url: '5000x5000.jpg',
                height: 5000,
                width: 5000,
                thumbnails: [
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x50.jpg',
                        height: 50,
                        width: 50,
                        pixelRatio: 1
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x60.jpg',
                        height: 50,
                        width: 60,
                        pixelRatio: 1
                    }
                ]
            },
            { heigth: 50, width: 60 },
            1
        );
        expect(result).to.equal('50x60.jpg');
    });

    it('exact match (pixel ratio)', () => {
        const result = chooseMediaThumbnail(
            {
                id: 0,
                url: '5000x5000.jpg',
                height: 5000,
                width: 5000,
                thumbnails: [
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x50.jpg',
                        height: 50,
                        width: 50,
                        pixelRatio: 1
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x50@2.jpg',
                        height: 50,
                        width: 50,
                        pixelRatio: 2
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x50@3.jpg',
                        height: 50,
                        width: 50,
                        pixelRatio: 3
                    }
                ]
            },
            { heigth: 50, width: 50 },
            2
        );
        expect(result).to.equal('50x50@2.jpg');
    });

    it('exact match (size and pixel ratio)', () => {
        const result = chooseMediaThumbnail(
            {
                id: 0,
                url: '5000x5000.jpg',
                height: 5000,
                width: 5000,
                thumbnails: [
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x50.jpg',
                        height: 50,
                        width: 50,
                        pixelRatio: 1
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x50@2.jpg',
                        height: 50,
                        width: 50,
                        pixelRatio: 2
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x60.jpg',
                        height: 50,
                        width: 60,
                        pixelRatio: 1
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x60@2.jpg',
                        height: 50,
                        width: 60,
                        pixelRatio: 2
                    }
                ]
            },
            { heigth: 50, width: 60 },
            1
        );
        expect(result).to.equal('50x60.jpg');
    });

    it('no match', () => {
        const result = chooseMediaThumbnail(
            {
                id: 0,
                url: '5000x5000.jpg',
                height: 5000,
                width: 5000,
                thumbnails: [
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x50.jpg',
                        height: 50,
                        width: 50,
                        pixelRatio: 1
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x50@2.jpg',
                        height: 50,
                        width: 50,
                        pixelRatio: 2
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x60.jpg',
                        height: 50,
                        width: 60,
                        pixelRatio: 1
                    },
                    {
                        id: 0,
                        mediaContentId: 0,
                        url: '50x60@2.jpg',
                        height: 50,
                        width: 60,
                        pixelRatio: 2
                    }
                ]
            },
            { heigth: 50, width: 70 },
            1
        );
        expect(result).to.equal('5000x5000.jpg');
    });
});
