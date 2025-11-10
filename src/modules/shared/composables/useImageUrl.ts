const useImageUrl = () => {
  const baseURL = process.env.DEV ? process.env.BASE_URL : process.env.BASE_URL_PROD;
  const basePublicURL = process.env.DEV
    ? process.env.BASE_PUBLIC_URL
    : process.env.BASE_PUBLIC_URL_PROD;

  const imageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return `${baseURL}/files/${imagePath}`;
  };

  const imagePublicUrl = (imagePath: string) => {
    if (!imagePath) return '';
    const image = `${basePublicURL}/${imagePath}`;
    console.log('imagePublicUrl', image);

    return image;
  };

  return {
    imageUrl,
    imagePublicUrl,
  };
};

export default useImageUrl;
