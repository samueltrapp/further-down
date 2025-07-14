export const formatCaps = (str: string) => {
    const regex = /(\b[a-z](?!\s))/g;
    return str.replace(regex, (letter) => letter.toUpperCase());
}