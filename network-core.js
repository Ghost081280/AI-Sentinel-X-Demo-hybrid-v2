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
        const envDetection = document.getElementById('environmentDetection');
        if (envDetection) {
            envDetection.style.display = 'block';
        }
    }
}

function startAutoScan() {
    console.log('Starting auto scan...');
    const autoScanBtn = document.getElementById('autoScanBtn');
    const scanProgress = document.getElementById('scanProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (!autoScanBtn || !scanProgress || !progressFill || !progressText) {
        console.error('Missing scan elements');
        return;
    }
    
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
    if (window.sentinelChat && SentinelState.chatOpen) {
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
    console.log('Showing scan results:', recommendation);
    const scanProgress = document.getElementById('scanProgress');
    const autoScanBtn = document.getElementById('autoScanBtn');
    
    // Hide progress, show results
    if (scanProgress) scanProgress.style.display = 'none';
    if (autoScanBtn) {
        autoScanBtn.disabled = false;
        autoScanBtn.innerHTML = `
            <span class="scan-icon">✅</span>
            <span class="scan-text">Scan Complete</span>
            <span class="scan-subtitle">Click to rescan network</span>
        `;
    }
    
    // Create results modal or update interface
    showScanResultsModal(recommendation);
    
    // Highlight recommended solution
    highlightRecommendedSolution(recommendation.type);
    
    // Update chat with results
    if (window.sentinelChat && SentinelState.chatOpen) {
        sentinelChat.addMessage(`🎯 NetworkMapper: Scan complete! Detected ${recommendation.details.infrastructure}. ${recommendation.details.recommendation}. Confidence: ${recommendation.confidence}%`, false, 'system');
    }
}

function showScanResultsModal(recommendation) {
    // Create a results modal with proper sizing
    const modal = document.createElement('div');
    modal.className = 'modal-overlay scan-results-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal scan-results-modal-content">
            <div class="modal-header">
                <h2 class="modal-title">🎯 Network Discovery Complete</h2>
            </div>
            <div class="modal-content">
                <div class="scan-results-summary">
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="summary-label">Infrastructure Type</span>
                            <span class="summary-value">${recommendation.details.infrastructure}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Detection Confidence</span>
                            <span class="summary-value">${recommendation.confidence}%</span>
                        </div>
                    </div>
                    
                    <div class="recommendation-banner">
                        <div class="banner-icon">🚀</div>
                        <div class="banner-content">
                            <h3>Recommended Configuration</h3>
                            <p>${recommendation.details.recommendation}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="modal-btn modal-btn-primary" onclick="acceptRecommendation('${recommendation.type}')">
                    Apply Configuration
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="closeScanResultsModal()">
                    Choose Manually
                </button>
            </div>
        </div>
    `;
    
    // Add improved modal styles
    if (!document.querySelector('#scan-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'scan-modal-styles';
        style.textContent = `
            .scan-results-modal-content {
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .scan-results-summary {
                margin-bottom: 20px;
            }
            
            .summary-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: rgba(0, 255, 136, 0.05);
                border: 1px solid rgba(0, 255, 136, 0.2);
                border-radius: 8px;
            }
            
            .summary-label {
                font-size: 14px;
                color: var(--text-secondary);
                font-weight: 500;
            }
            
            .summary-value {
                font-size: 14px;
                font-weight: bold;
                color: var(--primary);
            }
            
            .recommendation-banner {
                background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 255, 0.05));
                border: 1px solid var(--primary);
                border-radius: 12px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .banner-icon {
                font-size: 32px;
                flex-shrink: 0;
            }
            
            .banner-content h3 {
                color: var(--primary);
                margin-bottom: 8px;
                font-size: 16px;
            }
            
            .banner-content p {
                color: var(--text-secondary);
                font-size: 14px;
                margin: 0;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeScanResultsModal();
        }
    });
}

function closeScanResultsModal() {
    const modal = document.querySelector('.scan-results-modal');
    if (modal) {
        modal.remove();
    }
}

