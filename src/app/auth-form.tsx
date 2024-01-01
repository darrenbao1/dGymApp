"use client";
//import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import dynamic from "next/dynamic";
const AuthWithNoSSR = dynamic(
	() => import("@supabase/auth-ui-react").then((mod) => mod.Auth),
	{ ssr: false }
); // this is to solve FOUC for auth component.

export default function AuthForm() {
	const supabase = createClientComponentClient<Database>();

	return (
		<div className=" bg-slate-500 w-screen h-screen flex justify-center items-center">
			<div className="container p-6 shadow-xl bg-black rounded-xl">
				<AuthWithNoSSR
					supabaseClient={supabase}
					view="magic_link"
					appearance={{
						theme: ThemeSupa,
						variables: {
							default: {
								colors: {
									brand: "#2D9CDB",
									brandAccent: "#2D9CDB",
									brandButtonText: "white",
									dividerBackground: "#2e2e2e",
									defaultButtonBackground: "#2e2e2e",
									defaultButtonBackgroundHover: "gray",
									defaultButtonBorder: "#2e2e2e",
									inputPlaceholder: "gray",
									inputLabelText: "gray",
									inputText: "white",
									inputBackground: "#2e2e2e",
									inputBorder: "#2e2e2e",
								},
							},
						},
					}}
					theme="light"
					showLinks={false}
					providers={["twitter"]}
					socialLayout="horizontal"
					redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`}
				/>
			</div>
		</div>
	);
}
