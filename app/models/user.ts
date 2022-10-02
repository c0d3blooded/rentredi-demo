export interface User {
  /** The user's id (uuid) */
  id: string;
  /** The users's name */
  name: string;
  /** The users's current zip code */
  zip_code: string;
  /** Calculated latitude */
  latitude: number;
  /** Calculated longitude */
  longitude: number;
  /** Calculated timezone */
  timezone: number;
}
