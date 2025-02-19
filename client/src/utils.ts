import { DEFAULT_IMAGE } from "./constans";

export const extractImageUrl = (url: string | undefined): string => {
    if (!url) {
        return DEFAULT_IMAGE;
    }
    return url.match(/.*?\.(png|jpg)/)?.[0] || url;
};


export const getRandomString = () => {
    const digits = Math.floor(Math.random() * 90 + 10);
    const letters = [...Array(3)]
      .map(() => String.fromCharCode(Math.random() > 0.5 
        ? Math.floor(Math.random() * 26) + 65 
        : Math.floor(Math.random() * 26) + 97 
      ))
      .join('');
    return `${digits}${letters}`;
};
