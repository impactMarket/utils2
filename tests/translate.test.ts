import { expect } from 'chai';
// eslint-disable-next-line import/named
import { translate } from '../src/translate';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('#translate()', () => {
    let mock: MockAdapter;
    const googleApiKey = 'xyz';

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    it('valid data (en->pt)', async () => {
        const language = 'pt';

        mock.onAny().replyOnce(200, {
            data: {
                translations: [
                    {
                        detectedSourceLanguage: language,
                        translatedText: 'Olá amigo'
                    }
                ]
            }
        });
        const result = await translate('Hello friend', language, {
            googleApiKey
        });

        expect(mock.history.get[0].url).to.contain('&q=Hello%20friend');
        mock.reset();
        expect(result.translatedText).to.equal('Olá amigo');
        expect(result.detectedSourceLanguage).to.equal('Portuguese');
    });

    it('valid data (no translation needed)', async () => {
        const language = 'en';

        mock.onAny().replyOnce(200, {
            data: {
                translations: [
                    {
                        detectedSourceLanguage: language,
                        translatedText: 'Hello'
                    }
                ]
            }
        });
        const result = await translate('Hello', language, {
            googleApiKey
        });

        expect(result.translatedText).to.equal('Hello');
        expect(result.detectedSourceLanguage).to.equal('English');
    });

    it('throws on requet', async () => {
        const language = 'pt';
        const result = await translate('Hello', language, {
            googleApiKey
        });

        expect(result.translatedText).to.equal('Hello');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(result.detectedSourceLanguage).to.be.undefined;
    });
});
