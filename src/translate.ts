import LanguagesJSON from './languages.json';
import axios, { AxiosResponse } from 'axios';

const languages: {
    [key: string]: {
        name: string;
    };
} = LanguagesJSON;

export async function translate(
    text: string,
    target: string,
    options: {
        googleApiKey: string;
    }
): Promise<{ detectedSourceLanguage?: string; translatedText: string }> {
    try {
        const q = encodeURIComponent(text);
        const query = `https://translation.googleapis.com/language/translate/v2?key=${options.googleApiKey}&format=text&target=${target}&q=${q}`;
        const response = await axios.get<
            never,
            AxiosResponse<{
                data: {
                    translations: [
                        {
                            translatedText: string;
                            detectedSourceLanguage: string;
                        }
                    ];
                };
            }>
        >(query);
        const result = response.data?.data?.translations;

        return result &&
            result.length > 0 &&
            result[0].translatedText.length > 0
            ? {
                  translatedText: result[0].translatedText,
                  detectedSourceLanguage:
                      languages[result[0].detectedSourceLanguage.toLowerCase()]
                          .name
              }
            : { translatedText: text };
    } catch (_) {
        return { translatedText: text };
    }
}
