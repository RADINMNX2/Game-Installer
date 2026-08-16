import React from 'react';
import { AlertTriangle, Trash2, Check } from 'lucide-react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  count?: number;            // optional badge in the icon corner
  danger?: boolean;          // red destructive button (default true)
}

/**
 * Canonical NeonRed confirmation dialog.
 * Reuse for deletes, resets, destructive/irreversible actions.
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, onClose, onConfirm, title, description, confirmText = 'Confirm', cancelText = 'Cancel', count, danger = true,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} accent="primary" size="sm">
      <div className="p-8 flex flex-col items-center text-center relative z-10">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse-slow" />
          <div className="w-20 h-20 bg-gradient-to-br from-zinc-900 to-black border border-red-500/30 rounded-full flex items-center justify-center shadow-lg relative z-10">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
          {count && count > 0 && (
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-zinc-950 z-20">
              {count}
            </div>
          )}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-persian">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 font-persian">{description}</p>

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={onClose}
            className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-gray-300 rounded-xl font-medium transition-colors border border-white/5 font-persian"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-3 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 font-persian group/btn
              ${danger
                ? 'bg-red-600 hover:bg-red-500 shadow-red-900/30 hover:shadow-red-900/50 hover:scale-[1.02]'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'}`}
          >
            {danger ? <Trash2 size={18} className="group-hover/btn:animate-bounce" /> : <Check size={18} />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
