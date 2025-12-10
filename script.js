// --- GLOBAL STATE ---
let diagnosisResult = null;
let selectedFile = null;
let currentPage = 'info';
let chatHistory = [];
let wizardStep = 1; // 1: Symptoms, 2: Severity, 3: Questions, 4: Results
let diagnosisData = {
    symptoms: [],
    severity: 5,
    additional: { fever: false, fatigue: false, pain: false }
};

// --- DOM ELEMENTS ---
const contentDiv = document.getElementById('content');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const modal = document.getElementById('modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const chatContainer = document.getElementById('ai-chat-container');
const chatBubble = document.getElementById('chat-bubble');

// --- CONSTANTS / PALETTE ---
const COLORS = {
    primary: '#4A90E2', 
    secondary: '#36C2A3', 
    accent: '#FFC48F'
};

// --- WIZARD DATA ---
const WIZARD_QUESTIONS = [
    { key: 'fever', text: 'Have you experienced a fever above 100.4°F (38°C) in the last 24 hours?' },
    { key: 'fatigue', text: 'Do you feel unusual or persistent fatigue/weakness?' },
    { key: 'pain', text: 'Are you experiencing any specific localized pain (e.g., chest, joints)?' },
];

const SUGGESTED_SYMPTOMS = ['Cough', 'Dizziness', 'Shortness of Breath', 'Headache', 'Nausea', 'Chest Pain'];


// --- UTILITY FUNCTIONS ---

/**
 * Simulates a custom alert box instead of using window.alert().
 */
function showModal(title, message, type = 'error') {
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modalTitle.style.color = type === 'success' ? COLORS.secondary : 'red';
    document.getElementById('modal-content').querySelector('button').style.backgroundColor = COLORS.secondary;

    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('modal-content').classList.remove('scale-95', 'opacity-0');
    }, 50);
}

