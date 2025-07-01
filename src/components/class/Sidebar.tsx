"use client";

import { openModal } from "@/store/appSlice";
import { HiCalendar, HiClipboard, HiDocumentReport, HiHome, HiPencil, HiUserGroup } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import InviteCode from "./forms/InviteCode";
import Button from "../ui/Button";
import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import { Sidebar } from "../ui/Sidebar";
import Input from "../ui/Input";

export default function ClassSidebar({ teacher, classId }: { teacher: boolean, classId: string }) {
    const dispatch = useDispatch();
    const appState = useSelector((state: RootState) => state.app);

    const navigationItems = [
        {
            type: 'link' as const,
            icon: <HiHome className="size-5" />,
            label: "Home",
            href: `/classes/${classId}`,
        },
        {
            type: 'link' as const,
            icon: <HiClipboard className="size-5" />,
            label: "Assignments",
            href: `/classes/${classId}/assignments`,
        },
        {
            type: 'link' as const,
            icon: <HiUserGroup className="size-5" />,
            label: "Members",
            href: `/classes/${classId}/members`,
        },
        {
            type: 'link' as const,
            icon: <HiDocumentReport className="size-5" />,
            label: "Grades",
            href: teacher ? `/classes/${classId}/grades` : `/classes/${classId}/grades/${appState.user.id}`,
        },
        {
            type: 'link' as const,
            icon: <HiCalendar className="size-5" />,
            label: "Attendance",
            href: `/classes/${classId}/attendance`,
        },
        ...(teacher ? [{
            type: 'link' as const,
            icon: <HiPencil className="size-5" />,
            label: "Settings",
            href: `/classes/${classId}/settings`,
        }] : []),
    ];

    return (
        <Sidebar navigationItems={navigationItems}>
            {teacher && (
                <div className="mt-auto">
                    <Button.Primary
                        className="w-full flex justify-center items-center font-semibold"
                        onClick={() => {
                            dispatch(openModal({ body: <InviteCode classId={classId} />, header: 'Invite' }))
                        }}
                    >
                        Invite
                    </Button.Primary>
                </div>
            )}
        </Sidebar>
    );
}