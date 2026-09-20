import './style.css';

/* =========================================================
   VOICEGUARD
   CLEAN FULL VERSION
   PART 1 / 2

   Features preserved:
   - Splash screen
   - Sidebar
   - Home
   - Dashboard
   - Voice recording
   - Voice upload
   - AI voice analysis
   - Results
   - History
   - IndexedDB persistence
   - Search
   - Notifications
   - Location
   - Voice comparison
   - Scam call detection
   - Incoming call security demo
   - Settings
   - Share recording
   - Share result
   ========================================================= */


/* =========================================================
   1. SPLASH SCREEN
   ========================================================= */

const splash = document.createElement('section');

splash.className = 'vg-splash';

splash.innerHTML = `
  <div class="vg-splash-content">

    <div class="vg-splash-logo">
      <div class="vg-logo-shield">🛡️</div>

      <div class="vg-logo-wave">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <h1>VOICEGUARD</h1>

    <p class="vg-splash-subtitle">
      AI-Powered Voice Protection
    </p>

    <div class="vg-splash-wave">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="vg-swipe-hint">
      <span class="swipe-arrow">↑</span>
      <span>Swipe up to continue</span>
    </div>

  </div>
`;

document.body.appendChild(splash);

Object.assign(splash.style, {
  position: 'fixed',
  inset: '0',
  width: '100%',
  height: '100dvh',
  margin: '0',
  padding: '0',
  zIndex: '99999',
  overflow: 'hidden'
});

let splashClosed = false;

function closeSplash() {
  if (splashClosed) return;

  splashClosed = true;
  splash.classList.add('closing');

  setTimeout(() => {
    splash.remove();
  }, 700);
}

let touchStartY = null;

splash.addEventListener(
  'touchstart',
  (event) => {
    touchStartY = event.touches[0]?.clientY ?? null;
  },
  { passive: true }
);

splash.addEventListener(
  'touchend',
  (event) => {
    if (touchStartY === null) return;

    const touchEndY =
      event.changedTouches[0]?.clientY ?? touchStartY;

    if (touchStartY - touchEndY > 50) {
      closeSplash();
    }

    touchStartY = null;
  },
  { passive: true }
);

splash.addEventListener(
  'wheel',
  (event) => {
    if (event.deltaY > 20) {
      closeSplash();
    }
  },
  { passive: true }
);

splash.addEventListener('click', closeSplash);


/* =========================================================
   2. MAIN APPLICATION
   ========================================================= */

const app = document.querySelector('#app');

if (!app) {
  throw new Error('VoiceGuard #app element was not found.');
}

