import React from "react";
import { X } from "lucide-react";

interface ProfileModalProps {
	isOpen?: boolean;
	onClose?: () => void;
	children?: React.ReactNode;
}

const Modal: React.FC<ProfileModalProps> = ({
	isOpen = true,
	onClose,
	children,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-lg w-full relative">
				{/* Header buttons */}
				<div className="absolute top-4 right-4 flex gap-2">
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<X className="w-5 h-5 text-gray-600" />
					</button>
				</div>

				{children}
			</div>
		</div>
	);
};

export default Modal;
