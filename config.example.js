// Example configuration file for Talkeos Chat
// Copy this to config.js and customize as needed

const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 8080,           // Server port (override with PORT env var)
        host: process.env.HOST || 'localhost',   // Server host (override with HOST env var)

        // WebSocket settings
        websocket: {
            heartbeatInterval: 30000,    // Heartbeat interval in milliseconds
            maxMessageSize: 65536,       // Maximum message size in bytes
            connectionTimeout: 10000     // Connection timeout in milliseconds
        },

        // CORS settings
        cors: {
            enabled: true,                           // Enable CORS
            origins: process.env.CORS_ORIGINS ?      // Allowed origins (override with CORS_ORIGINS env var)
                process.env.CORS_ORIGINS.split(',') : ['*'],
            credentials: true                        // Allow credentials
        },

        // Security settings
        security: {
            rateLimit: 100,              // Requests per minute per IP
            maxRoomNameLength: 50,       // Maximum room name length
            maxUsernameLength: 20        // Maximum username length
        }
    },

    // Client Configuration
    client: {
        // Default room settings
        room: {
            defaultId: 'default',        // Default room ID
            idGeneration: 'random'       // Room ID generation: 'random', 'timestamp', 'custom'
        },

        // Connection settings
        connection: {
            maxReconnectAttempts: 5,     // Maximum reconnection attempts
            reconnectDelay: 3000,        // Initial reconnection delay (ms)
            maxReconnectDelay: 30000     // Maximum reconnection delay (ms)
        },

        // UI settings
        ui: {
            animationDuration: 300,      // Animation duration in milliseconds
            maxMessageWidth: 400,        // Maximum message bubble width (px)
            autoScroll: true,            // Auto-scroll to new messages
            typingTimeout: 3000          // Typing indicator timeout (ms)
        },

        // Feature flags
        features: {
            typingIndicators: true,      // Show typing indicators
            messageTimestamps: true,     // Show message timestamps
            userAvatars: true,           // Show user avatars
            connectionStatus: true,      // Show connection status
            darkMode: false,             // Enable dark mode
            messageReactions: false,     // Enable message reactions
            fileSharing: false           // Enable file sharing
        }
    },

    // Development settings
    development: {
        debug: process.env.NODE_ENV !== 'production',    // Enable debug logging
        logWebSocketMessages: process.env.NODE_ENV !== 'production', // Log WebSocket messages
        devTools: process.env.NODE_ENV !== 'production'  // Enable development tools
    },

    // Production settings
    production: {
        compression: true,           // Enable compression
        https: process.env.HTTPS === 'true',  // Enable HTTPS
        sessions: true,              // Enable sessions
        database: false              // Enable database integration
    }
};

// Environment-specific configurations
if (process.env.NODE_ENV === 'production') {
    config.server.host = process.env.HOST || '0.0.0.0';
    config.server.port = process.env.PORT || 8080;
    config.client.features.darkMode = true;
    config.development.debug = false;
    config.development.logWebSocketMessages = false;
}

module.exports = config;
