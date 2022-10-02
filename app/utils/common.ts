/**
 * Utility function useful for forcing react state to update on nested objects
 * @param obj
 */
export const copyObject = (obj: any) => JSON.parse(JSON.stringify(obj));
