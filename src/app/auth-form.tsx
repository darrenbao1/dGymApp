"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";

export default function AuthForm() {
	const supabase = createClientComponentClient<Database>();

	return (
		<div className=" bg-slate-500 w-screen h-screen flex justify-center items-center">
			<div className="container p-6 shadow-xl bg-black rounded-xl">
				<Auth
					supabaseClient={supabase}
					view="magic_link"
					appearance={{
						theme: ThemeSupa,
						variables: {
							default: {
								colors: {
									brand: "#2D9CDB",
									brandAccent: "#2D9CDB",
								},
							},
						},
					}}
					theme="dark"
					showLinks={false}
					providers={["twitter", "google"]}
					socialLayout="horizontal"
					redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/account`}
				/>
			</div>
		</div>
	);
}
