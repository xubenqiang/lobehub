/**
 * Market's 409 reasons, passed through as the tRPC message by
 * `workspaceCreds`: the workspace already shares a credential under this key,
 * or private workspace credentials are not enabled on Market yet.
 */
const CONFLICT_KEYS = {
  private_creds_disabled: 'creds.errors.privateCredsDisabled',
  public_cred_exists: 'creds.errors.publicCredExists',
} as const;

type ConflictKey = (typeof CONFLICT_KEYS)[keyof typeof CONFLICT_KEYS];

/** The `setting` locale key describing a credential write failure, or `fallbackKey`. */
export const credErrorKey = <K extends string>(error: unknown, fallbackKey: K): ConflictKey | K => {
  if (!(error instanceof Error)) return fallbackKey;
  if ((error as { data?: { code?: string } }).data?.code !== 'CONFLICT') return fallbackKey;
  return CONFLICT_KEYS[error.message as keyof typeof CONFLICT_KEYS] ?? fallbackKey;
};
