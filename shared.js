/**
 * AI Sentinel-X Shared JavaScript Library - Hybrid V2
 * Enhanced modular architecture for cross-platform compatibility
 */

// Version and configuration
const SENTINEL_VERSION = '2.0-hybrid';
const API_VERSION = 'v2';

// Global state management
const SentinelState = {
    chatOpen: false,
    agentActive: true,
    cliMode: false,
    classicalActive: true,
    quantumActive: true,
    discoveryActive: true,
    scanningActive: true,
    currentPage: 'unknown',
    apiEndpoints: {
        main: '/api/v2/agent',
        threats: '/api/v2/threats',
        network: '/api/v2/network',
        encryption: '/api/v2/encryption',
        analytics: '/api/v2/analytics'
    }
};

// Initialize page context
function initializePageContext() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) SentinelState.currentPage = 'dashboard';
    else if (path.includes('threats')) SentinelState.currentPage = 'threats';
    else if (path.includes('network')) SentinelState.currentPage = 'network';
    else if (path.includes('defense')) SentinelState.currentPage = 'defense';
    else if (path.includes('ai-engine')) SentinelState.currentPage = 'ai-engine';
    else if (path.includes('encryption')) SentinelState.currentPage = 'encryption';
    else if (path.includes('analytics')) SentinelState.currentPage = 'analytics';
    else if (path.includes('settings')) SentinelState.currentPage = 'settings';
    else SentinelState.currentPage = 'general';
}

// Enhanced Neural Network Background Animation
function initNeuralBackground() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    const nodes = [];
    const nodeCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 10000));
    
    // Create nodes with improved distribution
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1,
            activity: Math.random()
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.activity = Math.sin(Date.now() * 0.001 + node.x * 0.01) * 0.5 + 0.5;
            
            // Boundary collision
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });
        
        // Draw connections with improved performance
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                const dist = Math.hypot(node1.x - node2.x, node1.y - node2.y);
                
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.3;
                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.moveTo(node1.x, node1.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw nodes with activity-based glow
        ctx.globalAlpha = 1;
        nodes.forEach(node => {
            const intensity = node.activity;
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0, 
                node.x, node.y, node.radius * 3
            );
            gradient.addColorStop(0, `rgba(0, 255, 136, ${intensity * 0.8 + 0.2})`);
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * (intensity * 0.5 + 1), 0, Math.PI * 2);
            ctx.fill();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    // Return cleanup function
    return () => {
        if (animationId) cancelAnimationFrame(animationId);
    };
}

// Enhanced Chat System with V2 features
class SentinelChat {
    constructor() {
        this.messageHistory = [];
        this.typingTimeout = null;
        this.connectionState = 'connected';
        this.retryAttempts = 0;
        this.maxRetries = 3;
    }
    
    toggle() {
        SentinelState.chatOpen = !SentinelState.chatOpen;
        const chatWindow = document.getElementById('aiChatWindow');
        if (chatWindow) {
            if (SentinelState.chatOpen) {
                chatWindow.classList.add('active');
                this.focusInput();
            } else {
                chatWindow.classList.remove('active');
            }
        }
    }
    
    focusInput() {
        setTimeout(() => {
            const input = document.getElementById('aiChatInput');
            if (input) input.focus();
        }, 100);
    }
    
