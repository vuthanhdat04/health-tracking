const users = [];

export const createUser = (data) => {
  const newUser = {
    id: Date.now().toString(),
    ...data,
  };
  users.push(newUser);
  return newUser;
};

export const findUser = (id) => users.find((u) => u.id === id);