app.innerHTML = `
<div class="app-shell">

  <!-- SIDEBAR -->
  <aside class="sidebar" id="sidebar">

    <div class="sidebar-brand">
      <div class="brand-icon">🛡️</div>

      <div class="brand-text">
        <strong>VOICEGUARD</strong>
        <span>Voice Protection</span>
      </div>
    </div>

    <nav class="sidebar-nav">

      <button class="nav-item active" data-page="home">
        <span class="nav-icon">🏠</span>
        <span>Home</span>
      </button>

      <button class="nav-item" data-page="dashboard">
        <span class="nav-icon">📊</span>
        <span>Dashboard</span>
      </button>

      <button class="nav-item" data-page="analyze">
        <span class="nav-icon">🎙️</span>
        <span>Analyze Voice</span>
      </button>

      <button class="nav-item" data-page="comparison">
        <span class="nav-icon">🔊</span>
        <span>Voice Comparison</span>
      </button>

      <button class="nav-item" data-page="scam">
        <span class="nav-icon">🚨</span>
        <span>Scam Detection</span>
      </button>

      <button class="nav-item" data-page="location">
        <span class="nav-icon">📍</span>
        <span>Location</span>
      </button>

      <button class="nav-item" data-page="results">
        <span class="nav-icon">📋</span>
        <span>Results</span>
      </button>

      <button class="nav-item" data-page="history">
        <span class="nav-icon">🕘</span>
        <span>History</span>
      </button>

      <button class="nav-item" data-page="settings">
        <span class="nav-icon">⚙️</span>
        <span>Settings</span>
      </button>

    </nav>

    <div class="sidebar-bottom">
      <div class="protection-card">
        <div class="protection-icon">🛡️</div>

        <div>
          <strong>Protection Active</strong>
          <small>Your voice tools are ready</small>
        </div>
      </div>
    </div>

  </aside>


  <!-- MAIN -->
  <main class="app-main">

    <!-- HEADER -->
    <header class="header">

      <div class="header-left">

        <button
          class="mobile-menu-btn"
          id="mobileMenuBtn"
          title="Menu"
        >
          ☰
        </button>

        <div class="page-heading">
          <span class="page-kicker">VOICEGUARD</span>
          <h2 id="pageTitle">Home</h2>
        </div>

      </div>


      <div class="header-search">

        <span class="search-icon">🔎</span>

        <input
          id="globalSearch"
          type="search"
          placeholder="Search results, dates..."
          autocomplete="off"
        />

        <button
          id="clearSearchBtn"
          class="search-clear"
          title="Clear search"
          style="display:none"
        >
          ×
        </button>

      </div>


      <div class="header-actions">

        <button
          class="header-icon-btn"
          id="notificationBtn"
          title="Notifications"
        >
          🔔
          <span
            class="notification-dot"
            id="notificationDot"
          ></span>
        </button>

        <button
          class="header-profile"
          id="profileSettingsBtn"
          title="Settings"
        >
          <span class="profile-avatar">VG</span>

          <span class="profile-info">
            <strong>VoiceGuard</strong>
            <small>Protected</small>
          </span>
        </button>

      </div>

    </header>


    <!-- SEARCH -->
    <div
      id="searchPanel"
      class="search-panel"
      style="display:none"
    >

      <div class="search-panel-header">
        <strong>Search Results</strong>

        <button
          id="closeSearchPanelBtn"
          class="text-btn"
        >
          Close
        </button>
      </div>

      <div id="searchResultsList"></div>

    </div>


    <!-- NOTIFICATIONS -->
    <div
      id="notificationPanel"
      class="notification-panel"
      style="display:none"
    >

      <div class="notification-panel-header">

        <strong>Notifications</strong>

        <button
          id="clearNotificationsBtn"
          class="text-btn"
        >
          Clear
        </button>

      </div>

      <div id="notificationList"></div>

    </div>


    <!-- INCOMING CALL ALERT -->
    <div
      id="incomingCallAlert"
      class="incoming-call-alert"
      style="display:none"
    >

      <div class="incoming-call-icon">📞</div>

      <div class="incoming-call-content">

        <strong>Incoming Call Security Alert</strong>

        <p id="incomingCallText">
          VoiceGuard detected a potentially suspicious caller.
        </p>

      </div>

      <button
        id="closeIncomingCallAlert"
        class="alert-close-btn"
      >
        ×
      </button>

    </div>


    <!-- PAGE CONTENT -->
    <section class="page-content">


      <!-- HOME -->
      <section
        class="page-section active"
        id="page-home"
      >

        <div class="home-welcome">

          <div class="home-welcome-content">

            <span class="eyebrow">
              AI VOICE SECURITY
            </span>

            <h1>
              Protect your voice.
              <br />
              Detect synthetic voices.
            </h1>

            <p>
              Record, upload and analyze voices with
              VoiceGuard's AI-powered protection tools.
            </p>

            <div class="home-welcome-actions">

              <button
                class="primary-btn"
                data-page-target="analyze"
              >
                🎙️ Analyze a Voice
              </button>

              <button
                class="secondary-btn"
                data-page-target="scam"
              >
                🚨 Check Scam Call
              </button>

            </div>

          </div>


          <div class="home-welcome-visual">

            <div class="hero-shield">
              🛡️
            </div>

            <div class="hero-ring ring-one"></div>
            <div class="hero-ring ring-two"></div>

            <div class="hero-status">
              <span class="status-dot"></span>
              Protection Active
            </div>

          </div>

        </div>


        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              QUICK ACCESS
            </span>

            <h3>
              What would you like to do?
            </h3>
          </div>

        </div>


        <div class="quick-actions-grid">

          <button
            class="quick-action-card"
            data-page-target="analyze"
          >
            <div class="quick-card-icon blue">
              🎙️
            </div>

            <div>
              <strong>Analyze Voice</strong>
              <p>
                Detect AI-generated or natural speech.
              </p>
            </div>

            <span class="quick-arrow">→</span>
          </button>


          <button
            class="quick-action-card"
            data-page-target="comparison"
          >
            <div class="quick-card-icon purple">
              🔊
            </div>

            <div>
              <strong>Compare Voices</strong>
              <p>
                Compare two recorded voices.
              </p>
            </div>

            <span class="quick-arrow">→</span>
          </button>


          <button
            class="quick-action-card"
            data-page-target="scam"
          >
            <div class="quick-card-icon red">
              🚨
            </div>

            <div>
              <strong>Scam Detection</strong>
              <p>
                Check suspicious calls and phrases.
              </p>
            </div>

            <span class="quick-arrow">→</span>
          </button>


          <button
            class="quick-action-card"
            data-page-target="history"
          >
            <div class="quick-card-icon green">
              🕘
            </div>

            <div>
              <strong>View History</strong>
              <p>
                Find your previous voice analyses.
              </p>
            </div>

            <span class="quick-arrow">→</span>
          </button>

        </div>


        <div class="home-info-grid">

          <div class="info-card">
            <div class="info-card-icon">🔐</div>

            <div>
              <strong>Private by Design</strong>
              <p>
                Your analysis history is stored locally
                in your browser.
              </p>
            </div>
          </div>


          <div class="info-card">
            <div class="info-card-icon">🤖</div>

            <div>
              <strong>AI Voice Analysis</strong>
              <p>
                VoiceGuard analyzes recordings for
                synthetic voice patterns.
              </p>
            </div>
          </div>


          <div class="info-card">
            <div class="info-card-icon">📍</div>

            <div>
              <strong>Location Support</strong>
              <p>
                Capture location information along
                with an analysis when needed.
              </p>
            </div>
          </div>

        </div>

      </section>


      <!-- DASHBOARD -->
      <section
        class="page-section"
        id="page-dashboard"
      >

        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              OVERVIEW
            </span>

            <h1>Security Dashboard</h1>

            <p>
              A quick overview of your voice analysis activity.
            </p>
          </div>

        </div>


        <div class="stats-grid">

          <div class="stat-card">
            <div class="stat-icon blue">🎙️</div>

            <div>
              <span>Total Recordings</span>
              <strong id="totalRecordings">0</strong>
            </div>
          </div>


          <div class="stat-card">
            <div class="stat-icon red">🤖</div>

            <div>
              <span>Likely AI</span>
              <strong id="likelyAI">0</strong>
            </div>
          </div>


          <div class="stat-card">
            <div class="stat-icon green">👤</div>

            <div>
              <span>Likely Human</span>
            <strong id="likelyHuman">0</strong>
            </div>
          </div>


          <div class="stat-card">
            <div class="stat-icon purple">🎯</div>

            <div>
              <span>Average Confidence</span>
              <strong id="averageConfidence">0%</strong>
            </div>
          </div>

        </div>


        <div class="dashboard-grid">

          <div class="dashboard-card">

            <div class="dashboard-card-header">
              <div>
                <span class="section-kicker">
                  DISTRIBUTION
                </span>

                <h3>AI vs Human</h3>
              </div>
            </div>


            <div class="distribution-chart">

              <div class="distribution-row">

                <div class="distribution-label">
                  <span class="distribution-dot ai-dot"></span>

                  AI / Synthetic

                  <strong id="aiDistribution">
                    0%
                  </strong>
                </div>

                <div class="progress-track">
                  <div
                    id="aiBar"
                    class="progress-bar ai-bar"
                    style="width:0%"
                  ></div>
                </div>

              </div>


              <div class="distribution-row">

                <div class="distribution-label">
                  <span class="distribution-dot human-dot"></span>

                  Human / Natural

                  <strong id="humanDistribution">
                    0%
                  </strong>
                </div>

                <div class="progress-track">
                  <div
                    id="humanBar"
                    class="progress-bar human-bar"
                    style="width:0%"
                  ></div>
                </div>

              </div>

            </div>

          </div>


          <div class="dashboard-card security-summary">

            <div class="security-summary-icon">
              🛡️
            </div>

            <div>
              <span class="section-kicker">
                PROTECTION STATUS
              </span>

              <h3>
                VoiceGuard is Active
              </h3>

              <p>
                Your local analysis history and
                protection tools are ready.
              </p>
            </div>

          </div>

        </div>

      </section>


      <!-- ANALYZE -->
      <section
        class="page-section"
        id="page-analyze"
      >

        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              AI ANALYSIS
            </span>

            <h1>Analyze Voice</h1>

            <p>
              Record or upload an audio file to analyze
              whether the voice is likely synthetic.
            </p>
          </div>

        </div>


        <div class="analysis-layout">

          <div class="feature-card recording-card">

            <div class="feature-card-top">

              <div class="feature-icon blue">
                🎙️
              </div>

              <div>
                <h3>Voice Recording</h3>
                <p>
                  Record a new voice sample.
                </p>
              </div>

            </div>


            <div class="recording-controls">

              <button
                id="startRecordBtn"
                class="primary-btn"
              >
                🔴 Start Recording
              </button>

              <button
                id="stopRecordBtn"
                class="secondary-btn"
                disabled
              >
                ⏹️ Stop Recording
              </button>

            </div>


            <div
              id="recordingStatus"
              class="recording-status"
            >
              Ready to record
            </div>

            <div
              id="recordingTimer"
              class="recording-timer"
            >
              00:00
            </div>

          </div>


          <div class="feature-card">

            <div class="feature-card-top">

              <div class="feature-icon purple">
                📁
              </div>

              <div>
                <h3>Upload Recording</h3>
                <p>
                  Select an existing audio file.
                </p>
              </div>

            </div>


            <label
              class="upload-zone"
              for="audioUpload"
            >
              <span class="upload-zone-icon">
                ⬆️
              </span>

              <strong>
                Choose audio file
              </strong>

              <small>
                WAV, MP3, WebM, OGG and supported formats
              </small>
            </label>

            <input
              id="audioUpload"
              type="file"
              accept="audio/*"
              hidden
            />


            <div
              id="selectedFileName"
              class="selected-file-name"
            >
              No file selected
            </div>

          </div>

        </div>


        <div class="feature-card audio-preview-card">

          <div class="feature-card-top">

            <div class="feature-icon green">
              🔊
            </div>

            <div>
              <h3>Audio Preview</h3>

              <p>
                Listen to the selected recording before analysis.
              </p>
            </div>

          </div>


          <audio
            id="audioPreview"
            controls
            style="display:none"
          ></audio>


          <div
            id="audioPreviewEmpty"
            class="empty-preview"
          >
            No audio selected yet.
          </div>


          <div class="analysis-extra-actions">

            <button
              id="captureLocationBtn"
              class="secondary-btn"
            >
              📍 Capture Location
            </button>


            <button
              id="shareRecordingBtn"
              class="secondary-btn"
            >
              🔗 Share Recording
            </button>

          </div>


          <div
            id="analysisLocationInfo"
            class="location-info-box"
            style="display:none"
          ></div>


          <button
            id="analyzeVoiceBtn"
            class="primary-btn analyze-main-btn"
          >
            🤖 Analyze Voice
          </button>

        </div>

      </section>


      <!-- COMPARISON -->
      <section
        class="page-section"
        id="page-comparison"
      >

        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              VOICE COMPARISON
            </span>

            <h1>Compare Voices</h1>

            <p>
              Compare two recordings using basic audio
              characteristics such as duration, loudness
              and speech activity.
            </p>
          </div>

        </div>


        <div class="comparison-grid">

          <!-- REFERENCE -->

          <div class="feature-card">

            <div class="feature-card-top">

              <div class="feature-icon blue">
                🎯
              </div>

              <div>
                <h3>Reference Voice</h3>
                <p>
                  Upload or record the intended voice.
                </p>
              </div>

            </div>


            <div class="recording-controls">

              <button
                id="startIntendedRecordBtn"
                class="primary-btn"
              >
                🔴 Record
              </button>

              <button
                id="stopIntendedRecordBtn"
                class="secondary-btn"
                disabled
              >
                ⏹️ Stop
              </button>

            </div>


            <label
              class="upload-zone compact"
              for="intendedVoiceUpload"
            >
              <span>📁</span>
              <strong>
                Upload reference voice
              </strong>
              <small>
                Select an audio recording
              </small>
            </label>

            <input
              id="intendedVoiceUpload"
              type="file"
              accept="audio/*"
              hidden
            />


            <div
              id="intendedFileName"
              class="selected-file-name"
            >
              No reference voice selected
            </div>


            <audio
              id="intendedAudioPreview"
              controls
              style="display:none"
            ></audio>

          </div>


          <!-- PERSON -->

          <div class="feature-card">

            <div class="feature-card-top">

              <div class="feature-icon purple">
                👤
              </div>

              <div>
                <h3>Person Voice</h3>
                <p>
                  Upload or record the second voice.
                </p>
              </div>

            </div>


            <div class="recording-controls">

              <button
                id="startPersonRecordBtn"
                class="primary-btn"
              >
                🔴 Record
              </button>

              <button
                id="stopPersonRecordBtn"
                class="secondary-btn"
                disabled
              >
                ⏹️ Stop
              </button>

            </div>


            <label
              class="upload-zone compact"
              for="personVoiceUpload"
            >
              <span>📁</span>

              <strong>
                Upload person voice
              </strong>

              <small>
                Select an audio recording
              </small>
            </label>

            <input
              id="personVoiceUpload"
              type="file"
              accept="audio/*"
              hidden
            />


            <div
              id="personFileName"
              class="selected-file-name"
            >
              No person voice selected
            </div>


            <audio
              id="personAudioPreview"
              controls
              style="display:none"
            ></audio>

          </div>

        </div>


        <div class="feature-card comparison-action-card">

          <button
            id="compareVoicesBtn"
            class="primary-btn analyze-main-btn"
          >
            🔍 Compare Voices
          </button>


          <div
            id="comparisonResult"
            class="comparison-result"
            style="display:none"
          ></div>

        </div>

      </section>


      <!-- SCAM -->
      <section
        class="page-section"
        id="page-scam"
      >

        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              CALL SECURITY
            </span>

            <h1>Scam Call Detection</h1>

            <p>
              Check suspicious voice calls for AI-generated
              speech and common scam phrases.
            </p>
          </div>

        </div>


        <div class="scam-warning-banner">

          <div class="scam-warning-icon">
            ⚠️
          </div>

          <div>
            <strong>
              Never share OTPs, PINs or passwords.
            </strong>

            <p>
              VoiceGuard can help identify warning signs,
              but always verify important requests independently.
            </p>
          </div>

        </div>


        <div class="feature-card">

          <div class="feature-card-top">

            <div class="feature-icon red">
              📞
            </div>

            <div>
              <h3>Record Suspicious Call</h3>
              <p>
                Record a voice sample for analysis.
              </p>
            </div>

          </div>


          <div class="recording-controls">

            <button
              id="startScamRecordBtn"
              class="primary-btn danger-btn"
            >
              🔴 Start Scam Recording
            </button>

            <button
              id="stopScamRecordBtn"
              class="secondary-btn"
              disabled
            >
              ⏹️ Stop
            </button>

          </div>


          <label
            class="upload-zone"
            for="scamAudioUpload"
          >
            <span class="upload-zone-icon">
              📁
            </span>

            <strong>
              Upload suspicious call audio
            </strong>

            <small>
              Select an audio recording to check
            </small>
          </label>

          <input
            id="scamAudioUpload"
            type="file"
            accept="audio/*"
            hidden
          />


          <div
            id="scamFileName"
            class="selected-file-name"
          >
            No scam recording selected
          </div>


          <audio
            id="scamAudioPreview"
            controls
            style="display:none"
          ></audio>

        </div>


        <div class="feature-card">

          <div class="feature-card-top">

            <div class="feature-icon orange">
              📝
            </div>

            <div>
              <h3>Detected Speech</h3>

              <p>
                VoiceGuard can check recognized text for
                common scam phrases.
              </p>
            </div>

          </div>


          <div
            id="scamTranscript"
            class="transcript-box"
          >
            No speech detected yet.
          </div>


          <div
            id="suspiciousPhrases"
            class="suspicious-phrases"
          ></div>

        </div>


        <div class="feature-card">

          <button
            id="analyzeScamBtn"
            class="primary-btn danger-btn analyze-main-btn"
          >
            🚨 Analyze Scam Call
          </button>


          <div
            id="scamRiskResult"
            class="scam-risk-result"
            style="display:none"
          ></div>

        </div>

      </section>


      <!-- LOCATION -->
      <section
        class="page-section"
        id="page-location"
      >

        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              LOCATION
            </span>

            <h1>Location</h1>

            <p>
              Capture your current location when you want
              it associated with a voice analysis.
            </p>
          </div>

        </div>


        <div class="location-page-card">

          <div class="location-large-icon">
            📍
          </div>

          <h2>Current Location</h2>

          <p>
            VoiceGuard only requests location when you
            choose to capture it.
          </p>


          <button
            id="getLocationBtn"
            class="primary-btn"
          >
            📍 Get Current Location
          </button>


          <div
            id="locationResult"
            class="location-result"
          >
            Location not captured yet.
          </div>

        </div>

      </section>


      <!-- RESULTS -->
      <section
        class="page-section"
        id="page-results"
      >

        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              ANALYSIS
            </span>

            <h1>Results</h1>

            <p>
              Your latest voice analysis result appears here.
            </p>

          </div>

        </div>


        <div
          id="resultsContainer"
          class="results-container"
        >

          <div class="empty-state">

            <div class="empty-state-icon">
              🎧
            </div>

            <h3>No analysis yet</h3>

            <p>
              Analyze a voice to see the result here.
            </p>

            <button
              class="primary-btn"
              data-page-target="analyze"
            >
              Analyze Voice
            </button>

          </div>

        </div>

      </section>


      <!-- HISTORY -->
      <section
        class="page-section"
        id="page-history"
      >

        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              LOCAL HISTORY
            </span>

            <h1>Analysis History</h1>

            <p>
              Your previous analysis results are stored
              locally in this browser.
            </p>

          </div>


          <button
            id="clearHistoryBtn"
            class="danger-outline-btn"
          >
            🗑️ Clear History
          </button>

        </div>


        <div
          id="historyList"
          class="history-list"
        >

          <div class="empty-state">

            <div class="empty-state-icon">
              🕘
            </div>

            <h3>No history yet</h3>

            <p>
              Your analyzed recordings will appear here.
            </p>

          </div>

        </div>

      </section>


      <!-- SETTINGS -->
      <section
        class="page-section"
        id="page-settings"
      >

        <div class="section-heading-row">

          <div>
            <span class="section-kicker">
              PREFERENCES
            </span>

            <h1>Settings</h1>

            <p>
              Manage VoiceGuard's local preferences.
            </p>
          </div>

        </div>


        <div class="settings-grid">

          <div class="settings-card">

            <div class="settings-card-icon">
              🔐
            </div>

            <div class="settings-card-content">

              <h3>Privacy</h3>

              <p>
                Analysis history is stored locally
                in your browser.
              </p>

            </div>

          </div>


          <div class="settings-card">

            <div class="settings-card-icon">
              🔔
            </div>

            <div class="settings-card-content">

              <h3>Security Notifications</h3>

              <p>
                Show VoiceGuard security notifications.
              </p>

            </div>


            <label class="switch">

              <input
                type="checkbox"
                id="securityNotificationsToggle"
                checked
              />

              <span class="slider"></span>

            </label>

          </div>


          <div class="settings-card">

            <div class="settings-card-icon">
              🤖
            </div>

            <div class="settings-card-content">

              <h3>Analysis Notifications</h3>

              <p>
                Notify when a voice analysis is complete.
              </p>

            </div>


            <label class="switch">

              <input
                type="checkbox"
                id="analysisNotificationsToggle"
                checked
              />

              <span class="slider"></span>

            </label>

          </div>


          <div class="settings-card">

            <div class="settings-card-icon">
              📞
            </div>

            <div class="settings-card-content">

              <h3>Incoming Call Demo</h3>

              <p>
                Test the VoiceGuard suspicious caller alert.
              </p>

            </div>


            <button
              id="simulateIncomingCallBtn"
              class="secondary-btn"
            >
              Test Alert
            </button>

          </div>

        </div>

      </section>

    </section>


    <!-- FOOTER -->
    <footer class="app-footer">

      <div>
        <strong>🛡️ VOICEGUARD</strong>

        <span>
          AI-Powered Voice Protection
        </span>
      </div>

      <div>
        Your voice. Your privacy. Your protection.
      </div>

    </footer>

  </main>

</div>
`;


/* =========================================================
   3. STATE
   ========================================================= */

let currentPage = 'home';

let mediaRecorder = null;
let audioChunks = [];
let selectedAudioBlob = null;
let selectedAudioFile = null;
let recordingTimerInterval = null;
let recordingSeconds = 0;

let intendedRecorder = null;
let intendedChunks = [];
let intendedVoiceBlob = null;

let personRecorder = null;
let personChunks = [];
let personVoiceBlob = null;

let scamRecorder = null;
let scamChunks = [];
let scamAudioBlob = null;

let scamRecognition = null;
let scamTranscriptText = '';

let currentLocation = null;
let currentResult = null;

let notifications = [];


/* =========================================================
   4. PAGE LABELS
   ========================================================= */

const pageLabels = {
  home: 'Home',
  dashboard: 'Dashboard',
  analyze: 'Analyze Voice',
  comparison: 'Voice Comparison',
  scam: 'Scam Detection',
  location: 'Location',
  results: 'Results',
  history: 'History',
  settings: 'Settings'
};


/* =========================================================
   5. ELEMENT REFERENCES
   ========================================================= */

const sidebar =
  document.querySelector('#sidebar');

const mobileMenuBtn =
  document.querySelector('#mobileMenuBtn');

const pageTitle =
  document.querySelector('#pageTitle');

const notificationBtn =
  document.querySelector('#notificationBtn');

const notificationPanel =
  document.querySelector('#notificationPanel');

const notificationList =
  document.querySelector('#notificationList');

const notificationDot =
  document.querySelector('#notificationDot');

const clearNotificationsBtn =
  document.querySelector('#clearNotificationsBtn');

const globalSearch =
  document.querySelector('#globalSearch');

