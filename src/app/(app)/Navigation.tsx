"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ApplicationLogo from "@/components/ApplicationLogo";
import NavLink from "@/components/NavLink";
import ResponsiveNavLink from "@/components/ResponsiveNavLink";
import { User } from "@/types/user";

const Navigation = ({ user }: { user: User }) => {
    const { logout } = useAuth() as { logout: () => Promise<void> };
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // すべてのナビゲーションでフルリロードを使用
    const handleNavigation = (
        e: React.MouseEvent<HTMLAnchorElement>,
        path: string
    ) => {
        e.preventDefault();
        console.log(
            `Navigation - Redirecting to ${path} with full page reload`
        );
        window.location.href = path;
    };

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <a
                                href="/dashboard"
                                onClick={(e) =>
                                    handleNavigation(e, "/dashboard")
                                }
                            >
                                <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                            </a>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <a
                                href="/dashboard"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
                                    pathname === "/dashboard"
                                        ? "border-indigo-400 text-gray-900 focus:border-indigo-700"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
                                }`}
                                onClick={(e) =>
                                    handleNavigation(e, "/dashboard")
                                }
                            >
                                Dashboard
                            </a>
                        </div>
                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <a
                                href="/pens"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
                                    pathname === "/pens"
                                        ? "border-indigo-400 text-gray-900 focus:border-indigo-700"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
                                }`}
                                onClick={(e) => handleNavigation(e, "/pens")}
                            >
                                Pen Master
                            </a>
                        </div>
                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <a
                                href="/orders"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
                                    pathname === "/orders"
                                        ? "border-indigo-400 text-gray-900 focus:border-indigo-700"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
                                }`}
                                onClick={(e) => handleNavigation(e, "/orders")}
                            >
                                Order Master
                            </a>
                        </div>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <div className="ml-3 relative">
                            <div className="flex items-center">
                                <div className="font-medium text-base text-gray-800">
                                    {user.name}
                                </div>
                                <button
                                    onClick={logout}
                                    className="ml-4 font-medium text-sm text-gray-500 underline hover:text-gray-900 focus:outline-none"
                                >
                                    ログアウト
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
