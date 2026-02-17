/** Generate a UUID: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid/2117523#2117523 */
export const fallbackUuid = () =>
  '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );
