export const saveMetric = (data) => {
  return {
    id: Date.now(),
    ...data,
    recordedAt: new Date(),
  };
};
