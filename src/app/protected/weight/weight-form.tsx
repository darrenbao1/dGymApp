"use client";
import { useCallback, useEffect, useState } from "react";
import { Database } from "../../../../types/supabase";
import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WeightGraph from "./weight-graph";
import DateToStringSupabase from "@/utils/DateToStringSupabase";

export default function WeightForm({ session }: { session: Session | null }) {
	const supabase = createClientComponentClient<Database>();
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [weight, setWeight] = useState<number | null>(null);
	const user = session?.user;

	const getWeightEntryByDate = useCallback(async () => {
		try {
			const dateStr = DateToStringSupabase(selectedDate);
			const { data, error } = await supabase
				.from("weight_entries")
				.select("weight")
				.eq("profile_id", user!.id)
				.eq("date", dateStr)
				.single();

			if (error) {
				throw error;
			}

			if (data) {
				setWeight(data.weight);
			} else {
				setWeight(null);
			}
		} catch (error) {
			setWeight(null);
			toast.error(`${selectedDate} has no entry`);
		}
	}, [user, supabase, selectedDate]);

	useEffect(() => {
		getWeightEntryByDate();
	}, [getWeightEntryByDate]);

	async function upsertWeightEntry(weight: number) {
		try {
			const dateStr = DateToStringSupabase(selectedDate);
			const { error } = await supabase.from("weight_entries").upsert({
				profile_id: user!.id,
				weight: weight,
				date: dateStr,
				updated_at: new Date().toISOString(),
			});

			if (error) throw error;
			toast.success("Weight entry updated!");
		} catch (error) {
			toast.error("Error updating weight data!");
		}
	}

	return (
		<div className="container bg-gray-900 rounded-xl p-6 shadow-xxl flex flex-col overflow-auto gap-2 items-center h-full">
			<div className="account-form-field">
				<label htmlFor="dateSelect" className="account-form-label">
					Select Date:
				</label>

				<ReactDatePicker
					selected={selectedDate}
					onChange={(date) => date && setSelectedDate(date)}
					dateFormat="dd-MM-yyyy"
					className="primary-input"
				/>
			</div>
			<div className="account-form-field">
				<label htmlFor="weight" className="account-form-label">
					Weight:
				</label>
				<input
					id="weight"
					type="number"
					value={weight || ""}
					onChange={(e) => setWeight(Number(e.target.value))}
					className="primary-input"
					placeholder="Weight"
				/>
			</div>
			<button
				onClick={() => weight !== null && upsertWeightEntry(weight)}
				disabled={weight === null}
				className="primary-button">
				Save Weight
			</button>
			<div className="container my-auto">
				<WeightGraph session={session} />
			</div>
		</div>
	);
}