const clearSearchBtn =
  document.querySelector('#clearSearchBtn');

const searchPanel =
  document.querySelector('#searchPanel');

const searchResultsList =
  document.querySelector('#searchResultsList');

const closeSearchPanelBtn =
  document.querySelector('#closeSearchPanelBtn');

const profileSettingsBtn =
  document.querySelector('#profileSettingsBtn');


/* Main analysis */

const startRecordBtn =
  document.querySelector('#startRecordBtn');

const stopRecordBtn =
  document.querySelector('#stopRecordBtn');

const recordingStatus =
  document.querySelector('#recordingStatus');

const recordingTimer =
  document.querySelector('#recordingTimer');

const audioUpload =
  document.querySelector('#audioUpload');

const audioPreview =
  document.querySelector('#audioPreview');

const audioPreviewEmpty =
  document.querySelector('#audioPreviewEmpty');

const selectedFileName =
  document.querySelector('#selectedFileName');

const captureLocationBtn =
  document.querySelector('#captureLocationBtn');

const analysisLocationInfo =
  document.querySelector('#analysisLocationInfo');

const shareRecordingBtn =
  document.querySelector('#shareRecordingBtn');

const analyzeVoiceBtn =
  document.querySelector('#analyzeVoiceBtn');


/* Location */

const getLocationBtn =
  document.querySelector('#getLocationBtn');

const locationResult =
  document.querySelector('#locationResult');


/* Results */

const resultsContainer =
  document.querySelector('#resultsContainer');


/* History */

const historyList =
  document.querySelector('#historyList');

const clearHistoryBtn =
  document.querySelector('#clearHistoryBtn');


/* Comparison */

const startIntendedRecordBtn =
  document.querySelector('#startIntendedRecordBtn');

const stopIntendedRecordBtn =
  document.querySelector('#stopIntendedRecordBtn');

const intendedUploadInput =
  document.querySelector('#intendedVoiceUpload');

const intendedAudioPreview =
  document.querySelector('#intendedAudioPreview');

const intendedFileName =
  document.querySelector('#intendedFileName');

const startPersonRecordBtn =
  document.querySelector('#startPersonRecordBtn');

const stopPersonRecordBtn =
  document.querySelector('#stopPersonRecordBtn');

const personUploadInput =
  document.querySelector('#personVoiceUpload');

const personAudioPreview =
  document.querySelector('#personAudioPreview');

const personFileName =
  document.querySelector('#personFileName');

const compareVoicesBtn =
  document.querySelector('#compareVoicesBtn');

const comparisonResult =
  document.querySelector('#comparisonResult');


/* Scam */

const startScamRecordBtn =
  document.querySelector('#startScamRecordBtn');

const stopScamRecordBtn =
  document.querySelector('#stopScamRecordBtn');

const scamUploadInput =
  document.querySelector('#scamAudioUpload');

const scamAudioPreview =
  document.querySelector('#scamAudioPreview');

const scamFileName =
  document.querySelector('#scamFileName');

const scamTranscript =
  document.querySelector('#scamTranscript');

const suspiciousPhrases =
  document.querySelector('#suspiciousPhrases');

const analyzeScamBtn =
  document.querySelector('#analyzeScamBtn');

const scamRiskResult =
  document.querySelector('#scamRiskResult');


/* Settings */

const securityNotificationsToggle =
  document.querySelector(
    '#securityNotificationsToggle'
  );

const analysisNotificationsToggle =
  document.querySelector(
    '#analysisNotificationsToggle'
  );

const simulateIncomingCallBtn =
  document.querySelector(
    '#simulateIncomingCallBtn'
  );


/* Dashboard */

const dashboardTotal =
  document.querySelector('#totalRecordings');

const dashboardAi =
  document.querySelector('#aiRecordings');

const dashboardHuman =
  document.querySelector('#humanRecordings');

const dashboardConfidence =
  document.querySelector('#averageConfidence');

const dashboardAiBar =
  document.querySelector('#aiBar');

const dashboardHumanBar =
  document.querySelector('#humanBar');

const dashboardAiPercent =
  document.querySelector('#aiPercentage');

const dashboardHumanPercent =
  document.querySelector('#humanPercentage');


/* =========================================================
   6. UTILITY FUNCTIONS
   ========================================================= */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


function formatDate(value) {
  if (!value) {
    return 'Unknown date';
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(
    undefined,
    {
      dateStyle: 'medium',
      timeStyle: 'short'
    }
  );
}


function formatDuration(seconds) {
  const mins =
    Math.floor(seconds / 60);

  const secs =
    seconds % 60;

  return (
    `${String(mins).padStart(2, '0')}:` +
    `${String(secs).padStart(2, '0')}`
  );
}


function setElementText(element, value) {
  if (!element) return;

  element.textContent =
    String(value ?? '');
}


function formatCoordinates(latitude, longitude) {
  if (
    !Number.isFinite(Number(latitude)) ||
    !Number.isFinite(Number(longitude))
  ) {
    return 'Unavailable';
  }

  return (
    `${Number(latitude).toFixed(6)}, ` +
    `${Number(longitude).toFixed(6)}`
  );
}


function formatLocation(location) {
  if (!location) {
    return 'Location not captured';
  }

  if (typeof location === 'string') {
    return location;
  }

  if (location.address) {
    return location.address;
  }

  if (
    Number.isFinite(Number(location.latitude)) &&
    Number.isFinite(Number(location.longitude))
  ) {
    return formatCoordinates(
      location.latitude,
      location.longitude
    );
  }

  return 'Location not captured';
}


function showError(message) {
  addNotification(
    'VoiceGuard Error',
    message,
    '⚠️'
  );

  window.alert(message);
}
/* =========================================================
   VOICEGUARD — SMART ALERT SYSTEM
   ========================================================= */

function isAnalysisNotificationsEnabled() {
  const toggle = document.querySelector('#analysisNotificationsToggle');

  if (toggle) {
    return toggle.checked;
  }

  return localStorage.getItem(
    'voiceguard_analysis_notifications'
  ) !== 'false';
}


function isSecurityNotificationsEnabled() {
  const toggle = document.querySelector('#securityNotificationsToggle');

  if (toggle) {
    return toggle.checked;
  }

  return localStorage.getItem(
    'voiceguard_security_notifications'
  ) !== 'false';
}


/* ---------------------------------------------------------
   SOFT SOUND — ANALYZE / COMPARISON
   --------------------------------------------------------- */

function playAnalysisSound() {

  try {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) return;

    const ctx = new AudioContext();

    const playTone = (
      frequency,
      startTime,
      duration,
      volume
    ) => {

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(
        0.0001,
        ctx.currentTime + startTime
      );

      gain.gain.exponentialRampToValueAtTime(
        volume,
        ctx.currentTime + startTime + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + startTime + duration
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(
        ctx.currentTime + startTime
      );

      oscillator.stop(
        ctx.currentTime + startTime + duration + 0.03
      );
    };

    playTone(660, 0, 0.12, 0.045);
    playTone(880, 0.14, 0.16, 0.055);

    setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, 500);

  } catch (error) {

    console.log(
      'Analysis sound unavailable:',
      error
    );

  }

}


/* ---------------------------------------------------------
   STRONG SOUND — SCAM ALERT
   --------------------------------------------------------- */

function playScamSound() {

  try {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) return;

    const ctx = new AudioContext();

    const playAlarmTone = (
      frequency,
      startTime,
      duration
    ) => {

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'square';
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(
        0.0001,
        ctx.currentTime + startTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.10,
        ctx.currentTime + startTime + 0.015
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + startTime + duration
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(
        ctx.currentTime + startTime
      );

      oscillator.stop(
        ctx.currentTime + startTime + duration + 0.03
      );
    };

    playAlarmTone(760, 0, 0.18);
    playAlarmTone(560, 0.22, 0.18);
    playAlarmTone(760, 0.44, 0.18);
    playAlarmTone(560, 0.66, 0.18);

    setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, 1100);

  } catch (error) {

    console.log(
      'Scam alert sound unavailable:',
      error
    );

  }

}


/* ---------------------------------------------------------
   SMALL ANALYSIS TOAST
   --------------------------------------------------------- */

function showAnalysisToast(
  title = 'Voice Analysis Complete',
  message = 'The voice analysis has been completed successfully.'
) {

  if (!isAnalysisNotificationsEnabled()) {
    return;
  }

  const oldToast =
    document.querySelector('#voiceGuardToast');

  if (oldToast) {
    oldToast.remove();
  }

  const toast =
    document.createElement('div');

  toast.id = 'voiceGuardToast';

  toast.className =
    'vg-analysis-toast';

  toast.innerHTML = `
    <div class="vg-analysis-toast-icon">
      🤖
    </div>

    <div class="vg-analysis-toast-content">

      <strong>
        ${escapeHtml(title)}
      </strong>

      <p>
        ${escapeHtml(message)}
      </p>

    </div>

    <button
      type="button"
      class="vg-analysis-toast-close"
      aria-label="Close notification"
    >
      ×
    </button>
  `;

  document.body.appendChild(toast);

  const closeToast = () => {

    if (!toast.isConnected) {
      return;
    }

    toast.classList.add('hide');

    setTimeout(() => {

      if (toast.isConnected) {
        toast.remove();
      }

    }, 300);

  };

  const closeButton =
    toast.querySelector(
      '.vg-analysis-toast-close'
    );

  closeButton?.addEventListener(
    'click',
    closeToast
  );

  playAnalysisSound();

  const timer =
    setTimeout(
      closeToast,
      4500
    );

  closeButton?.addEventListener(
    'click',
    () => clearTimeout(timer)
  );

}


/* ---------------------------------------------------------
   BIG SCAM ALERT
   --------------------------------------------------------- */

function showStrictScamWarning(message) {

  const safeMessage =
    message ||
    'Suspicious scam warning signs were detected.';

  /*
   * Keep the existing notification panel working.
   */
  addNotification(
    '⚠️ BE CAREFUL',
    safeMessage,
    '🚨'
  );

  /*
   * Security notification setting OFF:
   * keep panel notification, but don't show
   * large popup or sound.
   */
  if (!isSecurityNotificationsEnabled()) {
    return;
  }

  const existing =
    document.querySelector('#vgScamAlert');

  if (existing) {
    existing.remove();
  }

  const overlay =
    document.createElement('div');

  overlay.id = 'vgScamAlert';

  overlay.className =
    'vg-scam-alert';

  overlay.setAttribute(
    'role',
    'alertdialog'
  );

  overlay.setAttribute(
    'aria-modal',
    'true'
  );

  overlay.innerHTML = `
    <div class="vg-scam-alert-box">

      <button
        type="button"
        class="vg-scam-alert-close"
        aria-label="Close scam alert"
      >
        ×
      </button>

      <div class="vg-scam-alert-icon">
        🚨
      </div>

      <div class="vg-scam-alert-label">
        VOICEGUARD SECURITY ALERT
      </div>

      <h2>
        Potential Scam Call Detected
      </h2>

      <p>
        ${escapeHtml(safeMessage)}
      </p>

      <div class="vg-scam-alert-warning">
        Never share OTPs, PINs, passwords,
        banking details, or send money because
        of a phone call.
      </div>

      <button
        type="button"
        class="vg-scam-alert-action"
      >
        I Understand
      </button>

    </div>
  `;

  document.body.appendChild(overlay);

  const closeAlert = () => {

    if (overlay.isConnected) {
      overlay.remove();
    }

  };

  overlay
    .querySelector('.vg-scam-alert-close')
    ?.addEventListener(
      'click',
      closeAlert
    );

  overlay
    .querySelector('.vg-scam-alert-action')
    ?.addEventListener(
      'click',
      closeAlert
    );

  /*
   * Clicking outside the white alert box
   * also closes it.
   */
  overlay.addEventListener(
    'click',
    (event) => {

      if (event.target === overlay) {
        closeAlert();
      }

    }
  );

  playScamSound();

}
/* =========================================================
   7. NAVIGATION
   ========================================================= */

function navigateTo(page) {

  if (!pageLabels[page]) {
    return;
  }

  currentPage = page;


  document
    .querySelectorAll('.page-section')
    .forEach((section) => {

      section.classList.remove('active');

    });


  const target =
    document.querySelector(
      `#page-${page}`
    );


  target?.classList.add('active');


  document
    .querySelectorAll('.nav-item')
    .forEach((item) => {

      item.classList.toggle(
        'active',
        item.dataset.page === page
      );

    });


  if (pageTitle) {

    pageTitle.textContent =
      pageLabels[page];

  }


  sidebar?.classList.remove('open');


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });


  /* -----------------------------------------
     HISTORY
     ----------------------------------------- */

  if (page === 'history') {

    loadHistory();

  }


  /* -----------------------------------------
     DASHBOARD
     ----------------------------------------- */

  if (page === 'dashboard') {

    setTimeout(() => {

      updateDashboard();

    }, 100);

  }

}


document
  .querySelectorAll('.nav-item')
  .forEach((button) => {

    button.addEventListener(
      'click',
      () => {

        navigateTo(
          button.dataset.page
        );

      }
    );

  });


document
  .querySelectorAll('[data-page-target]')
  .forEach((button) => {

    button.addEventListener(
      'click',
      () => {

        navigateTo(
          button.dataset.pageTarget
        );

      }
    );

  });


mobileMenuBtn?.addEventListener(
  'click',
  () => {

    sidebar?.classList.toggle(
      'open'
    );

  }
);


