const checkType = (item: any) => {
  return typeof item !== "string";
};

export const setItemToLS = (name: string, item: any) => {
  localStorage.setItem(name, checkType(item) ? JSON.stringify(item) : item);
};

export const getItemFromLS = (name: string) => {
  const item = localStorage.getItem(name);

  if (!item) return null;

  const parsedItem = JSON.parse(item);

  return typeof parsedItem === "object" ? parsedItem : item;
};

export const removeItemFromLS = (name: string) => {
  localStorage.removeItem(name);
};
