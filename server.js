const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

// Create HTTP server with CORS headers and file serving
const server = http.createServer((req, res) => {
    // Set CORS headers from config
    const headers = {
        'Access-Control-Allow-Origin': config.server.cors.enabled ?
            (config.server.cors.origins.includes('*') ? '*' : config.server.cors.origins.join(',')) : false,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': config.server.cors.credentials,
        'Cache-Control': 'no-cache'
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
        return;
    }

    // Set headers for all responses
    Object.keys(headers).forEach(key => {
        if (headers[key] !== false) {
            res.setHeader(key, headers[key]);
        }
    });

    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Serve static files
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    const filePath = path.join(__dirname, pathname);

    // Security check - only serve files from current directory
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        // Serve HTML, CSS, JS files
        const ext = path.extname(filePath);
        let contentType = 'text/plain';

        switch (ext) {
            case '.html':
                contentType = 'text/html';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpeg';
                break;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

// Create WebSocket server attached to HTTP server
const wss = new WebSocket.Server({ server });

// Store connected clients by room
const rooms = new Map();

// Store typing users by room
const typingUsers = new Map();

// Generate unique user ID
function generateUserId() {
    return Math.random().toString(36).substr(2, 9);
}

wss.on('connection', (ws, req) => {
    console.log('New client connected');

    // Extract room ID from URL query parameter
    const url = new URL(req.url, 'http://localhost');
    const roomId = url.searchParams.get('room') || 'default';
    const username = url.searchParams.get('username') || 'Anonymous';

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
    }

    const room = rooms.get(roomId);
    const userId = generateUserId();

    // Add client to room
    room.set(ws, {
        userId,
        username,
        connectedAt: new Date()
    });

    // Send welcome message with user info
    ws.send(JSON.stringify({
        type: 'welcome',
        userId,
        roomId,
        username,
        message: `Welcome to room ${roomId}, ${username}!`
    }));

    // Broadcast user joined message to other users in the room
    broadcastToRoom(roomId, {
        type: 'user_joined',
        username,
        userId,
        message: `${username} joined the chat`,
        timestamp: Date.now()
    }, ws);

    // Send recent messages (for demo, we'll send last 50 messages)
    const recentMessages = getRecentMessages(roomId);
    if (recentMessages.length > 0) {
        ws.send(JSON.stringify({
            type: 'recent_messages',
            messages: recentMessages
        }));
    }

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            if (message.type === 'chat_message') {
                const userInfo = room.get(ws);
                const chatMessage = {
                    type: 'chat_message',
                    userId: userInfo.userId,
                    username: userInfo.username,
                    text: message.text,
                    timestamp: Date.now()
                };

                // Save message to room history (in memory for demo)
                saveMessageToRoom(roomId, chatMessage);

                // Broadcast to all users in the room
                broadcastToRoom(roomId, chatMessage);
            } else if (message.type === 'typing_start') {
                // Handle typing indicator
                if (!typingUsers.has(roomId)) {
                    typingUsers.set(roomId, new Map());
                }
                const roomTyping = typingUsers.get(roomId);
                roomTyping.set(ws, { username, timestamp: Date.now() });

                // Broadcast typing start to other users
                broadcastToRoom(roomId, {
                    type: 'typing_start',
                    username: username,
                    timestamp: Date.now()
                }, ws);

                // Auto-stop typing after 3 seconds
                setTimeout(() => {
                    if (roomTyping.has(ws)) {
                        roomTyping.delete(ws);
                        broadcastToRoom(roomId, {
                            type: 'typing_stop',
                            username: username,
                            timestamp: Date.now()
                        }, ws);
                    }
                }, 3000);
            } else if (message.type === 'typing_stop') {
                // Handle typing stop
                if (typingUsers.has(roomId)) {
                    const roomTyping = typingUsers.get(roomId);
                    if (roomTyping.has(ws)) {
                        roomTyping.delete(ws);
                        broadcastToRoom(roomId, {
                            type: 'typing_stop',
                            username: username,
                            timestamp: Date.now()
                        }, ws);
                    }
                }
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');

        if (room.has(ws)) {
            const userInfo = room.get(ws);
            room.delete(ws);

            // Clean up typing indicator
            if (typingUsers.has(roomId)) {
                const roomTyping = typingUsers.get(roomId);
                if (roomTyping.has(ws)) {
                    roomTyping.delete(ws);
                }
            }

            // Broadcast user left message
            broadcastToRoom(roomId, {
                type: 'user_left',
                username: userInfo.username,
                userId: userInfo.userId,
                message: `${userInfo.username} left the chat`,
                timestamp: Date.now()
            });

            // Clean up empty rooms
            if (room.size === 0) {
                rooms.delete(roomId);
                typingUsers.delete(roomId);
            }
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Broadcast message to all clients in a room except sender
function broadcastToRoom(roomId, message, excludeWs = null) {
    const room = rooms.get(roomId);
    if (room) {
        room.forEach((userInfo, client) => {
            if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
}

// Save message to room history (in memory)
function saveMessageToRoom(roomId, message) {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
    }

    const room = rooms.get(roomId);
    if (!room.messageHistory) {
        room.messageHistory = [];
    }

    room.messageHistory.push(message);

    // Keep only last 100 messages
    if (room.messageHistory.length > 100) {
        room.messageHistory = room.messageHistory.slice(-100);
    }
}

// Get recent messages for a room
function getRecentMessages(roomId) {
    const room = rooms.get(roomId);
    return room && room.messageHistory ? room.messageHistory.slice(-50) : [];
}

// Start server
const PORT = config.server.port;
const HOST = config.server.host;

server.listen(PORT, HOST, () => {
    console.log(`🚀 Talkeos WebSocket server running on port ${PORT}`);
    console.log(`📱 Open chat at: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`🌐 Public URL: http://${require('os').hostname()}:${PORT}`);
    console.log(`⚙️  Configuration loaded from config.js`);

    if (config.development.debug) {
        console.log('🔧 Debug mode enabled');
        console.log('📋 Configuration:', JSON.stringify(config, null, 2));
    }
});
