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
            <nav 
                className="bg-background/90 dark:bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-40"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-14 justify-between">
                        <div className="flex items-center space-x-2 justify-start">
                            {/* Logo */}
                            <div className="flex items-center space-x-2 me-4">
                                <img src="/logo.png" alt="Studious logo" className="w-6" />
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
                                aria-label="Sign in to your account"
                            >
                                Sign In
                            </Button.Light>
                            <Button.Primary 
                                href="/signup"
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium"
                                aria-label="Create a new account"
                            >
                                Get Started
                            </Button.Primary>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-foreground-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 p-1"
                                aria-label="Toggle mobile menu"
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-menu"
                            >
                                {isMenuOpen ? (
                                    <HiX className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <HiMenu className="h-5 w-5" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <div 
                            id="mobile-menu"
                            className="md:hidden py-3 border-t border-border"
                            role="menu"
                            aria-label="Mobile navigation menu"
                        >
                            <div className="flex flex-col space-y-3">
                                <a 
                                    href="#features" 
                                    className="text-sm text-foreground-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium px-2 py-1"
                                    role="menuitem"
                                >
                                    Features
                                </a>
                                <a 
                                    href="#pricing" 
                                    className="text-sm text-foreground-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium px-2 py-1"
                                    role="menuitem"
                                >
                                    Pricing
                                </a>
                                <a 
                                    href="#contact" 
                                    className="text-sm text-foreground-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium px-2 py-1"
                                    role="menuitem"
                                >
                                    Contact
                                </a>
                                <div className="flex flex-col space-y-2 pt-2">
                                    <Button.Light 
                                        href="/login"
                                        className="w-full text-center px-3 py-2 text-sm font-medium"
                                        aria-label="Sign in to your account"
                                    >
                                        Sign In
                                    </Button.Light>
                                    <Button.Primary 
                                        href="/signup"
                                        className="w-full text-center px-3 py-2 text-sm font-medium"
                                        aria-label="Create a new account"
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
            <aside 
                className="hidden md:flex fixed left-0 top-0 h-full w-16 bg-background border-r border-border flex-col items-center py-4 space-y-4 z-30"
                role="navigation"
                aria-label="Main navigation sidebar"
            >
                {/* Logo */}
                <a 
                    href="/classes" 
                    className="flex flex-col items-center space-y-1"
                    aria-label="Go to classes - Studious home"
                >
                    <img src="/logo.png" alt="Studious logo" className="w-6" />
                </a>

                {/* Navigation Icons */}
                <nav className="flex flex-col items-center space-y-2 flex-grow" role="navigation" aria-label="Primary navigation">
                    <Button.Select 
                        href="/classes"
                        aria-label="View my classes"
                        aria-describedby="classes-description"
                    >
                        <HiAcademicCap className="h-5 w-5" aria-hidden="true" />
                    </Button.Select>
                    <div id="classes-description" className="sr-only">Navigate to classes page</div>
                    
                    <Button.Select 
                        href="/agenda"
                        aria-label="View my agenda"
                        aria-describedby="agenda-description"
                    >
                        <HiCalendar className="h-5 w-5" aria-hidden="true" />
                    </Button.Select>
                    <div id="agenda-description" className="sr-only">Navigate to agenda page</div>
                    
                    {appState.user.institutionIds && appState.user.institutionIds.length > 0 && (
                        <>
                            <Button.Select 
                                href={`/institute/${appState.user.institutionIds[0].id}`}
                                aria-label="View institution dashboard"
                                aria-describedby="institute-description"
                            >
                                <HiOfficeBuilding className="h-5 w-5" aria-hidden="true" />
                            </Button.Select>
                            <div id="institute-description" className="sr-only">Navigate to institution dashboard</div>
                        </>
                    )}
                </nav>

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
                <nav 
                    className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3"
                    role="navigation"
                    aria-label="Mobile floating navigation"
                >
                    {/* Classes Button */}
                    <Button.Light 
                        href="/classes"
                        aria-label="View my classes"
                        aria-describedby="mobile-classes-description"
                    >
                        <HiAcademicCap className="h-5 w-5 text-foreground" aria-hidden="true" />
                    </Button.Light>
                    <div id="mobile-classes-description" className="sr-only">Navigate to classes page</div>

                    {/* Agenda Button */}
                    <Button.Light 
                        href="/agenda"
                        aria-label="View my agenda"
                        aria-describedby="mobile-agenda-description"
                    >
                        <HiCalendar className="h-5 w-5 text-foreground" aria-hidden="true" />
                    </Button.Light>
                    <div id="mobile-agenda-description" className="sr-only">Navigate to agenda page</div>

                    <Button.Light
                        className="bg-red-500 hover:bg-red-600 text-white"
                        aria-label="Sign out of your account"
                        aria-describedby="logout-description"
                    >
                        <HiLogout className="h-5 w-5" aria-hidden="true" />
                    </Button.Light>
                    <div id="logout-description" className="sr-only">Sign out and return to login page</div>
                </nav>
            </div>
        </>
    );
}