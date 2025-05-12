# Multiple User Sessions Support

This application now supports multiple concurrent login sessions locally, allowing you to be logged in as both a teacher and a student simultaneously in different browser windows/tabs.

## How it works

Instead of using a single token in localStorage (which would be overwritten when logging in with different accounts), the application now:

1. Stores authentication tokens with user-specific keys
2. Tracks the "active user" for each browser tab
3. Provides a session switcher UI component to easily switch between logged-in users

## How to use multiple sessions

### Option 1: Use different browser windows

1. Login as a teacher in one browser window
2. Open a new browser window and login as a student
3. Both sessions will remain active and independent

### Option 2: Switch between sessions in the same window

1. Login as multiple users in different windows
2. Use the session dropdown in the top-right corner of any page to switch between them
3. The current window will switch to using that user's authentication

## Technical Details

- Each user session is stored in localStorage with a unique key based on the user's role and email
- The session manager UI shows all available sessions
- The authentication system has been updated to support this multi-user approach

## Benefits

- Test teacher and student functionality simultaneously
- No need to logout and login repeatedly
- Sessions persist across browser restarts
