/**
 * AI Sentinel-X Network Discovery Core Module
 * Handles network-specific functionality and adaptive scaling
 */

// Network module state
let currentScale = null;
let ipRanges = [];
let internalDevices = [];
let deviceCounter = 1;
let scanningActive = true;
let discoveryActive = true;

// Initialize environment detection
function initializeEnvironmentDetection() {
    // Auto-detect based on stored preference or simulate detection
    const savedScale = localStorage.getItem('sentinel_scale');
    if (savedScale && ScaleConfigs[savedScale]) {
        selectScale(savedScale, false);
    } else {
        // Show selection interface
        SentinelUtils.showElement('environmentDetection');
    }
}
function startAutoScan() {
    const autoScanBtn = document.getElementById('autoScanBtn');
    const scanProgress = document.getElementById('scanProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Disable button and show progress
    autoScanBtn.disabled = true;
    scanProgress.style.display = 'block';
    
    // Simulate network scanning process
    const scanSteps = [
        { progress: 15, text: "Detecting public IP addresses..." },
        { progress: 30, text: "Scanning network topology..." },
        { progress: 45, text: "Analyzing service distribution..." },
        { progress: 60, text: "Checking geographic presence..." },
        { progress: 75, text: "Evaluating security requirements..." },
        { progress: 90, text: "Determining optimal solution..." },
        { progress: 100, text: "Scan complete! Recommending deployment..." }
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < scanSteps.length) {
            const step = scanSteps[currentStep];
            progressFill.style.width = step.progress + '%';
            progressText.textContent = step.text;
            currentStep++;
        } else {
            clearInterval(interval);
            
            // Simulate scan results and recommendation
            setTimeout(() => {
                const recommendation = simulateNetworkScan();
                showScanResults(recommendation);
            }, 1000);
        }
    }, 800);
    
    // Track scan initiation in chat
    if (SentinelState.chatOpen) {
        sentinelChat.addMessage('🔍 NetworkMapper: Auto-scan initiated. Analyzing your network infrastructure to recommend optimal security deployment...', false, 'system');
    }
}

function simulateNetworkScan() {
    // Simulate different network configurations
    const scenarios = [
        {
            type: 'individual',
            confidence: 92,
            details: {
                publicIPs: 1,
                services: 6,
                complexity: 'Low',
                infrastructure: 'Single VPS/Cloud Instance',
                recommendation: 'Essential Protection is perfect for your setup'
            }
        },
        {
            type: 'business',
            confidence: 87,
            details: {
                publicIPs: 3,
                services: 24,
                complexity: 'Medium',
                infrastructure: 'Multi-location business network',
                recommendation: 'Professional solution recommended for your scale'
            }
        },
        {
            type: 'enterprise',
            confidence: 94,
            details: {
                publicIPs: 12,
                services: 156,
                complexity: 'High',
                infrastructure: 'Enterprise data center infrastructure',
                recommendation: 'Enterprise Defense required for your scale'
            }
        }
    ];
    
    // Randomly select a scenario (in production, this would be real network analysis)
    return scenarios[Math.floor(Math.random() * scenarios.length)];
}

function showScanResults(recommendation) {
    const scanProgress = document.getElementById('scanProgress');
    const autoScanBtn = document.getElementById('autoScanBtn');
    
    // Hide progress, show results
    scanProgress.style.display = 'none';
    autoScanBtn.disabled = false;
    autoScanBtn.innerHTML = `
        <span class="scan-icon">✅</span>
        <span class="scan-text">Scan Complete</span>
        <span class="scan-subtitle">Click to rescan network</span>
    `;
    
    // Create results modal or update interface
    showScanResultsModal(recommendation);
    
    // Highlight recommended solution
    highlightRecommendedSolution(recommendation.type);
    
    // Update chat with results
    if (SentinelState.chatOpen) {
        sentinelChat.addMessage(`🎯 NetworkMapper: Scan complete! Detected ${recommendation.details.infrastructure}. ${recommendation.recommendation}. Confidence: ${recommendation.confidence}%`, false, 'system');
    }
}

function showScanResultsModal(recommendation) {
    // Create a results modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">🎯 Network Scan Results</h2>
            </div>
            <div class="modal-content">
                <div class="scan-results-grid">
                    <div class="result-metric">
                        <div class="metric-icon">🌐</div>
                        <div class="metric-label">Public IPs</div>
                        <div class="metric-value">${recommendation.details.publicIPs}</div>
                    </div>
                    <div class="result-metric">
                        <div class="metric-icon">⚙️</div>
                        <div class="metric-label">Services</div>
                        <div class="metric-value">${recommendation.details.services}</div>
                    </div>
                    <div class="result-metric">
                        <div class="metric-icon">📊</div>
                        <div class="metric-label">Complexity</div>
                        <div class="metric-value">${recommendation.details.complexity}</div>
                    </div>
                    <div class="result-metric">
                        <div class="metric-icon">🎯</div>
                        <div class="metric-label">Confidence</div>
                        <div class="metric-value">${recommendation.confidence}%</div>
                    </div>
                </div>
                
                <div class="recommendation-box">
                    <h3>🚀 Recommended Solution</h3>
                    <p><strong>${recommendation.details.infrastructure}</strong></p>
                    <p>${recommendation.details.recommendation}</p>
                </div>
                
                <p style="color: var(--text-secondary); text-align: center; margin-top: 20px;">
                    The recommended solution is highlighted below. You can still choose any solution that fits your needs.
                </p>
            </div>
            <div class="modal-actions">
                <button class="modal-btn modal-btn-primary" onclick="acceptRecommendation('${recommendation.type}')">
                    Accept Recommendation
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="closeScanResultsModal()">
                    Choose Manually
                </button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .scan-results-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .result-metric {
            background: rgba(0, 255, 136, 0.05);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 10px;
            padding: 15px;
            text-align: center;
        }
        
        .metric-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        
        .metric-label {
            font-size: 12px;
            color: var(--text-secondary);
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        
        .metric-value {
            font-size: 18px;
            font-weight: bold;
            color: var(--primary);
        }
        
        .recommendation-box {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.05));
            border: 1px solid var(--primary);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .recommendation-box h3 {
            color: var(--primary);
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeScanResultsModal();
        }
    });
}

function closeScanResultsModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal && modal.querySelector('.scan-results-grid')) {
        modal.remove();
    }
}

