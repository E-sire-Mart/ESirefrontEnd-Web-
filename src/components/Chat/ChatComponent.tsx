import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Input, Button, Badge, Tooltip, Dropdown, MenuProps } from 'antd';
import { 
  SendOutlined, 
  PaperClipOutlined, 
  SmileOutlined, 
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  SearchOutlined,
  UserOutlined,
  CheckOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import './ChatComponent.css';
import { getAllUsersWithRoles } from '../../services/api/user';
import socketService from '../../services/socketService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isTyping?: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  status: 'online' | 'away' | 'offline';
  roles?: string[];
  role?: string; // Keep for backward compatibility
  isTyping?: boolean; // Add typing indicator
}

const ChatComponent: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Contacts from backend
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'vendor' | 'delivery' | 'user'>('all');
  
  // Socket state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [chatHistoryLoading, setChatHistoryLoading] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const users = await getAllUsersWithRoles();
        if (!mounted) return;
        
        console.log('All users from backend (already filtered):', users);
        
        const mapped: ChatContact[] = users.map((u) => {
          // Handle avatar URL construction with proper fallback
          let avatarUrl = '';
          if (u.avatar && u.avatar !== 'undefined' && u.avatar !== 'null') {
            // Use the correct backend URL format
            avatarUrl = `${(import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/${u.avatar}`;
          } else {
            avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`;
          }
          
          return {
            id: u.id,
            name: u.name,
            avatar: avatarUrl,
            lastMessage: '',
            lastMessageTime: new Date(),
            unreadCount: 0,
            isOnline: Boolean(u.isOnline),
            status: u.isOnline ? 'online' : 'offline',
            roles: u.roles,
            role: u.role,
          };
        });
        
        setContacts(mapped);
        
        // Initialize socket connection
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            let userId = parsedUser._id || parsedUser.id || parsedUser.userId;
            
            // Extract userId from JWT token if not directly available
            if (!userId && parsedUser.access_token) {
              try {
                const tokenPayload = JSON.parse(atob(parsedUser.access_token.split('.')[1]));
                userId = tokenPayload.userId;
              } catch (e) {
                console.warn('Failed to decode JWT token for socket');
              }
            }
            
            setCurrentUserId(userId);
            
            if (userId) {
              // Clear any existing handlers first
              socketService.clearHandlers();
              socketService.connect(userId, parsedUser.access_token);
              
              // Set up socket status handlers for online/offline updates
              socketService.onStatusChange((data) => {
                if (data.type === 'status_update' && data.users) {
                  updateContactsOnlineStatus(data.users);
                }
              });
              
              // Mark current user as online
              console.log('Marking current user as online:', userId);
              fetch('http://localhost:3003/api/v1/chat/online', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${parsedUser.access_token}`
                },
                body: JSON.stringify({ isOnline: true })
              }).then(response => {
                console.log('Online status update response:', response.status);
                return response.json();
              }).then(data => {
                console.log('Online status update data:', data);
              }).catch(error => {
                console.warn('Failed to mark user as online:', error);
              });
              
              // Request current online users after a short delay to ensure socket is ready
              setTimeout(() => {
                if (socketService.isSocketConnected()) {
                  console.log('Requesting current online users...');
                  socketService.requestOnlineUsers();
                  
                  // Also request available rooms for synchronization
                  console.log('Requesting available rooms...');
                  socketService.requestAvailableRooms();
                }
              }, 1000);
            }
          } catch (e) {
            console.warn('Failed to initialize socket connection');
          }
        }
      } catch (e) {
        console.warn('Failed to load users; falling back to empty list', e);
        setContacts([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Mock messages for the first contact
  const mockMessages: Message[] = [
    {
      id: '1',
      text: 'Hello! Welcome to BellyBasket. How can I assist you today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      status: 'read'
    },
    {
      id: '2',
      text: 'Hi! I have a question about my recent order',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      status: 'read'
    },
    {
      id: '3',
      text: 'Of course! I\'d be happy to help. What\'s your order number?',
      sender: 'support',
      timestamp: new Date(Date.now() - 1000 * 60 * 6),
      status: 'read'
    },
    {
      id: '4',
      text: 'It\'s #ORD-12345',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      status: 'read'
    },
    {
      id: '5',
      text: 'Let me check that for you...',
      sender: 'support',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      status: 'delivered'
    }
  ];

  // Initialize socket event handlers
  useEffect(() => {
    // Update connection status periodically
    const updateConnectionStatus = () => {
      setIsSocketConnected(socketService.isSocketConnected());
    };
    
    // Update immediately
    updateConnectionStatus();
    
    // Update every second
    const interval = setInterval(updateConnectionStatus, 1000);
    
    // Handle status updates
    const unsubscribeStatus = socketService.onStatusChange((data) => {
      if (data.type === 'status_update') {
        setContacts(prevContacts => {
          return prevContacts.map(contact => {
            const updatedUser = data.users.find((u: any) => u._id === contact.id || u.id === contact.id);
            console.log('Status update for contact:', contact.name, 'User found:', updatedUser, 'isOnline:', updatedUser?.isOnline);
            return {
              ...contact,
              isOnline: updatedUser?.isOnline || false,
              status: updatedUser?.isOnline ? 'online' : 'offline'
            };
          });
        });
      }
    });

    // Handle real-time user presence updates
    const unsubscribePresence = socketService.onMessage((data) => {
      if (data.type === 'user_online' || data.type === 'user_offline') {
        console.log('User presence update:', data);
        
        if (data.user && data.user.roles) {
          // Only process admin/shop admin/delivery users
          const isRelevantUser = data.user.roles.some((role: string) => 
            ['admin', 'vendor', 'delivery'].includes(role)
          );
          
          if (isRelevantUser) {
            setContacts(prevContacts => {
              // Check if user already exists in contacts
              const existingContactIndex = prevContacts.findIndex(
                contact => contact.id === data.user.id
              );
              
              if (data.type === 'user_online') {
                if (existingContactIndex === -1) {
                  // User is coming online and not in contacts - add them
                  console.log('Adding new online user to contacts:', data.user.name);
                  const newContact: ChatContact = {
                    id: data.user.id,
                    name: data.user.name,
                    avatar: data.user.avatar ? 
                      `${(import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/${data.user.avatar}` : 
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.user.name)}`,
                    lastMessage: '',
                    lastMessageTime: new Date(),
                    unreadCount: 0,
                    isOnline: true,
                    status: 'online',
                    roles: data.user.roles
                  };
                  return [...prevContacts, newContact];
                } else {
                  // User is coming online and already in contacts - update status
                  console.log('Updating existing user to online:', data.user.name);
                  return prevContacts.map((contact, index) => 
                    index === existingContactIndex 
                      ? { ...contact, isOnline: true, status: 'online' }
                      : contact
                  );
                }
              } else if (data.type === 'user_offline') {
                if (existingContactIndex !== -1) {
                  // User is going offline - update status
                  console.log('Updating user to offline:', data.user.name);
                  return prevContacts.map((contact, index) => 
                    index === existingContactIndex 
                      ? { ...contact, isOnline: false, status: 'offline' }
                      : contact
                  );
                }
              }
              
              return prevContacts;
            });
          }
        }
      } else if (data.type === 'online_users_list') {
        console.log('Received online users list:', data.users);
        
        // Add any online users that aren't already in contacts
        setContacts(prevContacts => {
          const newContacts: ChatContact[] = [];
          const existingContactIds = new Set(prevContacts.map(c => c.id));
          
          data.users.forEach((user: any) => {
            if (!existingContactIds.has(user.id)) {
              const newContact: ChatContact = {
                id: user.id,
                name: user.name,
                avatar: user.avatar ? 
                  `${(import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:3003'}/uploads/${user.avatar}` : 
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
                lastMessage: '',
                lastMessageTime: new Date(),
                unreadCount: 0,
                isOnline: true,
                status: 'online',
                roles: user.roles
              };
              newContacts.push(newContact);
            }
          });
          
          if (newContacts.length > 0) {
            console.log('Adding new online users to contacts:', newContacts.map(c => c.name));
            return [...prevContacts, ...newContacts];
          }
          
          return prevContacts;
        });
      } else if (data.type === 'room_available') {
        console.log('Room availability notification received:', data);
        
        // This notification means a new chat room has been created
        // We can use this to update contact information or prepare for future chat
        if (data.initiator && data.participant) {
          console.log('New room available between:', data.initiator.name, 'and', data.participant.name);
          
          // Update contact information if needed
          setContacts(prevContacts => {
            return prevContacts.map(contact => {
              // Update last message time for the contact involved in the new room
              if (contact.id === data.initiator.id || contact.id === data.participant.id) {
                return {
                  ...contact,
                  lastMessageTime: new Date(data.timestamp)
                };
              }
              return contact;
            });
          });
        }
      } else if (data.type === 'available_rooms_list') {
        console.log('Received available rooms list:', data.rooms);
        
        // This can be used to populate existing chat rooms
        // For now, we'll just log it for debugging
        if (data.rooms && data.rooms.length > 0) {
          console.log(`Found ${data.rooms.length} existing chat rooms`);
        }
      }
    });

    // Handle new messages
    const unsubscribeMessage = socketService.onMessage((data) => {
      console.log('Socket message received:', data);
      if (data.type === 'new_message' && data.message) {
        console.log('Processing new message:', data.message);
        console.log('Current room ID:', currentRoomId);
        console.log('Message room ID:', data.message.roomId);
        
        // Only process messages for the current chat room
        if (currentRoomId && data.message.roomId === currentRoomId) {
          console.log('Message belongs to current room, processing...');
          const newMsg: Message = {
            id: data.message.id,
            text: data.message.content,
            sender: data.message.senderId === currentUserId ? 'user' : 'support',
            timestamp: new Date(data.message.timestamp),
            status: data.message.status
          };
          
          setMessages(prev => {
            // Check if this is a message we just sent (by content and sender)
            const isOwnMessage = newMsg.sender === 'user' && 
              prev.some(msg => msg.text === newMsg.text && msg.sender === 'user' && msg.id.startsWith('local_'));
            
            if (isOwnMessage) {
              console.log('Replacing local message with server message');
              // Replace the local message with the server message (to get proper ID and status)
              return prev.map(msg => 
                (msg.text === newMsg.text && msg.sender === 'user' && msg.id.startsWith('local_')) 
                  ? newMsg 
                  : msg
              );
            } else {
              console.log('Adding new message from other user');
              // This is a message from someone else, add it normally
              const messageExists = prev.some(msg => msg.id === newMsg.id);
              if (messageExists) {
                return prev; // Don't add duplicate
              }
              return [...prev, newMsg];
            }
          });
        } else {
          console.log('Message does not belong to current room, ignoring');
        }
      } else if (data.type === 'typing') {
        console.log('Typing indicator received:', data);
        // Handle typing indicator
        if (data.userId !== currentUserId) {
          setContacts(prevContacts => 
            prevContacts.map(contact => {
              if (contact.id === data.userId) {
                return {
                  ...contact,
                  isTyping: data.isTyping
                };
              }
              return contact;
            })
          );
        }
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribeStatus();
      unsubscribePresence();
      unsubscribeMessage();
      socketService.disconnect();
      
      // Mark current user as offline when component unmounts
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          fetch('http://localhost:3003/api/v1/chat/online', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${parsedUser.access_token}`
            },
            body: JSON.stringify({ isOnline: false })
          }).catch(error => {
            console.warn('Failed to mark user as offline:', error);
          });
        } catch (e) {
          console.warn('Failed to mark user as offline');
        }
      }
    };
  }, [currentUserId, currentRoomId]);

  useEffect(() => {
    if (selectedContact) {
      setMessages(mockMessages);
      
      // Join chat room via socket
      if (currentUserId && selectedContact.id) {
        const roomId = [currentUserId, selectedContact.id].sort().join('_');
        console.log('useEffect: Joining chat room:', roomId, 'for contact:', selectedContact.name);
        setCurrentRoomId(roomId);
        socketService.joinChatRoom(currentUserId, selectedContact.id);
        socketService.markAsRead(currentUserId, selectedContact.id, roomId);
      }
      
      // Do not force scroll on contact change; keep container position stable
      // Determine current preference from container position
      const c = messagesContainerRef.current;
      if (c) {
        const atBottom = c.scrollTop + c.clientHeight >= c.scrollHeight - 10;
        setShouldAutoScroll(atBottom);
      } else {
        setShouldAutoScroll(false);
      }
    }
  }, [selectedContact, currentUserId]);

  // Handle scroll events to detect user scrolling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      
      // If user scrolls away from bottom, disable auto-scroll
      if (!isAtBottom) {
        setShouldAutoScroll(false);
      } else {
        // If user scrolls back to bottom, re-enable auto-scroll
        setShouldAutoScroll(true);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Only auto-scroll when new messages are added and auto-scroll is enabled
    if (shouldAutoScroll && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  // Periodically refresh online status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Request online users via socket for real-time updates
        if (socketService.isSocketConnected()) {
          socketService.requestOnlineUsers();
        }
        
        // Also refresh via API as backup
        const response = await fetch('http://localhost:3003/api/v1/chat', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const users = data.data || [];
          updateContactsOnlineStatus(users);
        }
      } catch (error) {
        console.warn('Failed to refresh online status:', error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      // Keep scroll confined to the chat area to avoid page jump
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleContactSelect = async (contact: ChatContact) => {
    setSelectedContact(contact);
    setShouldAutoScroll(true);
    const roomId = [currentUserId, contact.id].sort().join('_');
    console.log('Selecting contact:', contact.name, 'Room ID:', roomId);
    setCurrentRoomId(roomId);
    
    // Join chat room via socket
    if (currentUserId) {
      console.log('Joining chat room via socket for contact:', contact.name);
      socketService.joinChatRoom(currentUserId, contact.id, contact.name);
    }
    
    // Load chat history from backend
    await loadChatHistory(roomId);
  };

  const updateContactsOnlineStatus = (users: any[]) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => {
        const updatedUser = users.find((u: any) => u._id === contact.id || u.id === contact.id);
        if (updatedUser) {
          return {
            ...contact,
            isOnline: !!updatedUser.isOnline,
            status: updatedUser.isOnline ? 'online' : 'offline'
          };
        }
        return contact;
      })
    );
  };

  const loadChatHistory = async (roomId: string) => {
    if (!roomId) return;
    
    setChatHistoryLoading(true);
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const response = await fetch(`http://localhost:3003/api/v1/chat/rooms/${roomId}/messages`, {
          headers: {
            'Authorization': `Bearer ${parsedUser.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.messages) {
            const formattedMessages: Message[] = data.data.messages.map((msg: any) => ({
              id: msg.id || msg._id,
              text: msg.content,
              sender: msg.senderId === currentUserId ? 'user' : 'support',
              timestamp: new Date(msg.timestamp || msg.createdAt),
              status: msg.status || 'sent'
            }));
            setMessages(formattedMessages);
          } else {
            setMessages([]);
          }
        } else {
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setMessages([]);
    } finally {
      setChatHistoryLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !currentUserId || !currentRoomId) return;

    const messageText = newMessage.trim();
    console.log('Sending message:', messageText, 'to room:', currentRoomId);
    setNewMessage(''); // Clear input immediately

    // Create local message for immediate display
    const localMessageId = `local_${Date.now()}`;
    const message: Message = {
      id: localMessageId,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    // Determine if user is currently at bottom before appending
    const c = messagesContainerRef.current;
    const atBottom = !!c && (c.scrollTop + c.clientHeight >= c.scrollHeight - 10);
    setShouldAutoScroll(atBottom);
    setMessages(prev => [...prev, message]);
    
    // Auto-scroll to bottom
    setShouldAutoScroll(true);

    // Send message via socket
    console.log('Calling socketService.sendMessage with:', { currentUserId, selectedContactId: selectedContact.id, messageText, currentRoomId });
    try {
      const success = await socketService.sendMessage(currentUserId, selectedContact.id, messageText, currentRoomId);
      if (!success) {
        console.error('Failed to send message via socket');
        // Optionally show error to user or retry
      }
    } catch (error) {
      console.error('Error sending message via socket:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle typing indicators
  const handleTypingStart = () => {
    if (currentRoomId && currentUserId) {
      socketService.sendTyping(currentRoomId, currentUserId, true);
    }
  };

  const handleTypingStop = () => {
    if (currentRoomId && currentUserId) {
      socketService.sendTyping(currentRoomId, currentUserId, false);
    }
  };

  // Debounced typing stop
  useEffect(() => {
    if (newMessage.trim()) {
      handleTypingStart();
      const timer = setTimeout(() => {
        handleTypingStop();
      }, 1000); // Stop typing indicator after 1 second of no input
      
      return () => clearTimeout(timer);
    } else {
      handleTypingStop();
    }
  }, [newMessage, currentRoomId, currentUserId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>;
      case 'away':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>;
      case 'offline':
        return <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>;
      default:
        return null;
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckOutlined className="text-gray-400 text-xs" />;
      case 'delivered':
        return <CheckOutlined className="text-blue-400 text-xs" />;
      case 'read':
        return <CheckCircleOutlined className="text-blue-500 text-xs" />;
      default:
        return null;
    }
  };

  const contactMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'View Profile',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: 'Call',
      icon: <PhoneOutlined />,
    },
    {
      key: '3',
      label: 'Video Call',
      icon: <VideoCameraOutlined />,
    },
    {
      key: '4',
      label: 'Search Messages',
      icon: <SearchOutlined />,
    },
  ];

  const isDark = mode === 'dark';

  return (
    <div className={`chat-container ${isDark ? 'dark' : 'light'}`}>
      <div className="chat-layout">
        {/* Contacts Sidebar */}
        <div className="contacts-sidebar">
          <div className="contacts-header">
            <h3 className="contacts-title">Chats</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Connection Status Indicator */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4,
                fontSize: '12px',
                color: isSocketConnected ? '#52c41a' : '#ff4d4f'
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isSocketConnected ? '#52c41a' : '#ff4d4f'
                }}></div>
                {isSocketConnected ? 'Connected' : 'Disconnected'}
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                style={{
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  borderRadius: 8,
                  height: 28,
                  padding: '0 8px',
                }}
              >
                <option value="all">All</option>
                <option value="admin">Admins</option>
                <option value="vendor">Vendors</option>
                <option value="delivery">Delivery</option>
                <option value="user">Users</option>
              </select>
              <Button 
                type="text" 
                icon={<SearchOutlined />} 
                className="search-button"
                size="small"
              />

            </div>
          </div>
          
          <div className="contacts-list">
            {contacts
              .filter((c) => {
                if (roleFilter === 'all') return true;
                // Filter based on roles array (users can have multiple roles)
                return c.roles?.includes(roleFilter) || c.role === roleFilter;
              })
              .map((contact) => (
              <div
                key={contact.id}
                className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="contact-avatar">
                  <Badge 
                    dot={contact.isOnline} 
                    offset={[-2, 2]}
                    color={contact.status === 'online' ? '#52c41a' : '#faad14'}
                  >
                    <Avatar 
                      src={contact.avatar} 
                      size={48}
                      icon={<UserOutlined />}
                    />
                  </Badge>
                  <div className="status-indicator">
                    {getStatusIcon(contact.status)}
                  </div>
                </div>
                
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-roles">
                    {contact.roles?.map((role, index) => (
                      <span key={index} className={`role-badge role-${role}`}>
                        {role === 'admin' && '👑 Admin'}
                        {role === 'vendor' && '🏪 Shop Admin'}
                        {role === 'delivery' && '🚚 Delivery'}
                        {role === 'user' && '👤 User'}
                      </span>
                    ))}
                  </div>
                  <div className="contact-last-message">{contact.lastMessage}</div>
                  <div className="contact-time">
                    {contact.lastMessageTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                
                {contact.unreadCount > 0 && (
                  <Badge count={contact.unreadCount} className="unread-badge" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-contact-info">
                  <Avatar 
                    src={selectedContact.avatar} 
                    size={40}
                    icon={<UserOutlined />}
                  />
                  <div className="contact-details">
                    <div className="contact-name">{selectedContact.name}</div>
                    <div className="contact-status">
                      {selectedContact.isOnline ? 'Online' : 'Offline'}
                      {selectedContact.isTyping && (
                        <span className="typing-indicator"> • typing...</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="chat-actions">
                  <Tooltip title="Voice Call">
                    <Button 
                      type="text" 
                      icon={<PhoneOutlined />} 
                      className="action-button"
                    />
                  </Tooltip>
                  <Tooltip title="Video Call">
                    <Button 
                      type="text" 
                      icon={<VideoCameraOutlined />} 
                      className="action-button"
                    />
                  </Tooltip>
                  <Tooltip title="More Options">
                    <Dropdown menu={{ items: contactMenuItems }} trigger={['click']}>
                      <Button 
                        type="text" 
                        icon={<MoreOutlined />} 
                        className="action-button"
                      />
                    </Dropdown>
                  </Tooltip>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container" ref={messagesContainerRef}>
                {/* Scroll to bottom button - only show when not at bottom */}
                {!shouldAutoScroll && (
                  <div className="scroll-to-bottom-container">
                    <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      icon={<SendOutlined />}
                      onClick={scrollToBottom}
                      className="scroll-to-bottom-button"
                      title="Scroll to bottom"
                    />
                  </div>
                )}
                
                {chatHistoryLoading ? (
                  <div className="no-messages">
                    <div className="loading-spinner">Loading chat history...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="no-messages">
                    <div className="no-messages-icon">💬</div>
                    <h3>No Chat History</h3>
                    <p>Start a conversation with {selectedContact.name} by sending your first message!</p>
                  </div>
                ) : (
                  <div className="messages-list">
                    {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
                    >
                      {message.sender === 'support' && (
                        <Avatar 
                          src={selectedContact.avatar} 
                          size={32}
                          icon={<UserOutlined />}
                          className="message-avatar"
                        />
                      )}
                      
                      <div className="message-content">
                        <div className="message-bubble">
                          {message.text}
                        </div>
                        <div className="message-meta">
                          <span className="message-time">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.sender === 'user' && (
                            <span className="message-status">
                              {getMessageStatusIcon(message.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="message support-message">
                      <Avatar 
                        src={selectedContact.avatar} 
                        size={32}
                        icon={<UserOutlined />}
                        className="message-avatar"
                      />
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                  )}
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <Input.TextArea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="message-input"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                  />
                  
                  <div className="input-actions">
                    <Tooltip title="Attach File">
                      <Button 
                        type="text" 
                        icon={<PaperClipOutlined />} 
                        className="input-action-button"
                      />
                    </Tooltip>
                    <Tooltip title="Emoji">
                      <Button 
                        type="text" 
                        icon={<SmileOutlined />} 
                        className="input-action-button"
                      />
                    </Tooltip>
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="send-button"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <div className="no-chat-icon">💬</div>
                <h3>Select a chat to start messaging</h3>
                <p>Choose from your contacts to begin a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
