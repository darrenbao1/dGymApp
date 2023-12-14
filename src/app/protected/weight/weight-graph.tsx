"use client";
import { useCallback, useEffect, useState } from "react";
import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { toast } from "react-hot-toast";
import WeightChart from "./weight-chart";

interface WeightEntry {
	weight: number;
	date: string;
}

export default function WeightGraph({ session }: { session: Session | null }) {
	const supabase = createClientComponentClient<Database>();
	const user = session?.user;
	const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
	const getWeightEntriesByUser = useCallback(async () => {
		try {
			const { data, error } = await supabase
				.from("weight_entries")
				.select("weight, date")
				.eq("profile_id", user!.id)
				.order("date", { ascending: true }); // Assuming you want the weights ordered by date

			if (error) {
				throw error;
			}

			return data; // Returns the array of weight entries
		} catch (error) {
			toast.error("Error fetching weight entries!");
			return []; // Return an empty array in case of error
		}
	}, [user, supabase]);
	useEffect(() => {
		const fetchData = async () => {
			const entries = await getWeightEntriesByUser();
			setWeightEntries(entries);
		};

		fetchData();
	}, [getWeightEntriesByUser]);

	return <WeightChart data={weightEntries} />;
}
