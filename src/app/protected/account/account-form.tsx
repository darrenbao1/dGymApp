"use client";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Database } from "../../../../types/supabase";
import {
	Session,
	createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Avatar from "./avatar";
import { toast } from "react-hot-toast";

interface accountDetails {
	fullname: string | null;
	username: string | null;
	website: string | null;
	avatar_url: string | null;
	isLoading: boolean;
}

export default function AccountForm({ session }: { session: Session | null }) {
	const [accountDetails, setAccountDetails] = useState<accountDetails>({
		fullname: null,
		username: null,
		website: null,
		avatar_url: null,
		isLoading: true,
	});

	const supabase = createClientComponentClient<Database>();
	const user = session?.user;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setAccountDetails((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const getProfile = useCallback(async () => {
		try {
			setAccountDetails({ ...accountDetails, isLoading: true });
			const { data, error, status } = await supabase
				.from("profiles")
				.select(`full_name, username, website, avatar_url`)
				.eq("id", user?.id!)
				.single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setAccountDetails({
					...accountDetails,
					fullname: data.full_name,
					username: data.username,
					website: data.website,
					avatar_url: data.avatar_url,
				});
			}
		} catch (error) {
			alert("Error loading user data!");
		} finally {
			setAccountDetails((prev) => ({ ...prev, isLoading: false }));
		}
	}, [user, supabase]);

	useEffect(() => {
		getProfile();
	}, [user, getProfile]);

	async function updateProfile({
		fullname,
		username,
		website,
		avatar_url,
	}: {
		username: string | null;
		fullname: string | null;
		website: string | null;
		avatar_url: string | null;
	}) {
		try {
			setAccountDetails({ ...accountDetails, isLoading: true });
			const { error } = await supabase.from("profiles").upsert({
				id: user?.id as string,
				full_name: fullname,
				username,
				website,
				avatar_url,
				updated_at: new Date().toISOString(),
			});
			if (error) throw error;
			toast.success("Profile updated!");
		} catch (error) {
			alert("Error updating the data!");
		} finally {
			setAccountDetails((prev) => ({ ...prev, isLoading: false }));
		}
	}

	return (
		<div className="container bg-gray-900 rounded-xl p-6 shadow-xxl flex flex-col overflow-auto h-full gap-2">
			{user && (
				<div>
					<Avatar
						uid={user!.id}
						url={accountDetails.avatar_url}
						size={100}
						onUpload={(url) => {
							setAccountDetails({ ...accountDetails, avatar_url: url });
							updateProfile({ ...accountDetails, avatar_url: url });
						}}
					/>
				</div>
			)}
			<div className="account-form-field">
				<label htmlFor="email" className="account-form-label">
					Email:
				</label>
				<input
					id="email"
					type="text"
					value={session?.user.email}
					className="primary-input"
					disabled
				/>
			</div>
			<div className="account-form-field">
				<label htmlFor="fullName" className="account-form-label">
					Full Name:
				</label>
				<input
					name="fullname"
					id="fullname"
					type="text"
					value={accountDetails.fullname || ""}
					onChange={handleChange}
					className="primary-input"
					placeholder="Full Name"
				/>
			</div>
			<div className="account-form-field">
				<label htmlFor="username" className="account-form-label">
					Username:
				</label>
				<input
					name="username"
					id="username"
					type="text"
					value={accountDetails.username || ""}
					className="primary-input"
					onChange={handleChange}
					placeholder="Username"
				/>
			</div>
			<div className="account-form-field">
				<label htmlFor="website" className="account-form-label">
					Website:
				</label>
				<input
					name="website"
					id="website"
					type="url"
					value={accountDetails.website || ""}
					onChange={handleChange}
					className="primary-input"
					placeholder="Website"
				/>
			</div>
			<div className="flex items-center justify-center gap-2">
				<div>
					<button
						className="primary-button"
						onClick={() => updateProfile({ ...accountDetails })}
						disabled={accountDetails.isLoading}>
						{accountDetails.isLoading ? "Loading ..." : "Update"}
					</button>
				</div>

				<div>
					<form action="/auth/signout" method="post">
						<button type="submit" className="secondary-button">
							Sign Out
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
