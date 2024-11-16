export const extractRpcErrorMessage = (errorString) => {
  const errorRegex = /Error: (.*)$/;
  const match = errorString.match(errorRegex);
  if (match) {
    const messageRegex = /\d+ [A-Z_]+: (.*)$/;
    const messageMatch = match[1].match(messageRegex);
    return messageMatch ? messageMatch[1] : null;
  }
  return null;
};

export const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);
