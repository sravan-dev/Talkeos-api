# Talkeos Real-time Chat Application

A modern, multi-user real-time chat application using WebSockets with a beautiful, responsive UI design.

## ✨ Features

- 🎨 **Modern UI Design** - Beautiful gradient backgrounds, rounded message bubbles, and smooth animations
- 👥 **User Avatars** - Colorful gradient avatars with user initials
- ⏰ **Smart Timestamps** - Contextual time display (now, Xm, time, day, date)
- 🔄 **Typing Indicators** - See when others are typing in real-time
- 🏠 **Room-based Chat** - Each room has isolated conversations
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🌈 **Modern Styling** - Gradients, shadows, backdrop blur effects
- ⚡ **Real-time Updates** - Instant message delivery and presence indicators
- 🔗 **Shareable Links** - Easy room sharing with copy functionality
- 📶 **Connection Status** - Live connection indicator with pulse animation

## 🚀 Modern UI Elements

### Message Bubbles
- **Rounded design** with modern shadows
- **Gradient backgrounds** for sent messages (blue to indigo)
- **Clean white bubbles** for received messages
- **Smooth slide-in animations** when messages appear
- **Message status indicators** (checkmarks for sent messages)

### User Experience
- **Colorful avatars** with unique gradients per user
- **Smart timestamps** that adapt based on message age
- **Typing indicators** with bouncing dots animation
- **System messages** with modern pill-style design
- **Connection status** with animated pulse indicator

### Visual Design
- **Gradient backgrounds** throughout the interface
- **Backdrop blur effects** for modern glass-morphism look
- **Custom scrollbars** with gradient styling
- **Hover animations** and smooth transitions
- **Responsive typography** that scales beautifully

## 🎯 How It Works

1. **WebSocket Server**: Handles real-time communication between users
2. **Room Management**: Users join specific rooms via URL parameters
3. **Message Broadcasting**: Instant delivery to all users in the same room
4. **Modern UI**: Beautiful, responsive interface with animations

## 📱 Responsive Design

- **Mobile-first approach** with touch-friendly interactions
- **Adaptive layouts** that work on all screen sizes
- **Optimized animations** for smooth performance
- **Modern CSS techniques** (backdrop-blur, gradients, transforms)

## 🛠 Setup & Installation

### Prerequisites
- Node.js (version 14 or higher)
- Modern web browser

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:8080` and serves the chat application

3. **Open the chat:**
   - Go to `http://localhost:8080` in your browser
   - The server serves both the WebSocket and HTML files

## ⚙️ Configuration

The application uses a centralized configuration system for easy customization:

### Quick Setup

1. **Copy the example config:**
   ```bash
   cp config.example.js config.js
   ```

2. **Edit config.js** to customize settings:
   ```javascript
   // Change server port
   server: {
       port: 3000,        // Change from 8080 to 3000
       host: 'localhost'
   }
   ```

3. **Restart the server:**
   ```bash
   npm start
   ```

### Configuration Files

**`config.js`** - Server-side configuration (create from `config.example.js`)
- Server settings (port, host, CORS)
- WebSocket settings
- Security options
- Feature flags

**`config.example.js`** - Template with all available options
- Copy this to create your own configuration
- Well-documented with comments

### Configuration Options

#### Server Configuration
```javascript
{
    server: {
        port: 8080,           // Server port
        host: 'localhost',    // Server host
        cors: {
            enabled: true,    // Enable CORS
            origins: ['*'],   // Allowed origins
            credentials: true // Allow credentials
        }
    }
}
```

#### Client Configuration
```javascript
{
    client: {
        connection: {
            maxReconnectAttempts: 5,    // Max reconnection tries
            reconnectDelay: 3000,       // Initial delay (ms)
            maxReconnectDelay: 30000    // Max delay (ms)
        },
        features: {
            typingIndicators: true,     // Show typing indicators
            messageTimestamps: true,    // Show message times
            userAvatars: true,          // Show user avatars
            connectionStatus: true      // Show connection status
        }
    }
}
```

### Environment Variables