profileSettingsBtn?.addEventListener(
  'click',
  () => {

    navigateTo('settings');

  }
);

/* =========================================================
   8. NOTIFICATIONS
   ========================================================= */

function addNotification(
  title,
  message,
  icon = '🛡️'
) {
  /*
   * Supports both:
   * addNotification(title, message, icon)
   * and old calls:
   * addNotification(message, 'success')
   */

  const oldStyleTypes = [
    'success',
    'warning',
    'error',
    'info'
  ];

  if (
    oldStyleTypes.includes(String(message))
  ) {
    icon =
      message === 'success'
        ? '✅'
        : message === 'warning'
          ? '⚠️'
          : message === 'error'
            ? '❌'
            : 'ℹ️';

    message = title;
    title = 'VoiceGuard';
  }

  const item = {
    id: Date.now() + Math.random(),
    title: String(title || 'VoiceGuard'),
    message: String(message || ''),
    icon,
    timestamp: new Date()
  };

  notifications.unshift(item);

  notifications =
    notifications.slice(0, 30);

  renderNotifications();

  if (notificationDot) {
    notificationDot.style.display =
      'block';
  }
}


function renderNotifications() {
  if (!notificationList) return;

  if (notifications.length === 0) {
    notificationList.innerHTML = `
      <div class="notification-item">
        <span class="notification-item-icon">
          🛡️
        </span>

        <div>
          <strong>No new notifications</strong>
          <p>VoiceGuard is ready.</p>
        </div>
      </div>
    `;

    return;
  }

  notificationList.innerHTML =
    notifications
      .map(
        (item) => `
          <div class="notification-item">

            <span class="notification-item-icon">
              ${escapeHtml(item.icon)}
            </span>

            <div>
              <strong>
                ${escapeHtml(item.title)}
              </strong>

              <p>
                ${escapeHtml(item.message)}
              </p>

              <small>
                ${formatDate(item.timestamp)}
              </small>
            </div>

          </div>
        `
      )
      .join('');
}


notificationBtn?.addEventListener(
  'click',
  (event) => {
    event.stopPropagation();

    if (!notificationPanel) return;

    const hidden =
      notificationPanel.style.display ===
        'none' ||
      !notificationPanel.style.display;

    notificationPanel.style.display =
      hidden ? 'block' : 'none';

    if (hidden && notificationDot) {
      notificationDot.style.display =
        'none';
    }
  }
);


clearNotificationsBtn?.addEventListener(
  'click',
  () => {
    notifications = [];

    renderNotifications();

    if (notificationDot) {
      notificationDot.style.display =
        'none';
    }
  }
);


document.addEventListener(
  'click',
  (event) => {
    if (
      notificationPanel &&
      !notificationPanel.contains(
        event.target
      ) &&
      event.target !== notificationBtn
    ) {
      notificationPanel.style.display =
        'none';
    }
  }
);


/* =========================================================
   9. SEARCH
   ========================================================= */

async function searchHistory(query) {
  if (!searchResultsList) return;

  const cleanQuery =
    String(query || '')
      .trim()
      .toLowerCase();

  if (!cleanQuery) {
    searchResultsList.innerHTML = `
      <div class="search-empty">
        Type a filename, date or verdict to search.
      </div>
    `;

    return;
  }

  try {
    const history =
      await getHistory();

    const matches =
      history.filter((item) => {
        const searchable = [
          item.filename,
          item.verdict,
          item.timestamp,
          item.location?.address,
          item.location?.latitude,
          item.location?.longitude
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchable.includes(
          cleanQuery
        );
      });

    if (matches.length === 0) {
      searchResultsList.innerHTML = `
        <div class="search-empty">
          No matching analysis results found.
        </div>
      `;

      return;
    }

    searchResultsList.innerHTML =
      matches
        .map(
          (item) => `
            <button
              class="search-result-item"
              data-history-id="${item.id}"
            >

              <div class="search-result-icon">
                ${
                  item.verdict === 'synthetic'
                    ? '🤖'
                    : '👤'
                }
              </div>

              <div>

                <strong>
                  ${escapeHtml(
                    item.filename ||
                      'Voice recording'
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    item.verdict ||
                      'unknown'
                  )}
                </span>

                <small>
                  ${formatDate(
                    item.timestamp
                  )}
                </small>

              </div>

            </button>
          `
        )
        .join('');

    searchResultsList
      .querySelectorAll(
        '.search-result-item'
      )
      .forEach((button) => {
        button.addEventListener(
          'click',
          async () => {
            const id =
              Number(
                button.dataset.historyId
              );

            const item =
              await getHistoryItem(id);

            if (!item) return;

            displayResult(item);

            navigateTo('results');

            if (searchPanel) {
              searchPanel.style.display =
                'none';
            }
          }
        );
      });

  } catch (error) {
    console.error(
      'Search error:',
      error
    );
  }
}


globalSearch?.addEventListener(
  'input',
  () => {
    const value =
      globalSearch.value.trim();

    if (clearSearchBtn) {
      clearSearchBtn.style.display =
        value ? 'block' : 'none';
    }

    if (searchPanel) {
      searchPanel.style.display =
        value ? 'block' : 'none';
    }

    searchHistory(value);
  }
);


clearSearchBtn?.addEventListener(
  'click',
  () => {
    if (globalSearch) {
      globalSearch.value = '';
      globalSearch.focus();
    }

    if (clearSearchBtn) {
      clearSearchBtn.style.display =
        'none';
    }

    if (searchPanel) {
      searchPanel.style.display =
        'none';
    }

    if (searchResultsList) {
      searchResultsList.innerHTML = '';
    }
  }
);


closeSearchPanelBtn?.addEventListener(
  'click',
  () => {
    if (searchPanel) {
      searchPanel.style.display =
        'none';
    }
  }
);


/* =========================================================
   10. INDEXEDDB
   ========================================================= */

const DB_NAME =
  'VoiceGuardDB';

const DB_VERSION =
  5;

const STORE_NAME =
  'voiceHistory';


function openDatabase() {
  return new Promise(
    (resolve, reject) => {

      const request =
        indexedDB.open(
          DB_NAME,
          DB_VERSION
        );

      request.onupgradeneeded =
        (event) => {

          const db =
            event.target.result;

          let store;

          if (
            !db.objectStoreNames
              .contains(STORE_NAME)
          ) {
            store =
              db.createObjectStore(
                STORE_NAME,
                {
                  keyPath: 'id',
                  autoIncrement: true
                }
              );
          } else {
            store =
              event.target.transaction
                .objectStore(
                  STORE_NAME
                );
          }

          if (
            !store.indexNames
              .contains('timestamp')
          ) {
            store.createIndex(
              'timestamp',
              'timestamp',
              { unique: false }
            );
          }
        };

      request.onsuccess =
        () => {
          const db =
            request.result;

          db.onversionchange =
            () => db.close();

          resolve(db);
        };

      request.onerror =
        () => {
          reject(request.error);
        };
    }
  );
}


async function saveHistory(item) {
  const db =
    await openDatabase();

  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          'readwrite'
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.put(item);

      request.onsuccess =
        () => {
          resolve(request.result);
        };

      request.onerror =
        () => {
          reject(request.error);
        };
    }
  );
}


async function getHistory() {
  const db =
    await openDatabase();

  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          'readonly'
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.getAll();

      request.onsuccess =
        () => {

          const records =
            request.result || [];

          records.sort(
            (a, b) =>
              new Date(
                b.timestamp
              ) -
              new Date(
                a.timestamp
              )
          );

          resolve(records);
        };

      request.onerror =
        () => {
          reject(request.error);
        };
    }
  );
}


async function getHistoryItem(id) {
  const db =
    await openDatabase();

  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          'readonly'
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.get(id);

      request.onsuccess =
        () => {
          resolve(
            request.result ||
            null
          );
        };

      request.onerror =
        () => {
          reject(request.error);
        };
    }
  );
}


async function clearHistoryDatabase() {
  const db =
    await openDatabase();

  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          'readwrite'
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.clear();

      request.onsuccess =
        () => resolve();

      request.onerror =
        () => reject(
          request.error
        );
    }
  );
}


/* =========================================================
   11. MIME TYPE
   ONLY ONE DECLARATION
   ========================================================= */

function getSupportedMimeType() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg'
  ];

  if (!window.MediaRecorder) {
    return '';
  }

  return (
    types.find(
      (type) =>
        MediaRecorder.isTypeSupported(
          type
        )
    ) || ''
  );
}


/* =========================================================
   12. RECORDING TIMER
   ========================================================= */

function startRecordingTimer() {
  recordingSeconds = 0;

  if (recordingTimer) {
    recordingTimer.textContent =
      formatDuration(
        recordingSeconds
      );
  }

  clearInterval(
    recordingTimerInterval
  );

  recordingTimerInterval =
    setInterval(() => {

      recordingSeconds++;

      if (recordingTimer) {
        recordingTimer.textContent =
          formatDuration(
            recordingSeconds
          );
      }

    }, 1000);
}


function stopRecordingTimer() {
  clearInterval(
    recordingTimerInterval
  );

  recordingTimerInterval = null;
}


/* =========================================================
   13. MAIN VOICE RECORDING
   ========================================================= */

async function startMainRecording() {

  if (
    !navigator.mediaDevices?.getUserMedia
  ) {
    showError(
      'Your browser does not support microphone recording.'
    );

    return;
  }

  try {

    const stream =
      await navigator.mediaDevices
        .getUserMedia({
          audio: true
        });

    const mimeType =
      getSupportedMimeType();

    mediaRecorder =
      mimeType
        ? new MediaRecorder(
            stream,
            { mimeType }
          )
        : new MediaRecorder(
            stream
          );

    audioChunks = [];

    mediaRecorder.ondataavailable =
      (event) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          audioChunks.push(
            event.data
          );
        }
      };

    mediaRecorder.onstop =
      () => {

        const type =
          mediaRecorder.mimeType ||
          'audio/webm';

        selectedAudioBlob =
          new Blob(
            audioChunks,
            { type }
          );

        const extension =
          type.includes('ogg')
            ? 'ogg'
            : type.includes('mp4')
              ? 'm4a'
              : 'webm';

        selectedAudioFile =
          new File(
            [selectedAudioBlob],
            `voiceguard-recording.${extension}`,
            { type }
          );

        updateAudioPreview(
          selectedAudioBlob,
          selectedAudioFile.name
        );

        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        if (startRecordBtn) {
          startRecordBtn.disabled =
            false;
        }

        if (stopRecordBtn) {
          stopRecordBtn.disabled =
            true;
        }

        if (recordingStatus) {
          recordingStatus.textContent =
            'Recording completed';

          recordingStatus.classList
            .remove(
              'recording'
            );
        }
      };

    mediaRecorder.start();

    startRecordingTimer();

    if (startRecordBtn) {
      startRecordBtn.disabled =
        true;
    }

    if (stopRecordBtn) {
      stopRecordBtn.disabled =
        false;
    }

    if (recordingStatus) {
      recordingStatus.textContent =
        'Recording in progress...';

      recordingStatus.classList.add(
        'recording'
      );
    }

  } catch (error) {

    console.error(
      'Microphone error:',
      error
    );

    showError(
      'Microphone access was not available. Please allow microphone permission.'
    );
  }
}


function stopMainRecording() {

  if (
    !mediaRecorder ||
    mediaRecorder.state ===
      'inactive'
  ) {
    return;
  }

  mediaRecorder.stop();

  stopRecordingTimer();

  if (stopRecordBtn) {
    stopRecordBtn.disabled =
      true;
  }
}


function updateAudioPreview(
  blob,
  filename
) {
  if (!blob) return;

  if (audioPreview) {
    if (audioPreview.src) {
      try {
        URL.revokeObjectURL(
          audioPreview.src
        );
      } catch {}
    }

    audioPreview.src =
      URL.createObjectURL(
        blob
      );

    audioPreview.style.display =
      'block';
  }

  if (audioPreviewEmpty) {
    audioPreviewEmpty.style.display =
      'none';
  }

  if (selectedFileName) {
    selectedFileName.textContent =
      filename ||
      'Audio recording selected';
  }
}


startRecordBtn?.addEventListener(
  'click',
  startMainRecording
);

stopRecordBtn?.addEventListener(
  'click',
  stopMainRecording
);


/* =========================================================
   14. MAIN AUDIO UPLOAD
   ========================================================= */

audioUpload?.addEventListener(
  'change',
  (event) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    selectedAudioFile =
      file;

    selectedAudioBlob =
      file;

    updateAudioPreview(
      file,
      file.name
    );

    addNotification(
      'Recording selected',
      file.name,
      '📁'
    );
  }
);


/* =========================================================
   15. LOCATION
   ========================================================= */

async function reverseGeocode(
  latitude,
  longitude
) {
  try {

    const response =
      await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

    if (!response.ok) {
      throw new Error(
        'Reverse geocoding failed'
      );
    }

    const data =
      await response.json();

    const city =
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      '';

    const country =
      data.countryName ||
      '';

    const parts =
      [city, country]
        .filter(Boolean);

    return parts.length
      ? parts.join(', ')
      : 'Location detected';

  } catch (error) {

    console.warn(
      'Reverse geocoding failed:',
      error
    );

    return 'Location detected';
  }
}


