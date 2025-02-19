import { VERCEL_IMAGE } from "../constans";

export const extractImageUrl = (url: string | undefined): string => {
    if (!url) {
        return VERCEL_IMAGE;
    }

    const imageRegex = /\.(jpeg|jpg|gif|png|bmp|webp|svg)$/i;

    const extractedUrl = url.split('?')[0];
    
    if (imageRegex.test(extractedUrl)) {
        return extractedUrl;
    }

    return VERCEL_IMAGE;
};
