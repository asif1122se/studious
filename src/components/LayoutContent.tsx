"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const appState = useSelector((state: RootState) => state.app);

    return (
        <div className={`flex-grow text-sm w-full flex justify-center overflow-y-auto ${appState.user.loggedIn ? 'pl-16' : ''}`}>
            <div className="w-full">
                {children}
            </div>
        </div>
    );
} 