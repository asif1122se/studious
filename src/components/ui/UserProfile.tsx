"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { trpc } from '@/utils/trpc';
import { setAuth } from '@/store/appSlice';
import { useNavigation, ROUTES } from '@/lib/navigation';
import Dropdown, { DropdownItem } from './Dropdown';
import ProfilePicture from './ProfilePicture';
import Button from './Button';

interface UserProfileProps {
    username: string;
    className?: string;
}

export default function UserProfile({ username, className = '' }: UserProfileProps) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isSigningOut, setIsSigningOut] = useState(false);

    // TODO: Implement this mutation when backend routes are available
    const logoutMutation = {
        mutateAsync: async () => {
            dispatch(setAuth({
                loggedIn: false,
                teacher: false,
                student: false,
                institutionIds: [],
            }));
            navigation.push(ROUTES.LOGIN);
        }
    };

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await logoutMutation.mutateAsync();
        } catch (error) {
            console.error('Failed to sign out:', error);
            setIsSigningOut(false);
        }
    };

    const dropdownItems: DropdownItem[] = [
        {
            label: 'Profile',
            onClick: () => {
                navigation.push(ROUTES.PROFILE);
            }
        },
        {
            label: 'Settings',
            onClick: () => {
                navigation.push(ROUTES.SETTINGS);
            }
        },
        {
            label: 'Sign Out',
            onClick: handleSignOut,
            disabled: isSigningOut
        }
    ];

    const trigger = (
        <Button.SM>
            <ProfilePicture username={username} size="sm" />
        </Button.SM>
    );

    return (
        <div className={className}>
            <Dropdown 
                trigger={trigger}
                items={dropdownItems}
                orientation="top"
                align="left"
                className="w-full flex items-center justify-center"
            />
        </div>
    );
} 