function getLocationReason(error) {

  if (!error) {
    return 'Location unavailable';
  }

  switch (error.code) {
    case 1:
      return 'Location permission denied';

    case 2:
      return 'Location information unavailable';

    case 3:
      return 'Location request timed out';

    default:
      return 'Unable to detect location';
  }
}


function getCurrentLocation() {

  return new Promise(
    (resolve, reject) => {

      if (!navigator.geolocation) {
        reject(
          new Error(
            'Geolocation is not supported by this browser.'
          )
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const accuracy =
            position.coords.accuracy;

          const address =
            await reverseGeocode(
              latitude,
              longitude
            );

          resolve({
            latitude,
            longitude,
            accuracy,
            address
          });
        },

        reject,

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }
  );
}


async function captureLocationForAnalysis() {

  try {

    const location =
      await getCurrentLocation();

    currentLocation =
      location;

    if (analysisLocationInfo) {

      analysisLocationInfo.style.display =
        'block';

      analysisLocationInfo.textContent =
        `📍 ${location.address} • ` +
        `${formatCoordinates(
          location.latitude,
          location.longitude
        )}`;
    }

    return location;

  } catch (error) {

    console.warn(
      'Location capture failed:',
      error
    );

    currentLocation = {
      latitude: null,
      longitude: null,
      accuracy: null,
      address:
        getLocationReason(error)
    };

    if (analysisLocationInfo) {
      analysisLocationInfo.style.display =
        'block';

      analysisLocationInfo.textContent =
        `📍 ${currentLocation.address}`;
    }

    return currentLocation;
  }
}


captureLocationBtn?.addEventListener(
  'click',
  async () => {

    captureLocationBtn.disabled =
      true;

    captureLocationBtn.textContent =
      '📍 Detecting...';

    await captureLocationForAnalysis();

    captureLocationBtn.disabled =
      false;

    captureLocationBtn.textContent =
      '📍 Capture Location';
  }
);


getLocationBtn?.addEventListener(
  'click',
  async () => {

    getLocationBtn.disabled =
      true;

    getLocationBtn.textContent =
      '📍 Detecting...';

    if (locationResult) {
      locationResult.textContent =
        'Please wait...';
    }

    try {

      const location =
        await getCurrentLocation();

      currentLocation =
        location;

      if (locationResult) {
        locationResult.innerHTML = `
          <strong>
            ${escapeHtml(
              location.address ||
                'Location detected'
            )}
          </strong>

          <br />

          Coordinates:
          ${escapeHtml(
            formatCoordinates(
              location.latitude,
              location.longitude
            )
          )}

          <br />

          Accuracy:
          ${
            location.accuracy
              ? `${Math.round(
                  location.accuracy
                )} meters`
              : 'Unavailable'
          }
        `;
      }

      addNotification(
        'Location detected successfully.',
        'success'
      );

    } catch (error) {

      console.warn(
        'Location error:',
        error
      );

      if (locationResult) {
        locationResult.textContent =
          getLocationReason(
            error
          );
      }

      addNotification(
        getLocationReason(error),
        'warning'
      );

    } finally {

      getLocationBtn.disabled =
        false;

      getLocationBtn.textContent =
        '📍 Get Current Location';
    }
  }
);


/* =========================================================
   16. NORMALIZE MODULATE RESULT
   ========================================================= */

function normalizeResult(data) {

  const frames =
    data?.frames ||
    data?.result?.frames ||
    data?.data?.frames ||
    [];

  if (
    !Array.isArray(frames) ||
    frames.length === 0
  ) {
    throw new Error(
      'No voice analysis frames were returned by the AI service.'
    );
  }

  let aiTotal = 0;
  let humanTotal = 0;

  const normalizedFrames =
    frames.map(
      (frame) => {

        const rawVerdict =
          String(
            frame?.verdict || ''
          ).toLowerCase();

        let confidence =
          Number(
            frame?.confidence
          );

        if (
          !Number.isFinite(
            confidence
          )
        ) {
          confidence = 0;
        }

        confidence =
          Math.max(
            0,
            Math.min(
              1,
              confidence
            )
          );

        const isSynthetic =
          rawVerdict.includes(
            'synthetic'
          ) &&
          !rawVerdict.includes(
            'non-synthetic'
          );

        let aiProbability;
        let humanProbability;

        if (isSynthetic) {

          aiProbability =
            confidence;

          humanProbability =
            1 - confidence;

        } else {

          humanProbability =
            confidence;

          aiProbability =
            1 - confidence;
        }

        aiTotal +=
          aiProbability;

        humanTotal +=
          humanProbability;

        return {
          startMs:
            frame?.start_ms ??
            frame?.startMs ??
            0,

          endMs:
            frame?.end_ms ??
            frame?.endMs ??
            0,

          verdict:
            rawVerdict ||
            'unknown',

          confidence,

          aiProbability,

          humanProbability
        };
      }
    );

  let aiPercentage =
    (
      aiTotal /
      normalizedFrames.length
    ) * 100;

  let humanPercentage =
    (
      humanTotal /
      normalizedFrames.length
    ) * 100;

  const total =
    aiPercentage +
    humanPercentage;

  if (total > 0) {

    aiPercentage =
      (
        aiPercentage /
        total
      ) * 100;

    humanPercentage =
      (
        humanPercentage /
        total
      ) * 100;
  }

  const verdict =
    aiPercentage >=
      humanPercentage
      ? 'synthetic'
      : 'non-synthetic';

  const confidence =
    Math.max(
      aiPercentage,
      humanPercentage
    ) / 100;

  return {
    verdict,
    aiPercentage,
    humanPercentage,
    confidence,
    frames:
      normalizedFrames
  };
}


/* =========================================================
   17. SINGLE VOICE ANALYSIS
   ========================================================= */

analyzeVoiceBtn?.addEventListener(
  'click',
  analyzeVoice
);


async function analyzeVoice() {

  if (!selectedAudioBlob) {

    addNotification(
      'Please record or upload a voice recording first.',
      'warning'
    );

    return;
  }

  try {

    analyzeVoiceBtn.disabled =
      true;

    analyzeVoiceBtn.textContent =
      '🤖 Analyzing Voice...';


    const location =
      await captureLocationForAnalysis();


    const formData =
      new FormData();


    const filename =
      selectedAudioFile?.name ||
      'voiceguard-recording.webm';


    formData.append(
      'audio',
      selectedAudioBlob,
      filename
    );


    const response =
      await fetch(
        'http://localhost:3000/api/analyze',
        {
          method: 'POST',
          body: formData
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        'Voice analysis failed.'
      );
    }


    const result =
      normalizeResult(data);


    const historyItem = {
      id: Date.now(),
      filename,

      verdict:
        result.verdict,

      aiPercentage:
        Number(
          result.aiPercentage
        ),

      humanPercentage:
        Number(
          result.humanPercentage
        ),

      confidence:
        Number(
          result.confidence
        ),

      timestamp:
        new Date().toISOString(),

      location,

      audioBlob:
        selectedAudioBlob
    };


    await saveHistory(
      historyItem
    );


    currentResult =
      historyItem;


    displayResult(
      historyItem
    );


    await updateDashboard();

    await loadHistory();


    addNotification(
  'Voice analysis completed successfully.',
  'success'
);

showAnalysisToast(
  'AI Voice Analysis Complete',
  'Voice analysis finished. Your result is ready to view.'
);

navigateTo('results');


  } catch (error) {

    console.error(
      'Voice analysis error:',
      error
    );

    addNotification(
      error.message ||
      'Voice analysis failed.',
      'error'
    );

  } finally {

    analyzeVoiceBtn.disabled =
      false;

    analyzeVoiceBtn.textContent =
      '🤖 Analyze Voice';
  }
}


/* =========================================================
   18. RESULTS DISPLAY
   ========================================================= */

function displayResult(item) {

  if (!item || !resultsContainer) {
    return;
  }

  currentResult =
    item;


  const ai =
    Number(
      item.aiPercentage || 0
    );

  const human =
    Number(
      item.humanPercentage || 0
    );

  const confidence =
    Number(
      item.confidence || 0
    ) * 100;


  const isAI =
    item.verdict ===
    'synthetic';


  const locationText =
    formatLocation(
      item.location
    );


  let audioHtml = '';

  if (item.audioBlob) {

    try {

      const audioUrl =
        URL.createObjectURL(
          item.audioBlob
        );

      audioHtml = `
        <audio
          controls
          class="result-audio"
          src="${audioUrl}"
        ></audio>
      `;

    } catch {
      audioHtml = '';
    }
  }


  resultsContainer.innerHTML = `
    <div class="result-card">

      <div class="result-card-header">

        <div>
          <span class="section-kicker">
            VOICEGUARD RESULT
          </span>

          <h2>
            ${
              isAI
                ? '🤖 Likely AI Generated'
                : '👤 Likely Human Voice'
            }
          </h2>

          <p>
            ${escapeHtml(
              item.filename ||
                'Voice recording'
            )}
          </p>
        </div>


        <div class="result-verdict-badge">
          ${
            isAI
              ? 'Synthetic'
              : 'Non-Synthetic'
          }
        </div>

      </div>


      ${audioHtml}


      <div class="result-score-grid">

        <div class="result-score-card">

          <span>AI Score</span>

          <strong>
            ${ai.toFixed(2)}%
          </strong>

        </div>


        <div class="result-score-card">

          <span>Human Score</span>

          <strong>
            ${human.toFixed(2)}%
          </strong>

        </div>


        <div class="result-score-card">

          <span>Confidence</span>

          <strong>
            ${confidence.toFixed(2)}%
          </strong>

        </div>

      </div>


      <div class="result-details">

        <div>
          <span>📅 Date & Time</span>
          <strong>
            ${escapeHtml(
              formatDate(
                item.timestamp
              )
            )}
          </strong>
        </div>


        <div>
          <span>📍 Location</span>
          <strong>
            ${escapeHtml(
              locationText
            )}
          </strong>
        </div>

      </div>


      <div class="result-actions">

        <button
          id="shareResultBtn"
          class="secondary-btn"
        >
          🔗 Share Result
        </button>

        <button
          id="resultHistoryBtn"
          class="secondary-btn"
        >
          🕘 View History
        </button>

        <button
          id="newAnalysisBtn"
          class="primary-btn"
        >
          🎙️ New Analysis
        </button>

      </div>


      <div class="result-note">

        <strong>ℹ️ Note</strong>

        <p>
          These percentages are derived from the
          AI voice-analysis frame confidences returned
          by the analysis service. They should be treated
          as analysis signals, not absolute proof.
        </p>

      </div>

    </div>
  `;


  document
    .querySelector('#shareResultBtn')
    ?.addEventListener(
      'click',
      shareCurrentResult
    );


  document
    .querySelector('#resultHistoryBtn')
    ?.addEventListener(
      'click',
      () => {
        navigateTo('history');
      }
    );


  document
    .querySelector('#newAnalysisBtn')
    ?.addEventListener(
      'click',
      () => {
        navigateTo('analyze');
      }
    );
}


/* =========================================================
   19. SHARE RECORDING
   ========================================================= */

shareRecordingBtn?.addEventListener(
  'click',
  shareSelectedRecording
);


async function shareSelectedRecording() {

  if (!selectedAudioBlob) {

    addNotification(
      'No recording available to share.',
      'warning'
    );

    return;
  }


  const filename =
    selectedAudioFile?.name ||
    'voiceguard-recording.webm';


  try {

    const file =
      new File(
        [selectedAudioBlob],
        filename,
        {
          type:
            selectedAudioBlob.type ||
            'audio/webm'
        }
      );


    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file]
      })
    ) {

      await navigator.share({
        title:
          'VoiceGuard Recording',

        text:
          'Voice recording analyzed with VoiceGuard.',

        files: [file]
      });

    } else if (
      navigator.share
    ) {

      await navigator.share({
        title:
          'VoiceGuard Recording',

        text:
          'Voice recording analyzed with VoiceGuard.'
      });

    } else {

      addNotification(
        'Sharing is not supported in this browser.',
        'warning'
      );
    }

  } catch (error) {

    if (
      error?.name !==
      'AbortError'
    ) {

      console.error(
        'Share recording error:',
        error
      );
    }
  }
}


/* =========================================================
   20. SHARE RESULT
   ========================================================= */

async function shareCurrentResult() {

  if (!currentResult) {

    addNotification(
      'No result available to share.',
      'warning'
    );

    return;
  }


  const verdict =
    currentResult.verdict ===
      'synthetic'
      ? 'Likely AI Generated'
      : 'Likely Human Voice';


  const shareText =
    `VoiceGuard Result\n\n` +
    `Verdict: ${verdict}\n` +
    `AI Score: ${Number(
      currentResult.aiPercentage || 0
    ).toFixed(2)}%\n` +
    `Human Score: ${Number(
      currentResult.humanPercentage || 0
    ).toFixed(2)}%\n` +
    `Confidence: ${(
      Number(
        currentResult.confidence || 0
      ) * 100
    ).toFixed(2)}%`;


  try {

    if (navigator.share) {

      await navigator.share({
        title:
          'VoiceGuard Analysis Result',
        text:
          shareText
      });

    } else if (
      navigator.clipboard
    ) {

      await navigator.clipboard.writeText(
        shareText
      );

      addNotification(
        'Result copied to clipboard.',
        'success'
      );

    } else {

      window.prompt(
        'Copy VoiceGuard result:',
        shareText
      );
    }

  } catch (error) {

    if (
      error?.name !==
      'AbortError'
    ) {
      console.error(
        'Share result error:',
        error
      );
    }
  }
}

