import { useEffect, useState } from 'react';

import { VisualGallo } from './VisualGallo';
import { diccionarioColores } from '../data/characters';

import type { ColorEditorModalProps } from '@/types/ui';

export function ColorEditorModal({
  fighter,
  onClose,
  onSave,
}: ColorEditorModalProps) {
  const [tempColor, setTempColor] = useState<string>(
    fighter?.color || '#FFCB05',
  );
  const [previewPose, setPreviewPose] = useState('defensa');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!fighter) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>🎨 Feather Color Editor</h2>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          <div className='color-list'>
            {diccionarioColores.map((c) => (
              <div
                key={c.color}
                className={`color-item ${c.color === tempColor ? 'selected' : ''}`}
                onClick={() => setTempColor(c.color)}
              >
                <div
                  className='color-preview-dot'
                  style={{ backgroundColor: c.color }}
                ></div>
                <span className='color-name'>{c.name}</span>
              </div>
            ))}
          </div>
          <div className='preview-panel'>
            <div className='preview-svg-container'>
              <VisualGallo
                type={previewPose}
                color={tempColor}
                isRight={false}
              />
            </div>
            <button
              className='button button--ghost'
              onClick={() =>
                setPreviewPose((prev) =>
                  prev === 'defensa' ? 'ataque' : 'defensa',
                )
              }
            >
              🔄 View Pose:{' '}
              <span>{previewPose === 'defensa' ? 'Defense' : 'Attack'}</span>
            </button>
          </div>
        </div>
        <div className='modal-footer'>
          <button className='button button--ghost' onClick={onClose}>
            Cancel
          </button>
          <button
            className='button button--secondary'
            onClick={() => onSave(fighter.id, tempColor)}
          >
            Save Color
          </button>
        </div>
      </div>
    </div>
  );
}
