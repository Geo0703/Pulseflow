/**
 * Utilitários Criptográficos para PIN Local (src/features/settings/utils/pinCrypto.ts)
 * Gera e valida hashes SHA-256 via Web Crypto API sem armazenar o PIN em texto puro.
 */

// Valida se o PIN informado possui exatamente 4 dígitos numéricos
export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

// Calcula o hash SHA-256 hexadecimal de um PIN usando crypto.subtle.digest
export async function hashPin(pin: string): Promise<string> {
  const salted = `pulseflow-pin-v1:${pin}`;
  const bytes = new TextEncoder().encode(salted);

  if (typeof crypto !== 'undefined' && crypto.subtle?.digest) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Fallback determinístico apenas para ambientes sem Web Crypto
  let h = 2166136261;
  for (let i = 0; i < bytes.length; i += 1) {
    h ^= bytes[i];
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// Compara um PIN digitado contra o hash SHA-256 salvo nas configurações
export async function verifyPin(pin: string, expectedHash: string): Promise<boolean> {
  const computed = await hashPin(pin);
  return computed === expectedHash;
}