/* =========================================================
   21. HISTORY
   ========================================================= */

async function loadHistory() {

  if (!historyList) {
    return;
  }

  try {

    const history = await getHistory();

    if (
      !Array.isArray(history) ||
      history.length === 0
    ) {

      historyList.innerHTML = `
        <div class="empty-state">

          <div class="empty-state-icon">
            🕘
          </div>

          <h3>No analysis history yet</h3>

          <p>
            Your analyzed voice recordings
            will appear here.
          </p>

        </div>
      `;

      return;
    }

    const sorted =
      [...history].sort(
        (a, b) =>
          new Date(b.timestamp) -
          new Date(a.timestamp)
      );


    historyList.innerHTML =
      sorted
        .map((item) => {

          /* -----------------------------------------
             GET AI / HUMAN SCORES
             ----------------------------------------- */

          let aiScore =
            Number(
              item.aiPercentage ??
              item.aiScore ??
              item.ai ??
              0
            );

          let humanScore =
            Number(
              item.humanPercentage ??
              item.humanScore ??
              item.human ??
              0
            );

          /* Decimal → Percentage */

          if (
            aiScore > 0 &&
            aiScore <= 1
          ) {
            aiScore *= 100;
          }

          if (
            humanScore > 0 &&
            humanScore <= 1
          ) {
            humanScore *= 100;
          }


          /* -----------------------------------------
             CONFIDENCE
             ----------------------------------------- */

          let confidence =
            Number(
              item.confidence ?? 0
            );

          if (
            confidence > 0 &&
            confidence <= 1
          ) {
            confidence *= 100;
          }


          /* -----------------------------------------
             VERDICT
             ----------------------------------------- */

          const rawVerdict =
            String(
              item.verdict || ''
            ).toLowerCase();

          const verdict =
            rawVerdict.includes('synthetic') ||
            rawVerdict.includes('ai')
              ? 'Likely AI Generated'
              : 'Likely Human Voice';


          /* -----------------------------------------
             RETURN CARD
             ----------------------------------------- */

          return `
            <article
              class="history-card"
              data-history-id="${item.id}"
            >

              <div class="history-card-header">

                <div>

                  <h3>
                    ${escapeHtml(
                      item.filename ||
                      'Voice recording'
                    )}
                  </h3>

                  <p>
                    ${escapeHtml(
                      formatDate(
                        item.timestamp
                      )
                    )}
                  </p>

                </div>


                <span class="history-verdict">
                  ${escapeHtml(
                    verdict
                  )}
                </span>

              </div>


              <div class="history-stats">

                <div>
                  <span>AI Score</span>

                  <strong>
                    ${aiScore.toFixed(2)}%
                  </strong>
                </div>


                <div>
                  <span>Human Score</span>

                  <strong>
                    ${humanScore.toFixed(2)}%
                  </strong>
                </div>


                <div>
                  <span>Confidence</span>

                  <strong>
                    ${confidence.toFixed(2)}%
                  </strong>
                </div>

              </div>


              <div class="history-location">
                📍 ${escapeHtml(
                  formatLocation(
                    item.location
                  )
                )}
              </div>


              <button
                class="history-view-btn"
                data-history-view="${item.id}"
              >
                View Result
              </button>

            </article>
          `;

        })
        .join('');


    /* -----------------------------------------
       VIEW RESULT BUTTONS
       ----------------------------------------- */

    historyList
      .querySelectorAll(
        '[data-history-view]'
      )
      .forEach((button) => {

        button.addEventListener(
          'click',
          async () => {

            const id =
              Number(
                button.dataset.historyView
              );

            const item =
              await getHistoryItem(id);

            if (!item) {
              return;
            }

            displayResult(item);

            navigateTo('results');

          }
        );

      });

  } catch (error) {

    console.error(
      'History loading error:',
      error
    );

    historyList.innerHTML = `
      <div class="empty-state">

        <h3>
          Unable to load history
        </h3>

        <p>
          Please refresh the page and try again.
        </p>

      </div>
    `;
  }
}
/* =========================================================
   DASHBOARD UPDATE
   History is the single source of truth
   ========================================================= */

async function updateDashboard() {

  try {

    /* -----------------------------------------
       GET HISTORY
       ----------------------------------------- */

    const history = await getHistory();

    console.log(
      '📊 Dashboard History:',
      history
    );


    if (!Array.isArray(history)) {
      return;
    }


    const totalRecordings =
      history.length;


    let likelyAI = 0;

    let likelyHuman = 0;

    let totalConfidence = 0;


    /* -----------------------------------------
       PROCESS HISTORY
       ----------------------------------------- */

    history.forEach((item) => {

      /* -----------------------------------------
         VERDICT
         ----------------------------------------- */

      const verdict =
        String(
          item.verdict || ''
        ).toLowerCase();


     
      /* -----------------------------------------
         AI / HUMAN COUNT
         USE AI / HUMAN SCORES FIRST
         ----------------------------------------- */

      let ai =
        Number(
          item.aiPercentage ??
          item.aiScore ??
          item.ai ??
          0
        );

      let human =
        Number(
          item.humanPercentage ??
          item.humanScore ??
          item.human ??
          0
        );


      /* -----------------------------------------
         CONVERT DECIMAL TO PERCENTAGE
         ----------------------------------------- */

      if (
        ai > 0 &&
        ai <= 1
      ) {
        ai *= 100;
      }


      if (
        human > 0 &&
        human <= 1
      ) {
        human *= 100;
      }


      /* -----------------------------------------
         DECIDE AI / HUMAN USING SCORES
         ----------------------------------------- */

      if (ai > human) {

        likelyAI++;

      }

      else if (human > ai) {

        likelyHuman++;

      }

      else {

        /* -----------------------------------------
           FALLBACK TO VERDICT
           ONLY WHEN SCORES ARE NOT AVAILABLE
           ----------------------------------------- */

        if (
          verdict === 'non-synthetic' ||
          verdict.includes('non-synthetic') ||
          verdict.includes('human') ||
          verdict.includes('natural')
        ) {

          likelyHuman++;

        }

        else if (
          verdict === 'synthetic' ||
          verdict.includes('synthetic') ||
          verdict.includes('ai')
        ) {

          likelyAI++;

        }

      }


      /* -----------------------------------------
         CONFIDENCE
         ----------------------------------------- */

      let confidence =
        Number(
          item.confidence ??
          item.confidencePercentage ??
          0
        );


      if (
        confidence > 0 &&
        confidence <= 1
      ) {

        confidence *= 100;

      }


      totalConfidence += confidence;

    });


    /* -----------------------------------------
       CALCULATE DASHBOARD VALUES
       ----------------------------------------- */

    const averageConfidence =
      totalRecordings > 0
        ? totalConfidence /
          totalRecordings
        : 0;


    const aiDistribution =
      totalRecordings > 0
        ? (
            likelyAI /
            totalRecordings
          ) * 100
        : 0;


    const humanDistribution =
      totalRecordings > 0
        ? (
            likelyHuman /
            totalRecordings
          ) * 100
        : 0;


    /* -----------------------------------------
       GET ELEMENTS
       ----------------------------------------- */

    const totalRecordingsElement =
      document.getElementById(
        'totalRecordings'
      );


    const likelyAIElement =
      document.getElementById(
        'likelyAI'
      );


    const likelyHumanElement =
      document.getElementById(
        'likelyHuman'
      );


    const averageConfidenceElement =
      document.getElementById(
        'averageConfidence'
      );


    const aiDistributionElement =
      document.getElementById(
        'aiDistribution'
      );


    const humanDistributionElement =
      document.getElementById(
        'humanDistribution'
      );


    /* -----------------------------------------
       SET TEXT
       ----------------------------------------- */

    setElementText(
      totalRecordingsElement,
      totalRecordings
    );


    setElementText(
      likelyAIElement,
      likelyAI
    );


    setElementText(
      likelyHumanElement,
      likelyHuman
    );


    setElementText(
      averageConfidenceElement,
      `${averageConfidence.toFixed(1)}%`
    );


    setElementText(
      aiDistributionElement,
      `${aiDistribution.toFixed(1)}%`
    );


    setElementText(
      humanDistributionElement,
      `${humanDistribution.toFixed(1)}%`
    );


    /* -----------------------------------------
       UPDATE MAIN PROGRESS BARS
       ----------------------------------------- */

    const aiBar =
      document.getElementById(
        'aiBar'
      );


    const humanBar =
      document.getElementById(
        'humanBar'
      );


    if (aiBar) {

      aiBar.style.width =
        `${aiDistribution}%`;

      aiBar.setAttribute(
        'aria-valuenow',
        aiDistribution.toFixed(1)
      );

    }


    if (humanBar) {

      humanBar.style.width =
        `${humanDistribution}%`;

      humanBar.setAttribute(
        'aria-valuenow',
        humanDistribution.toFixed(1)
      );

    }


    /* -----------------------------------------
       OTHER PROGRESS ELEMENTS
       ----------------------------------------- */

    const aiProgress =
      document.getElementById(
        'aiProgress'
      );


    const humanProgress =
      document.getElementById(
        'humanProgress'
      );


    if (aiProgress) {

      aiProgress.style.width =
        `${aiDistribution}%`;

    }


    if (humanProgress) {

      humanProgress.style.width =
        `${humanDistribution}%`;

    }


    /* -----------------------------------------
       DEBUG
       ----------------------------------------- */

    console.log(
      '✅ Dashboard updated successfully:',
      {
        totalRecordings,
        likelyAI,
        likelyHuman,
        averageConfidence,
        aiDistribution,
        humanDistribution
      }
    );


  } catch (error) {

    console.error(
      '❌ Dashboard update error:',
      error
    );

  }
  }


/* =========================================================
   22. CLEAR HISTORY
   ========================================================= */

clearHistoryBtn?.addEventListener(
  'click',
  async () => {

    const confirmed =
      window.confirm(
        'Are you sure you want to clear all VoiceGuard analysis history?'
      );

    if (!confirmed) {
      return;
    }

    try {

      await clearHistoryDatabase();

      currentResult = null;

      await loadHistory();

      await updateDashboard();

      addNotification(
        'History Cleared',
        'All saved analysis history was removed.',
        '🗑️'
      );

      navigateTo(
        'history'
      );

    } catch (error) {

      console.error(
        'Clear history error:',
        error
      );

      showError(
        'Unable to clear history.'
      );
    }
  }
);

/* =========================================================
   23A. VOICE COMPARISON
   ========================================================= */

function setupAudioPreview(audioElement, blob) {
  if (!audioElement || !blob) return;

  try {
    if (audioElement.src) {
      URL.revokeObjectURL(audioElement.src);
    }
  } catch {}

  audioElement.src = URL.createObjectURL(blob);
  audioElement.style.display = 'block';
}


/* -------------------------
   Reference Voice Recording
   ------------------------- */

async function startIntendedRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showError(
      'Your browser does not support microphone recording.'
    );
    return;
  }

  try {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    const mimeType =
      getSupportedMimeType();

    intendedRecorder =
      mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

    intendedChunks = [];

    intendedRecorder.ondataavailable =
      (event) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          intendedChunks.push(event.data);
        }
      };

    intendedRecorder.onstop =
      () => {
        const type =
          intendedRecorder.mimeType ||
          'audio/webm';

        intendedVoiceBlob =
          new Blob(
            intendedChunks,
            { type }
          );

        if (intendedFileName) {
          intendedFileName.textContent =
            'Recorded reference voice';
        }

        setupAudioPreview(
          intendedAudioPreview,
          intendedVoiceBlob
        );

        stream
          .getTracks()
          .forEach(
            (track) => track.stop()
          );

        if (startIntendedRecordBtn) {
          startIntendedRecordBtn.disabled =
            false;
        }

        if (stopIntendedRecordBtn) {
          stopIntendedRecordBtn.disabled =
            true;
        }

        addNotification(
          'Reference voice recorded.',
          'success'
        );
      };

    intendedRecorder.start();

    if (startIntendedRecordBtn) {
      startIntendedRecordBtn.disabled =
        true;
    }

    if (stopIntendedRecordBtn) {
      stopIntendedRecordBtn.disabled =
        false;
    }

    addNotification(
      'Recording reference voice...',
      'info'
    );

  } catch (error) {
    console.error(
      'Reference recording error:',
      error
    );

    showError(
      'Microphone permission is required to record the reference voice.'
    );
  }
}


function stopIntendedRecording() {
  if (
    !intendedRecorder ||
    intendedRecorder.state === 'inactive'
  ) {
    return;
  }

  intendedRecorder.stop();

  if (stopIntendedRecordBtn) {
    stopIntendedRecordBtn.disabled =
      true;
  }
}


startIntendedRecordBtn?.addEventListener(
  'click',
  startIntendedRecording
);


stopIntendedRecordBtn?.addEventListener(
  'click',
  stopIntendedRecording
);


/* -------------------------
   Reference Voice Upload
   ------------------------- */

intendedUploadInput?.addEventListener(
  'change',
  (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    intendedVoiceBlob =
      file;

    if (intendedFileName) {
      intendedFileName.textContent =
        file.name;
    }

    setupAudioPreview(
      intendedAudioPreview,
      file
    );

    addNotification(
      'Reference voice selected.',
      file.name,
      '📁'
    );
  }
);


