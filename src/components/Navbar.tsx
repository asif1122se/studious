"use client";

import { openModal } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import CreateClass from "./class/forms/CreateClass";
import JoinClass from "./class/forms/JoinClass";
import Button from "./ui/Button";
import Badge from "./Badge";
import { useState } from "react";
import { HiMenu, HiX, HiPlus, HiHome, HiAcademicCap, HiCalendar, HiOfficeBuilding, HiLogout } from "react-icons/hi";
import ProfilePicture from "@/components/ui/ProfilePicture";
import UserProfile from "@/components/ui/UserProfile";

export default function Navbar() {
    const appState = useSelector((state: RootState) => state.app);
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!appState.user.loggedIn) {
        return (
            <nav className="bg-background/90 dark:bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-14 justify-between">
                        <div className="flex items-center space-x-2 justify-start">
                            {/* Logo */}
                            <div className="flex items-center space-x-2 me-4">
                                    <img src="/logo.png" alt="logo" className="w-5" />
                                <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                                    Studious
                                </span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center space-x-3">
                            <Button.Light 
                                href="/login"
                                className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium"
                            >
                                Sign In
                            </Button.Light>
                            <Button.Primary 
                                href="/signup"
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium"
                            >
                                Get Started
                            </Button.Primary>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-foreground-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 p-1"
                            >
                                {isMenuOpen ? (
                                    <HiX className="h-5 w-5" />
                                ) : (
                                    <HiMenu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <div className="md:hidden py-3 border-t border-border">
                            <div className="flex flex-col space-y-3">
                                <a href="#features" className="text-sm text-foreground-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium px-2 py-1">
                                    Features
                                </a>
                                <a href="#pricing" className="text-sm text-foreground-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium px-2 py-1">
                                    Pricing
                                </a>
                                <a href="#contact" className="text-sm text-foreground-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium px-2 py-1">
                                    Contact
                                </a>
                                <div className="flex flex-col space-y-2 pt-2">
                                    <Button.Light 
                                        href="/login"
                                        className="w-full text-center px-3 py-2 text-sm font-medium"
                                    >
                                        Sign In
                                    </Button.Light>
                                    <Button.Primary 
                                        href="/signup"
                                        className="w-full text-center px-3 py-2 text-sm font-medium"
                                    >
                                        Get Started
                                    </Button.Primary>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-16 bg-background border-r border-border flex-col items-center py-4 space-y-4 z-30">
                {/* Logo */}
                <a href="/classes" className="flex flex-col items-center space-y-1">
                    <img src="/logo.png" alt="logo" className="w-8" />
                </a>

                {/* Navigation Icons */}
                <div className="flex flex-col items-center space-y-2 flex-grow">
                    <Button.Select href="/classes">
                        <HiAcademicCap className="h-5 w-5" />
                    </Button.Select>
                    <Button.Select href="/agenda">
                        <HiCalendar className="h-5 w-5" />
                    </Button.Select>
                    {appState.user.institutionIds && appState.user.institutionIds.length > 0 && (
                        <Button.Select href={`/institute/${appState.user.institutionIds[0].id}`}>
                            <HiOfficeBuilding className="h-5 w-5" />
                        </Button.Select>
                    )}
                </div>

                {/* User Profile */}
                <div className="w-full flex justify-center px-2">
                    <UserProfile 
                        username={appState.user.username || 'User'} 
                        className="w-full"
                    />
                </div>
            </aside>

            {/* Mobile Floating Navigation */}
            <div className="md:hidden">
                {/* Floating Navigation Buttons */}
                <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3">
                    {/* Classes Button */}
                    <Button.Light href="/classes">
                        <HiAcademicCap className="h-5 w-5 text-foreground" />
                    </Button.Light>

                    {/* Agenda Button */}
                    <Button.Light href="/agenda">
                        <HiCalendar className="h-5 w-5 text-foreground" />
                    </Button.Light>

                    <Button.Light
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        <HiLogout className="h-5 w-5" />
                    </Button.Light>
                </div>
            </div>
        </>
    );
}