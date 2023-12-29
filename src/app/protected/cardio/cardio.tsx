"use client";
import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Database } from "../../../../types/supabase";
import { useMemo, useState } from "react";
import NewWorkoutButton from "./newWorkoutButton";

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

export default function Cardio({ session }: { session: Session | null }) {
	const supabase = createClientComponentClient<Database>();
	const user = session?.user;

	const [filter, setFilter] = useState<Filter>({
		timeFrame: TimeFrame.ThisWeek,
		exerciseType: ExerciseType.All,
		isYourSession: false,
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	//useMemo is used to prevent unnecessary re-renders
	const filteredSessions = useMemo(() => {
		console.log("filter changed");
	}, [filter]);

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
			<div className="flex gap-2">
				{/* Time Frame Dropdown */}
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
				{/* Exercise Type Dropdown */}
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
			</div>
			<NewWorkoutButton userId={user?.id} />
		</>
	);
}