/* -------------------------
   Person Voice Recording
   ------------------------- */

async function startPersonRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showError(
      'Your browser does not support microphone recording.'
    );
    return;
  }

  try {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    const mimeType =
      getSupportedMimeType();

    personRecorder =
      mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

    personChunks = [];

    personRecorder.ondataavailable =
      (event) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          personChunks.push(event.data);
        }
      };

    personRecorder.onstop =
      () => {
        const type =
          personRecorder.mimeType ||
          'audio/webm';

        personVoiceBlob =
          new Blob(
            personChunks,
            { type }
          );

        if (personFileName) {
          personFileName.textContent =
            'Recorded person voice';
        }

        setupAudioPreview(
          personAudioPreview,
          personVoiceBlob
        );

        stream
          .getTracks()
          .forEach(
            (track) => track.stop()
          );

        if (startPersonRecordBtn) {
          startPersonRecordBtn.disabled =
            false;
        }

        if (stopPersonRecordBtn) {
          stopPersonRecordBtn.disabled =
            true;
        }

        addNotification(
          'Person voice recorded.',
          'success'
        );
      };

    personRecorder.start();

    if (startPersonRecordBtn) {
      startPersonRecordBtn.disabled =
        true;
    }

    if (stopPersonRecordBtn) {
      stopPersonRecordBtn.disabled =
        false;
    }

    addNotification(
      'Recording person voice...',
      'info'
    );

  } catch (error) {
    console.error(
      'Person recording error:',
      error
    );

    showError(
      'Microphone permission is required to record the person voice.'
    );
  }
}


function stopPersonRecording() {
  if (
    !personRecorder ||
    personRecorder.state === 'inactive'
  ) {
    return;
  }

  personRecorder.stop();

  if (stopPersonRecordBtn) {
    stopPersonRecordBtn.disabled =
      true;
  }
}


startPersonRecordBtn?.addEventListener(
  'click',
  startPersonRecording
);


stopPersonRecordBtn?.addEventListener(
  'click',
  stopPersonRecording
);


/* -------------------------
   Person Voice Upload
   ------------------------- */

personUploadInput?.addEventListener(
  'change',
  (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    personVoiceBlob =
      file;

    if (personFileName) {
      personFileName.textContent =
        file.name;
    }

    setupAudioPreview(
      personAudioPreview,
      file
    );

    addNotification(
      'Person voice selected.',
      file.name,
      '📁'
    );
  }
);


/* -------------------------
   Audio Duration
   ------------------------- */

function getAudioDuration(blob) {
  return new Promise((resolve) => {
    if (!blob) {
      resolve(0);
      return;
    }

    const audio =
      document.createElement('audio');

    const url =
      URL.createObjectURL(blob);

    audio.preload = 'metadata';

    audio.onloadedmetadata =
      () => {
        const duration =
          Number(audio.duration);

        URL.revokeObjectURL(url);

        resolve(
          Number.isFinite(duration)
            ? duration
            : 0
        );
      };

    audio.onerror =
      () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };

    audio.src = url;
  });
}


/* -------------------------
   Voice Comparison
   ------------------------- */

compareVoicesBtn?.addEventListener(
  'click',
  compareVoices
);


async function compareVoices() {
  if (!intendedVoiceBlob) {
    showError(
      'Please record or upload the reference voice first.'
    );
    return;
  }

  if (!personVoiceBlob) {
    showError(
      'Please record or upload the person voice first.'
    );
    return;
  }

  try {
    compareVoicesBtn.disabled =
      true;

    compareVoicesBtn.textContent =
      '🔍 Comparing...';

    if (comparisonResult) {
      comparisonResult.style.display =
        'block';

      comparisonResult.innerHTML = `
        <div class="comparison-loading">
          🔄 Comparing the two recordings...
        </div>
      `;
    }

    const referenceDuration =
      await getAudioDuration(
        intendedVoiceBlob
      );

    const personDuration =
      await getAudioDuration(
        personVoiceBlob
      );

    const durationDifference =
      Math.abs(
        referenceDuration -
        personDuration
      );

    const maxDuration =
      Math.max(
        referenceDuration,
        personDuration,
        1
      );

    let durationSimilarity =
      1 -
      (
        durationDifference /
        maxDuration
      );

    durationSimilarity =
      Math.max(
        0,
        Math.min(
          1,
          durationSimilarity
        )
      );

    const referenceSize =
      Number(
        intendedVoiceBlob.size || 0
      );

    const personSize =
      Number(
        personVoiceBlob.size || 0
      );

    const sizeDifference =
      Math.abs(
        referenceSize -
        personSize
      );

    const maxSize =
      Math.max(
        referenceSize,
        personSize,
        1
      );

    let fileSimilarity =
      1 -
      (
        sizeDifference /
        maxSize
      );

    fileSimilarity =
      Math.max(
        0,
        Math.min(
          1,
          fileSimilarity
        )
      );

    const similarity =
      (
        durationSimilarity * 0.7
      ) +
      (
        fileSimilarity * 0.3
      );

    const similarityPercentage =
      similarity * 100;

    let interpretation;

    if (similarityPercentage >= 80) {
      interpretation =
        'The recordings have similar basic audio characteristics.';
    } else if (similarityPercentage >= 55) {
      interpretation =
        'The recordings have moderately similar basic audio characteristics.';
    } else {
      interpretation =
        'The recordings have noticeably different basic audio characteristics.';
    }

    if (comparisonResult) {
      comparisonResult.style.display =
        'block';

      comparisonResult.innerHTML = `
        <div class="comparison-result-card">

          <div class="comparison-result-icon">
            🔊
          </div>

          <div class="comparison-result-main">

            <span class="section-kicker">
              COMPARISON RESULT
            </span>

            <h3>
              ${similarityPercentage.toFixed(1)}% Similarity Signal
            </h3>

            <div class="comparison-progress">
              <div
                class="comparison-progress-bar"
                style="width:${similarityPercentage.toFixed(1)}%"
              ></div>
            </div>

            <p>
              ${escapeHtml(interpretation)}
            </p>

            <div class="comparison-details">

              <div>
                <span>Reference Duration</span>
                <strong>
                  ${referenceDuration.toFixed(2)} sec
                </strong>
              </div>

              <div>
                <span>Person Duration</span>
                <strong>
                  ${personDuration.toFixed(2)} sec
                </strong>
              </div>

              <div>
                <span>Duration Difference</span>
                <strong>
                  ${durationDifference.toFixed(2)} sec
                </strong>
              </div>

            </div>

            <div class="comparison-note">
              ℹ️ This is a basic audio similarity signal,
              not proof that two recordings belong to the
              same person.
            </div>

          </div>

        </div>
      `;
    }

    addNotification(
      'Voice comparison completed.',
      'success'
    );
    showAnalysisToast(
  'Voice Comparison Complete',
  'Voice comparison has been completed successfully.'
);

  } catch (error) {
    console.error(
      'Voice comparison error:',
      error
    );

    showError(
      'Unable to compare the recordings.'
    );

  } finally {
    compareVoicesBtn.disabled =
      false;

    compareVoicesBtn.textContent =
      '🔍 Compare Voices';
  }
}


/* =========================================================
   23B. SCAM CALL DETECTION
   ========================================================= */

const scamKeywords = [

  {
    words: [
      'otp',
      'one time password',
      'verification code',
      'security code'
    ],
    label: 'OTP / verification code request',
    severity: 'high'
  },

  {
    words: [
      'pin',
      'atm pin',
      'upi pin',
      'password'
    ],
    label: 'PIN / password request',
    severity: 'high'
  },

  {
    words: [
      'bank account',
      'bank details',
      'account number',
      'card number',
      'debit card',
      'credit card'
    ],
    label: 'Banking information request',
    severity: 'high'
  },

  {
    words: [
      'send money',
      'transfer money',
      'pay now',
      'make a payment',
      'payment'
    ],
    label: 'Payment request',
    severity: 'high'
  },

  {
    words: [
      'urgent',
      'immediately',
      'right now',
      'act now',
      'within minutes'
    ],
    label: 'Urgency / pressure',
    severity: 'medium'
  },

  {
    words: [
      'account will be blocked',
      'account will be closed',
      'account blocked',
      'account suspended'
    ],
    label: 'Account threat',
    severity: 'high'
  },

  {
    words: [
      'police',
      'cyber crime',
      'legal action',
      'arrest',
      'court case'
    ],
    label: 'Threat / intimidation',
    severity: 'high'
  },

  {
    words: [
      'link',
      'click this link',
      'download this app',
      'install this app'
    ],
    label: 'Suspicious link / application request',
    severity: 'medium'
  },

  {
    words: [
      'refund',
      'cashback',
      'lottery',
      'prize',
      'winner',
      'reward'
    ],
    label: 'Prize / refund lure',
    severity: 'medium'
  }

];


/* -------------------------
   Scam Phrase Scanner
   ------------------------- */

function detectScamPhrases(text) {
  const cleanText =
    String(text || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

  const detected = [];

  scamKeywords.forEach(
    (rule) => {
      const matchedWords =
        rule.words.filter(
          (word) =>
            cleanText.includes(
              word.toLowerCase()
            )
        );

      if (matchedWords.length > 0) {
        detected.push({
          label: rule.label,
          severity: rule.severity,
          matches: matchedWords
        });
      }
    }
  );

  return detected;
}


/* -------------------------
   Render Scam Phrases
   ------------------------- */

function renderSuspiciousPhrases(phrases) {
  if (!suspiciousPhrases) {
    return;
  }

  if (
    !Array.isArray(phrases) ||
    phrases.length === 0
  ) {
    suspiciousPhrases.innerHTML = `
      <div class="phrase-safe">
        ✅ No common scam phrase detected in the recognized speech.
      </div>
    `;

    return;
  }

  suspiciousPhrases.innerHTML =
    phrases
      .map(
        (phrase) => {
          const severityClass =
            phrase.severity === 'high'
              ? 'high'
              : 'medium';

          const icon =
            phrase.severity === 'high'
              ? '🚨'
              : '⚠️';

          return `
            <div class="suspicious-phrase ${severityClass}">

              <span class="suspicious-phrase-icon">
                ${icon}
              </span>

              <div>
                <strong>
                  ${escapeHtml(
                    phrase.label
                  )}
                </strong>

                <small>
                  Matched:
                  ${escapeHtml(
                    phrase.matches.join(', ')
                  )}
                </small>
              </div>

            </div>
          `;
        }
      )
      .join('');
}


/* -------------------------
   Speech Recognition
   ------------------------- */

function getSpeechRecognitionConstructor() {
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null
  );
}


function startScamSpeechRecognition() {
  const Recognition =
    getSpeechRecognitionConstructor();

  if (!Recognition) {
    console.warn(
      'Speech Recognition is not supported in this browser.'
    );

    return null;
  }

  const recognition =
    new Recognition();

  recognition.continuous =
    true;

  recognition.interimResults =
    true;

  recognition.lang =
    'en-IN';

  recognition.onresult =
    (event) => {
      let finalText = '';
      let interimText = '';

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0]?.transcript ||
          '';

        if (
          event.results[i].isFinal
        ) {
          finalText +=
            transcript + ' ';
        } else {
          interimText +=
            transcript;
        }
      }

      if (finalText.trim()) {
        scamTranscriptText +=
          finalText;
      }

      const visibleText =
        (
          scamTranscriptText +
          ' ' +
          interimText
        ).trim();

      if (scamTranscript) {
        scamTranscript.textContent =
          visibleText ||
          'Listening...';
      }

      const phrases =
        detectScamPhrases(
          visibleText
        );

      renderSuspiciousPhrases(
        phrases
      );
    };

  recognition.onerror =
    (event) => {
      console.warn(
        'Speech recognition error:',
        event.error
      );
    };

  recognition.onend =
    () => {
      /*
       * Do not restart automatically after
       * scam recording has stopped.
       */
    };

  try {
    recognition.start();
    return recognition;

  } catch (error) {
    console.warn(
      'Speech recognition could not start:',
      error
    );

    return null;
  }
}


/* -------------------------
   Stop Speech Recognition
   ------------------------- */

function stopScamSpeechRecognition() {
  if (!scamRecognition) {
    return;
  }

  try {
    scamRecognition.stop();
  } catch {}

  scamRecognition = null;
}


/* -------------------------
   Scam Recording
   ------------------------- */

