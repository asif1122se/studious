# Profile and Settings Pages

This document describes the profile and settings functionality that has been implemented following the project's established patterns and conventions.

## Overview

The profile and settings system consists of:

1. **Profile Page** (`/profile`) - View and edit user profile information
2. **Settings Page** (`/settings`) - Manage account preferences and settings
3. **Profile Components** - Reusable components for profile management

## File Structure

```
src/
├── app/
│   ├── profile/
│   │   └── page.tsx                 # Main profile page
│   └── settings/
│       └── page.tsx                 # Settings page
├── components/
│   ├── profile/
│   │   ├── ProfileView.tsx          # Profile display component
│   │   ├── ProfileEdit.tsx          # Profile editing form
│   │   └── PasswordChange.tsx       # Password change form
│   └── ui/
│       └── UserProfile.tsx          # Updated with profile navigation
└── lib/
    └── navigation.ts                # Updated with profile routes
```

## Features Implemented

### Profile Page (`/profile`)

#### Profile View Mode
- **Profile Header**: Displays user avatar, name, username, and bio
- **Profile Picture Management**: Upload, change, and delete profile pictures
- **Account Information**: Read-only display of account details
- **Edit Button**: Switch to edit mode

#### Profile Edit Mode
- **Personal Information**: Edit first name, last name
- **Bio**: Edit user biography with character limit
- **Account Information**: Read-only display of system information
- **Form Validation**: Client-side validation for required fields
- **Save/Cancel**: Save changes or cancel editing

#### Password Change Section
- **Current Password**: Verify current password
- **New Password**: Enter new password with strength indicator
- **Password Confirmation**: Confirm new password
- **Password Requirements**: Visual feedback on password strength
- **Security Features**: Password visibility toggles

### Settings Page (`/settings`)

#### Account Settings
- **Username Management**: View and change username
- **Email Management**: View and change email address
- **Account Type**: Display user role (Teacher/Student)

#### Notification Settings
- **Email Notifications**: Toggle email notifications
- **Push Notifications**: Toggle browser notifications
- **Assignment Reminders**: Toggle assignment notifications
- **Announcements**: Toggle announcement notifications

#### Appearance Settings
- **Dark Mode**: Toggle between light and dark themes

#### Privacy & Security
- **Two-Factor Authentication**: Enable 2FA (placeholder)
- **Login History**: View recent logins (placeholder)
- **Data Export**: Export user data (placeholder)

#### Danger Zone
- **Account Deletion**: Delete account permanently (placeholder)

## Navigation Integration

### UserProfile Dropdown
- **Profile Link**: Navigate to `/profile`
- **Settings Link**: Navigate to `/settings`
- **Sign Out**: Logout functionality

### Route Configuration
- Added `PROFILE: '/profile'` to navigation routes
- Added `SETTINGS: '/settings'` to navigation routes

## Component Patterns

### Following Project Conventions

1. **State Management**: Uses Redux for global state and local state for component-specific data
2. **Form Validation**: Uses the project's `validate` utility function
3. **Alert System**: Uses the project's alert system for user feedback
4. **UI Components**: Uses existing UI components (Card, Button, Input, etc.)
5. **Styling**: Follows the project's Tailwind CSS patterns
6. **TypeScript**: Properly typed interfaces and components

### Component Structure

#### ProfileView
- Displays user information in read-only format
- Profile picture management with modal interface
- Responsive design with proper spacing

#### ProfilePictureModal
- Upload custom images with drag & drop support
- Choose from 8 different avatar styles (64 total avatars)
- Preview functionality before saving
- File validation and error handling

#### ProfileEdit
- Form-based editing with validation
- Real-time form state management
- Change detection for save button state

#### PasswordChange
- Secure password input with visibility toggles
- Password strength indicator
- Password confirmation validation

## Backend Integration (TODO)

The current implementation uses mock data and placeholder functions. When the backend routes are implemented, the following tRPC mutations should be added:

### Required Backend Routes

1. **User Profile Routes**
   - `user.getProfile` - Get user profile data
   - `user.updateProfile` - Update profile information
   - `user.updateProfilePicture` - Upload profile picture
   - `user.deleteProfilePicture` - Delete profile picture
   - `user.changePassword` - Change user password

2. **Settings Routes**
   - `user.updateSettings` - Update user preferences
   - `user.getSettings` - Get user settings

### Integration Points

When backend routes are available, replace the mock implementations in:

- `ProfileView.tsx` - Replace mock profile picture mutations
- `ProfileEdit.tsx` - Replace mock profile update mutation
- `PasswordChange.tsx` - Replace mock password change mutation
- `profile/page.tsx` - Replace mock user data with tRPC query

## Usage

### Accessing Profile
1. Click on the user avatar in the sidebar
2. Select "Profile" from the dropdown menu
3. Navigate to `/profile`

### Accessing Settings
1. Click on the user avatar in the sidebar
2. Select "Settings" from the dropdown menu
3. Navigate to `/settings`

### Editing Profile
1. On the profile page, click "Edit Profile"
2. Make changes to personal information
3. Click "Save Changes" to save or "Cancel" to discard

### Changing Password
1. On the profile page, scroll to the "Change Password" section
2. Enter current password
3. Enter new password (with strength requirements)
4. Confirm new password
5. Click "Change Password"

## Future Enhancements

1. **Profile Picture Cropping**: Add image cropping functionality
2. **Email Verification**: Implement email change verification
3. **Two-Factor Authentication**: Complete 2FA implementation
4. **Data Export**: Implement user data export functionality
5. **Login History**: Add login activity tracking
6. **Theme Persistence**: Save theme preference to backend
7. **Notification Preferences**: Save notification settings to backend

## Notes

- All components are fully responsive and follow the project's design system
- Form validation provides immediate feedback to users
- Error handling is implemented with user-friendly messages
- The implementation is ready for backend integration when routes are available
- All TypeScript types are properly defined for type safety
