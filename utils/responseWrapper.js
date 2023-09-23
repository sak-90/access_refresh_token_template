const responseFormat = (
  success,
  message = "No specific message",
  token = "No assiciated token"
) => {
  return {
    success: success,
    message: message,
    token: token,
  };
};
export default responseFormat;