function closeModal() {
    document.getElementById('modal-content').classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

/**
 * Toggles the visibility of the AI Chat Container.
 */
function toggleChat(show) {
    if (show === undefined) {
        show = chatContainer.classList.contains('translate-x-full');
    }

    if (show) {
        chatContainer.classList.remove('translate-x-full');
        chatBubble.classList.add('hidden');
        renderChatUI();
    } else {
        chatContainer.classList.add('translate-x-full');
        chatBubble.classList.remove('hidden');
    }
}

/**
 * Handles navigation, updates active links, and renders the correct page.
 * Retired "about" and "contact" pages are removed.
 * @param {string} page - The page to navigate to ('info', 'home', 'library', etc.).
 */
function navigateTo(page) {
    currentPage = page;
    
    // 1. Update desktop navigation bar active state
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // 2. Update mobile navigation bar active state
    mobileNavLinks.forEach(link => {
        if (link.dataset.page) { // Exclude chat link
            link.classList.toggle('active', link.dataset.page === page);
        }
    });
    
    // 3. Render the correct page content
    if (page === 'info') {
        renderInfoPage();
    } else if (page === 'home') {
        // Reset wizard state on entering the diagnosis page
        wizardStep = 1;
        diagnosisData = { symptoms: [], severity: 5, additional: { fever: false, fatigue: false, pain: false } };
        renderDiagnosisWizard();
    } else if (page === 'library') {
        renderHealthLibrary();
    } else if (page === 'results') {
        renderResultsPage();
    } else {
        // Handle pages retired from the navigation (e.g., 'profile' from mobile)
        contentDiv.className = 'py-20';
        contentDiv.innerHTML = `<div class="main-card p-10 rounded-xl text-center shadow-xl"><h2 class="text-3xl font-bold text-gray-800">Page Not Found</h2><p class="mt-4 text-gray-600">The requested page is not part of the current navigation structure.</p><button class="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200" onclick="navigateTo('info')">Back Home</button></div>`;
    }
}


// --- PAGE RENDERING ---

/**
 * Renders the Home/Info Page (Attractive, Innovative Design).
 */
function renderInfoPage() {
    contentDiv.className = 'grid grid-cols-1 gap-12';
    contentDiv.innerHTML = `
        <!-- 1. HERO SECTION -->
        <div class="main-card p-4 md:p-12 rounded-3xl mx-auto shadow-2xl overflow-hidden relative">
            
            <div class="absolute inset-0 bg-gradient-to-br from-[#4A90E2] to-indigo-400 opacity-10 rounded-3xl z-0"></div>
            
            <div class="text-center pt-8 pb-10 relative z-10">
                <h2 class="text-5xl md:text-7xl font-extrabold mb-4 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-indigo-600">
                    Precision Health. Transparent AI.
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    A revolutionary assistant combining Deep Learning with Explainable AI for rapid, trustworthy diagnostics.
                </p>
                <button class="mt-8 bg-[#36C2A3] hover:bg-emerald-600 text-white font-bold text-xl py-4 px-12 rounded-full shadow-xl transition duration-300 transform hover:scale-105 hover:ring-4 hover:ring-[#36C2A3]/50" onclick="navigateTo('home')">
                    Start Diagnosis Now <i class="ph ph-arrow-right ml-2"></i>
                </button>
            </div>
            
            <!-- Doctor/AI Interface Illustration Placeholder (More prominent) -->
            <div class="w-full h-64 bg-gray-200 rounded-xl mx-auto mt-6 mb-4 flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-400">
                 [Image of a Doctor and an AI interface illustration]
            </div>
        </div>

        <!-- 2. CORE FEATURES SECTION (Icon Grid with Animation) -->
        <div class="max-w-6xl mx-auto">
            <h3 class="text-3xl font-bold text-center mb-10 text-gray-800">Our Core Innovations</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${renderCoreFeatureCard('Transparent XAI', 'ph-magnifying-glass-plus', 'Every result comes with a visual explanation (Grad-CAM/SHAP) so you know *why* the AI decided.', COLORS.primary)}
                ${renderCoreFeatureCard('Multi-Modal Analysis', 'ph-chart-line', 'Analyzes X-ray, CT, MRI (ResNet-50) and ECG data (XGBoost) for comprehensive insights.', COLORS.secondary)}
                ${renderCoreFeatureCard('Patient Empowerment', 'ph-file-text', 'Clear, simplified reports and guided care tips for better patient understanding and outcomes.', COLORS.accent)}
            </div>
        </div>
        
        <!-- 3. TRUST & RELIABILITY BAR -->
        <div class="bg-gray-100 py-10 rounded-2xl max-w-6xl mx-auto">
            <h3 class="text-3xl font-bold text-center mb-8 text-gray-800">Commitment to Clinical Trust</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 text-center">
                ${renderTrustSignal('Certified Data', 'ph-scroll', 'Supported by verified medical datasets.', '#00A86B')}
                ${renderTrustSignal('Physician Vetting', 'ph-user-md', 'Models refined based on clinical feedback.', COLORS.primary)}
                ${renderTrustSignal('Data Privacy', 'ph-lock-simple', 'HIPAA/GDPR compliant principles applied.', '#F08080')}
                ${renderTrustSignal('XAI Integration', 'ph-eye', 'Built-in model transparency.', COLORS.secondary)}
            </div>
        </div>
        
        <!-- 4. FINAL CTA -->
        <div class="bg-gradient-to-r from-[#4A90E2] to-indigo-500 p-8 md:p-12 rounded-2xl text-center text-white shadow-2xl mb-12">
            <h3 class="text-4xl font-bold mb-3">Begin Your Diagnostic Journey</h3>
            <p class="text-lg mb-6 opacity-90">Start the simple, step-by-step symptom check now and get instant AI analysis.</p>
            <button class="bg-white text-[#4A90E2] hover:bg-gray-100 font-bold text-xl py-4 px-10 rounded-full shadow-2xl transition duration-300 transform hover:scale-[1.05]" onclick="navigateTo('home')">
                Start Diagnosis
            </button>
        </div>
    `;
}

/**
 * Renders an attractive core feature card.
 */
function renderCoreFeatureCard(title, iconClass, description, color) {
    return `
        <div class="p-8 main-card rounded-xl shadow-lg transition-all duration-300 transform hover:translate-y-[-8px] hover:shadow-2xl cursor-default border-b-4 border-[${color}]">
            <i class="ph ${iconClass} text-5xl mb-4 p-3 rounded-xl block" style="color: white; background-color: ${color}; box-shadow: 0 4px 10px ${color}80;"></i>
            <h4 class="font-bold text-xl text-gray-800 mb-2">${title}</h4>
            <p class="text-sm text-gray-600">${description}</p>
        </div>
    `;
}

/**
 * Renders a small trust signal card.
 */
function renderTrustSignal(title, iconClass, description, color) {
    return `
        <div class="flex flex-col items-center p-4">
            <i class="ph ${iconClass} text-3xl mb-2" style="color: ${color};"></i>
            <h5 class="font-semibold text-gray-800 text-sm">${title}</h5>
            <p class="text-xs text-gray-500 mt-1">${description}</p>
        </div>
    `;
}

/**
 * Renders the Health Library Page.
 */
function renderHealthLibrary() {
    contentDiv.className = 'py-4';
    contentDiv.innerHTML = `
        <div class="main-card p-10 rounded-xl shadow-2xl">
            <h2 class="text-4xl font-bold mb-6 text-[#36C2A3]">Health Library: Core Medical Topics</h2>
            <p class="mb-8 text-gray-600">Browse scientifically reviewed content and information about how our AI models (ResNet-50, XGBoost) use data.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${renderLibraryTopic('Cardiology', 'ph-heart', 'Focus on ECG analysis via XGBoost and heart conditions.', COLORS.primary)}
                ${renderLibraryTopic('Pulmonology', 'ph-lungs', 'Deep learning applications (ResNet-50) for X-ray analysis of lung diseases.', COLORS.secondary)}
                ${renderLibraryTopic('Oncology', 'ph-brain', 'Tumor detection in CT/MRI scans.', '#FF6600')}
                ${renderLibraryTopic('Explainable AI (XAI)', 'ph-lightbulb', 'Understanding Grad-CAM and SHAP in diagnostic transparency.', COLORS.accent)}
            </div>
            <div class="mt-8 text-center">
                <span class="text-sm italic text-gray-500">All content adheres to "Reviewed by Experts" standards.</span>
            </div>
        </div>
    `;
}

function renderLibraryTopic(title, iconClass, fact, color) {
    return `
        <div class="main-card p-6 rounded-xl border border-gray-200 hover:shadow-lg transition duration-300 flex items-start space-x-4">
            <i class="ph ${iconClass} text-4xl flex-shrink-0" style="color: ${color};"></i>
            <div>
                <h4 class="font-bold text-xl text-gray-800">${title}</h4>
                <p class="text-sm text-gray-600">${fact}</p>
                <button class="text-sm text-indigo-500 font-semibold mt-2" onclick="showModal('${title}','This modal would display a full article on ${title}, reinforcing trust and medical accuracy.')">View Details</button>
            </div>
        </div>
    `;
}

// --- DIAGNOSIS WIZARD (Steps 1, 2, 3) ---

function getWizardProgressHTML() {
    const steps = [
        { num: 1, name: 'Symptoms' },
        { num: 2, name: 'Severity Check' },
        { num: 3, name: 'Additional Questions' },
        { num: 4, name: 'Diagnosis Results' }
    ];

    return `
        <div class="flex justify-between items-center mb-8 border-b pb-4">
            ${steps.map(step => `
                <div class="flex flex-col items-center flex-grow">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-all duration-500 
                        ${step.num === wizardStep ? 'bg-[#4A90E2] scale-110' : (step.num < wizardStep ? 'bg-[#36C2A3]' : 'bg-gray-400')}">
                        ${step.num}
                    </div>
                    <span class="text-xs mt-2 font-semibold text-center ${step.num <= wizardStep ? 'text-gray-800' : 'text-gray-500'}">${step.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderDiagnosisWizard() {
    contentDiv.className = 'py-4';
    const diagnosisCardHTML = `
        <div class="main-card p-6 md:p-10 rounded-xl shadow-2xl max-w-3xl mx-auto">
            ${getWizardProgressHTML()}
            <h2 class="text-2xl font-bold mb-6 text-gray-800">${getWizardTitle()}</h2>
            <div id="wizard-content" class="min-h-[300px]">
                ${getWizardStepContent()}
            </div>
            <div class="flex justify-between mt-8 pt-4 border-t">
                <button id="wizard-back-btn" class="bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg transition duration-200" onclick="nextWizardStep(-1)" ${wizardStep === 1 ? 'disabled' : ''}>
                    <i class="ph ph-arrow-left mr-2"></i> Back
                </button>
                <button id="wizard-next-btn" class="bg-[#36C2A3] hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200" onclick="nextWizardStep(1)">
                    ${wizardStep === 3 ? 'Get Diagnosis <i class="ph ph-rocket-launch ml-2"></i>' : 'Next Step <i class="ph ph-arrow-right ml-2"></i>'}
                </button>
            </div>
        </div>
    `;
    contentDiv.innerHTML = diagnosisCardHTML;
    attachWizardListeners();
}

function getWizardTitle() {
    switch(wizardStep) {
        case 1: return "Step 1: Primary Symptoms";
        case 2: return "Step 2: Check Severity (1-10)";
        case 3: return "Step 3: Confirm Additional Details";
        default: return "Diagnosis Wizard";
    }
}

function getWizardStepContent() {
    switch(wizardStep) {
        case 1: 
            // Step 1: Symptoms (Multi-select pills)
            return `
                <p class="mb-6 text-gray-600">Select all symptoms you are currently experiencing.</p>
                <div class="flex flex-wrap gap-3">
                    ${SUGGESTED_SYMPTOMS.map(s => 
                        `<span class="pill-chip ${diagnosisData.symptoms.includes(s) ? 'selected' : ''}" 
                              onclick="toggleSymptom('${s}')">${s}</span>`
                    ).join('')}
                </div>
                <div class="mt-8 p-4 bg-indigo-50 border-l-4 border-[#4A90E2] rounded-lg">
                    <i class="ph ph-info text-[#4A90E2] mr-2"></i>
                    <span class="text-sm text-gray-700 font-semibold">Medical Reliability Indicator:</span> Focus on the primary discomforts first.
                </div>
            `;
        case 2:
            // Step 2: Severity Check (Slider)
            const severity = diagnosisData.severity;
            return `
                <p class="mb-6 text-gray-600">On a scale of 1 to 10, how severe is your primary discomfort?</p>
                <div class="p-4 bg-gray-100 rounded-xl">
                    <input type="range" id="severity-slider" min="1" max="10" value="${severity}" class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-lg">
                    <div class="flex justify-between text-sm mt-2 font-medium">
                        <span>1 (Mild)</span>
                        <span>${severity} <span id="severity-display" class="font-bold text-[#4A90E2]">/ 10</span></span>
                        <span>10 (Severe)</span>
                    </div>
                </div>
                <div class="mt-8 p-4 bg-emerald-50 border-l-4 border-[#36C2A3] rounded-lg">
                    <i class="ph ph-medal text-[#36C2A3] mr-2"></i>
                    <span class="text-sm text-gray-700 font-semibold">Supported by Certified Medical Data:</span> Severity is key in differentiating minor ailments from serious conditions.
                </div>
            `;
        case 3:
            // Step 3: Additional Questions (Yes/No chips)
            return `
                <p class="mb-6 text-gray-600">Answer these quick questions to refine the AI's understanding.</p>
                <div class="space-y-4">
                    ${WIZARD_QUESTIONS.map(q => `
                        <div class="main-card p-4 rounded-lg shadow-sm flex justify-between items-center">
                            <span class="text-gray-700 font-medium">${q.text}</span>
                            <div class="flex space-x-2">
                                <button class="px-4 py-2 rounded-full font-semibold transition duration-150 ${diagnosisData.additional[q.key] === true ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}" 
                                        onclick="setAdditionalAnswer('${q.key}', true)">Yes</button>
                                <button class="px-4 py-2 rounded-full font-semibold transition duration-150 ${diagnosisData.additional[q.key] === false ? 'bg-[#36C2A3] text-white' : 'bg-gray-200 text-gray-700'}" 
                                        onclick="setAdditionalAnswer('${q.key}', false)">No</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        default: return "";
    }
}

function attachWizardListeners() {
    if (wizardStep === 2) {
        const slider = document.getElementById('severity-slider');
        const display = document.getElementById('severity-display');
        slider.addEventListener('input', (e) => {
            diagnosisData.severity = parseInt(e.target.value);
            display.textContent = ` / 10`;
            slider.parentElement.querySelector('span:nth-child(2)').innerHTML = `${e.target.value} <span id="severity-display" class="font-bold text-[#4A90E2]">/ 10</span>`;
        });
    }
}

function toggleSymptom(symptom) {
    const index = diagnosisData.symptoms.indexOf(symptom);
    if (index > -1) {
        diagnosisData.symptoms.splice(index, 1);
    } else {
        diagnosisData.symptoms.push(symptom);
    }
    renderDiagnosisWizard(); // Re-render to update chips
}

function setAdditionalAnswer(key, value) {
    diagnosisData.additional[key] = value;
    renderDiagnosisWizard(); // Re-render to update chips
}

function nextWizardStep(direction) {
    if (direction > 0) {
        // Validation before moving forward
        if (wizardStep === 1 && diagnosisData.symptoms.length === 0) {
            showModal('Missing Input', 'Please select at least one primary symptom before proceeding.', 'error');
            return;
        }
        if (wizardStep === 3) {
            // Final step before diagnosis
            runDiagnosisSimulation();
            return;
        }
    }

    // Move step
    wizardStep = Math.min(4, Math.max(1, wizardStep + direction));
    renderDiagnosisWizard();
}

function runDiagnosisSimulation() {
    // 1. Simulate ML model based on data
    const severityFactor = diagnosisData.severity / 10;
    const additionalFactor = Object.values(diagnosisData.additional).filter(v => v).length;

    // Simulate confidence based on input (Higher severity/more symptoms = more likely to be positive)
    let baseConfidence = 0.75;
    if (severityFactor > 0.7 && diagnosisData.symptoms.length >= 2) {
        baseConfidence = 0.90; // High suspicion
    }

    const confidence = (Math.random() * (0.05) + baseConfidence) * 100;
    const isPositive = confidence > 82; // Threshold

    const primarySymptom = diagnosisData.symptoms[0] || 'Unspecified Ailment';

    diagnosisResult = {
        timestamp: new Date().toLocaleTimeString(),
        patientId: 'P' + Math.floor(Math.random() * 9000 + 1000),
        dataType: 'Symptom Input',
        diagnosis: isPositive ? `${primarySymptom} Syndrome/Infection` : `Common Cold/Viral Infection`,
        confidence: confidence.toFixed(1) + '%',
        explanation: `The AI weighted the high severity score (${diagnosisData.severity}/10) and the presence of ${diagnosisData.symptoms.length} symptoms heavily. The XGBoost component identified a high correlation with [Condition Details].`,
        isPositive: isPositive,
        // Detailed data for display
        primarySymptom: primarySymptom
    };

    // 2. Navigate to results page
    navigateTo('results');
}

// --- RESULTS PAGE ---

function renderResultsPage() {
    contentDiv.className = 'py-4';
    if (!diagnosisResult) {
        // Safety check if user jumps directly
        contentDiv.innerHTML = `<div class="main-card p-10 rounded-xl text-center shadow-xl"><h2 class="text-3xl font-bold text-gray-800">Please start a diagnosis first.</h2></div>`;
        return;
    }

    const isHighRisk = parseFloat(diagnosisResult.confidence) > 85;

    contentDiv.innerHTML = `
        <div class="main-card p-6 md:p-10 rounded-xl shadow-2xl max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">Diagnosis Results</h2>

            <!-- Primary Diagnosis Card -->
            <div class="p-6 rounded-xl mb-8 ${isHighRisk ? 'bg-red-50 border-l-8 border-red-500' : 'bg-emerald-50 border-l-8 border-[#36C2A3]'} shadow-md">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-2xl font-bold ${isHighRisk ? 'text-red-700' : 'text-emerald-700'} mb-1">
                            ${diagnosisResult.diagnosis}
                        </h3>
                        <p class="text-sm text-gray-600">Based on ${diagnosisResult.primarySymptom} and additional input.</p>
                    </div>
                    <i class="ph ph-heartbeat text-5xl opacity-40 ${isHighRisk ? 'text-red-500' : 'text-[#36C2A3]'}"></i>
                </div>
                
                <div class="mt-4 p-3 bg-white rounded-lg border flex items-center justify-between">
                    <span class="text-lg font-bold text-gray-800">Confidence Level:</span>
                    <span class="text-xl font-extrabold ${isHighRisk ? 'text-red-600' : 'text-[#36C2A3]'}">
                        ${diagnosisResult.confidence} match
                    </span>
                </div>

                <!-- Consultation Recommended Badge -->
                ${isHighRisk ? `
                    <div class="mt-4 p-3 bg-red-100 rounded-lg flex items-center space-x-2">
                        <i class="ph ph-user-md text-red-700 text-xl"></i>
                        <span class="font-semibold text-red-700">Doctor Icon: Immediate professional consultation highly recommended.</span>
                    </div>
                ` : `
                    <div class="mt-4 p-3 bg-indigo-100 rounded-lg flex items-center space-x-2">
                        <i class="ph ph-check-circle text-[#4A90E2] text-xl"></i>
                        <span class="font-semibold text-[#4A90E2]">Initial check complete. Use Care Tips or consult AI Assistant.</span>
                    </div>
                `}
            </div>
            
            <!-- Secondary Possibilities (Accordion) -->
            <h3 class="text-xl font-bold mb-3 text-gray-800">Alternative Possibilities</h3>
            <div id="accordion-container" class="space-y-3">
                ${renderSecondaryPossibility('Possibility A: Flu-like Illness', 'Common flu can mimic initial symptoms. Check for body aches and congestion.', ['Body Aches', 'High Fever'])}
                ${renderSecondaryPossibility('Possibility B: Musculoskeletal Strain', 'If pain is localized, it might be due to a muscle or joint strain.', ['Localized Pain', 'Recent Activity'])}
            </div>

            <div class="mt-8 p-4 bg-gray-100 border-l-4 border-gray-300 rounded-lg">
                <h4 class="font-bold text-gray-700 mb-2">AI Explanation (XAI Insight)</h4>
                <p class="text-sm text-gray-600">${diagnosisResult.explanation}</p>
                <a href="#" class="text-sm text-indigo-500 font-semibold mt-2 block" onclick="showModal('XAI Deep Dive','The AI uses algorithms like XGBoost and ResNet-50. XGBoost analyzes structured symptom data by building a series of decision trees to correct errors iteratively, providing high accuracy on discrete features.')">How our AI works <i class="ph ph-link-simple ml-1"></i></a>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <button class="action-btn bg-yellow-500 hover:bg-yellow-600" onclick="showModal('Care Tips','Stay hydrated, rest, and monitor temperature. Consult a doctor if symptoms worsen.')">
                    <i class="ph ph-first-aid-kit-fill"></i> Get Care Tips
                </button>
                <button class="action-btn bg-[#4A90E2] hover:bg-blue-600" onclick="toggleChat(true)">
                    <i class="ph ph-chats-circle-fill"></i> Talk to AI Assistant
                </button>
                <button class="action-btn bg-indigo-500 hover:bg-indigo-600" onclick="showModal('Find Doctor','Feature not active: This would integrate with a geo-location service to find nearby physicians/hospitals.')">
                    <i class="ph ph-map-pin-fill"></i> Find Doctor
                </button>
                <button class="action-btn bg-gray-700 hover:bg-gray-800" onclick="navigateTo('report')">
                    <i class="ph ph-download-simple-fill"></i> Download Report
                </button>
            </div>
        </div>
    `;

    // Attach click listeners for accordion (simplified)
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.classList.toggle('hidden');
            this.querySelector('i').classList.toggle('ph-caret-down');
            this.querySelector('i').classList.toggle('ph-caret-up');
        });
    });
}

