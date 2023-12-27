import React, { FC, ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
}

enum ExerciseChoices {
	Stairs = "stairs",
	Treadmill = "treadmill",
	Elliptical = "elliptical",
	Bike = "bike",
}

export const AddWorkoutModal: FC<ModalProps> = ({ isOpen, onClose }) => {
	return (
		<div
			className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity ${
				isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			style={{ transition: "opacity 0.5s", zIndex: 1000 }}>
			<div
				className={`fixed bottom-0 left-0 right-0 bg-white p-4  transform transition-transform ${
					isOpen ? "translate-y-0" : "translate-y-full"
				} bg-gray-800 h-full w-full flex flex-col`}
				style={{ transition: "transform 0.5s" }}>
				<div className="w-full h-fit">
					<button onClick={onClose} className={`text-s secondary-button `}>
						cancel
					</button>
					<button
						onClick={onClose}
						className={`text-s primary-button float-right`}>
						post
					</button>
				</div>
				<form>
					<div className="rounded-xl shadow-xxl flex flex-col overflow-auto h-full gap-2 mt-6">
						<select className="primary-input h-9 w-fit">
							{Object.values(ExerciseChoices).map((exercise) => (
								<option key={exercise} value={exercise}>
									{exercise}
								</option>
							))}
						</select>
						<input
							className="primary-input"
							type="number"
							placeholder="duration"
						/>

						<textarea
							className="primary-input text-start p-2"
							placeholder="caption"></textarea>
					</div>
				</form>
			</div>
		</div>
	);
};
