// Talkeos Chat Configuration
// Edit this file to change server settings, URLs, and other configuration options

const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 8080,
        host: process.env.HOST || 'localhost',

        // WebSocket settings
        websocket: {
            // Heartbeat interval in milliseconds (for keeping connections alive)
            heartbeatInterval: 30000,

            // Maximum message size in bytes
            maxMessageSize: 65536,

            // Connection timeout in milliseconds
            connectionTimeout: 10000
        },

        // CORS settings
        cors: {
            enabled: true,
            origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
            credentials: true
        },

        // Security settings
        security: {
            // Rate limiting (requests per minute per IP)
            rateLimit: 100,

            // Maximum room name length
            maxRoomNameLength: 50,

            // Maximum username length
            maxUsernameLength: 20
        }
    },

    // Client Configuration
    client: {
        // Default room settings
        room: {
            // Default room ID if none provided
            defaultId: 'default',

            // Room ID generation method: 'random', 'timestamp', or 'custom'
            idGeneration: 'random'
        },

        // Connection settings
        connection: {
            // Reconnection attempts
            maxReconnectAttempts: 5,

            // Delay between reconnection attempts (in milliseconds)
            reconnectDelay: 3000,

            // Maximum reconnection delay (in milliseconds)
            maxReconnectDelay: 30000
        },

        // UI settings
        ui: {
            // Animation duration in milliseconds
            animationDuration: 300,

            // Message bubble max width (in pixels)
            maxMessageWidth: 400,

            // Auto-scroll behavior
            autoScroll: true,

            // Typing indicator timeout (in milliseconds)
            typingTimeout: 3000
        },

        // Feature flags
        features: {
            typingIndicators: true,
            messageTimestamps: true,
            userAvatars: true,
            connectionStatus: true,
            darkMode: false,
            messageReactions: false,
            fileSharing: false
        }
    },

    // Development settings
    development: {
        // Enable debug logging
        debug: process.env.NODE_ENV !== 'production',

        // Log WebSocket messages
        logWebSocketMessages: process.env.NODE_ENV !== 'production',

        // Enable development tools
        devTools: process.env.NODE_ENV !== 'production'
    },

    // Production settings
    production: {
        // Enable compression
        compression: true,

        // Enable HTTPS
        https: process.env.HTTPS === 'true',

        // Session management
        sessions: true,

        // Database integration
        database: false
    }
};

// Environment-specific configurations
if (process.env.NODE_ENV === 'production') {
    config.server.host = process.env.HOST || '0.0.0.0';
    config.server.port = process.env.PORT || 8080;
    config.client.features.darkMode = true;
    config.development.debug = false;
}

// Export configuration
module.exports = config;

// Also export for browser usage (if needed)
if (typeof window !== 'undefined') {
    window.TalkeosConfig = config;
}