function renderSecondaryPossibility(title, fact, redFlags) {
    return `
        <div class="main-card rounded-lg border overflow-hidden">
            <div class="accordion-header p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                <span class="font-semibold text-gray-800">${title}</span>
                <i class="ph ph-caret-down text-xl text-gray-500 transition-transform duration-300"></i>
            </div>
            <div class="accordion-content p-4 hidden">
                <p class="text-sm text-gray-600 mb-3">**Short Medical Fact:** ${fact}</p>
                <div class="text-xs font-semibold text-red-600">
                    Red Flags: ${redFlags.join(', ')}
                </div>
            </div>
        </div>
    `;
}

// --- REPORT PAGE (Only a simple placeholder for now) ---

function renderPatientReport() {
    contentDiv.className = 'py-4';
    
    let reportContent;
    if (diagnosisResult) {
        const isPositiveText = diagnosisResult.isPositive ? 
            '<span class="text-red-600 font-bold">Positive: Disease Detected.</span>' : 
            '<span class="text-emerald-600 font-bold">Negative: No Disease Detected.</span>';
        
        reportContent = `
            <div class="p-8 main-card rounded-xl max-w-4xl mx-auto shadow-2xl">
                <div class="flex justify-between items-center border-b-4 border-indigo-500 pb-4 mb-8">
                    <h2 class="text-3xl font-extrabold text-gray-900">Patient Diagnostic Summary</h2>
                    <span class="text-sm text-gray-500">Generated: ${new Date().toLocaleDateString()}</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg mb-8 p-4 bg-gray-50 rounded-lg">
                    <p><strong>Patient ID:</strong> <span class="text-indigo-700">${diagnosisResult.patientId}</span></p>
                    <p><strong>Diagnosis Time:</strong> ${diagnosisResult.timestamp}</p>
                    <p><strong>Data Analyzed:</strong> <span class="font-medium">${diagnosisResult.dataType}</span></p>
                    <p><strong>AI Model Used:</strong> Symptom-driven (XGBoost logic simulation)</p>
                </div>

                <div class="p-6 rounded-xl mb-8 border-l-8 ${diagnosisResult.isPositive ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'} shadow-md">
                    <h3 class="text-2xl font-bold mb-2 ${diagnosisResult.isPositive ? 'text-red-700' : 'text-emerald-700'}">AI Diagnosis Result:</h3>
                    <p class="text-xl text-gray-800">${diagnosisResult.diagnosis}</p>
                    <p class="text-sm mt-1 text-gray-600">Model Confidence Level: ${diagnosisResult.confidence}</p>
                </div>
                
                <h3 class="text-xl font-bold mt-8 mb-4 border-b pb-2 text-gray-800">Interpretation (Simplified for Patient)</h3>
                <p class="text-gray-700 leading-relaxed mb-8">The Artificial Intelligence Assistant analyzed your input and suggests the following finding: ${isPositiveText}. **It is crucial to remember that this is an aid, and the final diagnosis and treatment plan must come from your attending physician.**</p>

                <h3 class="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Explainable AI (XAI) Insight</h3>
                <div class="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <p class="text-sm text-gray-600 font-semibold mb-2">Technical Explanation for Physician Review:</p>
                    <p class="text-sm text-gray-700">${diagnosisResult.explanation}</p>
                </div>
                
                <div class="mt-10 flex justify-center space-x-4">
                    <button class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg transform hover:scale-[1.01] print:hidden" onclick="window.print()">
                        Print/Download PDF
                    </button>
                    <button class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg transform hover:scale-[1.01]" onclick="navigateTo('home')">
                        Start New Diagnosis
                    </button>
                </div>
            </div>
        `;
    } else {
        reportContent = `
            <div class="p-8 main-card rounded-xl text-center max-w-xl mx-auto shadow-xl">
                <h3 class="text-2xl font-semibold text-gray-800 mb-4">No Diagnosis Run</h3>
                <p class="text-lg text-gray-500">Please complete the step-by-step symptom check on the Diagnosis page first.</p>
                <button class="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 shadow-md transform hover:scale-[1.01]" onclick="navigateTo('home')">
                    Go to Diagnosis
                </button>
            </div>
        `;
    }
    contentDiv.innerHTML = reportContent;
}


