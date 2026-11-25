/**
 * Componente MediaAttachments (src/features/checkin/components/MediaAttachments/MediaAttachments.tsx)
 * Gerencia anexo de até 3 fotos comprimidas via Canvas e gravação de nota de voz
 * local usando MediaRecorder API com limite de 120 segundos e tratamento de fallback.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { MediaAttachment } from '../../../../types/domain';
import { compressImageFile } from '../../../../db/mediaUtils';
import { Button } from '../../../../components/ui/Button/Button';
import { Icon } from '../../../../components/ui/Icon/Icon';
import './MediaAttachments.css';

interface MediaAttachmentsProps {
  attachments: MediaAttachment[];
  onAdd: (attachment: MediaAttachment) => void;
  onRemove: (id: string) => void;
}

const MAX_PHOTOS = 3;
const MAX_AUDIO_SECONDS = 120;

export const MediaAttachments: React.FC<MediaAttachmentsProps> = ({
  attachments,
  onAdd,
  onRemove,
}) => {
  // Estados de gravação de áudio e feedback de erro de microfone
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const photos = attachments.filter((a) => a.type === 'image');
  const audios = attachments.filter((a) => a.type === 'audio');

  // Cria Object URLs para pré-visualização e revoga na desmontagem para evitar vazamento
  const previewUrls = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of attachments) {
      map[item.id] = URL.createObjectURL(item.blob);
    }
    return map;
  }, [attachments]);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Encerra a gravação de áudio ativa e limpa o cronômetro
  const stopRecording = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Trata seleção de arquivos de imagem respeitando o teto de 3 fotos comprimidas
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const remainingSlots = Math.max(0, MAX_PHOTOS - photos.length);

    for (const file of files.slice(0, remainingSlots)) {
      const { blob, mimeType } = await compressImageFile(file);
      onAdd({
        id: crypto.randomUUID(),
        type: 'image',
        mimeType,
        blob,
      });
    }
    event.target.value = '';
  };

  // Inicia gravação de voz via MediaRecorder com limite automático de 2 minutos
  const startRecording = async () => {
    setAudioError(null);
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setAudioError('Seu navegador não suporta gravação de voz local.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      const recorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      let elapsed = 0;

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((track) => track.stop());
        if (blob.size > 0) {
          onAdd({
            id: crypto.randomUUID(),
            type: 'audio',
            mimeType,
            blob,
            durationSeconds: elapsed,
          });
        }
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setSeconds(0);

      timerRef.current = window.setInterval(() => {
        elapsed += 1;
        setSeconds(elapsed);
        if (elapsed >= MAX_AUDIO_SECONDS) {
          stopRecording();
        }
      }, 1000);
    } catch {
      setAudioError('Permissão de microfone negada ou dispositivo indisponível.');
    }
  };

  return (
    <div className="pf-media">
      <div className="pf-media__actions">
        {/* Botão estilizado de upload de foto comprimida */}
        {photos.length < MAX_PHOTOS && (
          <label className="pf-media__file-label">
            <Icon name="camera" size={16} />
            <span>Adicionar foto ({photos.length}/{MAX_PHOTOS})</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="pf-sr-only"
              onChange={(e) => void handleFileChange(e)}
            />
          </label>
        )}

        {/* Controle de gravação de nota de voz local */}
        {!isRecording ? (
          <Button
            size="sm"
            variant="secondary"
            icon={<Icon name="mic" size={16} />}
            onClick={() => void startRecording()}
          >
            Gravar nota de voz
          </Button>
        ) : (
          <Button size="sm" variant="danger" onClick={stopRecording}>
            Parar gravação ({seconds}s / {MAX_AUDIO_SECONDS}s)
          </Button>
        )}
      </div>

      {audioError && <p className="pf-text-xs">{audioError}</p>}

      {/* Pré-visualização das fotos anexadas */}
      {photos.length > 0 && (
        <div className="pf-media__preview-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="pf-media__photo-card">
              <img src={previewUrls[photo.id]} alt="Foto anexada ao check-in" />
              <button
                type="button"
                className="pf-media__remove-btn"
                aria-label="Remover foto"
                onClick={() => onRemove(photo.id)}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Players de revisão para notas de voz gravadas */}
      {audios.map((audio) => (
        <div key={audio.id} className="pf-media__audio-row">
          <audio controls src={previewUrls[audio.id]} />
          <Button
            size="sm"
            variant="ghost"
            aria-label="Remover áudio"
            onClick={() => onRemove(audio.id)}
          >
            Remover
          </Button>
        </div>
      ))}
    </div>
  );
};
