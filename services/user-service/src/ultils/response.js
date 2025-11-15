export const success = (message, data) => ({
  status: "success",
  message,
  data,
});

export const error = (message) => ({
  status: "error",
  message,
});