// --- AI CHAT UI ---

function renderChatUI() {
    const isMobile = window.innerWidth < 768;
    
    // Header for the chat container
    const chatHeader = `
        <div class="flex items-center justify-between p-4 border-b bg-[#4A90E2] text-white rounded-t-xl">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4A90E2] font-bold">
                    <i class="ph ph-robot text-2xl"></i>
                </div>
                <div>
                    <h4 class="font-bold">AI Health Assistant</h4>
                    <span class="text-xs opacity-80">Online | Always ready to chat</span>
                </div>
            </div>
            <button onclick="toggleChat(false)" class="text-white hover:text-gray-200">
                <i class="ph ph-x text-2xl"></i>
            </button>
        </div>
    `;

    // Main chat history and input
    const chatBody = `
        <div id="chat-history" class="flex-grow p-4 overflow-y-auto space-y-3" style="height: ${isMobile ? 'calc(100vh - 200px)' : 'calc(100% - 150px)'};">
            <!-- Messages go here -->
            ${chatHistory.map(msg => `
                <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
                    <div class="chat-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}">
                        ${msg.text}
                    </div>
                </div>
            `).join('')}
            <div id="typing-indicator" class="ai-message w-10 h-5 hidden flex items-center">
                <div class="animate-pulse w-2 h-2 bg-gray-500 rounded-full mx-0.5"></div>
                <div class="animate-pulse w-2 h-2 bg-gray-500 rounded-full mx-0.5" style="animation-delay: 0.2s;"></div>
                <div class="animate-pulse w-2 h-2 bg-gray-500 rounded-full mx-0.5" style="animation-delay: 0.4s;"></div>
            </div>
        </div>
    `;

    // Input area
    const chatInput = `
        <div class="p-4 border-t-2">
            <div class="flex space-x-2 mb-3 overflow-x-auto">
                <button class="text-xs px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition" onclick="simulateChatResponse('What is the difference between flu and cold?')">Flu vs Cold?</button>
                <button class="text-xs px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition" onclick="simulateChatResponse('What are the red flags for chest pain?')">Red Flags?</button>
            </div>
            <div class="flex space-x-2">
                <input type="text" id="chat-input" placeholder="Ask a health question..." class="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-[#4A90E2] focus:border-[#4A90E2] outline-none">
                <button id="send-btn" class="w-12 h-12 bg-[#36C2A3] text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition duration-200">
                    <i class="ph ph-paper-plane-right-fill text-xl"></i>
                </button>
            </div>
        </div>
    `;

    chatContainer.innerHTML = chatHeader + chatBody + chatInput;
    document.getElementById('send-btn').addEventListener('click', handleChatInput);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatInput();
    });

    // Initial AI greeting if history is empty
    if (chatHistory.length === 0) {
        simulateChatResponse("Hello! I'm your AI Health Assistant. How can I help with your symptoms or questions today?", 'ai');
    }
}

