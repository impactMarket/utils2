// eslint-disable-next-line import/named
import { chooseMediaThumbnail } from '../src/chooseMediaThumbnail';
import { expect } from 'chai';

describe('#chooseMediaThumbnail()', () => {
    it('exact match (size)', () => {
        const result = chooseMediaThumbnail(
            {
                thumbnails: [
                    {
                        height: 50,
                        pixelRatio: 1,
                        url: '50x50.jpg',
                        width: 50
                    },
                    {
                        height: 50,
                        pixelRatio: 1,
                        url: '50x60.jpg',
                        width: 60
                    }
                ],
                url: '5000x5000.jpg'
            },
            { heigth: 50, width: 60 },
            1
        );

        expect(result).to.equal('50x60.jpg');
    });

    it('exact match (pixel ratio)', () => {
        const result = chooseMediaThumbnail(
            {
                thumbnails: [
                    {
                        height: 50,
                        pixelRatio: 1,
                        url: '50x50.jpg',
                        width: 50
                    },
                    {
                        height: 50,
                        pixelRatio: 2,
                        url: '50x50@2.jpg',
                        width: 50
                    },
                    {
                        height: 50,
                        pixelRatio: 3,
                        url: '50x50@3.jpg',
                        width: 50
                    }
                ],
                url: '5000x5000.jpg'
            },
            { heigth: 50, width: 50 },
            2
        );

        expect(result).to.equal('50x50@2.jpg');
    });

    it('exact match (size and pixel ratio)', () => {
        const result = chooseMediaThumbnail(
            {
                thumbnails: [
                    {
                        height: 50,
                        pixelRatio: 1,
                        url: '50x50.jpg',
                        width: 50
                    },
                    {
                        height: 50,
                        pixelRatio: 2,
                        url: '50x50@2.jpg',
                        width: 50
                    },
                    {
                        height: 50,
                        pixelRatio: 1,
                        url: '50x60.jpg',
                        width: 60
                    },
                    {
                        height: 50,
                        pixelRatio: 2,
                        url: '50x60@2.jpg',
                        width: 60
                    }
                ],
                url: '5000x5000.jpg'
            },
            { heigth: 50, width: 60 },
            1
        );

        expect(result).to.equal('50x60.jpg');
    });

    it('no match', () => {
        const result = chooseMediaThumbnail(
            {
                thumbnails: [
                    {
                        height: 50,
                        pixelRatio: 1,
                        url: '50x50.jpg',
                        width: 50
                    },
                    {
                        height: 50,
                        pixelRatio: 2,
                        url: '50x50@2.jpg',
                        width: 50
                    },
                    {
                        height: 50,
                        pixelRatio: 1,
                        url: '50x60.jpg',
                        width: 60
                    },
                    {
                        height: 50,
                        pixelRatio: 2,
                        url: '50x60@2.jpg',
                        width: 60
                    }
                ],
                url: '5000x5000.jpg'
            },
            { heigth: 50, width: 70 },
            1
        );

        expect(result).to.equal('5000x5000.jpg');
    });
});
