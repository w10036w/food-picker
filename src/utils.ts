export const getFromStorage = async (key: string) => {
  const data = await chrome?.storage?.local?.get(key)
  return data[key]
}

export const setToStorage = async (key: string, value: any) => {
  await chrome?.storage?.local?.set({ [key]: value })
}