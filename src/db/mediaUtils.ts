/**
 * Utilitários de Mídia Local (src/db/mediaUtils.ts)
 * Realiza compressão de imagens client-side via <canvas> (máx 1080px, qualidade 0.8)
 * e conversão entre Blob e Data URL Base64 para backup JSON.
 */

// Comprime uma imagem selecionada pelo usuário para economizar cota do IndexedDB
export async function compressImageFile(
  file: File,
  maxWidth = 1080,
  quality = 0.8
): Promise<{ blob: Blob; mimeType: string }> {
  // Em ambientes de teste sem suporte completo a Image/Canvas, retorna o próprio arquivo
  if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return { blob: file, mimeType: file.type || 'image/jpeg' };
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const targetWidth = Math.max(1, Math.round(img.width * scale));
      const targetHeight = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({ blob: file, mimeType: file.type || 'image/jpeg' });
        return;
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const targetMime = 'image/webp';

      if (typeof canvas.toBlob !== 'function') {
        resolve({ blob: file, mimeType: file.type || 'image/jpeg' });
        return;
      }

      canvas.toBlob(
        (resultBlob) => {
          if (resultBlob) {
            resolve({ blob: resultBlob, mimeType: resultBlob.type || targetMime });
          } else {
            resolve({ blob: file, mimeType: file.type || 'image/jpeg' });
          }
        },
        targetMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ blob: file, mimeType: file.type || 'image/jpeg' });
    };

    img.src = objectUrl;
  });
}

// Converte um Blob binário para Data URL Base64 (usado na exportação JSON)
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Erro ao ler mídia.'));
    reader.readAsDataURL(blob);
  });
}

// Reconstrói um Blob a partir de uma Data URL Base64 (usado na restauração JSON)
export function dataUrlToBlob(dataUrl: string, fallbackMime = 'application/octet-stream'): Blob {
  const parts = dataUrl.split(',');
  if (parts.length < 2) {
    return new Blob([], { type: fallbackMime });
  }
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : fallbackMime;
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

// Gera chave de data local no formato 'YYYY-MM-DD' sem distorção de fuso horário
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
