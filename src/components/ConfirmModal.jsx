import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "Are you sure?", message, confirmText = "YES", cancelText = "NO" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-md w-80 text-center overflow-hidden relative shadow-2xl">
                <div className="h-2 bg-[#e46462] w-full absolute top-0 left-0"></div>

                <div className="pt-6 pb-5 px-6">
                    <h3 className="text-[1.125rem] font-bold text-[#5c6873] mb-3">{title}</h3>
                    <div className="w-full border-t border-gray-100 my-3"></div>
                    <p className="text-[0.95rem] text-[#4a5568] mb-6">{message}</p>

                    <div className="flex justify-center space-x-2">
                        <button
                            onClick={onConfirm}
                            className="px-5 py-1.5 bg-[#e46462] hover:bg-[#d65755] text-white text-sm font-medium rounded transition"
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-5 py-1.5 bg-[#939ba2] hover:bg-[#858d94] text-white text-sm font-medium rounded transition"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
