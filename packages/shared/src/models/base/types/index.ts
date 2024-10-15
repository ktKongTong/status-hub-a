export type CredentialType = 'cookie' | 'oauth' | 'apiToken' | 'credential' | 'oidc' | 'none'

export const CredentialStatusArr:readonly string[] = ['ok', 'in-active', 'pending', 'unknown', 'out-date']

export type CredentialStatus = 'ok' | 'in-active' | 'pending' | 'unknown' | 'out-date'