Override configuration without editing files:

```bash
# Server configuration
PORT=3000                    # Change server port
HOST=0.0.0.0                # Bind to all interfaces
NODE_ENV=production         # Production mode
CORS_ORIGINS=https://mydomain.com  # Allowed CORS origins

# Client configuration (via URL parameters)
http://localhost:8080?debug=false    # Disable debug logging
http://localhost:8080?port=3000      # Override WebSocket port
```

### Development vs Production

**Development Mode:**
- Debug logging enabled
- WebSocket message logging
- Development tools active
- Detailed error messages

**Production Mode:**
- Optimized performance
- Minimal logging
- Enhanced security
- Compression enabled

Set with: `NODE_ENV=production npm start`

## 🔧 Error Fixes

### Common Issues & Solutions

**WebSocket Connection Errors:**
- ✅ **CORS Fixed:** Server now includes proper CORS headers
- ✅ **Same-origin:** Server serves both HTML and WebSocket from same port
- ✅ **Auto-reconnection:** Client automatically reconnects on connection loss

**Browser Security:**
- If opening HTML directly (file://), some browsers may block WebSocket connections
- **Solution:** Always use the built-in server or a proper web server

**Port Issues:**
- If port 8080 is in use, the server will show an error
- **Solution:** Change the port in `server.js` line 214

## 🎯 Testing

### Quick Test
1. **Start the server:** `npm start`
2. **Open browser:** Go to `http://localhost:8080`
3. **Check console:** Press F12 and look for WebSocket connection logs
4. **Test chat:** Type a message and press Enter

### Multi-User Testing
1. **Open multiple tabs:** `http://localhost:8080`
2. **Join same room:** All tabs should connect to the same room automatically
3. **Test real-time:** Messages should appear instantly across all tabs
4. **Test typing indicators:** See bouncing dots when others type

### Connection Status
- **Green pulsing dot:** Connected and working
- **Red dot:** Disconnected (will auto-reconnect)
- **Console logs:** Check browser console for detailed connection info

## 📱 Mobile Testing

1. **Local network:** Make sure your phone is on same WiFi as computer
2. **Server IP:** Use your computer's IP address instead of localhost
3. **Port forwarding:** Ensure port 8080 is accessible
4. **Test:** Open `http://YOUR_IP:8080` on mobile browser

---

**The chat is now fully functional with no CORS issues!** 🎉

## 🎨 Modern Features

### Message Styling
- **Gradient message bubbles** with rounded corners
- **User avatars** with colorful gradients
- **Message timestamps** with smart formatting
- **Status indicators** for message delivery
- **Smooth animations** on message appearance

### Real-time Features
- **Typing indicators** with animated dots
- **User presence** notifications (join/leave)
- **Connection status** with live indicator
- **Auto-reconnection** on connection loss

### Visual Effects
- **Background gradients** and backdrop blur
- **Hover animations** and smooth transitions
- **Custom scrollbars** with gradient styling
- **Responsive shadows** and modern styling

## 🔧 Technical Details

### Server (server.js)
- WebSocket server with room management
- Typing indicator handling
- Message history storage
- User presence tracking

### Client (index.html)
- Modern CSS with Tailwind utilities
- WebSocket client implementation
- Responsive design system
- Smooth animations and transitions

### Message Types
- `chat_message`: Regular chat messages
- `typing_start/stop`: Typing indicators
- `user_joined/left`: Presence notifications
- `welcome`: User onboarding
- `recent_messages`: Message history

## 🎯 Testing

1. **Multi-user Testing:**
   - Open multiple browser tabs
   - Join the same room via shared link
   - See real-time message sync and typing indicators

2. **Responsive Testing:**
   - Test on different screen sizes
   - Verify touch interactions on mobile
   - Check animations and transitions

## 🚀 Performance

- **Optimized animations** using CSS transforms
- **Efficient WebSocket usage** with proper cleanup
- **Responsive images** and scalable design
- **Modern CSS techniques** for smooth performance

---

**Built with modern web technologies for the best user experience!** 🎉
