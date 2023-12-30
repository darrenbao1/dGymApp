"use client";

import { useCallback, useState } from "react";
import { AddWorkoutModal } from "./addWorkoutModal";

interface Props {
	userId: string | undefined;
	refetch: () => void;
}

export default function NewWorkoutButton(props: Props) {
	const { userId,refetch } = props;
	const [isModalOpen, setModalOpen] = useState(false);

	const openModal = useCallback(() => setModalOpen(true), []);
	const closeModal = useCallback(() => setModalOpen(false), []);

	if (!userId) return null;

	return (
		<>
			<button
				onClick={openModal}
				className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 shadow-lg rounded-full"
				aria-label="Add Workout">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 4v16m8-8H4"
					/>
				</svg>
			</button>
			<AddWorkoutModal
				isOpen={isModalOpen}
				onClose={closeModal}
				userId={userId}
				refetch={refetch}
			/>
		</>
	);
}
