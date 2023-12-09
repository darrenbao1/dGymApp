import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AccountForm from "./account-form";
import { Database } from "../../../../types/supabase";
import { cookies } from "next/headers";

export default async function Page() {
	const supabase = createServerComponentClient<Database>({ cookies });

	const {
		data: { session },
	} = await supabase.auth.getSession();
	//
	return (
		<div className="main-content">
			<AccountForm session={session} />
		</div>
	);
}
