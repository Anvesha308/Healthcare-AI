// --- GLOBAL STATE ---
let diagnosisResult = null;
let selectedFile = null;

// --- DOM ELEMENTS ---
const contentDiv = document.getElementById('content');
const navLinks = document.querySelectorAll('.nav-link');
const modal = document.getElementById('modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

// --- UTILITY FUNCTIONS ---

/**
 * Simulates a custom alert box instead of using window.alert()
 * Uses CSS transitions for a smooth appearance.
 * @param {string} title - The title of the alert.
 * @param {string} message - The message content.
 * @param {string} type - 'success' or 'error'.
 */
function showModal(title, message, type = 'error') {
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Set title color based on type
    if (type === 'success') {
        modalTitle.classList.remove('text-red-600');
        modalTitle.classList.add('text-emerald-600');
    } else {
        modalTitle.classList.remove('text-emerald-600');
        modalTitle.classList.add('text-red-600');
    }

    modal.classList.remove('hidden');
    // For CSS transition effect
    setTimeout(() => {
        document.getElementById('modal-content').classList.remove('scale-95', 'opacity-0');
    }, 50);
}

/**
 * Closes the custom modal.
 */
function closeModal() {
    document.getElementById('modal-content').classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

/**
 * Simulates the ML model inference and XAI generation.
 * @param {string} dataType - 'image' or 'ecg'.
 * @returns {object} Simulated diagnosis data.
 */
function runDiagnosis(dataType) {
    const disease = dataType === 'image' ? 'Pneumonia/Tumor' : 'Cardiac Arrhythmia';
    // Base confidence is lower if no file was truly selected, reinforcing the need for data
    const confidenceModifier = selectedFile ? 1 : 0.8; 
    const confidence = (Math.random() * (0.99 - 0.75) + 0.75) * confidenceModifier * 100;
    const isPositive = confidence > 85;

    return {
        timestamp: new Date().toLocaleTimeString(),
        patientId: 'P' + Math.floor(Math.random() * 9000 + 1000),
        dataType: dataType,
        diagnosis: isPositive ? `${disease} Detected` : `No ${disease} Detected`,
        confidence: confidence.toFixed(1) + '%',
        explanation: dataType === 'image' 
            ? `Grad-CAM analysis highlights the specific density changes in the lower right lung field, consistent with infiltration.`
            : `SHAP analysis shows a significant positive contribution from the QRS complex duration and T-wave amplitude (Feature set X), indicating ventricular irregularity.`,
        isPositive: isPositive,
        xaiFocus: dataType === 'image' ? (isPositive ? 'Lung Lobe' : 'Normal') : 'Features'
    };
}

// --- RENDERING FUNCTIONS ---

/**
 * Renders the Home/Info Page (Interactive, Icon-Driven).
 */
function renderInfoPage() {
    contentDiv.className = 'grid grid-cols-1 gap-8';
    contentDiv.innerHTML = `
        <div class="main-card p-4 md:p-12 rounded-3xl max-w-6xl mx-auto shadow-2xl">
            <!-- 1. HERO SECTION -->
            <div class="text-center mb-16 pt-8 pb-4 border-b border-indigo-100">
                <h2 class="text-5xl md:text-6xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-500">
                    Precision Diagnosis, Powered by AI.
                </h2>
                <p class="text-xl text-gray-500 max-w-3xl mx-auto">
                    The Healthcare Diagnosis Assistant integrates Deep Learning with Explainable AI (XAI) to elevate clinical decision support.
                </p>
            </div>
            
            <!-- 2. CORE METRICS / VALUE PROPS (Interactive Cards) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <!-- Metric 1 -->
                <div class="bg-indigo-50 p-6 rounded-xl text-center shadow-lg transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-2xl">
                    <span class="text-5xl font-extrabold text-indigo-700 block">95%+</span>
                    <p class="text-lg font-semibold mt-2 text-gray-800">Simulated Accuracy</p>
                    <p class="text-sm text-gray-500 mt-1">High-confidence predictions with ResNet-50 and XGBoost models.</p>
                </div>
                <!-- Metric 2 -->
                <div class="bg-emerald-50 p-6 rounded-xl text-center shadow-lg transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-2xl">
                    <span class="text-5xl font-extrabold text-emerald-700 block">5X</span>
                    <p class="text-lg font-semibold mt-2 text-gray-800">Faster Analysis</p>
                    <p class="text-sm text-gray-500 mt-1">Real-time processing of complex medical images and signals.</p>
                </div>
                <!-- Metric 3 -->
                <div class="bg-blue-50 p-6 rounded-xl text-center shadow-lg transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-2xl">
                    <span class="text-5xl font-extrabold text-blue-700 block">100%</span>
                    <p class="text-lg font-semibold mt-2 text-gray-800">Model Transparency</p>
                    <p class="text-sm text-gray-500 mt-1">Explainable AI (XAI) provides verifiable reasoning for every result.</p>
                </div>
            </div>

            <!-- 3. HOW IT WORKS (Infographic Style) -->
            <div class="mb-16">
                <h3 class="text-3xl font-bold text-center mb-10 text-gray-800">The Diagnostic Workflow</h3>
                <div class="flex flex-col lg:flex-row justify-between items-stretch space-y-8 lg:space-y-0 lg:space-x-8">
                    
                    <!-- Step 1: Data Acquisition -->
                    <div class="flex flex-col items-center text-center p-4 main-card rounded-xl hover:shadow-xl transition-shadow duration-300">
                        <div class="bg-indigo-200 p-4 rounded-full mb-3">
                            <svg class="w-8 h-8 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-2-2L4 16m0 0h16"></path></svg>
                        </div>
                        <h4 class="font-semibold text-lg text-gray-800">1. Data Upload</h4>
                        <p class="text-sm text-gray-500">Upload medical images (X-ray, CT) or physiological signals (ECG data).</p>
                    </div>

                    <!-- Arrow/Separator -->
                    <div class="hidden lg:flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400 transform rotate-90 lg:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                    
                    <!-- Step 2: AI Inference -->
                    <div class="flex flex-col items-center text-center p-4 main-card rounded-xl hover:shadow-xl transition-shadow duration-300">
                        <div class="bg-purple-200 p-4 rounded-full mb-3">
                            <svg class="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.27a11.97 11.97 0 013.297.803 2.1 2.1 0 01-1.464 2.887 11.97 11.97 0 01-11.233-12.016 2.1 2.1 0 012.887-1.464c1.03-.687 2.146-1.03 3.32-.803"></path></svg>
                        </div>
                        <h4 class="font-semibold text-lg text-gray-800">2. AI Processing</h4>
                        <p class="text-sm text-gray-500">Dedicated models (ResNet-50 for Image, XGBoost for ECG) generate a diagnostic probability.</p>
                    </div>

                    <!-- Arrow/Separator -->
                    <div class="hidden lg:flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400 transform rotate-90 lg:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>

                    <!-- Step 3: XAI Explanation -->
                    <div class="flex flex-col items-center text-center p-4 main-card rounded-xl hover:shadow-xl transition-shadow duration-300">
                        <div class="bg-red-200 p-4 rounded-full mb-3">
                            <svg class="w-8 h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0014.586 3H7a2 2 0 00-2 2v11m-1 4h10a2 2 0 012 2v2M8 12h8m-4 4h4"></path></svg>
                        </div>
                        <h4 class="font-semibold text-lg text-gray-800">3. XAI Generation</h4>
                        <p class="text-sm text-gray-500">Grad-CAM/SHAP visualizations are created to explain the model's decision-making process.</p>
                    </div>
                </div>
            </div>

            <!-- 4. CALL TO ACTION -->
            <div class="bg-gradient-to-r from-emerald-500 to-green-600 p-8 md:p-12 rounded-2xl text-center text-white shadow-2xl">
                <h3 class="text-4xl font-bold mb-3">Ready to Analyze Patient Data?</h3>
                <p class="text-lg mb-6">Explore the full capabilities of the AI Diagnosis Dashboard now.</p>
                <button class="bg-white text-emerald-600 hover:bg-gray-100 font-bold text-xl py-4 px-10 rounded-xl shadow-2xl transition duration-300 transform hover:scale-[1.05]" onclick="navigateTo('home')">
                    Go to Dashboard
                </button>
            </div>
        </div>
    `;
}

/**
 * Renders the Doctor Dashboard (Diagnosis Page).
 */
function renderDashboard() {
    contentDiv.className = 'grid grid-cols-1 lg:grid-cols-3 gap-8';
    contentDiv.innerHTML = `
        <!-- 1. Data Input/Upload Card -->
        <div class="lg:col-span-1 main-card p-6 rounded-xl h-fit sticky top-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Diagnostic Input</h2>
            <p class="text-sm text-gray-500 mb-6">Upload patient data for AI analysis.</p>
            
            <form id="diagnosis-form" class="space-y-4">
                
                <!-- Data Type Selection -->
                <div class="mb-4">
                    <label for="data-type" class="block text-sm font-medium text-gray-700 mb-1">Select Data Type:</label>
                    <select id="data-type" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="image">Medical Imaging (X-ray, CT, MRI)</option>
                        <option value="ecg">Physiological Data (ECG, structured features)</option>
                    </select>
                </div>

                <!-- File Upload Input -->
                <div class="mb-6">
                    <label for="file-upload" class="block text-sm font-medium text-gray-700 mb-1">Upload File:</label>
                    <input type="file" id="file-upload" accept="image/*" class="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 transition duration-150
                    "/>
                    <p id="file-status" class="mt-1 text-xs text-gray-400">Please select an image file (e.g., JPEG, PNG) for X-ray/CT analysis.</p>
                </div>


                <button type="submit" id="diagnose-btn" class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-200 flex items-center justify-center transform hover:scale-[1.01]">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    Run AI Diagnosis
                </button>
            </form>

            <div id="patient-info" class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 class="font-semibold text-sm mb-2 text-gray-700">Current Session Details:</h3>
                <p class="text-gray-600 text-sm">Patient ID: <span id="patient-id-display" class="font-medium text-indigo-700">N/A</span></p>
                <p class="text-gray-600 text-sm">Last Run: <span id="last-run-display">N/A</span></p>
            </div>
        </div>

        <!-- 2. Diagnosis and Visualization Card (Large) -->
        <div class="lg:col-span-2 main-card p-6 rounded-xl">
            <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Model Diagnosis & Explainability (XAI)</h2>
            
            <div id="diagnosis-area" class="min-h-[400px] flex items-center justify-center bg-gray-100 rounded-xl border-4 border-dashed border-gray-300">
                <p class="text-gray-500 font-medium text-lg">Upload data and click "Run AI Diagnosis" to begin.</p>
            </div>

            <div id="xai-details" class="mt-6 p-4 rounded-xl border-l-4 border-indigo-300 bg-indigo-50 hidden">
                <h3 class="font-bold text-lg mb-2 text-indigo-700">XAI Interpretation:</h3>
                <div class="flex flex-col md:flex-row md:items-center justify-between">
                    <p id="explanation-text" class="text-gray-700 md:w-3/4"></p>
                    <div class="mt-3 md:mt-0">
                        <span id="confidence-badge" class="px-4 py-2 text-sm font-bold rounded-full shadow-lg"></span>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex justify-end">
                <button id="save-report-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-xl transition duration-200 hidden transform hover:scale-[1.01]" onclick="navigateTo('report')">
                    Generate Patient Report
                </button>
            </div>
        </div>
    `;
    attachDashboardListeners();
}

/**
 * Renders the Patient Report Page. (No change to content needed here)
 */
function renderPatientReport() {
    contentDiv.className = 'grid grid-cols-1 gap-8';
    
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
                    <p><strong>Data Analyzed:</strong> <span class="font-medium">${diagnosisResult.dataType === 'image' ? 'Medical Imaging (X-ray/CT)' : 'Physiological Data (ECG)'}</span></p>
                    <p><strong>AI Model Used:</strong> ${diagnosisResult.dataType === 'image' ? 'ResNet-50' : 'XGBoost'}</p>
                </div>

                <div class="p-6 rounded-xl mb-8 border-l-8 ${diagnosisResult.isPositive ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'} shadow-md">
                    <h3 class="text-2xl font-bold mb-2 ${diagnosisResult.isPositive ? 'text-red-700' : 'text-emerald-700'}">AI Diagnosis Result:</h3>
                    <p class="text-xl text-gray-800">${diagnosisResult.diagnosis}</p>
                    <p class="text-sm mt-1 text-gray-600">Model Confidence Level: ${diagnosisResult.confidence}</p>
                </div>
                
                <h3 class="text-xl font-bold mt-8 mb-4 border-b pb-2 text-gray-800">Interpretation (Simplified for Patient)</h3>
                <p class="text-gray-700 leading-relaxed mb-8">The Artificial Intelligence Assistant analyzed your data and suggests the following finding: ${isPositiveText}. **It is crucial to remember that this is an aid, and the final diagnosis and treatment plan must come from your attending physician.**</p>

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
                        Back to Dashboard
                    </button>
                </div>
            </div>
        `;
    } else {
        reportContent = `
            <div class="p-8 main-card rounded-xl text-center max-w-xl mx-auto shadow-xl">
                <h3 class="text-2xl font-semibold text-gray-800 mb-4">No Data Available</h3>
                <p class="text-lg text-gray-500">Please run a diagnostic analysis from the Dashboard first to generate a patient report.</p>
                <button class="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 shadow-md transform hover:scale-[1.01]" onclick="navigateTo('home')">
                    Go to Dashboard
                </button>
            </div>
        `;
    }
    contentDiv.innerHTML = reportContent;
}

/**
 * Handles navigation, updates active links, and renders the correct page.
 * @param {string} page - The page to navigate to ('info', 'home', or 'report').
 */
function navigateTo(page) {
    // 1. Update navigation bar active state
    navLinks.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Render the correct page content
    if (page === 'info') {
        renderInfoPage();
    } else if (page === 'home') {
        renderDashboard();
    } else if (page === 'report') {
        renderPatientReport();
    }
}

// --- EVENT LISTENERS (Dashboard) ---

function attachDashboardListeners() {
    const diagnosisForm = document.getElementById('diagnosis-form');
    const fileInput = document.getElementById('file-upload');
    const dataTypeSelect = document.getElementById('data-type');
    const fileStatus = document.getElementById('file-status');

    // Display file name when selected
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            selectedFile = fileInput.files[0];
            fileStatus.textContent = `File selected: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`;
            fileStatus.classList.remove('text-gray-400');
            fileStatus.classList.add('text-emerald-600', 'font-medium');
        } else {
            selectedFile = null;
            fileStatus.textContent = 'Please select a file.';
            fileStatus.classList.remove('text-emerald-600', 'font-medium');
            fileStatus.classList.add('text-gray-400');
        }
    });

    // Adjust file acceptance based on data type selection
    dataTypeSelect.addEventListener('change', () => {
        if (dataTypeSelect.value === 'image') {
            fileInput.setAttribute('accept', 'image/*');
            fileStatus.textContent = 'Please select an image file (e.g., JPEG, PNG) for X-ray/CT analysis.';
        } else {
            fileInput.setAttribute('accept', '.csv');
            fileStatus.textContent = 'Please select a CSV file for ECG/structured data analysis.';
        }
        // Clear previously selected file when changing type
        fileInput.value = '';
        selectedFile = null;
        fileStatus.classList.remove('text-emerald-600', 'font-medium');
        fileStatus.classList.add('text-gray-400');
    });

    // Event handler for diagnosis form submission
    diagnosisForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Stop page reload

        if (!selectedFile) {
            showModal('Missing Data', 'Please select a file to run the AI diagnosis.', 'error');
            return;
        }

        const dataType = dataTypeSelect.value;
        
        // DOM elements for results
        const diagnoseArea = document.getElementById('diagnosis-area');
        const xaiDetails = document.getElementById('xai-details');
        const explanationText = document.getElementById('explanation-text');
        const confidenceBadge = document.getElementById('confidence-badge');
        const saveReportBtn = document.getElementById('save-report-btn');
        const patientIdDisplay = document.getElementById('patient-id-display');
        const lastRunDisplay = document.getElementById('last-run-display');

        // Clear previous results and show loading
        diagnoseArea.innerHTML = `
            <div class="text-center p-4">
                <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
                <p class="mt-4 text-indigo-700 font-semibold text-lg">Analyzing Data...</p>
                <p class="text-sm text-gray-500">Running ${dataType === 'image' ? 'ResNet-50 (Deep Learning)' : 'XGBoost (Gradient Boosting)'} on ${selectedFile.name}.</p>
            </div>
        `;
        xaiDetails.classList.add('hidden');
        saveReportBtn.classList.add('hidden');
        lastRunDisplay.textContent = 'Processing...';

        // Simulate network latency/processing time
        setTimeout(() => {
            diagnosisResult = runDiagnosis(dataType);
            
            // Update session info
            patientIdDisplay.textContent = diagnosisResult.patientId;
            lastRunDisplay.textContent = diagnosisResult.timestamp;

            let diagnosisHTML;

            if (dataType === 'image') {
                // Image Visualization (X-ray/CT)
                const placeholderImage = "https://placehold.co/800x600/b0c4de/333333?text=X-RAY+SCAN+Simulated";
                diagnosisHTML = `
                    <div class="xai-overlay-container w-full h-full p-4">
                        <!-- In a real app, this would be the uploaded image -->
                        <img src="${placeholderImage}" onerror="this.onerror=null;this.src='https://placehold.co/800x600/b0c4de/333333?text=Image+Load+Error';" alt="Medical Scan" class="max-h-full max-w-full object-contain rounded-xl shadow-xl transition-all duration-500" />
                        <div id="xai-overlay" class="xai-overlay ${diagnosisResult.isPositive ? 'active' : ''}"></div>
                    </div>
                `;
            } else {
                // ECG/Structured Data Visualization
                diagnosisHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center p-4 bg-white rounded-xl">
                        <svg viewBox="0 0 100 20" class="w-full h-auto text-red-600 mb-4" fill="none" stroke="currentColor" stroke-width="0.3" style="max-height: 200px;">
                            <polyline points="0,10 5,12 10,8 15,10 20,11 25,13 30,7 35,10 40,11 45,13 50,7 55,10 60,11 65,13 70,7 75,10 80,12 85,8 90,10 95,11 100,10" class="stroke-red-500"/>
                        </svg>
                        <p class="mt-4 text-center text-gray-700 font-medium">ECG Analysis Complete on ${selectedFile.name}.</p>
                        <p class="text-sm text-gray-500">XGBoost successfully analyzed key physiological features.</p>
                    </div>
                `;
            }
            
            diagnoseArea.innerHTML = diagnosisHTML;
            
            // Update XAI Details
            explanationText.textContent = diagnosisResult.explanation;
            confidenceBadge.textContent = diagnosisResult.diagnosis + ' (Conf: ' + diagnosisResult.confidence + ')';
            
            // Style the badge based on result
            confidenceBadge.classList.remove('bg-emerald-100', 'text-emerald-700', 'bg-red-100', 'text-red-700');
            if (diagnosisResult.isPositive) {
                confidenceBadge.classList.add('bg-red-100', 'text-red-700');
            } else {
                confidenceBadge.classList.add('bg-emerald-100', 'text-emerald-700');
            }

            xaiDetails.classList.remove('hidden');
            saveReportBtn.classList.remove('hidden');
            
            showModal('Diagnosis Complete', `AI Model predicted: ${diagnosisResult.diagnosis}`, diagnosisResult.isPositive ? 'error' : 'success');


        }, 2500); // 2.5 second simulation time
    });
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Attach navigation listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => navigateTo(e.target.dataset.page));
    });
    
    // Attach modal close listener
    modalCloseBtn.addEventListener('click', closeModal);

    // Start on the new Home (Info) page
    navigateTo('info');
});