function acceptRecommendation(recommendedType) {
    console.log('Accepting recommendation:', recommendedType);
    closeScanResultsModal();
    selectScale(recommendedType, true);
    
    // Show configuration message
    if (window.sentinelChat && SentinelState.chatOpen) {
        sentinelChat.addMessage(`✅ NetworkMapper: Applying ${ScaleConfigs[recommendedType].text} configuration. Your license will be configured for optimal monitoring of your infrastructure.`, false, 'system');
    }
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
    
    // Add CSS for recommended styling if not already added
    if (!document.querySelector('#recommended-styles')) {
        const style = document.createElement('style');
        style.id = 'recommended-styles';
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
    console.log('Selecting scale:', scale);
    if (!ScaleConfigs[scale]) return;

    currentScale = scale;
    if (window.SentinelState) {
        SentinelState.currentScale = scale;
    }
    const config = ScaleConfigs[scale];

    // Hide environment detection
    const envDetection = document.getElementById('environmentDetection');
    if (envDetection) {
        envDetection.style.display = 'none';
    }

    // Update scale indicator
    updateScaleIndicator(config);

    // Update body class for CSS targeting
    document.body.className = `${scale}-mode`;

    // Configure interface based on scale
    configureInterfaceForScale(scale, config);

    // Initialize data for scale
    initializeDataForScale(scale, config);

    // Save preference
    if (userSelected) {
        localStorage.setItem('sentinel_scale', scale);
    }

    // Update chat context
    if (window.sentinelChat && SentinelState.chatOpen && userSelected) {
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
    const sections = ['subAgentStatus', 'dashboardInteractive', 'networkOverview', 'ipRangeManager'];
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.style.display = sectionId === 'scanningGrid' ? 'grid' : 
                                   sectionId === 'deviceDiscovery' ? 'block' : 
                                   'flex';
        }
    });

    // Update sub-agent description
    const subAgentDesc = document.getElementById('subAgentDescription');
    if (subAgentDesc) {
        subAgentDesc.textContent = config.description;
    }

    // Update dashboard title
    const titles = {
        individual: 'Single IP Discovery',
        business: 'Multi-Site Network Discovery', 
        enterprise: 'Enterprise Network Discovery'
    };
    
    const interactiveTitle = document.getElementById('interactiveTitle');
    if (interactiveTitle) {
        interactiveTitle.textContent = titles[scale];
    }

    const scanDetails = document.getElementById('scanDetails');
    if (scanDetails) {
        scanDetails.textContent = 'Continuous Monitoring Active';
    }

    // Update dashboard description
    const descriptions = {
        individual: '🤖 <strong>Server monitoring active</strong> • Hybrid-resistant encryption • Automatic threat detection',
        business: '🤖 <strong>Multi-site autonomous scanning</strong> • Business-grade encryption • Cross-location monitoring',
        enterprise: '🤖 <strong>Enterprise autonomous scanning</strong> • Cross-DC correlation • Full hybrid-resistant infrastructure'
    };
    
    const dashboardDesc = document.getElementById('dashboardDescription');
    if (dashboardDesc) {
        dashboardDesc.innerHTML = descriptions[scale];
    }

    // Update range manager title
    const ipRangeTitle = document.getElementById('ipRangeTitle');
    if (ipRangeTitle) {
        const rangeTitles = {
            individual: 'Server Range Management',
            business: 'Business Network Ranges',
            enterprise: 'Enterprise IP Range Management'
        };
        ipRangeTitle.textContent = rangeTitles[scale];
    }

    // Update add range button
    const addRangeBtn = document.getElementById('addRangeBtn');
    if (addRangeBtn) {
        addRangeBtn.textContent = scale === 'individual' ? 'Add Server Range' : 'Add IP Range';
    }

    // Update metrics label
    const networksLabel = document.getElementById('networksLabel');
    if (networksLabel) {
        const labels = {
            individual: 'Server',
            business: 'Locations', 
            enterprise: 'IP Ranges'
        };
        networksLabel.textContent = labels[scale];
    }
}

// Initialize data structures for each scale
function initializeDataForScale(scale, config) {
    // Reset data
    ipRanges = [];
    internalDevices = [];
    deviceCounter = 1;

    // Generate appropriate IP ranges based on scale
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
            }
        ];
        deviceCounter = 2848;
    }

    // Update metrics display
    updateMetrics();
    
    // Populate IP ranges grid
    populateIPRangesGrid();
}

function updateMetrics() {
    if (!currentScale) return;

    const totalRanges = ipRanges.length;
    const totalDevices = ipRanges.reduce((sum, range) => sum + range.devices, 0);
    const totalServices = ipRanges.reduce((sum, range) => sum + range.services, 0);

    // Update sub-agent metrics
    const totalNetworks = document.getElementById('totalNetworks');
    const discoveredDevices = document.getElementById('discoveredDevices');
    const openServices = document.getElementById('openServices');

    if (totalNetworks) totalNetworks.textContent = totalRanges.toString();
    if (discoveredDevices) discoveredDevices.textContent = totalDevices.toLocaleString();
    if (openServices) openServices.textContent = totalServices.toString();
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
    const sections = ['subAgentStatus', 'ipRangeManager', 'dashboardInteractive', 'networkOverview', 'scanningGrid', 'deviceDiscovery'];
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.style.display = 'none';
        }
    });
    
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
    const envDetection = document.getElementById('environmentDetection');
    if (envDetection) {
        envDetection.style.display = 'block';
    }
    
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

// Chat handlers
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('aiChatInput');
    if (input && window.sentinelChat) {
        const message = input.value.trim();
        if (message) {
            sentinelChat.sendMessage(message);
            input.value = '';
        }
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout? The AI agent will continue protecting your network autonomously.')) {
        localStorage.removeItem('sentinel_auth');
        localStorage.removeItem('sentinel_scale');
        window.location.href = 'index.html';
    }
}

function showAgentShutdownModal() {
    console.log('Show agent shutdown modal');
}

function toggleChat() {
    if (window.sentinelChat) {
        sentinelChat.toggle();
    }
}

// Global function exports
window.startAutoScan = startAutoScan;
window.selectScale = selectScale;
window.acceptRecommendation = acceptRecommendation;
window.closeScanResultsModal = closeScanResultsModal;
window.requestConsultation = requestConsultation;
window.showAddRangeModal = showAddRangeModal;
window.closeAddRangeModal = closeAddRangeModal;
window.addIPRange = addIPRange;
window.showRescanModal = showRescanModal;
window.closeRescanModal = closeRescanModal;
window.confirmRescan = confirmRescan;
window.showRangeDetails = showRangeDetails;
window.showDeviceDetails = showDeviceDetails;
window.showOverviewDetails = showOverviewDetails;
window.showServiceDetails = showServiceDetails;
window.closeModalOnOverlay = closeModalOnOverlay;
window.handleChatKeyPress = handleChatKeyPress;
window.sendChatMessage = sendChatMessage;
window.handleLogout = handleLogout;
window.showAgentShutdownModal = showAgentShutdownModal;
window.toggleChat = toggleChat;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Network core module loaded');
    initializeEnvironmentDetection();
    
    // Auto-update metrics periodically
    setInterval(() => {
        if (currentScale) {
            updateMetrics();
        }
    }, 5000);
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
