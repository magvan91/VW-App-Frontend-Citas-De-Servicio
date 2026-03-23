export const onlyLettersWithAcents = (word: string): string => {
  //* Se agrega \u00C0-\u00FF para incluir acentos y ñ
  const filteredValue = word.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, "");
  return filteredValue;
};

export const onlyLettersAndNumbers = (word: string): string => {
  const filteredValue = word.replace(/[^\p{L}\p{N}]|[ñÑ]/gu, "");
  return filteredValue;
};

export const onlyNumbers = (digit: string): string => {
  const filteredValue = digit.replace(/\D/g, "");
  return filteredValue;
};
