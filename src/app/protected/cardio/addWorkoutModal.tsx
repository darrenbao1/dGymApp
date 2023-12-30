import DateToStringSupabase from "@/utils/DateToStringSupabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { ChangeEvent, FC, ReactNode, useState } from "react";
import { Database } from "../../../../types/supabase";
import { toast } from "react-hot-toast";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	userId: string;
	refetch: () => void;
}

enum ExerciseChoices {
	Stairs = "stairs",
	Treadmill = "treadmill",
	Elliptical = "elliptical",
	Bike = "bike",
}

interface WorkoutDetails {
	caption: string | null;
	image_url: string | null;
	workout_type: string;
	workout_datetime: Date;
	durationInMinutes: number;
}

export const AddWorkoutModal: FC<ModalProps> = ({
	isOpen,
	onClose,
	userId,
	refetch,
}) => {
	const defaultWorkoutDetails = {
		caption: "",
		image_url: null,
		workout_type: ExerciseChoices.Stairs,
		workout_datetime: new Date(),
		durationInMinutes: 0,
	};
	const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetails>(
		defaultWorkoutDetails
	);

	//state and onChange for image upload
	const [image, setImage] = useState<File | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const uploadFile = async () => {
		if (!image) {
			alert("Please select a file first!");
			return null; // Return null if no file is selected
		}

		const formData = new FormData();
		formData.append("file", image);
		formData.append("userId", userId);

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const data = await response.json();

			return data.url; // Return the secure URL
		} catch (error) {
			console.error("Error during file upload:", error);
			return null; // Return null in case of an error
		}
	};

	//end image upload

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const target = e.target as
			| HTMLInputElement
			| HTMLSelectElement
			| HTMLTextAreaElement;
		setWorkoutDetails((prev) => ({
			...prev,
			[target.name]: e.target.value,
		}));
	};
	const supabase = createClientComponentClient<Database>();

	async function upsertWorkoutEntry(workoutDetails: WorkoutDetails) {
		try {
			const dateStr = DateToStringSupabase(workoutDetails.workout_datetime);
			const imageUrl = await uploadFile();

			if (!imageUrl) throw new Error("Error uploading image!");

			const { error } = await supabase.from("cardio_entries").upsert({
				profile_id: userId,
				workout_type: workoutDetails.workout_type,
				durationinminutes: workoutDetails.durationInMinutes,
				workout_datetime: dateStr,
				caption: workoutDetails.caption,
				image_url: imageUrl,
				updated_at: new Date().toISOString(),
			});
			if (error) throw error;
			refetch();
			toast.success("Workout entry updated!");
		} catch (error) {
			toast.error("Error updating workout data!");
		}
	}

	return (
		<div
			className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity ${
				isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			style={{ transition: "opacity 0.5s", zIndex: 1000 }}>
			<div
				className={`fixed bottom-0 left-0 right-0 p-4  transform transition-transform h-full w-full flex flex-col bg-slate-800 ${
					isOpen ? "translate-y-0" : "translate-y-full"
				} `}
				style={{ transition: "transform 0.5s" }}>
				<div className="w-full h-fit">
					<button onClick={onClose} className={`text-s secondary-button `}>
						cancel
					</button>
					<button
						onClick={() => {
							upsertWorkoutEntry(workoutDetails);
							setWorkoutDetails(defaultWorkoutDetails);
							onClose();
						}}
						className={`text-s primary-button float-right`}>
						post
					</button>
				</div>
				<form>
					<div className="rounded-xl shadow-xxl flex flex-col overflow-auto h-full gap-2 mt-6">
						<select
							className="primary-input h-9 w-fit"
							value={workoutDetails.workout_type}
							name="workout_type"
							onChange={(e) => handleChange(e)}>
							{Object.values(ExerciseChoices).map((exercise) => (
								<option key={exercise} value={exercise}>
									{exercise}
								</option>
							))}
						</select>
						<input
							className="primary-input"
							name="durationInMinutes"
							type="number"
							placeholder="duration"
							onChange={(e) => handleChange(e)}
						/>
						<input
							type="file"
							onChange={(e) => handleImageChange(e)}
							accept="image/*"
						/>
						<textarea
							name="caption"
							className="primary-input text-start p-2"
							placeholder="caption"
							onChange={(e) => handleChange(e)}></textarea>
					</div>
				</form>
			</div>
		</div>
	);
};
