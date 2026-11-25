/**
 * Testes de Criptografia de PIN (src/features/settings/utils/pinCrypto.test.ts)
 * Valida formato de 4 dígitos e consistência do hash SHA-256.
 */
import { describe, expect, it } from 'vitest';
import { hashPin, isValidPin, verifyPin } from './pinCrypto';

describe('Segurança de PIN local (pinCrypto)', () => {
  it('deve validar PINs estritamente com 4 dígitos numéricos', () => {
    expect(isValidPin('1234')).toBe(true);
    expect(isValidPin('123')).toBe(false);
    expect(isValidPin('12ab')).toBe(false);
  });

  it('deve gerar hash SHA-256 consistente e verificar PIN correto e incorreto', async () => {
    const hash = await hashPin('2580');
    expect(hash).not.toBe('2580');
    expect(await verifyPin('2580', hash)).toBe(true);
    expect(await verifyPin('9999', hash)).toBe(false);
  });
});
