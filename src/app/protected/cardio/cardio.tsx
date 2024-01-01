"use client";
import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Database } from "../../../../types/supabase";
import { useCallback, useEffect, useMemo, useState } from "react";
import NewWorkoutButton from "./newWorkoutButton";
import Image from "next/image";

interface Filter {
	timeFrame: string;
	exerciseType: string;
	isYourSession: boolean;
}

enum TimeFrame {
	Today = "today",
	ThisWeek = "this week",
	ThisMonth = "this month",
	ThisYear = "this year",
	AllTime = "all time",
}
enum ExerciseType {
	All = "all",
	Stairs = "stairs",
	Treadmill = "treadmill",
	Elliptical = "elliptical",
	Bike = "bike",
}

interface CardioData {
	caption: string | null;
	durationinminutes: number;
	id: number;
	image_url: string | null;
	inserted_at: string;
	profile_id: string;
	updated_at: string;
	workout_datetime: string;
	workout_type: string;
	profiles: any;
}
interface ProfileData {
	avatar_url: string | null;
	full_name: string | null;
	id: string;
	updated_at: string | null;
	username: string | null;
	website: string | null;
}
interface AvatarUrls {
	[key: string]: string;
}

export default function Cardio({ session }: { session: Session | null }) {
	const supabase = createClientComponentClient<Database>();
	const user = session?.user;
	const [cardioDataArray, setCardioDataArray] = useState<CardioData[] | null>();
	const [avatarUrls, setAvatarUrls] = useState<AvatarUrls>({});
	const [filter, setFilter] = useState<Filter>({
		timeFrame: TimeFrame.ThisWeek,
		exerciseType: ExerciseType.All,
		isYourSession: false,
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	//useMemo is used to prevent unnecessary re-renders
	const filteredSessions = useMemo(() => {
		//filter cardioDataArray with the filter object
		if (!cardioDataArray) return [];

		return cardioDataArray.filter((session) => {
			const isUserSession =
				!filter.isYourSession || session.profile_id === user?.id;
			return isUserSession;
		});
	}, [filter, cardioDataArray]);

	const downloadAvatar = async (userId: string, path: string) => {
		try {
			const { data, error } = await supabase.storage
				.from("avatars")
				.download(path);
			if (error) {
				throw error;
			}
			const url = URL.createObjectURL(data);
			setAvatarUrls((prevUrls) => ({ ...prevUrls, [userId]: url }));
		} catch (error) {
			console.error("Error downloading avatar for user", userId, error);
		}
	};

	const getCardioEntry = useCallback(async () => {
		try {
			const { data, error } = await supabase
				.from("cardio_entries")
				.select(
					`
			*,
			profiles (
				id,
				username,
				full_name,
				avatar_url,
				website
			)
		`
				)
				.order("inserted_at", { ascending: false });

			if (error) {
				throw error;
			}
			if (data) {
				setCardioDataArray(data);
				data.forEach((entry: CardioData) => {
					if (entry.profiles.avatar_url) {
						downloadAvatar(entry.profile_id, entry.profiles.avatar_url);
					}
				});
			} else {
				setCardioDataArray(null);
			}
		} catch (error) {
			setCardioDataArray(null);
			toast.error("Error retrieving data");
		}
	}, [user, supabase]);

	useEffect(() => {
		getCardioEntry();
	}, [user, getCardioEntry]);

	return (
		<>
			<div className="flex">
				<button
					className={`flex-1 text-lg font-semibold py-2 rounded-l-lg ${
						filter.isYourSession
							? "bg-blue-500 text-white"
							: "bg-gray-700 text-gray-300"
					}`}
					onClick={() => setFilter({ ...filter, isYourSession: true })}>
					Personal
				</button>
				<button
					className={`flex-1 text-lg font-semibold py-2 rounded-r-lg ${
						!filter.isYourSession
							? "bg-blue-500 text-white"
							: "bg-gray-700 text-gray-300"
					}`}
					onClick={() => setFilter({ ...filter, isYourSession: false })}>
					Global
				</button>
			</div>
			{/* <div className="flex gap-2">
				
				<select
					className="flex-1 form-select rounded-lg bg-gray-700 text-white p-2"
					value={filter.timeFrame}
					onChange={(e) =>
						setFilter({ ...filter, timeFrame: e.target.value as TimeFrame })
					}>
					{Object.values(TimeFrame).map((timeFrame) => (
						<option key={timeFrame} value={timeFrame}>
							{timeFrame}
						</option>
					))}
				</select>
				
				<select
					className="flex-1 form-select rounded-lg bg-gray-700 text-white p-2"
					value={filter.exerciseType}
					onChange={(e) =>
						setFilter({
							...filter,
							exerciseType: e.target.value as ExerciseType,
						})
					}>
					{Object.values(ExerciseType).map((exerciseType) => (
						<option key={exerciseType} value={exerciseType}>
							{exerciseType}
						</option>
					))}
				</select>
			</div> */}
			<div className="overflow-auto">
				{filteredSessions?.map((item, index) => {
					const profileObj = item.profiles as ProfileData;
					const avatarUrl = avatarUrls[item.profile_id] || "default-avatar.png";
					return (
						<div key={index} className="cardio-post">
							<div className="user-info">
								<img
									src={avatarUrl || "default-avatar.png"}
									alt="User Avatar"
									className="avatar"
								/>
								<span className="username">{profileObj.username}</span>
							</div>

							<div className="workout-info">
								<p>
									<strong>Workout:</strong> {item.workout_type}
								</p>

								<p>
									<strong>Duration:</strong> {item.durationinminutes} minutes
								</p>
								{item.caption && <p className="caption">{item.caption}</p>}
							</div>

							{item.image_url && (
								<Image
									src={item.image_url}
									alt="Workout"
									className="workout-image"
									width={200}
									height={200}
								/>
							)}

							<div className="post-footer">
								<span>
									Posted on{" "}
									{new Date(item.workout_datetime).toLocaleDateString()}
								</span>
							</div>
						</div>
					);
				})}
			</div>
			<NewWorkoutButton userId={user?.id} refetch={getCardioEntry} />
		</>
	);
}
