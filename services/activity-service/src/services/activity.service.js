export const saveActivity = (data) => {
  return {
    id: Date.now(),
    ...data,
    createdAt: new Date(),
  };
};