async function startScamRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showError(
      'Your browser does not support microphone recording.'
    );

    return;
  }

  try {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    const mimeType =
      getSupportedMimeType();

    scamRecorder =
      mimeType
        ? new MediaRecorder(
            stream,
            { mimeType }
          )
        : new MediaRecorder(
            stream
          );

    scamChunks = [];

    scamTranscriptText = '';

    if (scamTranscript) {
      scamTranscript.textContent =
        'Listening for suspicious speech...';
    }

    if (suspiciousPhrases) {
      suspiciousPhrases.innerHTML = '';
    }

    scamRecorder.ondataavailable =
      (event) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          scamChunks.push(
            event.data
          );
        }
      };

    scamRecorder.onstop =
      () => {
        const type =
          scamRecorder.mimeType ||
          'audio/webm';

        scamAudioBlob =
          new Blob(
            scamChunks,
            { type }
          );

        if (scamFileName) {
          scamFileName.textContent =
            'Recorded suspicious call';
        }

        setupAudioPreview(
          scamAudioPreview,
          scamAudioBlob
        );

        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        if (startScamRecordBtn) {
          startScamRecordBtn.disabled =
            false;
        }

        if (stopScamRecordBtn) {
          stopScamRecordBtn.disabled =
            true;
        }

        stopScamSpeechRecognition();

        addNotification(
          'Suspicious call recording completed.',
          'success'
        );

        const phrases =
          detectScamPhrases(
            scamTranscriptText
          );

        renderSuspiciousPhrases(
          phrases
        );
      };

    scamRecorder.start();

    if (startScamRecordBtn) {
      startScamRecordBtn.disabled =
        true;
    }

    if (stopScamRecordBtn) {
      stopScamRecordBtn.disabled =
        false;
    }

    scamRecognition =
      startScamSpeechRecognition();

    addNotification(
      'Scam call recording started.',
      'Recording...',
      '📞'
    );


  } catch (error) {
    console.error(
      'Scam recording error:',
      error
    );

    showError(
      'Microphone access was not available. Please allow microphone permission.'
    );
  }
}


/* -------------------------
   Stop Scam Recording
   ------------------------- */

function stopScamRecording() {
  if (
    !scamRecorder ||
    scamRecorder.state === 'inactive'
  ) {
    stopScamSpeechRecognition();
    return;
  }

  scamRecorder.stop();

  if (stopScamRecordBtn) {
    stopScamRecordBtn.disabled =
      true;
  }

  stopScamSpeechRecognition();
}


startScamRecordBtn?.addEventListener(
  'click',
  startScamRecording
);


stopScamRecordBtn?.addEventListener(
  'click',
  stopScamRecording
);


/* -------------------------
   Scam Audio Upload
   ------------------------- */

scamUploadInput?.addEventListener(
  'change',
  (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    scamAudioBlob =
      file;

    if (scamFileName) {
      scamFileName.textContent =
        file.name;
    }

    setupAudioPreview(
      scamAudioPreview,
      file
    );

    addNotification(
      'Suspicious call audio selected.',
      file.name,
      '📁'
    );
    showStrictScamWarning(
  'Be careful. This recorded call will be checked for possible scam warning signs.'
);
  }
);


/* -------------------------
   Optional Transcript Input
   ------------------------- */

function analyzeTranscriptText() {
  const text =
    scamTranscriptText ||
    scamTranscript?.textContent ||
    '';

  const phrases =
    detectScamPhrases(text);

  renderSuspiciousPhrases(
    phrases
  );

  return phrases;
}


/* -------------------------
   Scam Risk Result
   ------------------------- */

function calculateScamRisk(
  phrases,
  voiceResult
) {
  let score = 0;

  phrases.forEach(
    (phrase) => {
      if (
        phrase.severity === 'high'
      ) {
        score += 25;
      } else {
        score += 12;
      }
    }
  );

  if (
    voiceResult &&
    voiceResult.aiPercentage >= 70
  ) {
    score += 25;

  } else if (
    voiceResult &&
    voiceResult.aiPercentage >= 50
  ) {
    score += 12;
  }

  score =
    Math.min(
      100,
      score
    );

  let level;

  if (score >= 70) {
    level = 'high';
  } else if (score >= 35) {
    level = 'medium';
  } else {
    level = 'low';
  }

  return {
    score,
    level
  };
}


/* -------------------------
   Analyze Scam Call
   ------------------------- */

analyzeScamBtn?.addEventListener(
  'click',
  analyzeScamCall
);


async function analyzeScamCall() {
  if (!scamAudioBlob) {
    showError(
      'Please record or upload the suspicious call audio first.'
    );

    return;
  }

  try {
    analyzeScamBtn.disabled =
      true;

    analyzeScamBtn.textContent =
      '🚨 Analyzing Call...';

    if (scamRiskResult) {
      scamRiskResult.style.display =
        'block';

      scamRiskResult.innerHTML = `
        <div class="comparison-loading">
          🤖 Checking voice and scam warning signs...
        </div>
      `;
    }

    const phrases =
      analyzeTranscriptText();

    let voiceResult = null;

    try {
      const formData =
        new FormData();

      const filename =
        scamUploadInput?.files?.[0]?.name ||
        'voiceguard-scam-recording.webm';

      formData.append(
        'audio',
        scamAudioBlob,
        filename
      );

      const response =
        await fetch(
          'http://localhost:3000/api/analyze',
          {
            method: 'POST',
            body: formData
          }
        );

      const data =
        await response.json();

      if (response.ok) {
        voiceResult =
          normalizeResult(data);

      } else {
        console.warn(
          'Scam voice analysis failed:',
          data
        );
      }

    } catch (voiceError) {
      console.warn(
        'Scam voice backend analysis failed:',
        voiceError
      );
    }

    const risk =
      calculateScamRisk(
        phrases,
        voiceResult
      );
      if (risk.level === 'high') {

  showStrictScamWarning(
    'HIGH RISK: Be careful. Strong scam warning signs were detected. Do not share OTPs, PINs, passwords, banking details, or send money.'
  );

} else if (risk.level === 'medium') {

  showStrictScamWarning(
    'CAUTION: Suspicious warning signs were detected. Be careful and do not share sensitive information with the caller.'
  );

}

    let title;
    let icon;

    if (risk.level === 'high') {
      title =
        'High-Risk Warning';

      icon =
        '🚨';

    } else if (
      risk.level === 'medium'
    ) {
      title =
        'Suspicious Activity Detected';

      icon =
        '⚠️';

    } else {
      title =
        'Low Scam Signal';

      icon =
        '🛡️';
    }

    const aiScore =
      voiceResult
        ? voiceResult.aiPercentage
        : null;

    const humanScore =
      voiceResult
        ? voiceResult.humanPercentage
        : null;

    if (scamRiskResult) {
      scamRiskResult.style.display =
        'block';

      scamRiskResult.innerHTML = `
        <div class="scam-risk-card ${risk.level}">

          <div class="scam-risk-icon">
            ${icon}
          </div>

          <div class="scam-risk-content">

            <span class="section-kicker">
              SCAM SECURITY RESULT
            </span>

            <h2>
              ${title}
            </h2>

            <div class="scam-risk-score">
              <span>Risk Signal</span>

              <strong>
                ${risk.score}%
              </strong>
            </div>

            <div class="comparison-progress">
              <div
                class="comparison-progress-bar"
                style="width:${risk.score}%"
              ></div>
            </div>

            <div class="scam-risk-details">

              <div>
                <span>Suspicious phrases</span>
                <strong>
                  ${phrases.length}
                </strong>
              </div>

              <div>
                <span>AI voice signal</span>
                <strong>
                  ${
                    aiScore === null
                      ? 'Unavailable'
                      : `${aiScore.toFixed(1)}%`
                  }
                </strong>
              </div>

              <div>
                <span>Human voice signal</span>
                <strong>
                  ${
                    humanScore === null
                      ? 'Unavailable'
                      : `${humanScore.toFixed(1)}%`
                  }
                </strong>
              </div>

            </div>

            ${
              phrases.length > 0
                ? `
                  <div class="scam-detected-list">

                    <strong>
                      ⚠️ Warning signs found
                    </strong>

                    ${phrases
                      .map(
                        (phrase) => `
                          <div>
                            • ${escapeHtml(
                              phrase.label
                            )}
                          </div>
                        `
                      )
                      .join('')}

                  </div>
                `
                : `
                  <div class="scam-safe-message">
                    ✅ No common scam phrase was found
                    in the recognized speech.
                  </div>
                `
            }

            <div class="scam-disclaimer">
              ℹ️ This result identifies warning signals.
              It does not prove that a call is a scam.
              Never share OTPs, PINs, passwords or
              banking credentials based only on a caller's request.
            </div>

          </div>

        </div>
      `;
    }
   /* =========================
   SAVE SCAM RESULT TO HISTORY
   ========================= */

const scamHistoryItem = {
  id: Date.now(),

  filename:
    scamUploadInput?.files?.[0]?.name ||
    'voiceguard-scam-recording.webm',

  verdict:
    voiceResult?.verdict ||
    'scam-analysis',

  aiPercentage:
    Number(voiceResult?.aiPercentage) || 0,

  humanPercentage:
    Number(voiceResult?.humanPercentage) || 0,

  confidence:
    Number(voiceResult?.confidence) || 0,

  scamRisk:
    Number(risk.score) || 0,

  scamRiskLevel:
    risk.level,

  suspiciousPhrases:
    phrases.length,

  timestamp:
    new Date().toISOString(),

  location:
    'Scam Detection',

  audioBlob:
    scamAudioBlob
};

await saveHistory(scamHistoryItem);

console.log(
  '✅ Scam result saved to History:',
  scamHistoryItem
);

/* Refresh History + Dashboard */
await loadHistory();
await updateDashboard();
    addNotification(
      'Scam call analysis completed.',
      risk.level === 'high'
        ? 'warning'
        : 'success'
    );
 
  } catch (error) {
    console.error(
      'Scam analysis error:',
      error
    );

    showError(
      error.message ||
      'Unable to analyze the suspicious call.'
    );

  } finally {
    analyzeScamBtn.disabled =
      false;

    analyzeScamBtn.textContent =
      '🚨 Analyze Scam Call';
  }
}


/* =========================================================
   23C. INCOMING CALL SECURITY DEMO
   ========================================================= */

const incomingCallAlert =
  document.querySelector(
    '#incomingCallAlert'
  );

const incomingCallText =
  document.querySelector(
    '#incomingCallText'
  );

const closeIncomingCallAlert =
  document.querySelector(
    '#closeIncomingCallAlert'
  );


function showIncomingCallSecurityAlert() {
  if (!incomingCallAlert) {
    return;
  }

  if (incomingCallText) {
    incomingCallText.textContent =
      'VoiceGuard detected warning signs associated with a potentially suspicious caller. Do not share OTPs, PINs or passwords.';
  }

  incomingCallAlert.style.display =
    'flex';

  addNotification(
    'Suspicious caller alert',
    'Potential scam-call warning detected.',
    '🚨'
  );
}


function hideIncomingCallSecurityAlert() {
  if (!incomingCallAlert) {
    return;
  }

  incomingCallAlert.style.display =
    'none';
}


simulateIncomingCallBtn?.addEventListener(
  'click',
  showIncomingCallSecurityAlert
);


closeIncomingCallAlert?.addEventListener(
  'click',
  hideIncomingCallSecurityAlert
);


/* =========================================================
   24. SETTINGS
   ========================================================= */

const SECURITY_SETTING_KEY =
  'voiceguard_security_notifications';

const ANALYSIS_SETTING_KEY =
  'voiceguard_analysis_notifications';


function loadSettings() {
  if (
    securityNotificationsToggle
  ) {
    securityNotificationsToggle.checked =
      localStorage.getItem(
        SECURITY_SETTING_KEY
      ) !== 'false';
  }

  if (
    analysisNotificationsToggle
  ) {
    analysisNotificationsToggle.checked =
      localStorage.getItem(
        ANALYSIS_SETTING_KEY
      ) !== 'false';
  }
}


securityNotificationsToggle?.addEventListener(
  'change',
  () => {
    localStorage.setItem(
      SECURITY_SETTING_KEY,
      String(
        securityNotificationsToggle.checked
      )
    );

    addNotification(
      'Security Notifications',
      securityNotificationsToggle.checked
        ? 'Security notifications enabled.'
        : 'Security notifications disabled.',
      securityNotificationsToggle.checked
        ? '🔔'
        : '🔕'
    );
  }
);


analysisNotificationsToggle?.addEventListener(
  'change',
  () => {
    localStorage.setItem(
      ANALYSIS_SETTING_KEY,
      String(
        analysisNotificationsToggle.checked
      )
    );

    addNotification(
      'Analysis Notifications',
      analysisNotificationsToggle.checked
        ? 'Analysis notifications enabled.'
        : 'Analysis notifications disabled.',
      analysisNotificationsToggle.checked
        ? '🔔'
        : '🔕'
    );
  }
);


/* =========================================================
   25. INITIAL NOTIFICATION
   ========================================================= */

loadSettings();

renderNotifications();

addNotification(
  'VoiceGuard is active',
  'Your voice protection tools are ready.',
  '🛡️'
);


/* =========================================================
   26. INITIAL LOAD
   ========================================================= */

(async function initializeVoiceGuard() {
  try {
    await loadHistory();
    await updateDashboard();

  } catch (error) {
    console.error(
      'VoiceGuard initialization error:',
      error
    );
  }

  console.log(
    '🛡️ VoiceGuard initialized successfully'
  );
})();
/* =========================================================
   DASHBOARD AUTO UPDATE
   ========================================================= */

async function refreshDashboard() {
  try {

    await updateDashboard();

  } catch (error) {

    console.error(
      '❌ Dashboard refresh failed:',
      error
    );

  }
}


/* Update when page loads */
document.addEventListener(
  'DOMContentLoaded',
  async () => {

    await refreshDashboard();

  }
);


/* Update whenever dashboard is opened */
document.addEventListener(
  'click',
  async (event) => {

    const target =
      event.target.closest(
        '[data-page="dashboard"], [data-navigate="dashboard"]'
      );

    if (!target) {
      return;
    }

    setTimeout(
      refreshDashboard,
      100
    );

  }
);
