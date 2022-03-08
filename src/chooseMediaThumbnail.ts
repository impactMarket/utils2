export function chooseMediaThumbnail(
    media: {
        url: string;
        thumbnails: {
            url: string;
            width: number;
            height: number;
            pixelRatio: number;
        }[];
    },
    size: { heigth: number; width: number },
    pixelRatio?: number
) {
    if (media.thumbnails && media.thumbnails.length > 0) {
        const thumbnails = media.thumbnails.filter(t => t.height === size.heigth && t.width === size.width);

        if (thumbnails.length > 0) {
            const thumbnail = thumbnails.find(t => t.pixelRatio === (pixelRatio || 1));

            if (thumbnail) {
                return thumbnail.url;
            }

            return thumbnails[0].url;
        }
    }

    return media.url;
}