    addMessage(message, isUser = false, type = 'normal') {
        const messagesContainer = document.getElementById('aiChatMessages');
        if (!messagesContainer) return;
        
        const messageObj = {
            id: Date.now(),
            message,
            isUser,
            type,
            timestamp: new Date(),
            context: SentinelState.currentPage
        };
        
        this.messageHistory.push(messageObj);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        messageDiv.dataset.messageId = messageObj.id;
        
        const time = messageObj.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        let bubbleClass = 'ai-message-bubble';
        if (isUser) bubbleClass += ' user';
        if (type === 'system') bubbleClass += ' system';
        if (type === 'error') bubbleClass += ' error';
        
        messageDiv.innerHTML = `
            <div class="${bubbleClass}">${this.formatMessage(message)}</div>
            <div class="ai-message-time">${time}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Limit message history
        if (this.messageHistory.length > 100) {
            this.messageHistory = this.messageHistory.slice(-50);
        }
    }
    
    formatMessage(message) {
        // Enhanced message formatting with security considerations
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('aiChatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    showTypingIndicator() {
        this.removeTypingIndicator();
        
        const messagesContainer = document.getElementById('aiChatMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }
    
    async sendMessage(message) {
        if (!message?.trim()) return;
        
        // Add user message
        this.addMessage(message, true);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Process command with enhanced routing
            await this.processCommand(message);
        } catch (error) {
            console.error('Chat error:', error);
            this.addMessage('⚠️ Communication error. Switching to local CLI mode.', false, 'error');
            SentinelState.cliMode = true;
        }
    }
    
    async processCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Check agent state
        if (!SentinelState.agentActive || SentinelState.cliMode) {
            await this.processCLICommand(command);
            return;
        }
        
        // Simulate network delay
        await this.delay(300);
        this.removeTypingIndicator();
        
        // Enhanced command routing with context awareness
        await this.routeCommand(command, lowerCommand);
    }
    
    async routeCommand(command, lowerCommand) {
        this.addMessage('Routing to Main Agent...', false, 'system');
        await this.delay(500);
        
        // Context-aware routing
        const context = this.getCommandContext(lowerCommand);
        const subAgent = this.determineSubAgent(lowerCommand, context);
        
        if (subAgent !== 'main') {
            this.addMessage(`Main Agent: Routing to ${subAgent} sub-agent...`, false, 'system');
            await this.delay(800);
        }
        
        const response = this.generateResponse(lowerCommand, context, subAgent);
        this.addMessage(response, false);
    }
    
    getCommandContext(lowerCommand) {
        if (lowerCommand.includes('threat') || lowerCommand.includes('attack') || lowerCommand.includes('malware')) return 'threats';
        if (lowerCommand.includes('network') || lowerCommand.includes('device') || lowerCommand.includes('scan')) return 'network';
        if (lowerCommand.includes('encrypt') || lowerCommand.includes('crypto') || lowerCommand.includes('quantum')) return 'encryption';
        if (lowerCommand.includes('defense') || lowerCommand.includes('response') || lowerCommand.includes('honeypot')) return 'defense';
        if (lowerCommand.includes('analytics') || lowerCommand.includes('report') || lowerCommand.includes('metric')) return 'analytics';
        if (lowerCommand.includes('log') || lowerCommand.includes('audit') || lowerCommand.includes('compliance')) return 'logs';
        return SentinelState.currentPage;
    }
    
    determineSubAgent(lowerCommand, context) {
        const agentMap = {
            threats: 'ThreatScanner',
            network: 'NetworkMapper',
            encryption: 'EncryptionManager',
            defense: 'DefenseOrchestrator',
            analytics: 'AnalyticsEngine',
            logs: 'LogAgent'
        };
        return agentMap[context] || 'main';
    }
    
    generateResponse(lowerCommand, context, subAgent) {
        // Enhanced response generation with V2 features
        const responses = this.getContextualResponses(context);
        
        // Command-specific responses
        if (lowerCommand.includes('status')) {
            return this.generateStatusResponse(context);
        }
        
        if (lowerCommand.includes('help')) {
            return this.generateHelpResponse(context);
        }
        
        if (lowerCommand.includes('quarantine')) {
            const ipMatch = lowerCommand.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
            return this.handleQuarantine(ipMatch);
        }
        
        // Fallback to contextual responses
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getContextualResponses(context) {
        const responseMap = {
            threats: [
                'ThreatScanner: Currently tracking 7 active threats. All critical threats contained with hybrid encryption. ML confidence: 99.8%.',
                'ThreatScanner: Real-time analysis shows emerging attack patterns. All data protected with AES-256-GCM + Kyber-1024.',
                'ThreatScanner: Behavioral analysis detected 3 new threat signatures. DefenseOrchestrator coordinating response.'
            ],
            network: [
                'NetworkMapper: 247 devices discovered and monitored. Live discovery active with quantum-resistant protocols.',
                'NetworkMapper: Dual-layer scanning (external + internal) operating normally. All communications hybrid encrypted.',
                'NetworkMapper: New device detection rate: 1 every 8-15 seconds. External threat intelligence via Shodan API.'
            ],
            encryption: [
                'EncryptionManager: Hybrid mode operational. Classical: AES-256-GCM, HMAC-SHA256. Post-Quantum: Kyber-1024, Dilithium-3.',
                'EncryptionManager: Processing 2.1M crypto operations/second. Key rotation scheduled every 24 hours.',
                'EncryptionManager: All systems quantum-ready. NIST-approved algorithms with zero performance impact.'
            ],
            defense: [
                'DefenseOrchestrator: 8 honeypots active. Automated response enabled. Average mitigation time: 0.3 seconds.',
                'DefenseOrchestrator: 124 attacks neutralized today. All actions logged with Dilithium-3 signatures.',
                'DefenseOrchestrator: Playbook execution successful. Coordinating with ThreatScanner and NetworkMapper.'
            ],
            analytics: [
                'AnalyticsEngine: Processing 2.4M metrics/hour. ML accuracy: 99.8%. Predictive models active.',
                'AnalyticsEngine: Trend analysis shows 78% increase in phishing attempts. Enhanced monitoring deployed.',
                'AnalyticsEngine: Real-time dashboards updated. All analytics protected with hybrid encryption.'
            ],
            logs: [
                'LogAgent: Processing 147K entries/minute. All logs Dilithium-signed for compliance.',
                'LogAgent: SOC2, ISO27001, NIST compliance verified. Tamper-proof storage active.',
                'LogAgent: Audit trail complete with quantum-resistant signatures. Ready for forensic analysis.'
            ]
        };
        
        return responseMap[context] || ['Main Agent: Command processed successfully. All operations protected with hybrid encryption.'];
    }
    
    generateStatusResponse(context) {
        return `System Status - ${context.toUpperCase()} Module:
• AI Mode: ${SentinelState.agentActive ? 'Autonomous' : 'Manual Control'}
• Encryption: Hybrid Active (Classical + Post-Quantum)
• Sub-Agents: 6 Online
• Threat Level: Medium
• Discovery: ${SentinelState.discoveryActive ? 'ACTIVE' : 'PAUSED'}
• Performance: Optimal
• Uptime: 99.98%`;
    }
    
    generateHelpResponse(context) {
        const commands = {
            general: ['status', 'help', 'list threats', 'scan network', 'show encryption', 'view logs'],
            threats: ['list threats', 'analyze threat [ID]', 'quarantine [IP]', 'threat stats'],
            network: ['scan network', 'list devices', 'discovery status', 'device info [IP]'],
            encryption: ['show encryption', 'key rotation', 'algorithm status', 'quantum readiness'],
            defense: ['defense status', 'list honeypots', 'response time', 'playbook status'],
            analytics: ['analytics report', 'threat trends', 'performance metrics', 'predictions']
        };
        
        const contextCommands = commands[context] || commands.general;
        return `Available Commands (${context.toUpperCase()}):
${contextCommands.map(cmd => `• ${cmd}`).join('\n')}

All commands route through appropriate sub-agents with hybrid encryption.`;
    }
    
    handleQuarantine(ipMatch) {
        if (ipMatch) {
            const ip = ipMatch[1];
            // Simulate quarantine action
            setTimeout(() => {
                this.addMessage(`DefenseOrchestrator: IP ${ip} quarantined successfully. All traffic blocked. Action logged with quantum-resistant signature.`, false);
            }, 1000);
            return `Main Agent: Initiating quarantine for IP ${ip}...`;
        }
        return 'Main Agent: Please specify a valid IP address. Usage: quarantine 192.168.1.105';
    }
    
    async processCLICommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Show CLI mode indicator
        const cliIndicator = document.getElementById('cliModeIndicator');
        if (cliIndicator) cliIndicator.classList.add('active');
        
        await this.delay(300);
        this.removeTypingIndicator();
        
        const cliResponses = {
            'help': `CLI Mode Commands (Hybrid V2):
• status - System overview
• list threats - Active threats
• scan network - Network devices
• show encryption - Encryption status
• view logs - Recent events
• quarantine [IP] - Block IP
• enable agent - Restore AI control
• discovery status - Device discovery
• version - Show version info`,
            
            'status': `[CLI] System Status:
• Mode: CLI (Manual Control)
• Version: ${SENTINEL_VERSION}
• Threats: 7 active
• Devices: 247 protected  
• Encryption: Hybrid Active
• Discovery: ${SentinelState.discoveryActive ? 'ACTIVE' : 'PAUSED'}
• Uptime: 99.98%`,
            
            'version': `[CLI] AI Sentinel-X Hybrid V2
• Version: ${SENTINEL_VERSION}
• API: ${API_VERSION}
• Encryption: Classical + Post-Quantum
• Architecture: Modular Sub-Agent System
• Status: Operational`,
            
            'list threats': `[CLI] Active Threats:
1. SQL Injection - /api/users - BLOCKED
2. DDoS Attack - Port 80 - MITIGATING
3. Port Scan - 185.*.*.* - MONITORED  
4. Brute Force - SSH - RATE LIMITED
5. Malware C2 - ISOLATED
6. Phishing - Email - QUARANTINED
7. Zero-Day - Web Server - ANALYZING`,
            
            'enable agent': () => {
                this.enableAgent();
                return '✅ Main Agent re-enabled. Autonomous mode restored.';
            }
        };
        
        const response = typeof cliResponses[lowerCommand] === 'function' 
            ? cliResponses[lowerCommand]() 
            : cliResponses[lowerCommand] || `[CLI] Command executed: ${command}`;
        
        this.addMessage(response, false);
    }
    
    enableAgent() {
        SentinelState.agentActive = true;
        SentinelState.cliMode = false;
        SentinelState.discoveryActive = true;
        
        const cliIndicator = document.getElementById('cliModeIndicator');
        if (cliIndicator) cliIndicator.classList.remove('active');
        
        // Update UI elements
        this.updateAgentStatus();
    }
    
    updateAgentStatus() {
        const agentStatus = document.querySelector('.agent-status');
        if (agentStatus) {
            agentStatus.style.background = 'rgba(0, 255, 136, 0.1)';
            agentStatus.style.borderColor = '#00ff88';
            
            const title = agentStatus.querySelector('.agent-title');
            const text = agentStatus.querySelector('.agent-status-text');
            
            if (title) title.textContent = 'AI Agent Active';
            if (text) text.textContent = 'Autonomous with Manual Override';
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Enhanced Event Handlers
class SentinelEventHandlers {
    static initializeEventListeners() {
        // Chat input handlers
        const chatInput = document.getElementById('aiChatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const message = chatInput.value.trim();
                    if (message) {
                        sentinelChat.sendMessage(message);
                        chatInput.value = '';
                    }
                }
            });
        }
        
        // Chat send button
        const sendButton = document.getElementById('aiChatSend');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                const chatInput = document.getElementById('aiChatInput');
                if (chatInput) {
                    const message = chatInput.value.trim();
                    if (message) {
                        sentinelChat.sendMessage(message);
                        chatInput.value = '';
                    }
                }
            });
        }
        
        // Chat toggle
        const chatToggle = document.querySelector('.ai-chat-toggle');
        if (chatToggle) {
            chatToggle.addEventListener('click', () => sentinelChat.toggle());
        }
        
        // Chat close
        const chatClose = document.querySelector('.ai-chat-close');
        if (chatClose) {
            chatClose.addEventListener('click', () => sentinelChat.toggle());
        }
    }
    
    static initializeModalHandlers() {
        // Modal overlay click handler
        const modalOverlay = document.getElementById('agentShutdownModal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    SentinelEventHandlers.closeModal();
                }
            });
        }
    }
    
    static showAgentShutdownModal() {
        const modal = document.getElementById('agentShutdownModal');
        if (modal) modal.style.display = 'flex';
    }
    
    static closeModal() {
        const modal = document.getElementById('agentShutdownModal');
        if (modal) modal.style.display = 'none';
    }
    
    static confirmAgentShutdown() {
        SentinelState.agentActive = !SentinelState.agentActive;
        
        if (!SentinelState.agentActive) {
            SentinelState.discoveryActive = false;
            SentinelState.scanningActive = false;
        }
        
        sentinelChat.updateAgentStatus();
        SentinelEventHandlers.closeModal();
        
        const status = SentinelState.agentActive ? 'resumed autonomous operation' : 'switched to manual control mode';
        if (SentinelState.chatOpen) {
            sentinelChat.addMessage(`⚠️ Main Agent has ${status}. CLI mode available if external connections fail.`, false, 'system');
        }
    }
}

// Enhanced Utilities
class SentinelUtils {
    static formatTimestamp(date = new Date()) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    
    static generateSecureId() {
        return 'sentinel_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    static validateIP(ip) {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    }
    
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim();
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Connection Monitor for V2
class SentinelConnectionMonitor {
    constructor() {
        this.connected = true;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }
    
    startMonitoring() {
        setInterval(() => {
            this.checkConnection();
        }, 30000);
    }
    
    checkConnection() {
        // Simulate connection check
        if (Math.random() > 0.95 && SentinelState.agentActive) {
            this.handleConnectionLoss();
        }
    }
    
    handleConnectionLoss() {
        if (this.connected) {
            this.connected = false;
            SentinelState.cliMode = true;
            
            const cliIndicator = document.getElementById('cliModeIndicator');
            if (cliIndicator) cliIndicator.classList.add('active');
            
            if (SentinelState.chatOpen) {
                sentinelChat.addMessage('⚠️ Main Agent connection lost. Switching to CLI fallback mode. Type "help" for available commands.', false, 'system');
            }
            
            this.attemptReconnection();
        }
    }
    
    attemptReconnection() {
        setTimeout(() => {
            this.reconnectAttempts++;
            
            if (this.reconnectAttempts <= this.maxReconnectAttempts) {
                // Simulate successful reconnection
                if (Math.random() > 0.3) {
                    this.handleReconnection();
                } else {
                    this.attemptReconnection();
                }
            }
        }, this.reconnectDelay * this.reconnectAttempts);
    }
    
    handleReconnection() {
        this.connected = true;
        this.reconnectAttempts = 0;
        SentinelState.cliMode = false;
        
        const cliIndicator = document.getElementById('cliModeIndicator');
        if (cliIndicator) cliIndicator.classList.remove('active');
        
        if (SentinelState.chatOpen) {
            sentinelChat.addMessage('✅ Main Agent connection restored. Autonomous mode resumed.', false, 'system');
        }
    }
}

// Global instances
let sentinelChat;
let connectionMonitor;
let neuralCleanup;

// Enhanced initialization
function initializeSentinel() {
    initializePageContext();
    
    // Initialize chat system
    sentinelChat = new SentinelChat();
    
    // Initialize connection monitor
    connectionMonitor = new SentinelConnectionMonitor();
    connectionMonitor.startMonitoring();
    
    // Initialize event handlers
    SentinelEventHandlers.initializeEventListeners();
    SentinelEventHandlers.initializeModalHandlers();
    
    // Initialize neural background
    neuralCleanup = initNeuralBackground();
    
    // Add global CSS for enhanced features
    addEnhancedCSS();
}

// Enhanced CSS for V2 features
function addEnhancedCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* Typing indicator animation */
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 10px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--primary, #00ff88);
            border-radius: 50%;
            animation: typingDot 1.4s ease-in-out infinite;
        }
        
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typingDot {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.7;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }
        
        /* Enhanced message bubbles */
        .ai-message-bubble.error {
            background: rgba(255, 0, 68, 0.1);
            border-color: var(--danger, #ff0044);
        }
        
        .ai-message-bubble code {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        
        /* Connection status indicators */
        .connection-status {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10001;
            transition: all 0.3s ease;
        }
        
        .connection-status.connected {
            background: rgba(0, 255, 136, 0.2);
            color: var(--success, #00ff88);
        }
        
        .connection-status.disconnected {
            background: rgba(255, 0, 68, 0.2);
            color: var(--danger, #ff0044);
            animation: pulse 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// Cleanup function
function cleanupSentinel() {
    if (neuralCleanup) neuralCleanup();
    if (connectionMonitor) connectionMonitor = null;
    if (sentinelChat) sentinelChat = null;
}

// Global exports for backward compatibility
window.SentinelState = SentinelState;
window.sentinelChat = sentinelChat;
window.SentinelUtils = SentinelUtils;
window.SentinelEventHandlers = SentinelEventHandlers;

// Legacy function exports
window.toggleChat = () => sentinelChat?.toggle();
window.addChatMessage = (msg, isUser, type) => sentinelChat?.addMessage(msg, isUser, type);
window.processCommand = (cmd) => sentinelChat?.sendMessage(cmd);
window.showAgentShutdownModal = SentinelEventHandlers.showAgentShutdownModal;
window.closeModal = SentinelEventHandlers.closeModal;
window.closeModalOnOverlay = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        SentinelEventHandlers.closeModal();
    }
};
window.confirmAgentShutdown = SentinelEventHandlers.confirmAgentShutdown;
window.handleChatKeyPress = (e) => {
    if (e.key === 'Enter') {
        const input = e.target;
        const message = input.value.trim();
        if (message) {
            sentinelChat?.sendMessage(message);
            input.value = '';
        }
    }
};
window.sendChatMessage = () => {
    const input = document.getElementById('aiChatInput');
    if (input) {
        const message = input.value.trim();
        if (message) {
            sentinelChat?.sendMessage(message);
            input.value = '';
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSentinel);
} else {
    initializeSentinel();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupSentinel);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SentinelState,
        SentinelChat,
        SentinelUtils,
        SentinelEventHandlers,
        initializeSentinel,
        cleanupSentinel
    };
}