function acceptRecommendation(recommendedType) {
    closeScanResultsModal();
    selectScale(recommendedType, true);
}

function highlightRecommendedSolution(recommendedType) {
    // Remove any existing highlights
    document.querySelectorAll('.scale-option').forEach(option => {
        option.classList.remove('recommended');
    });
    
    // Add highlight to recommended solution
    const recommendedOption = document.querySelector(`.scale-option.${recommendedType}`);
    if (recommendedOption) {
        recommendedOption.classList.add('recommended');
        
        // Add a recommended badge
        const header = recommendedOption.querySelector('.scale-header');
        if (header && !header.querySelector('.recommended-badge')) {
            const badge = document.createElement('div');
            badge.className = 'recommended-badge';
            badge.innerHTML = '⭐ RECOMMENDED';
            header.appendChild(badge);
        }
        
        // Scroll into view
        recommendedOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Add CSS for recommended styling
    const style = document.createElement('style');
    style.textContent = `
        .scale-option.recommended {
            border-color: var(--secondary) !important;
            box-shadow: 0 0 25px rgba(0, 204, 255, 0.4) !important;
            animation: recommendedPulse 2s ease-in-out 3;
        }
        
        @keyframes recommendedPulse {
            0%, 100% { box-shadow: 0 0 25px rgba(0, 204, 255, 0.4); }
            50% { box-shadow: 0 0 35px rgba(0, 204, 255, 0.6); }
        }
        
        .recommended-badge {
            background: var(--gradient-2);
            color: white;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            animation: badgePulse 1s ease-in-out infinite;
        }
        
        @keyframes badgePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
}

function requestConsultation() {
    if (!SentinelState.chatOpen) {
        sentinelChat.toggle();
    }
    
    setTimeout(() => {
        sentinelChat.addMessage('📞 Thank you for your interest in a security consultation! Our team will contact you within 24 hours to discuss your infrastructure needs and provide personalized recommendations.', false, 'system');
        sentinelChat.addMessage('In the meantime, feel free to explore our solutions above or ask me any questions about AI Sentinel-X capabilities.', false, 'system');
    }, 500);
}

// Select scale and configure interface
function selectScale(scale, userSelected = true) {
    if (!ScaleConfigs[scale]) return;

    currentScale = scale;
    SentinelState.currentScale = scale;
    const config = ScaleConfigs[scale];

    // Hide environment detection
    SentinelUtils.hideElement('environmentDetection');

    // Update scale indicator
    updateScaleIndicator(config);

    // Update body class for CSS targeting
    document.body.className = `${scale}-mode`;

    // Update modal title
    SentinelUtils.updateElementText('addRangeModalTitle', config.modalTitle);

    // Configure interface based on scale
    configureInterfaceForScale(scale, config);

    // Initialize data for scale
    initializeDataForScale(scale, config);

    // Save preference
    if (userSelected) {
        localStorage.setItem('sentinel_scale', scale);
    }

    // Update chat context
    updateChatForScale(scale, config);

    // Show notification
    if (SentinelState.chatOpen && userSelected) {
        sentinelChat.addMessage(`NetworkMapper: Configured for ${config.text.toLowerCase()} scale. Interface adapted for ${config.chatContext}. All features optimized for your environment.`, false, 'system');
    }
}

// Update scale indicator
function updateScaleIndicator(config) {
    const scaleIndicator = document.getElementById('scaleIndicator');
    const scaleIcon = document.getElementById('scaleIcon');
    const scaleText = document.getElementById('scaleText');
    
    if (scaleIndicator && scaleIcon && scaleText) {
        scaleIndicator.className = `scale-indicator ${config.className}`;
        scaleIcon.textContent = config.icon;
        scaleText.textContent = config.text;
    }
}

// Configure interface elements based on scale
function configureInterfaceForScale(scale, config) {
    // Show main sections
    SentinelUtils.showElement('subAgentStatus');
    SentinelUtils.showElement('dashboardInteractive');
    SentinelUtils.showElement('networkOverview');
    
    const scanningGrid = document.getElementById('scanningGrid');
    const deviceDiscovery = document.getElementById('deviceDiscovery');
    if (scanningGrid) scanningGrid.style.display = 'grid';
    if (deviceDiscovery) deviceDiscovery.style.display = 'block';

    // Always show IP range manager with reset button
    SentinelUtils.showElement('ipRangeManager');
    
    // Update titles based on scale
    const ipRangeTitle = scale === 'individual' ? 'Server Range Management' : 
                       scale === 'business' ? 'Business Network Ranges' : 
                       'Enterprise IP Range Management';
    SentinelUtils.updateElementText('ipRangeTitle', ipRangeTitle);

    // Configure add range button for individual mode
    const addRangeBtn = document.getElementById('addRangeBtn');
    if (addRangeBtn) {
        if (scale === 'individual') {
            addRangeBtn.textContent = 'Add Server Range';
            // Disable if already has max ranges
            if (ipRanges.length >= config.maxRanges) {
                addRangeBtn.disabled = true;
                addRangeBtn.title = 'Maximum ranges reached for single IP deployment';
            } else {
                addRangeBtn.disabled = false;
                addRangeBtn.title = 'Add additional server range';
            }
        } else {
            addRangeBtn.textContent = 'Add IP Range';
            addRangeBtn.disabled = false;
            addRangeBtn.title = 'Add new IP range for monitoring';
        }
    }

    // Update titles and descriptions
    updateInterfaceTitles(scale, config);

    // Configure metrics labels
    updateMetricsLabels(scale);

    // Generate appropriate scanning panels
    generateScanningPanels(scale);

    // Generate overview cards
    generateOverviewCards(scale);
}

// Update interface titles and descriptions
function updateInterfaceTitles(scale, config) {
    // Sub-agent description
    SentinelUtils.updateElementText('subAgentDescription', config.description);

    // Dashboard title and description
    const titles = {
        individual: 'Single IP Discovery',
        business: 'Multi-Site Network Discovery', 
        enterprise: 'Enterprise Network Discovery'
    };
    
    SentinelUtils.updateElementText('interactiveTitle', titles[scale]);
    SentinelUtils.updateElementText('scanDetails', config.scanDetails);

    // Overview title
    const overviewTitles = {
        individual: 'Server Overview',
        business: 'Business Network Overview',
        enterprise: 'Enterprise Network Overview'
    };
    SentinelUtils.updateElementText('overviewTitle', overviewTitles[scale]);

    // Discovery title
    const discoveryTitles = {
        individual: 'Server Discovery',
        business: 'Business Device Discovery',
        enterprise: 'Enterprise Device Discovery'
    };
    SentinelUtils.updateElementText('discoveryTitle', discoveryTitles[scale]);

    // Dashboard descriptions - Fixed terminology
    const descriptions = {
        individual: '🤖 <strong>Server monitoring active</strong> • Hybrid-resistant encryption • Automatic threat detection',
        business: '🤖 <strong>Multi-site autonomous scanning</strong> • Business-grade encryption • Cross-location monitoring',
        enterprise: '🤖 <strong>Enterprise autonomous scanning</strong> • Cross-DC correlation • Full hybrid-resistant infrastructure'
    };
    SentinelUtils.updateElementHTML('dashboardDescription', descriptions[scale]);
}

// Update metrics labels based on scale
function updateMetricsLabels(scale) {
    const labels = {
        individual: 'Server',
        business: 'Locations', 
        enterprise: 'IP Ranges'
    };
    SentinelUtils.updateElementText('networksLabel', labels[scale]);
}

// Generate scanning panels based on scale
function generateScanningPanels(scale) {
    const scanningGrid = document.getElementById('scanningGrid');
    if (!scanningGrid) return;
    
    scanningGrid.innerHTML = '';

    if (scale === 'individual') {
        // Clean, focused design for single server
        scanningGrid.innerHTML = `
            <div class="scan-panel external">
                <div class="panel-header">
                    <h2 class="panel-title external">External Security Scan</h2>
                    <div class="scan-status active">
                        <div class="status-dot"></div>
                        <span>SCANNING</span>
                    </div>
                </div>
                <div class="scan-results">
                    <div class="result-item">
                        <span class="result-label">Public IP</span>
                        <span class="result-value" id="serverPublicIP">203.0.113.42</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Provider</span>
                        <span class="result-value">DigitalOcean</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Location</span>
                        <span class="result-value">New York, US</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Open Ports</span>
                        <span class="result-value" style="color: var(--success);">4</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Security Score</span>
                        <span class="result-value" style="color: var(--success);">A+</span>
                    </div>
                </div>
                <div class="service-list">
                    <div class="service-item" onclick="showServiceDetails('ServerHTTPS')">
                        <div class="service-info">
                            <div class="service-name">HTTPS (443/tcp)</div>
                            <div class="service-details">Web Server • Nginx 1.24</div>
                            <div class="service-encryption">🔐 TLS 1.3 + Hybrid-Ready</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                    <div class="service-item" onclick="showServiceDetails('ServerSSH')">
                        <div class="service-info">
                            <div class="service-name">SSH (22/tcp)</div>
                            <div class="service-details">Remote Access • Key Auth Only</div>
                            <div class="service-encryption">🔐 OpenSSH + Hybrid Keys</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                </div>
            </div>
            <div class="scan-panel internal">
                <div class="panel-header">
                    <h2 class="panel-title internal">Server Internal Scan</h2>
                    <div class="scan-status active">
                        <div class="status-dot"></div>
                        <span>MONITORING</span>
                    </div>
                </div>
                <div class="scan-results">
                    <div class="result-item">
                        <span class="result-label">Server Type</span>
                        <span class="result-value">VPS Ubuntu 22.04</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Services</span>
                        <span class="result-value" style="color: var(--success);" id="serverServiceCount">6</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">CPU Usage</span>
                        <span class="result-value" style="color: var(--success);">12%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Memory</span>
                        <span class="result-value" style="color: var(--success);">34%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">AI Protection</span>
                        <span class="result-value" style="color: var(--accent);">ACTIVE</span>
                    </div>
                </div>
                <div class="service-list">
                    <div class="service-item" onclick="showServiceDetails('ServerDocker')">
                        <div class="service-info">
                            <div class="service-name">Docker Engine</div>
                            <div class="service-details">Containers • 3 running</div>
                            <div class="service-encryption">🔐 Container Security + TLS</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                    <div class="service-item" onclick="showServiceDetails('ServerDB')">
                        <div class="service-info">
                            <div class="service-name">PostgreSQL</div>
                            <div class="service-details">Database • Local only</div>
                            <div class="service-encryption">🔐 Encrypted at rest + TLS</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                </div>
            </div>
        `;
    } else if (scale === 'business') {
        // Business with multi-site
        scanningGrid.innerHTML = `
            <div class="scan-panel external">
                <div class="panel-header">
                    <h2 class="panel-title external">Multi-Site External Scan</h2>
                    <div class="scan-status active">
                        <div class="status-dot"></div>
                        <span>SCANNING</span>
                    </div>
                </div>
                <div class="scan-results">
                    <div class="result-item">
                        <span class="result-label">Business Locations</span>
                        <span class="result-value">3 Sites</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Organization</span>
                        <span class="result-value">Business Corp LLC</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">IP Ranges</span>
                        <span class="result-value">3</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Services</span>
                        <span class="result-value" style="color: var(--warning);">24</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Security Score</span>
                        <span class="result-value" style="color: var(--success);">B+</span>
                    </div>
                </div>
                <div class="service-list">
                    <div class="service-item" onclick="showServiceDetails('BusinessHTTPS')">
                        <div class="service-info">
                            <div class="service-name">Business Web Services</div>
                            <div class="service-details">Multi-site • Load balanced</div>
                            <div class="service-encryption">🔐 TLS 1.3 + Business Certs</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                    <div class="service-item" onclick="showServiceDetails('BusinessVPN')">
                        <div class="service-info">
                            <div class="service-name">VPN Gateways</div>
                            <div class="service-details">Site-to-site • IPSec</div>
                            <div class="service-encryption">🔐 IPSec + Hybrid Encryption</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                    <div class="service-item" onclick="showServiceDetails('BusinessEmail')">
                        <div class="service-info">
                            <div class="service-name">Email Server (25/tcp)</div>
                            <div class="service-details">Exchange • TLS required</div>
                            <div class="service-encryption">⚠️ TLS 1.2 - upgrade available</div>
                        </div>
                        <div class="service-status status-update">UPDATE</div>
                    </div>
                </div>
            </div>
            <div class="scan-panel internal">
                <div class="panel-header">
                    <h2 class="panel-title internal">Business Network Scan</h2>
                    <div class="scan-status active">
                        <div class="status-dot"></div>
                        <span>MULTI-SITE</span>
                    </div>
                </div>
                <div class="scan-results">
                    <div class="result-item">
                        <span class="result-label">Network Segments</span>
                        <span class="result-value">8 Subnets</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Devices</span>
                        <span class="result-value" style="color: var(--success);" id="businessDeviceCount">127</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Servers</span>
                        <span class="result-value">12</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Workstations</span>
                        <span class="result-value">89</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Cross-Site Protection</span>
                        <span class="result-value" style="color: var(--accent);">ACTIVE</span>
                    </div>
                </div>
                <div class="service-list">
                    <div class="service-item" onclick="showServiceDetails('BusinessDC')">
                        <div class="service-info">
                            <div class="service-name">Domain Controllers</div>
                            <div class="service-details">3 sites • AD replication</div>
                            <div class="service-encryption">🔐 Kerberos + Business Security</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                    <div class="service-item" onclick="showServiceDetails('BusinessFile')">
                        <div class="service-info">
                            <div class="service-name">File Servers</div>
                            <div class="service-details">Distributed • SMB 3.1.1</div>
                            <div class="service-encryption">🔐 SMB encryption + BitLocker</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                </div>
            </div>
        `;
    } else { // enterprise
        // Full enterprise with data centers
        scanningGrid.innerHTML = `
            <div class="scan-panel datacenter">
                <div class="panel-header">
                    <h2 class="panel-title datacenter">Data Center Overview</h2>
                    <div class="scan-status active">
                        <div class="status-dot"></div>
                        <span>MONITORING</span>
                    </div>
                </div>
                <div class="scan-results">
                    <div class="result-item">
                        <span class="result-label">Primary DC</span>
                        <span class="result-value">US-East-1</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Secondary DC</span>
                        <span class="result-value">US-West-2</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Backup DC</span>
                        <span class="result-value">EU-Central-1</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Ranges</span>
                        <span class="result-value">8</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Global Threats</span>
                        <span class="result-value" style="color: var(--success);">0</span>
                    </div>
                </div>
                <div class="service-list">
                    <div class="service-item" onclick="showServiceDetails('EnterpriseLB')">
                        <div class="service-info">
                            <div class="service-name">Load Balancers</div>
                            <div class="service-details">Global • High availability</div>
                            <div class="service-encryption">🔐 Enterprise TLS + Hybrid</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                    <div class="service-item" onclick="showServiceDetails('EnterpriseCDN')">
                        <div class="service-info">
                            <div class="service-name">CDN Network</div>
                            <div class="service-details">Global edge • CloudFlare</div>
                            <div class="service-encryption">🔐 Global hybrid protection</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                </div>
            </div>
            <div class="scan-panel external">
                <div class="panel-header">
                    <h2 class="panel-title external">Enterprise External Scan</h2>
                    <div class="scan-status active">
                        <div class="status-dot"></div>
                        <span>GLOBAL SCAN</span>
                    </div>
                </div>
                <div class="scan-results">
                    <div class="result-item">
                        <span class="result-label">Organization</span>
                        <span class="result-value">Enterprise Data Corp</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">ASN</span>
                        <span class="result-value">AS64512</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Global Presence</span>
                        <span class="result-value">3 Continents</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Services</span>
                        <span class="result-value" style="color: var(--warning);">156</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Security Score</span>
                        <span class="result-value" style="color: var(--success);">A</span>
                    </div>
                </div>
                <div class="service-list">
                    <div class="service-item" onclick="showServiceDetails('EnterpriseHTTPS')">
                        <div class="service-info">
                            <div class="service-name">Enterprise Web</div>
                            <div class="service-details">Multi-region • Auto-scaling</div>
                            <div class="service-encryption">🔐 Enterprise TLS 1.3 + Hybrid</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                    <div class="service-item" onclick="showServiceDetails('EnterpriseAPI')">
                        <div class="service-info">
                            <div class="service-name">API Gateways</div>
                            <div class="service-details">12 endpoints • OAuth2</div>
                            <div class="service-encryption">🔐 mTLS + Enterprise Auth</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                </div>
            </div>
            <div class="scan-panel internal">
                <div class="panel-header">
                    <h2 class="panel-title internal">Enterprise Internal Scan</h2>
                    <div class="scan-status active">
                        <div class="status-dot"></div>
                        <span>FULL DISCOVERY</span>
                    </div>
                </div>
                <div class="scan-results">
                    <div class="result-item">
                        <span class="result-label">Network Segments</span>
                        <span class="result-value">24 Subnets</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Infrastructure</span>
                        <span class="result-value" style="color: var(--success);" id="enterpriseDeviceCount">2,847</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">K8s Nodes</span>
                        <span class="result-value">142</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">DB Clusters</span>
                        <span class="result-value">15</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Enterprise AI</span>
                        <span class="result-value" style="color: var(--accent);">FULL COVERAGE</span>
                    </div>
                </div>
                <div class="service-list">
                    <div class="service-item" onclick="showServiceDetails('EnterpriseK8s')">
                        <div class="service-info">
                            <div class="service-name">Kubernetes Platform</div>
                            <div class="service-details">Multi-cluster • Service mesh</div>
                            <div class="service-encryption">🔐 mTLS + Container security</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                    <div class="service-item" onclick="showServiceDetails('EnterpriseDB')">
                        <div class="service-info">
                            <div class="service-name">Database Infrastructure</div>
                            <div class="service-details">Distributed • TDE enabled</div>
                            <div class="service-encryption">🔐 TDE + Cross-DC encryption</div>
                        </div>
                        <div class="service-status status-secure">SECURE</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Generate overview cards based on scale
function generateOverviewCards(scale) {
    const overviewGrid = document.getElementById('overviewGrid');
    if (!overviewGrid) return;
    
    if (scale === 'individual') {
        overviewGrid.innerHTML = `
            <div class="overview-card" onclick="showOverviewDetails('serverIP')">
                <div class="overview-icon">🌐</div>
                <div class="overview-value" id="serverIP">203.0.113.42</div>
                <div class="overview-label">Server IP Address</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('serverServices')">
                <div class="overview-icon">⚙️</div>
                <div class="overview-value" id="serverServices">6</div>
                <div class="overview-label">Active Services</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('serverContainers')">
                <div class="overview-icon">📦</div>
                <div class="overview-value" id="serverContainers">3</div>
                <div class="overview-label">Containers</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('serverThreats')">
                <div class="overview-icon">🛡️</div>
                <div class="overview-value" id="serverThreats">0</div>
                <div class="overview-label">Security Issues</div>
            </div>
        `;
    } else if (scale === 'business') {
        overviewGrid.innerHTML = `
            <div class="overview-card" onclick="showOverviewDetails('businessSites')">
                <div class="overview-icon">🏢</div>
                <div class="overview-value" id="businessSites">3</div>
                <div class="overview-label">Business Locations</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('businessDevices')">
                <div class="overview-icon">📡</div>
                <div class="overview-value" id="businessDevices">127</div>
                <div class="overview-label">Total Devices</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('businessServices')">
                <div class="overview-icon">⚙️</div>
                <div class="overview-value" id="businessServices">24</div>
                <div class="overview-label">Business Services</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('businessServers')">
                <div class="overview-icon">🖥️</div>
                <div class="overview-value" id="businessServers">12</div>
                <div class="overview-label">Servers</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('businessUsers')">
                <div class="overview-icon">👥</div>
                <div class="overview-value" id="businessUsers">89</div>
                <div class="overview-label">Workstations</div>
            </div>
        `;
    } else { // enterprise
        overviewGrid.innerHTML = `
            <div class="overview-card" onclick="showOverviewDetails('enterpriseRanges')">
                <div class="overview-icon">🏭</div>
                <div class="overview-value" id="enterpriseRanges">8</div>
                <div class="overview-label">IP Ranges</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('enterpriseDatacenters')">
                <div class="overview-icon">🏗️</div>
                <div class="overview-value" id="enterpriseDatacenters">3</div>
                <div class="overview-label">Data Centers</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('enterpriseInfrastructure')">
                <div class="overview-icon">📡</div>
                <div class="overview-value" id="enterpriseInfrastructure">2,847</div>
                <div class="overview-label">Infrastructure</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('enterpriseServices')">
                <div class="overview-icon">⚡</div>
                <div class="overview-value" id="enterpriseServices">156</div>
                <div class="overview-label">Services</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('enterpriseKubernetes')">
                <div class="overview-icon">☸️</div>
                <div class="overview-value" id="enterpriseKubernetes">142</div>
                <div class="overview-label">K8s Nodes</div>
            </div>
            <div class="overview-card" onclick="showOverviewDetails('enterpriseBandwidth')">
                <div class="overview-icon">📊</div>
                <div class="overview-value" id="enterpriseBandwidth">47.2GB/s</div>
                <div class="overview-label">Bandwidth</div>
            </div>
        `;
    }
}

// Initialize data structures for each scale
function initializeDataForScale(scale, config) {
    // Reset data
    ipRanges = [];
    internalDevices = [];
    deviceCounter = 1;

    // Generate appropriate IP ranges
    if (scale === 'individual') {
        ipRanges = [{
            id: 'server',
            name: 'Production Server',
            range: '203.0.113.42/32',
            location: 'New York, US',
            organization: 'DigitalOcean',
            status: 'Active',
            devices: 1,
            services: 6,
            vulnerabilities: 0,
            bandwidth: '1Gbps'
        }];
        deviceCounter = 2;
    } else if (scale === 'business') {
        ipRanges = [
            {
                id: 'headquarters',
                name: 'Headquarters',
                range: '203.0.113.0/26',
                location: 'Columbia, SC',
                organization: 'Business Fiber',
                status: 'Active',
                devices: 67,
                services: 12,
                vulnerabilities: 0,
                bandwidth: '1Gbps'
            },
            {
                id: 'branch-atlanta',
                name: 'Atlanta Office',
                range: '203.0.113.64/27',
                location: 'Atlanta, GA',
                organization: 'Business Fiber',
                status: 'Active',
                devices: 34,
                services: 8,
                vulnerabilities: 1,
                bandwidth: '500Mbps'
            },
            {
                id: 'branch-charlotte',
                name: 'Charlotte Office',
                range: '203.0.113.96/28',
                location: 'Charlotte, NC',
                organization: 'Business Fiber',
                status: 'Active',
                devices: 26,
                services: 4,
                vulnerabilities: 0,
                bandwidth: '300Mbps'
            }
        ];
        deviceCounter = 128;
    } else { // enterprise
        ipRanges = [
            {
                id: 'primary-east',
                name: 'Primary-DC-East',
                range: '203.0.113.0/24',
                location: 'Virginia, US',
                organization: 'AS64512',
                status: 'Active',
                devices: 847,
                services: 42,
                vulnerabilities: 1,
                bandwidth: '15.8GB/s'
            },
            {
                id: 'secondary-west',
                name: 'Secondary-DC-West',
                range: '198.51.100.0/24',
                location: 'Oregon, US',
                organization: 'AS64512',
                status: 'Active',
                devices: 623,
                services: 38,
                vulnerabilities: 0,
                bandwidth: '12.4GB/s'
            },
            {
                id: 'backup-eu',
                name: 'Backup-DC-EU',
                range: '192.0.2.0/24',
                location: 'Frankfurt, DE',
                organization: 'AS64513',
                status: 'Active',
                devices: 456,
                services: 28,
                vulnerabilities: 1,
                bandwidth: '9.2GB/s'
            },
            {
                id: 'edge-east',
                name: 'Edge-East',
                range: '172.16.0.0/20',
                location: 'New York, US',
                organization: 'AS64514',
                status: 'Active',
                devices: 234,
                services: 18,
                vulnerabilities: 0,
                bandwidth: '3.8GB/s'
            },
            {
                id: 'cdn-global',
                name: 'CDN-Global',
                range: '10.0.0.0/16',
                location: 'Multi-region',
                organization: 'AS64515',
                status: 'Active',
                devices: 312,
                services: 8,
                vulnerabilities: 1,
                bandwidth: '1.7GB/s'
            }
        ];
        deviceCounter = 2848;
    }

    // Generate initial device list
    generateInitialDevices(scale);

    // Update metrics
    updateMetrics();

    // Populate IP ranges grid
    populateIPRangesGrid();

    // Populate device grid
    populateDeviceGrid();
}

// Generate initial devices based on scale
function generateInitialDevices(scale) {
    internalDevices = [];
    
    if (scale === 'individual') {
        internalDevices = [
            { id: 'server', name: 'PROD-SERVER-01', ip: '203.0.113.42', type: 'VPS', icon: '🖥️', services: 'HTTPS, SSH, Docker', status: 'Secure', encryption: 'TLS 1.3 + Container Security', isNew: false },
            { id: 'nginx', name: 'NGINX-PROXY', ip: '172.17.0.2', type: 'Container', icon: '🌐', services: 'HTTP Proxy', status: 'Secure', encryption: 'TLS termination', isNew: false },
            { id: 'database', name: 'POSTGRES-DB', ip: '172.17.0.3', type: 'Database', icon: '🗄️', services: 'PostgreSQL', status: 'Secure', encryption: 'Encrypted at rest', isNew: false },
            { id: 'app', name: 'APP-CONTAINER', ip: '172.17.0.4', type: 'Application', icon: '📦', services: 'Web App', status: 'Secure', encryption: 'Internal TLS', isNew: false }
        ];
    } else if (scale === 'business') {
        internalDevices = [
            { id: 'dc01', name: 'DC01-HQ', ip: '10.0.1.10', type: 'Domain Controller', icon: '🖥️', services: 'AD, DNS, DHCP', status: 'Secure', encryption: 'Kerberos + TLS', isNew: false },
            { id: 'fileserver', name: 'FILE-SERVER-01', ip: '10.0.1.20', type: 'File Server', icon: '📁', services: 'SMB, Backup', status: 'Secure', encryption: 'SMB3 + BitLocker', isNew: false },
            { id: 'exchange', name: 'EXCHANGE-01', ip: '10.0.1.30', type: 'Mail Server', icon: '📧', services: 'SMTP, IMAP', status: 'Update', encryption: 'TLS 1.2 - upgrade needed', isNew: false },
            { id: 'firewall', name: 'FIREWALL-HQ', ip: '10.0.1.1', type: 'Firewall', icon: '🛡️', services: 'Filtering, VPN', status: 'Secure', encryption: 'IPSec + Management', isNew: false },
            { id: 'workstation', name: 'WS-FINANCE-01', ip: '10.0.2.50', type: 'Workstation', icon: '💼', services: 'Domain, Office', status: 'Secure', encryption: 'Domain + BitLocker', isNew: false }
        ];
    } else { // enterprise
        internalDevices = [
            { id: 'k8s-master', name: 'K8S-MASTER-01', ip: '10.1.1.10', type: 'Kubernetes Master', icon: '☸️', services: 'kube-api, etcd', status: 'Secure', encryption: 'mTLS + Certificates', isNew: false },
            { id: 'db-primary', name: 'POSTGRES-PRIMARY', ip: '10.2.1.100', type: 'Database', icon: '🗄️', services: 'PostgreSQL 14', status: 'Secure', encryption: 'TDE + SSL', isNew: false },
            { id: 'load-balancer', name: 'LB-GLOBAL-01', ip: '203.0.113.10', type: 'Load Balancer', icon: '⚖️', services: 'HTTPS, Health', status: 'Secure', encryption: 'TLS 1.3 + Hybrid', isNew: false },
            { id: 'firewall-dc1', name: 'FW-DC1-CORE', ip: '203.0.113.254', type: 'Enterprise Firewall', icon: '🛡️', services: 'DPI, IPS', status: 'Secure', encryption: 'Enterprise Security', isNew: false },
            { id: 'storage-cluster', name: 'STORAGE-CLUSTER-01', ip: '10.3.1.50', type: 'Storage', icon: '💾', services: 'iSCSI, NFS', status: 'Secure', encryption: 'Array + Network', isNew: false }
        ];
    }
}

// Update chat context for scale
function updateChatForScale(scale, config) {
    if (SentinelState.chatOpen) {
        const contextMessage = `NetworkMapper: Configured for ${config.chatContext}. Monitoring ${ipRanges.length} ${scale === 'individual' ? 'server' : 'ranges'} with ${getTotalDevices()} devices. Hybrid-resistant encryption active. Ready for ${scale} deployment.`;
        sentinelChat.addMessage(contextMessage, false, 'system');
    }
}

// Helper functions
function getTotalDevices() {
    return ipRanges.reduce((sum, range) => sum + range.devices, 0);
}

function getTotalServices() {
    return ipRanges.reduce((sum, range) => sum + range.services, 0);
}

function updateMetrics() {
    if (!currentScale) return;

    const totalRanges = ipRanges.length;
    const totalDevices = getTotalDevices();
    const totalServices = getTotalServices();

    // Update sub-agent metrics
    SentinelUtils.updateElementText('totalNetworks', totalRanges.toString());
    SentinelUtils.updateElementText('discoveredDevices', totalDevices.toLocaleString());
    SentinelUtils.updateElementText('openServices', totalServices.toString());

    // Update overview cards based on scale
    if (currentScale === 'individual') {
        SentinelUtils.updateElementText('serverServices', totalServices.toString());
    } else if (currentScale === 'business') {
        SentinelUtils.updateElementText('businessDevices', totalDevices.toString());
        SentinelUtils.updateElementText('businessServices', totalServices.toString());
        SentinelUtils.updateElementText('businessSites', totalRanges.toString());
    } else if (currentScale === 'enterprise') {
        SentinelUtils.updateElementText('enterpriseRanges', totalRanges.toString());
        SentinelUtils.updateElementText('enterpriseInfrastructure', totalDevices.toLocaleString());
        SentinelUtils.updateElementText('enterpriseServices', totalServices.toString());
    }

    // Update threat exposure
    const totalVulns = ipRanges.reduce((sum, range) => sum + range.vulnerabilities, 0);
    const rating = document.getElementById('exposureRating');
    
    if (rating) {
        if (totalVulns > 5) {
            rating.textContent = 'HIGH';
            rating.className = 'exposure-rating exposure-high';
        } else if (totalVulns > 0) {
            rating.textContent = 'MEDIUM';
            rating.className = 'exposure-rating exposure-medium';
        } else {
            rating.textContent = 'LOW';
            rating.className = 'exposure-rating exposure-low';
        }
    }
}

// Populate IP ranges grid
function populateIPRangesGrid() {
    const grid = document.getElementById('ipRangesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    ipRanges.forEach((range, index) => {
        const card = document.createElement('div');
        card.className = 'ip-range-card';
        
        let statusClass = 'status-secure';
        if (range.status === 'Migrating') statusClass = 'status-warning';
        if (range.vulnerabilities > 0) statusClass = 'status-vulnerable';
        
        card.innerHTML = `
            <div class="range-header">
                <div class="range-name">${range.name}</div>
                <div class="range-status ${statusClass}">${range.status}</div>
            </div>
            <div class="range-info">
                <div class="info-item">
                    <div class="info-label">IP Range</div>
                    <div class="info-value">${range.range}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Location</div>
                    <div class="info-value">${range.location}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Organization</div>
                    <div class="info-value">${range.organization}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Bandwidth</div>
                    <div class="info-value">${range.bandwidth}</div>
                </div>
            </div>
            <div class="range-metrics">
                <div class="range-metric">
                    <div class="range-metric-value">${range.devices}</div>
                    <div class="range-metric-label">Devices</div>
                </div>
                <div class="range-metric">
                    <div class="range-metric-value">${range.services}</div>
                    <div class="range-metric-label">Services</div>
                </div>
                <div class="range-metric">
                    <div class="range-metric-value">${range.vulnerabilities}</div>
                    <div class="range-metric-label">Vulnerabilities</div>
                </div>
            </div>
        `;
        
        card.onclick = () => showRangeDetails(range);
        grid.appendChild(card);
    });
}

// Populate device grid
function populateDeviceGrid() {
    const grid = document.getElementById('deviceGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Show appropriate number of devices based on scale
    const maxDisplay = currentScale === 'individual' ? 10 : currentScale === 'business' ? 15 : 20;
    const devicesToShow = internalDevices.slice(0, maxDisplay);
    
    devicesToShow.forEach((device, index) => {
        const card = document.createElement('div');
        card.className = `device-card ${device.isNew ? 'new-device' : ''}`;
        card.innerHTML = `
            <div class="device-header">
                <div class="device-icon">${device.icon}</div>
            </div>
            <div class="device-name">${device.name}</div>
            <div class="device-ip">${device.ip}</div>
            <div class="device-services">Services: ${device.services}</div>
            <div class="device-ai-status">AI Status: ${device.status}</div>
            <div class="device-encryption">
                <span>🔒</span>
                <span>Encryption: ${device.encryption}</span>
            </div>
        `;
        card.style.animationDelay = `${index * 0.1}s`;
        card.onclick = () => showDeviceDetails(device);
        grid.appendChild(card);
        
        if (device.isNew) {
            setTimeout(() => {
                device.isNew = false;
                card.classList.remove('new-device');
            }, 2000);
        }
    });
}

// Modal and interaction functions
function showAddRangeModal() {
    const modal = document.getElementById('addRangeModal');
    if (modal) modal.style.display = 'flex';
}

function closeAddRangeModal() {
    const modal = document.getElementById('addRangeModal');
    if (modal) modal.style.display = 'none';
}

function addIPRange() {
    const name = document.getElementById('rangeName').value.trim();
    const range = document.getElementById('ipRange').value.trim();
    const location = document.getElementById('location').value.trim();
    const organization = document.getElementById('organization').value.trim();
    
    if (!name || !range || !location || !organization) {
        alert('Please fill in all fields');
        return;
    }
    
    // Basic CIDR validation
    if (!SentinelUtils.validateCIDR(range)) {
        alert('Please enter a valid CIDR notation (e.g., 192.168.1.0/24)');
        return;
    }
    
    // Check scale limits
    const config = ScaleConfigs[currentScale];
    if (ipRanges.length >= config.maxRanges) {
        alert(`Maximum ${config.maxRanges} IP ranges allowed for ${currentScale} scale. Upgrade to enterprise for unlimited ranges.`);
        return;
    }
    
    const newRange = {
        id: `range-${Date.now()}`,
        name: name,
        range: range,
        location: location,
        organization: organization,
        status: 'Scanning',
        devices: Math.floor(Math.random() * (config.deviceRange[1] - config.deviceRange[0])) + config.deviceRange[0],
        services: Math.floor(Math.random() * (config.serviceRange[1] - config.serviceRange[0])) + config.serviceRange[0],
        vulnerabilities: Math.floor(Math.random() * 2),
        bandwidth: currentScale === 'individual' ? '100Mbps' : 
                 currentScale === 'business' ? (Math.random() * 2 + 0.5).toFixed(1) + 'Gbps' :
                 (Math.random() * 20 + 1).toFixed(1) + 'GB/s'
    };
    
    ipRanges.push(newRange);
    populateIPRangesGrid();
    updateMetrics();
    closeAddRangeModal();
    
    // Clear form
    document.getElementById('rangeName').value = '';
    document.getElementById('ipRange').value = '';
    document.getElementById('location').value = '';
    document.getElementById('organization').value = '';
    
    // Update add range button state for individual mode
    if (currentScale === 'individual') {
        const addRangeBtn = document.getElementById('addRangeBtn');
        if (addRangeBtn && ipRanges.length >= ScaleConfigs[currentScale].maxRanges) {
            addRangeBtn.disabled = true;
            addRangeBtn.title = 'Maximum ranges reached for single IP deployment';
        }
    }
    
    if (SentinelState.chatOpen) {
        setTimeout(() => {
            sentinelChat.addMessage(`NetworkMapper: New ${currentScale} range ${name} (${range}) added to monitoring. Initiating discovery scan across ${newRange.devices} estimated devices...`, false);
        }, 1000);
    }
}

// Rescan Infrastructure Functions
function showRescanModal() {
    const modal = document.getElementById('rescanModal');
    if (modal) modal.style.display = 'flex';
}

function closeRescanModal() {
    const modal = document.getElementById('rescanModal');
    if (modal) modal.style.display = 'none';
}

function confirmRescan() {
    closeRescanModal();
    
    // Show rescan progress in chat
    if (!SentinelState.chatOpen) {
        sentinelChat.toggle();
    }
    
    sentinelChat.addMessage('🔄 Infrastructure rescan initiated...', false, 'system');
    
    // Simulate rescan process with realistic steps
    setTimeout(() => {
        sentinelChat.addMessage('NetworkMapper: Stopping current discovery processes...', false, 'system');
    }, 500);
    
    setTimeout(() => {
        sentinelChat.addMessage('NetworkMapper: Clearing discovery cache and resetting configuration...', false, 'system');
    }, 1200);
    
    setTimeout(() => {
        sentinelChat.addMessage('NetworkMapper: Re-initializing adaptive detection engine...', false, 'system');
    }, 2000);
    
    setTimeout(() => {
        sentinelChat.addMessage('NetworkMapper: Discovery process reset complete. Please reconfigure your environment.', false, 'system');
        
        // Reset to initial state
        resetToInitialState();
    }, 3000);
}

function resetToInitialState() {
    // Clear saved scale preference to force re-selection
    localStorage.removeItem('sentinel_scale');
    
    // Reset global state
    currentScale = null;
    SentinelState.currentScale = null;
    ipRanges = [];
    internalDevices = [];
    deviceCounter = 1;
    
    // Hide all main sections
    SentinelUtils.hideElement('subAgentStatus');
    SentinelUtils.hideElement('ipRangeManager');
    SentinelUtils.hideElement('dashboardInteractive');
    SentinelUtils.hideElement('networkOverview');
    SentinelUtils.hideElement('scanningGrid');
    SentinelUtils.hideElement('deviceDiscovery');
    
    // Reset scale indicator
    const scaleIndicator = document.getElementById('scaleIndicator');
    const scaleIcon = document.getElementById('scaleIcon');
    const scaleText = document.getElementById('scaleText');
    
    if (scaleIndicator && scaleIcon && scaleText) {
        scaleIndicator.className = 'scale-indicator scale-individual';
        scaleIcon.textContent = '🔍';
        scaleText.textContent = 'DETECTING';
    }
    
    // Remove scale class from body
    document.body.className = '';
    
    // Clear scale option selections
    const scaleOptions = document.querySelectorAll('.scale-option');
    scaleOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Show environment detection
    SentinelUtils.showElement('environmentDetection');
    
    // Update detection title for rescan context
    const detectionTitle = document.querySelector('.detection-title');
    const detectionDescription = document.querySelector('.detection-description');
    
    if (detectionTitle) {
        detectionTitle.textContent = '🔄 Network Discovery Reset';
    }
    
    if (detectionDescription) {
        detectionDescription.textContent = 'AI Sentinel-X has reset the network discovery configuration. Please select your current infrastructure scale to restart adaptive monitoring and analysis.';
    }
    
    // Add final chat message
    setTimeout(() => {
        sentinelChat.addMessage('✅ Network discovery reset complete. Environment detection reinitialized. Please select your infrastructure scale to continue.', false, 'system');
    }, 500);
}

// Detail functions
function showRangeDetails(range) {
    if (!SentinelState.chatOpen) sentinelChat.toggle();
    setTimeout(() => {
        sentinelChat.addMessage(`NetworkMapper: Analyzing ${range.name} (${range.range}) in ${range.location}. ${range.devices} devices, ${range.services} services, ${range.vulnerabilities} vulnerabilities. Bandwidth: ${range.bandwidth}.`, false);
    }, 300);
}

function showDeviceDetails(device) {
    if (!SentinelState.chatOpen) sentinelChat.toggle();
    setTimeout(() => {
        sentinelChat.addMessage(`NetworkMapper: Device ${device.name} (${device.ip}) - ${device.type}. Services: ${device.services}. Status: ${device.status}. Encryption: ${device.encryption}.`, false);
    }, 300);
}

function showOverviewDetails(type) {
    if (!SentinelState.chatOpen) sentinelChat.toggle();
    setTimeout(() => {
        const messages = {
            serverIP: 'NetworkMapper: Server IP analysis - Single public address with hybrid-ready protection.',
            serverServices: 'NetworkMapper: Server services analysis - All services secured and optimized.',
            businessSites: 'NetworkMapper: Multi-site business deployment with site-to-site VPN.',
            enterpriseRanges: 'NetworkMapper: Enterprise multi-range deployment across data centers.'
        };
        sentinelChat.addMessage(messages[type] || 'NetworkMapper: Network component analysis complete.', false);
    }, 300);
}

function showServiceDetails(service) {
    if (!SentinelState.chatOpen) sentinelChat.toggle();
    setTimeout(() => {
        sentinelChat.addMessage(`NetworkMapper: Service ${service} analysis - Configuration optimized for ${currentScale} deployment.`, false);
    }, 300);
}

// Chat and interaction functions
function toggleScanning() {
    scanningActive = !scanningActive;
    const toggle = document.getElementById('scanToggle');
    
    if (toggle) {
        if (scanningActive) {
            toggle.textContent = 'Auto-Scan Active';
            toggle.className = 'scan-toggle';
        } else {
            toggle.textContent = 'Auto-Scan Paused';
            toggle.className = 'scan-toggle paused';
        }
    }
    
    if (SentinelState.chatOpen) {
        const status = scanningActive ? 'resumed' : 'paused';
        sentinelChat.addMessage(`NetworkMapper: ${currentScale} scanning ${status}. Discovery mode: ${scanningActive ? 'ACTIVE' : 'PAUSED'}.`, false, 'system');
    }
}

// Enhanced modal overlay handler
function closeModalOnOverlay(event) {
    if (event.target.classList.contains('modal-overlay')) {
        const modalId = event.target.id;
        if (modalId === 'addRangeModal') {
            closeAddRangeModal();
        } else if (modalId === 'rescanModal') {
            closeRescanModal();
        } else {
            SentinelEventHandlers.closeModal(modalId);
        }
    }
}

// Global function exports
window.selectScale = selectScale;
window.startAutoScan = startAutoScan;
window.acceptRecommendation = acceptRecommendation;
window.closeScanResultsModal = closeScanResultsModal;
window.requestConsultation = requestConsultation;
window.showAddRangeModal = showAddRangeModal;
window.closeAddRangeModal = closeAddRangeModal;
window.addIPRange = addIPRange;
window.showRescanModal = showRescanModal;
window.closeRescanModal = closeRescanModal;
window.confirmRescan = confirmRescan;
window.toggleScanning = toggleScanning;
window.showRangeDetails = showRangeDetails;
window.showDeviceDetails = showDeviceDetails;
window.showOverviewDetails = showOverviewDetails;
window.showServiceDetails = showServiceDetails;
window.closeModalOnOverlay = closeModalOnOverlay;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeEnvironmentDetection();
    
    // Auto-update metrics periodically
    setInterval(() => {
        if (currentScale) {
            updateMetrics();
        }
    }, 5000);
    
    // Simulate new device discovery based on scale
    setInterval(() => {
        if (currentScale && scanningActive && discoveryActive && Math.random() > 0.7) {
            const config = ScaleConfigs[currentScale];
            if (internalDevices.length < config.deviceRange[1] * 0.1) {
                // Could add logic for new device discovery here if needed
            }
        }
    }, 15000);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectScale,
        initializeEnvironmentDetection,
        resetToInitialState,
        updateMetrics,
        showAddRangeModal,
        addIPRange,
        confirmRescan
    };
}
