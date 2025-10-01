# Chat Implementation with Dark/Light Mode

## Overview
This implementation adds a Telegram-like chat interface to the user profile with full dark/light mode support.

## Features

### Chat Component
- **Telegram-like UI**: Modern chat interface with contact sidebar and chat area
- **Contact Management**: List of support contacts with online/offline status
- **Real-time Messaging**: Message bubbles with timestamps and delivery status
- **Typing Indicators**: Animated typing indicators for support responses
- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes

### Dark/Light Mode
- **Theme Context**: Centralized theme management using React Context
- **Automatic Detection**: Detects system preference on first load
- **Persistent Storage**: Saves user's theme preference in localStorage
- **Smooth Transitions**: CSS transitions for theme switching
- **Full Coverage**: All components support both themes

## Components Added

### 1. ThemeContext (`src/contexts/ThemeContext.tsx`)
- Manages theme state (light/dark)
- Provides `useTheme` hook for components
- Handles theme persistence and system preference detection

### 2. ChatComponent (`src/components/Chat/ChatComponent.tsx`)
- Main chat interface component
- Contact sidebar with status indicators
- Chat area with message bubbles
- Message input with attachments and emoji support

### 3. ThemeToggle (`src/components/ThemeToggle/ThemeToggle.tsx`)
- Toggle button for switching between themes
- Sun/Moon icons for visual feedback
- Tooltip with theme information

### 4. Updated DashboardLayout
- Dark/light mode support for sidebar and main content
- Dynamic color schemes based on current theme

## Usage

### Accessing Chat
1. Navigate to the Profile page
2. Click on the "Chat" tab in the sidebar
3. Select a contact to start chatting

### Switching Themes
1. Click the theme toggle button (sun/moon icon) in the profile header
2. Theme changes are applied immediately
3. Preference is saved automatically

## Technical Details

### Theme System
- Uses CSS custom properties (variables) for consistent theming
- Tailwind CSS classes for responsive design
- CSS transitions for smooth theme switching

### Chat Features
- Mock data for demonstration purposes
- Simulated typing indicators and responses
- Message status tracking (sent, delivered, read)
- Contact status indicators (online, away, offline)

### Responsive Design
- Mobile-first approach
- Sidebar collapses on small screens
- Touch-friendly interface elements

## File Structure
```
src/
├── contexts/
│   └── ThemeContext.tsx          # Theme management
├── components/
│   ├── Chat/
│   │   ├── ChatComponent.tsx     # Main chat interface
│   │   ├── ChatComponent.css     # Chat styles
│   │   └── index.tsx             # Export file
│   ├── ThemeToggle/
│   │   ├── ThemeToggle.tsx       # Theme toggle button
│   │   ├── ThemeToggle.css       # Toggle styles
│   │   └── index.tsx             # Export file
│   └── DashboardLayout/
│       └── index.tsx             # Updated with theme support
├── pages/
│   └── Profile.tsx               # Updated with chat tab
└── main.tsx                      # Updated with ThemeProvider
```

## Customization

### Adding New Chat Contacts
Edit the `contacts` array in `ChatComponent.tsx`:
```typescript
const contacts: ChatContact[] = [
  {
    id: 'new-contact',
    name: 'New Support',
    avatar: 'avatar-url',
    lastMessage: 'Last message',
    lastMessageTime: new Date(),
    unreadCount: 0,
    isOnline: true,
    status: 'online'
  }
];
```

### Modifying Theme Colors
Update CSS variables in `ChatComponent.css`:
```css
.chat-container.light {
  --bg-primary: #your-color;
  --text-primary: #your-color;
  /* ... other variables */
}
```

### Adding New Message Types
Extend the `Message` interface in `ChatComponent.tsx`:
```typescript
interface Message {
  // ... existing properties
  type?: 'text' | 'image' | 'file';
  attachments?: string[];
}
```

## Browser Support
- Modern browsers with CSS custom properties support
- Responsive design works on all screen sizes
- Touch-friendly for mobile devices

## Future Enhancements
- Real-time messaging with WebSocket integration
- File upload and sharing
- Voice and video calling
- Message search and filtering
- Contact groups and channels
- Push notifications
- Message encryption