function handleChatInput() {
    const input = document.getElementById('chat-input');
    const userText = input.value.trim();
    if (!userText) return;

    // Add user message
    chatHistory.push({ role: 'user', text: userText });
    input.value = '';
    renderChatUI();
    scrollToBottom();

    // Show typing indicator
    document.getElementById('typing-indicator').classList.remove('hidden');
    scrollToBottom();

    // Simulate AI response after a delay
    setTimeout(() => {
        document.getElementById('typing-indicator').classList.add('hidden');
        simulateChatResponse(`I understand you asked about "${userText}". As an AI, I suggest you consult a medical professional for a definite diagnosis. However, based on general knowledge, [Simulated AI Answer].`, 'ai');
    }, 1500);
}

function simulateChatResponse(text, role = 'ai') {
    chatHistory.push({ role: role, text: text });
    renderChatUI();
    scrollToBottom();
}

function scrollToBottom() {
    const chatHistoryDiv = document.getElementById('chat-history');
    if (chatHistoryDiv) {
        chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
    }
}


// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Attach desktop navigation listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => navigateTo(e.target.dataset.page));
    });
    
    // Attach mobile navigation listeners
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.target.dataset.page) {
                navigateTo(e.target.dataset.page);
            }
        });
    });

    // Attach modal close listener
    modalCloseBtn.addEventListener('click', closeModal);

    // Start on the new Home (Info) page
    navigateTo('info');
});