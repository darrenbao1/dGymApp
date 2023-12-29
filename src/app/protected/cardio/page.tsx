import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { cookies } from "next/headers";
import Cardio from "./cardio";
import NewWorkoutButton from "./newWorkoutButton";

export default async function Page() {
	const supabase = createServerComponentClient<Database>({ cookies });

	const {
		data: { session },
	} = await supabase.auth.getSession();
	//
	return (
		<div className="main-content">
			<div className="relative container bg-gray-900 rounded-xl p-6 shadow-xxl flex flex-col overflow-auto h-full gap-2">
				<Cardio session={session} />
			</div>
		</div>
	);
}
