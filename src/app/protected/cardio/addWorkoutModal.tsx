"use client";
import DateToStringSupabase from "@/utils/DateToStringSupabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { ChangeEvent, FC, useState } from "react";
import { Database } from "../../../../types/supabase";
import { toast } from "react-hot-toast";
import UploadImageBase64 from "@/utils/UploadImageBase64";

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
	workout_type: string;
	workout_datetime: Date;
	durationinminutes: number;
}

export const AddWorkoutModal: FC<ModalProps> = ({
	isOpen,
	onClose,
	userId,
	refetch,
}) => {
	const supabase = createClientComponentClient<Database>();
	const defaultWorkoutDetails = {
		caption: "",
		workout_type: ExerciseChoices.Stairs,
		workout_datetime: new Date(),
		durationinminutes: 0,
	};
	const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetails>(
		defaultWorkoutDetails
	);
	const [image, setImage] = useState<File | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

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

	async function upsertWorkoutEntry(workoutDetails: WorkoutDetails) {
		const { caption, workout_type, workout_datetime, durationinminutes } =
			workoutDetails;
		if (image) {
			if (durationinminutes <= 0) {
				throw new Error("Duration cannot be blank or 0");
			}
			try {
				const imageUrl = await UploadImageBase64(image, userId).catch(
					(error) => {
						console.log(error);
						throw Error(error);
					}
				);

				const dateStr = DateToStringSupabase(workout_datetime);
				const { error } = await supabase.from("cardio_entries").upsert({
					profile_id: userId,
					caption,
					workout_type,
					workout_datetime: dateStr,
					durationinminutes,
					image_url: imageUrl,
					updated_at: new Date().toISOString(),
				});
				if (error) throw error;
			} catch (error) {
				console.log(error);
				throw Error("Error saving workout data");
			}
		} else {
			throw Error("Please select an image to upload.");
		}
	}

	const handlePostClicked = () => {
		const upsert = upsertWorkoutEntry(workoutDetails);
		toast.promise(upsert, {
			loading: "uploading workout",
			success: "Workout successfully uploaded",
			error: (err) => `${err.toString()}`,
		});
		upsert
			.then(() => {
				setWorkoutDetails(defaultWorkoutDetails);
				refetch();
				onClose();
			})
			.catch((error) => {
				console.error("Error during workout uplaod:", error);
			});
	};

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
						onClick={handlePostClicked}
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
							name="durationinminutes"
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
