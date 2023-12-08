"use client";
import Link from "next/link";
import { BsGearFill } from "react-icons/bs";
import { FaDumbbell } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { FaWeightScale } from "react-icons/fa6";
interface LinkObject {
	href: string;
	text: string;
	icon: any;
}

export default function NavBar() {
	const pathname = usePathname();
	const links: LinkObject[] = [
		{
			href: "/workout",
			text: "workouts",
			icon: <FaDumbbell />,
		},
		{
			href: "/cardio",
			text: "cardio",
			icon: <FaRunning />,
		},
		{
			href: "/weight",
			text: "weight",
			icon: <FaWeightScale />,
		},
		{
			href: "/settings",
			text: "settings",
			icon: <BsGearFill />,
		},
	];

	return (
		<div className="fixed bottom-0 w-screen bg-gray-900 text-white shadow-lg flex h-20">
			{links.map((link) => {
				const isActive = pathname === link.href;
				return (
					<Link
						key={link.text}
						{...link}
						className={`${
							isActive ? "bg-primary text-white rounded-xl" : ""
						} navbar-icon `}>
						{link.icon}
						<span className={`${isActive && "text-primary"}  navbar-label`}>
							{link.text}
						</span>
					</Link>
				);
			})}
		</div>
	);
}
