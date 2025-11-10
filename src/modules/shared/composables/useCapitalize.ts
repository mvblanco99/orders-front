const useCapitalize = () => {
  const capitalizeString = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return {
    capitalizeString,
  };
};

export default useCapitalize;
