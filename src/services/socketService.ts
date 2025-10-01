// Socket service for real-time chat functionality
class SocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private messageHandlers: ((data: any) => void)[] = [];
  private statusHandlers: ((data: any) => void)[] = [];
  private userId: string | null = null;
  private token: string | null = null;
  private isConnected: boolean = false;

  connect(userId: string, token: string) {
    try {
      this.userId = userId;
      this.token = token;
      
      // Connect to real WebSocket server
      const wsUrl = `ws://localhost:3003?token=${token}`;
      console.log('Attempting to connect to WebSocket:', wsUrl);
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected for user:', userId);
        this.reconnectAttempts = 0;
        this.isConnected = true;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Raw WebSocket message received:', event.data);
          this.handleIncomingMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.handleReconnection();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      return true;
    } catch (error) {
      console.error('Failed to connect to socket:', error);
      return false;
    }
  }

  private handleIncomingMessage(data: any) {
    console.log('Received WebSocket message:', data);
    
    switch (data.type) {
      case 'connection':
        console.log('Connection confirmed:', data);
        break;
      case 'room_joined':
        console.log('Joined room:', data);
        break;
      case 'new_message':
        this.messageHandlers.forEach(handler => handler(data));
        break;
      case 'user_joined':
        console.log('User joined room:', data);
        break;
      case 'typing':
        console.log('Typing indicator:', data);
        break;
      case 'messages_read':
        console.log('Messages marked as read:', data);
        break;
      case 'error':
        console.error('WebSocket error:', data.message);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId && this.token) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(this.userId!, this.token!);
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    // Clear all handlers to prevent accumulation
    this.messageHandlers = [];
    this.statusHandlers = [];
    this.isConnected = false;
    console.log('Socket service disconnected');
  }

  isSocketConnected(): boolean {
    return this.isConnected && !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  async waitForConnection(timeout: number = 5000): Promise<boolean> {
    if (this.isSocketConnected()) {
      return true;
    }
    
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkConnection = () => {
        if (this.isSocketConnected()) {
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          resolve(false);
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  // Clear all handlers without disconnecting
  clearHandlers() {
    this.messageHandlers = [];
    this.statusHandlers = [];
    console.log('Socket handlers cleared');
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  onStatusChange(handler: (data: any) => void) {
    this.statusHandlers.push(handler);
    return () => {
      const index = this.statusHandlers.indexOf(handler);
      if (index > -1) {
        this.statusHandlers.splice(index, 1);
      }
    };
  }

  async sendMessage(senderId: string, receiverId: string, message: string, roomId: string) {
    // Wait for connection if not already connected
    if (!this.isSocketConnected()) {
      console.log('Waiting for WebSocket connection...');
      const connected = await this.waitForConnection();
      if (!connected) {
        console.error('WebSocket connection timeout, cannot send message');
        return false;
      }
    }
    
    const messageData = {
      type: 'send_message',
      roomId,
      content: message,
      messageType: 'text'
    };
    
    console.log('Sending message via WebSocket:', messageData);
    this.socket!.send(JSON.stringify(messageData));
    console.log('Message sent via WebSocket successfully');
    return true;
  }

  joinChatRoom(userId: string, contactId: string, contactName?: string) {
    if (this.isSocketConnected()) {
      const roomId = [userId, contactId].sort().join('_');
      const messageData = {
        type: 'join_room',
        roomId,
        contactId,
        contactName: contactName || 'Contact'
      };
      
      console.log('Joining chat room via WebSocket:', messageData);
      this.socket!.send(JSON.stringify(messageData));
      console.log('Join room request sent successfully');
      return roomId; // Return the room ID for reference
    } else {
      console.error('WebSocket not connected, cannot join room');
      return null;
    }
  }

  markAsRead(userId: string, contactId: string, roomId: string) {
    if (this.isSocketConnected()) {
      const messageData = {
        type: 'mark_read',
        roomId,
        messageIds: [] // This should be passed from the component
      };
      
      this.socket!.send(JSON.stringify(messageData));
      console.log('Marking messages as read via WebSocket:', messageData);
    } else {
      console.error('WebSocket not connected, cannot mark as read');
    }
  }

  sendTyping(roomId: string, userId: string, isTyping: boolean) {
    if (this.isSocketConnected()) {
      const messageData = {
        type: 'typing',
        roomId,
        isTyping
      };
      
      this.socket!.send(JSON.stringify(messageData));
      console.log('Typing indicator sent via WebSocket:', messageData);
    } else {
      console.error('WebSocket not connected, cannot send typing indicator');
    }
  }

  requestOnlineUsers() {
    if (this.isSocketConnected()) {
      const messageData = {
        type: 'request_online_users'
      };
      
      console.log('Requesting online users via WebSocket');
      this.socket!.send(JSON.stringify(messageData));
      console.log('Online users request sent successfully');
    } else {
      console.error('WebSocket not connected, cannot request online users');
    }
  }

  requestAvailableRooms() {
    if (this.isSocketConnected()) {
      const messageData = {
        type: 'request_available_rooms'
      };
      
      console.log('Requesting available rooms via WebSocket');
      this.socket!.send(JSON.stringify(messageData));
      console.log('Available rooms request sent successfully');
    } else {
      console.error('WebSocket not connected, cannot request available rooms');
    }
  }
}

const socketService = new SocketService();
export default socketService;
