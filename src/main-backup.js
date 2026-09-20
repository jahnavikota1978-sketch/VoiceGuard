import './style.css'

// ============================================================
// VOICEGUARD - FULL MAIN.JS
// Existing Voice Analysis + Voice Comparison
// ============================================================

const API_URL = 'http://localhost:3000/api/analyze'

const RESULTS_PIN = '1004'

const DB_NAME = 'VoiceGuardDB'
const DB_VERSION = 2

const VOICE_STORE = 'voiceHistory'
const COMPARISON_STORE = 'comparisonHistory'

// ============================================================
// GLOBAL VARIABLES
// ============================================================

let stream = null
let recorder = null
let audioChunks = []

let audioBlob = null
let audioFile = null

let currentLocation = null

// Voice Comparison
let realVoiceFile = null
let aiVoiceFile = null

let realVoiceBlob = null
let aiVoiceBlob = null

let currentComparison = null

// ============================================================
// APP HTML
// ============================================================

document.querySelector('#app').innerHTML = `
  <div class="app">

    <!-- HEADER -->
    <header class="header">
      <div>
        <h1>🛡️ VoiceGuard</h1>
        <p>AI-Powered Voice Protection</p>
      </div>

      <nav class="nav">
        <button class="nav-btn active" data-page="home">Home</button>
        <button class="nav-btn" data-page="dashboard">Dashboard</button>
        <button class="nav-btn" data-page="analyze">Analyze Voice</button>
        <button class="nav-btn" data-page="comparison">Voice Comparison</button>
        <button class="nav-btn" data-page="location">Location</button>
        <button class="nav-btn" data-page="results">Results</button>
        <button class="nav-btn" data-page="history">History</button>
      </nav>
    </header>

    <main>

      <!-- ================================================== -->
      <!-- HOME -->
      <!-- ================================================== -->

      <section id="home" class="page active">
        <div class="hero">
          <h2>Protect Your Voice with AI</h2>

          <p>
            VoiceGuard analyzes voice recordings and helps identify
            potentially AI-generated or human speech.
          </p>

          <button id="goAnalyze" class="primary-btn">
            🎙️ Analyze Voice
          </button>

          <button
            id="goComparison"
            class="secondary-btn"
            style="margin-left:10px;"
          >
            🔍 Compare Voices
          </button>
        </div>

        <div class="privacy-card">
          <h3>🔒 Privacy Notice</h3>

          <p>
            Your recordings are used only for analysis.
            They are not publicly shared by VoiceGuard.
          </p>

          <p>
            Voice analysis history is stored locally in your browser.
            You can clear your saved history at any time.
          </p>
        </div>
      </section>


      <!-- ================================================== -->
      <!-- DASHBOARD -->
      <!-- ================================================== -->

      <section id="dashboard" class="page">

        <h2>📊 Dashboard</h2>

        <div class="dashboard-grid">

          <div class="stat-card">
            <h3>Total Recordings</h3>
            <div id="totalRecordings">0</div>
          </div>

          <div class="stat-card">
            <h3>Likely AI Voices</h3>
            <div id="aiRecordings">0</div>
          </div>

          <div class="stat-card">
            <h3>Likely Human Voices</h3>
            <div id="humanRecordings">0</div>
          </div>

          <div class="stat-card">
            <h3>Average Confidence</h3>
            <div id="averageConfidence">0%</div>
          </div>

        </div>

        <div class="chart-card">

          <h3>AI / Human Distribution</h3>

          <div style="margin:20px 0;">
            <div
              style="
                display:flex;
                justify-content:space-between;
                margin-bottom:6px;
              "
            >
              <span>🤖 AI</span>
              <span id="dashboardAiText">0%</span>
            </div>

            <div
              style="
                width:100%;
                height:18px;
                background:#e5e7eb;
                border-radius:10px;
                overflow:hidden;
              "
            >
              <div
                id="dashboardAiBar"
                style="
                  width:0%;
                  height:100%;
                  background:#ef4444;
                "
              ></div>
            </div>
          </div>

          <div style="margin:20px 0;">

            <div
              style="
                display:flex;
                justify-content:space-between;
                margin-bottom:6px;
              "
            >
              <span>👤 Human</span>
              <span id="dashboardHumanText">0%</span>
            </div>

            <div
              style="
                width:100%;
                height:18px;
                background:#e5e7eb;
                border-radius:10px;
                overflow:hidden;
              "
            >
              <div
                id="dashboardHumanBar"
                style="
                  width:0%;
                  height:100%;
                  background:#22c55e;
                "
              ></div>
            </div>

          </div>

        </div>

      </section>


      <!-- ================================================== -->
      <!-- ANALYZE VOICE -->
      <!-- ================================================== -->

      <section id="analyze" class="page">

        <h2>🎙️ Analyze Voice</h2>

        <div class="analysis-card">

          <div class="button-row">

            <button id="startRecording" class="primary-btn">
              🎤 Start Recording
            </button>

            <button id="stopRecording" class="secondary-btn" disabled>
              ⏹ Stop Recording
            </button>

            <label class="secondary-btn" style="cursor:pointer;">
              📁 Upload Recording

              <input
                id="audioInput"
                type="file"
                accept="audio/*,.webm,.wav,.mp3,.m4a"
                hidden
              />
            </label>

          </div>

          <p id="recordingStatus">
            Ready to record or upload audio.
          </p>

          <div id="audioBox"></div>

          <button
            id="analyzeVoice"
            class="primary-btn"
            disabled
            style="margin-top:15px;"
          >
            🔎 Analyze Voice
          </button>

          <button
            id="shareRecording"
            class="secondary-btn"
            disabled
            style="margin-top:15px;"
          >
            📤 Share Recording
          </button>

          <p id="analysisMessage"></p>

        </div>

      </section>


      <!-- ================================================== -->
      <!-- VOICE COMPARISON -->
      <!-- ================================================== -->

      <section id="comparison" class="page">

        <h2>🔍 Voice Comparison</h2>

        <p>
          Compare a real person's voice with an imitated or
          potentially AI-generated voice.
        </p>

        <div class="comparison-grid">

          <!-- REAL VOICE -->

          <div class="comparison-card">

            <h3>👤 Real Person Voice</h3>

            <p>
              Upload the genuine/reference voice recording.
            </p>

            <label
              class="secondary-btn"
              style="display:inline-block;cursor:pointer;"
            >
              📁 Upload Real Voice

              <input
                id="realVoiceInput"
                type="file"
                accept="audio/*,.webm,.wav,.mp3,.m4a"
                hidden
              />
            </label>

            <div id="realVoiceInfo" style="margin-top:15px;">
              No file selected.
            </div>

            <div id="realVoicePlayer" style="margin-top:15px;"></div>

          </div>


          <!-- AI VOICE -->

          <div class="comparison-card">

            <h3>🤖 Imitated / AI Voice</h3>

            <p>
              Upload the suspected imitation or AI-generated voice.
            </p>

            <label
              class="secondary-btn"
              style="display:inline-block;cursor:pointer;"
            >
              📁 Upload AI / Imitated Voice

              <input
                id="aiVoiceInput"
                type="file"
                accept="audio/*,.webm,.wav,.mp3,.m4a"
                hidden
              />
            </label>

            <div id="aiVoiceInfo" style="margin-top:15px;">
              No file selected.
            </div>

            <div id="aiVoicePlayer" style="margin-top:15px;"></div>

          </div>

        </div>


        <button
          id="compareVoices"
          class="primary-btn"
          disabled
          style="margin-top:20px;"
        >
          🔎 Analyze & Compare Voices
        </button>

        <p id="comparisonMessage"></p>


        <!-- COMPARISON REPORT -->

        <div
          id="comparisonReport"
          style="
            display:none;
            margin-top:25px;
          "
        >

          <div class="analysis-card">

            <h3>📋 Comparison Report</h3>

            <div
              id="comparisonReportContent"
              style="margin-top:15px;"
            ></div>

            <button
              id="shareComparison"
              class="secondary-btn"
              style="margin-top:20px;"
            >
              📤 Share Comparison Report
            </button>

          </div>

        </div>


        <!-- COMPARISON HISTORY -->

        <div
          class="analysis-card"
          style="margin-top:30px;"
        >

          <div
            style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:10px;
              flex-wrap:wrap;
            "
          >

            <h3>🗂️ Comparison History</h3>

            <button
              id="clearComparisonHistory"
              class="secondary-btn"
            >
              🗑️ Clear Comparison History
            </button>

          </div>

          <div id="comparisonHistoryList">
            Loading...
          </div>

        </div>

      </section>


      <!-- ================================================== -->
      <!-- LOCATION -->
      <!-- ================================================== -->

      <section id="location" class="page">

        <h2>📍 Location</h2>

        <div class="analysis-card">

          <p>
            Share your current location to attach location
            information to your voice analysis.
          </p>

          <button
            id="shareLocation"
            class="primary-btn"
          >
            📍 Share My Location
          </button>

          <p id="locationStatus"></p>

        </div>

      </section>


      <!-- ================================================== -->
      <!-- RESULTS -->
      <!-- ================================================== -->

      <section id="results" class="page">

        <h2>📋 Analysis Results</h2>

        <div id="resultsContent">
          Loading...
        </div>

      </section>


      <!-- ================================================== -->
      <!-- HISTORY -->
      <!-- ================================================== -->

      <section id="history" class="page">

        <h2>🗂️ Voice Analysis History</h2>

        <button
          id="clearHistory"
          class="secondary-btn"
        >
          🗑️ Clear History
        </button>

        <div
          id="historyList"
          style="margin-top:20px;"
        >
          Loading...
        </div>

      </section>

    </main>

  </div>
`


// ============================================================
// INDEXED DB
// ============================================================

function openDatabase() {

  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {

      const db = event.target.result

      if (!db.objectStoreNames.contains(VOICE_STORE)) {

        db.createObjectStore(
          VOICE_STORE,
          {
            keyPath: 'id'
          }
        )

      }

      if (!db.objectStoreNames.contains(COMPARISON_STORE)) {

        db.createObjectStore(
          COMPARISON_STORE,
          {
            keyPath: 'id'
          }
        )

      }

    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }

  })

}


// ============================================================
// VOICE HISTORY HELPERS
// ============================================================

async function saveVoiceRecord(record) {

  const db = await openDatabase()

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(
        VOICE_STORE,
        'readwrite'
      )

    transaction.objectStore(
      VOICE_STORE
    ).put(record)

    transaction.oncomplete = () => {
      resolve()
    }

    transaction.onerror = () => {
      reject(transaction.error)
    }

  })

}


async function getAllVoiceRecords() {

  const db = await openDatabase()

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(
        VOICE_STORE,
        'readonly'
      )

    const request =
      transaction.objectStore(
        VOICE_STORE
      ).getAll()

    request.onsuccess = () => {

      const records = request.result || []

      records.sort(
        (a, b) =>
          new Date(b.timestamp) -
          new Date(a.timestamp)
      )

      resolve(records)

    }

    request.onerror = () => {
      reject(request.error)
    }

  })

}


async function getLatestVoiceRecord() {

  const records =
    await getAllVoiceRecords()

  return records[0] || null
}


async function clearVoiceRecords() {

  const db = await openDatabase()

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(
        VOICE_STORE,
        'readwrite'
      )

    transaction.objectStore(
      VOICE_STORE
    ).clear()

    transaction.oncomplete = () => {
      resolve()
    }

    transaction.onerror = () => {
      reject(transaction.error)
    }

  })

}


// ============================================================
// COMPARISON HISTORY HELPERS
// ============================================================

async function saveComparisonRecord(record) {

  const db = await openDatabase()

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(
        COMPARISON_STORE,
        'readwrite'
      )

    transaction.objectStore(
      COMPARISON_STORE
    ).put(record)

    transaction.oncomplete = () => {
      resolve()
    }

    transaction.onerror = () => {
      reject(transaction.error)
    }

  })

}


async function getAllComparisonRecords() {

  const db = await openDatabase()

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(
        COMPARISON_STORE,
        'readonly'
      )

    const request =
      transaction.objectStore(
        COMPARISON_STORE
      ).getAll()

    request.onsuccess = () => {

      const records = request.result || []

      records.sort(
        (a, b) =>
          new Date(b.timestamp) -
          new Date(a.timestamp)
      )

      resolve(records)

    }

    request.onerror = () => {
      reject(request.error)
    }

  })

}


async function clearComparisonRecords() {

  const db = await openDatabase()

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(
        COMPARISON_STORE,
        'readwrite'
      )

    transaction.objectStore(
      COMPARISON_STORE
    ).clear()

    transaction.oncomplete = () => {
      resolve()
    }

    transaction.onerror = () => {
      reject(transaction.error)
    }

  })

}


// ============================================================
// PIN LOCK
// ============================================================

function lockHTML(title) {

  return `
    <div
      class="analysis-card"
      style="
        text-align:center;
        max-width:500px;
        margin:30px auto;
      "
    >

      <h3>🔒 ${title}</h3>

      <p>
        This section is protected.
        Enter your PIN to continue.
      </p>

      <input
        id="pinInput"
        type="password"
        inputmode="numeric"
        maxlength="10"
        placeholder="Enter PIN"
        style="
          padding:10px;
          border:1px solid #ccc;
          border-radius:8px;
          margin:10px;
        "
      />

      <br>

      <button
        id="pinButton"
        class="primary-btn"
      >
        🔓 Unlock
      </button>

      <p id="pinMessage"></p>

    </div>
  `
}


function setupPinButton(unlockFunction) {

  const button =
    document.querySelector('#pinButton')

  const input =
    document.querySelector('#pinInput')

  const message =
    document.querySelector('#pinMessage')

  if (!button || !input) return

  button.addEventListener(
    'click',
    () => {

      if (input.value === RESULTS_PIN) {

        unlockFunction()

      } else {

        message.textContent =
          '❌ Incorrect PIN'

        message.style.color =
          '#dc2626'

      }

    }
  )

  input.addEventListener(
    'keydown',
    (event) => {

      if (event.key === 'Enter') {

        button.click()

      }

    }
  )

}


function showResultsLock() {

  const container =
    document.querySelector('#resultsContent')

  container.innerHTML =
    lockHTML('Analysis Results')

  setupPinButton(
    async () => {

      const record =
        await getLatestVoiceRecord()

      if (record) {

        displayResult(record)

      } else {

        container.innerHTML = `
          <div class="analysis-card">
            <p>No analysis results available.</p>
          </div>
        `

      }

    }
  )

}


function unlockResults() {

  getLatestVoiceRecord()
    .then((record) => {

      if (record) {

        displayResult(record)

      } else {

        document.querySelector(
          '#resultsContent'
        ).innerHTML = `
          <div class="analysis-card">
            <p>No analysis results available.</p>
          </div>
        `

      }

    })

}


function showHistoryLock() {

  const container =
    document.querySelector('#historyList')

  container.innerHTML =
    lockHTML('Voice Analysis History')

  setupPinButton(
    () => {

      loadHistory()

    }
  )

}


function unlockHistory() {

  loadHistory()

}


// ============================================================
// NAVIGATION
// ============================================================

function showPage(pageName) {

  document
    .querySelectorAll('.page')
    .forEach((page) => {

      page.classList.remove('active')

    })

  const page =
    document.getElementById(pageName)

  if (page) {

    page.classList.add('active')

  }

  document
    .querySelectorAll('.nav-btn')
    .forEach((button) => {

      button.classList.remove('active')

      if (
        button.dataset.page ===
        pageName
      ) {

        button.classList.add('active')

      }

    })


  if (pageName === 'dashboard') {

    loadDashboard()

  }


  if (pageName === 'results') {

    showResultsLock()

  }


  if (pageName === 'history') {

    showHistoryLock()

  }


  if (pageName === 'comparison') {

    loadComparisonHistory()

  }

}


// ============================================================
// NAV BUTTONS
// ============================================================

document
  .querySelectorAll('.nav-btn')
  .forEach((button) => {

    button.addEventListener(
      'click',
      () => {

        showPage(
          button.dataset.page
        )

      }
    )

  })


document
  .querySelector('#goAnalyze')
  .addEventListener(
    'click',
    () => {

      showPage('analyze')

    }
  )


document
  .querySelector('#goComparison')
  .addEventListener(
    'click',
    () => {

      showPage('comparison')

    }
  )


// ============================================================
// RECORDING
// ============================================================

const startRecordingButton =
  document.querySelector(
    '#startRecording'
  )

const stopRecordingButton =
  document.querySelector(
    '#stopRecording'
  )

const audioInput =
  document.querySelector(
    '#audioInput'
  )

const recordingStatus =
  document.querySelector(
    '#recordingStatus'
  )

const audioBox =
  document.querySelector(
    '#audioBox'
  )

const analyzeVoiceButton =
  document.querySelector(
    '#analyzeVoice'
  )

const shareRecordingButton =
  document.querySelector(
    '#shareRecording'
  )


startRecordingButton.addEventListener(
  'click',
  async () => {

    try {

      stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        })

      audioChunks = []

      recorder =
        new MediaRecorder(stream)

      recorder.ondataavailable =
        (event) => {

          if (event.data.size > 0) {

            audioChunks.push(
              event.data
            )

          }

        }


      recorder.onstop = () => {

        audioBlob =
          new Blob(
            audioChunks,
            {
              type:
                recorder.mimeType ||
                'audio/webm'
            }
          )

        audioFile =
          new File(
            [audioBlob],
            'voiceguard-recording.webm',
            {
              type:
                audioBlob.type
            }
          )

        showAudioPreview(
          audioBlob
        )

        recordingStatus.textContent =
          '✅ Recording ready for analysis.'

        analyzeVoiceButton.disabled =
          false

        shareRecordingButton.disabled =
          false

      }


      recorder.start()

      startRecordingButton.disabled =
        true

      stopRecordingButton.disabled =
        false

      recordingStatus.textContent =
        '🔴 Recording...'

    } catch (error) {

      console.error(
        'Recording error:',
        error
      )

      recordingStatus.textContent =
        '❌ Microphone permission was denied or unavailable.'

    }

  }
)


stopRecordingButton.addEventListener(
  'click',
  () => {

    if (
      recorder &&
      recorder.state !== 'inactive'
    ) {

      recorder.stop()

    }

    if (stream) {

      stream
        .getTracks()
        .forEach(
          (track) =>
            track.stop()
        )

    }

    startRecordingButton.disabled =
      false

    stopRecordingButton.disabled =
      true

  }
)


audioInput.addEventListener(
  'change',
  (event) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    audioFile = file
    audioBlob = file

    showAudioPreview(file)

    recordingStatus.textContent =
      `✅ Uploaded: ${file.name}`

    analyzeVoiceButton.disabled =
      false

    shareRecordingButton.disabled =
      false

  }
)


function showAudioPreview(blob) {

  const url =
    URL.createObjectURL(blob)

  audioBox.innerHTML = `
    <div class="analysis-card">

      <h3>🎧 Audio Preview</h3>

      <audio
        controls
        src="${url}"
        style="width:100%;"
      ></audio>

    </div>
  `

}


// ============================================================
// SHARE RECORDING
// ============================================================

shareRecordingButton.addEventListener(
  'click',
  async () => {

    if (!audioFile) return

    try {

      const file =
        audioFile instanceof File
          ? audioFile
          : new File(
              [audioBlob],
              'voiceguard-recording.webm',
              {
                type:
                  audioBlob.type ||
                  'audio/webm'
              }
            )

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file]
        })
      ) {

        await navigator.share({
          title:
            'VoiceGuard Voice Recording',
          text:
            'Voice recording from VoiceGuard.',
          files: [file]
        })

      } else if (navigator.share) {

        await navigator.share({
          title:
            'VoiceGuard Voice Recording',
          text:
            'Voice recording from VoiceGuard.'
        })

      } else {

        alert(
          'Sharing is not supported by this browser.'
        )

      }

    } catch (error) {

      console.error(
        'Share recording error:',
        error
      )

    }

  }
)


// ============================================================
// SERVER ANALYSIS HELPER
// ============================================================

async function analyzeAudioWithServer(file) {

  if (!file) {

    throw new Error(
      'No audio file selected.'
    )

  }

  const formData =
    new FormData()

  formData.append(
    'audio',
    file,
    file.name || 'audio.webm'
  )


  const response =
    await fetch(
      API_URL,
      {
        method: 'POST',
        body: formData
      }
    )


  let data = null

  try {

    data =
      await response.json()

  } catch {

    const text =
      await response.text()

    throw new Error(
      `Server returned invalid response: ${text}`
    )

  }


  if (!response.ok) {

    throw new Error(
      data?.message ||
      data?.error ||
      `Server error ${response.status}`
    )

  }


  if (!data?.result) {

    throw new Error(
      'Analysis result was not returned by the server.'
    )

  }


  const frames =
    Array.isArray(
      data.result.frames
    )
      ? data.result.frames
      : []


  const validFrames =
    frames.filter(
      (frame) =>
        frame &&
        (
          frame.verdict ===
            'synthetic' ||
          frame.verdict ===
            'non-synthetic'
        ) &&
        Number.isFinite(
          Number(frame.confidence)
        )
    )


  const syntheticFrames =
    validFrames.filter(
      (frame) =>
        frame.verdict ===
        'synthetic'
    )


  const humanFrames =
    validFrames.filter(
      (frame) =>
        frame.verdict ===
        'non-synthetic'
    )


  let aiPercentage = 0
  let humanPercentage = 0

  if (validFrames.length > 0) {

    aiPercentage =
      (
        syntheticFrames.length /
        validFrames.length
      ) * 100

    humanPercentage =
      (
        humanFrames.length /
        validFrames.length
      ) * 100

  } else {

    const fallbackConfidence =
      Number(
        data.confidence
      )

    if (
      Number.isFinite(
        fallbackConfidence
      )
    ) {

      const percentage =
        fallbackConfidence <= 1
          ? fallbackConfidence * 100
          : fallbackConfidence

      aiPercentage =
        100 - percentage

      humanPercentage =
        percentage

    }

  }


  let confidence = 0

  if (validFrames.length > 0) {

    const average =
      validFrames.reduce(
        (
          total,
          frame
        ) =>
          total +
          Number(
            frame.confidence
          ),
        0
      ) /
      validFrames.length

    confidence =
      average <= 1
        ? average * 100
        : average

  } else {

    const fallback =
      Number(
        data.confidence
      )

    confidence =
      fallback <= 1
        ? fallback * 100
        : fallback

  }


  aiPercentage =
    Number(
      aiPercentage.toFixed(2)
    )

  humanPercentage =
    Number(
      humanPercentage.toFixed(2)
    )

  confidence =
    Number(
      confidence.toFixed(2)
    )


  const verdict =
    aiPercentage >
    humanPercentage
      ? 'synthetic'
      : 'non-synthetic'


  return {

    raw: data,

    frames,

    aiPercentage,

    humanPercentage,

    confidence,

    verdict,

    duration:
      data.result.duration ??
      data.duration ??
      null

  }

}


// ============================================================
// ANALYZE VOICE BUTTON
// ============================================================

analyzeVoiceButton.addEventListener(
  'click',
  async () => {

    if (!audioFile) {

      alert(
        'Please record or upload an audio file first.'
      )

      return

    }


    const analysisMessage =
      document.querySelector(
        '#analysisMessage'
      )


    analyzeVoiceButton.disabled =
      true

    analysisMessage.textContent =
      '⏳ Analyzing voice...'


    try {

      const analysis =
        await analyzeAudioWithServer(
          audioFile
        )


      const result = {

        id:
          Date.now(),

        filename:
          audioFile.name ||
          'voice-recording.webm',

        verdict:
          analysis.verdict,

        aiPercentage:
          analysis.aiPercentage,

        humanPercentage:
          analysis.humanPercentage,

        confidence:
          analysis.confidence,

        timestamp:
          new Date().toISOString(),

        location:
          currentLocation
            ? {
                latitude:
                  currentLocation.latitude,
                longitude:
                  currentLocation.longitude
              }
            : null,

        audioBlob:
          audioBlob,

        frames:
          analysis.frames,

        duration:
          analysis.duration

      }


      await saveVoiceRecord(
        result
      )


      analysisMessage.textContent =
        '✅ Voice analysis completed and saved.'

      displayResult(result)

      showPage('results')

    } catch (error) {

      console.error(
        'VoiceGuard Result Error:',
        error
      )

      analysisMessage.textContent =
        `❌ Voice analysis failed: ${error.message}`

    } finally {

      analyzeVoiceButton.disabled =
        false

    }

  }
)


// ============================================================
// RESULT DISPLAY
// ============================================================

function displayResult(result) {

  const container =
    document.querySelector(
      '#resultsContent'
    )


  const verdictIsAI =
    result.verdict ===
    'synthetic'


  const verdictText =
    verdictIsAI
      ? 'Likely AI-Generated Voice'
      : 'Likely Human Voice'


  const aiPercentage =
    Number(
      result.aiPercentage ?? 0
    )


  const humanPercentage =
    Number(
      result.humanPercentage ?? 0
    )


  const confidence =
    Number(
      result.confidence ?? 0
    )


  const locationText =
    result.location
      ? `${result.location.latitude}, ${result.location.longitude}`
      : 'Not shared'


  const timestamp =
    result.timestamp
      ? new Date(
          result.timestamp
        ).toLocaleString()
      : 'Unknown'


  let audioHTML = ''


  if (result.audioBlob) {

    const audioURL =
      URL.createObjectURL(
        result.audioBlob
      )

    audioHTML = `
      <div style="margin-top:20px;">

        <h3>🎧 Saved Voice Note</h3>

        <audio
          controls
          src="${audioURL}"
          style="width:100%;"
        ></audio>

      </div>
    `

  }


  container.innerHTML = `

    <div class="analysis-card">

      <h3>
        ${verdictIsAI ? '🤖' : '👤'}
        ${verdictText}
      </h3>

      <div style="margin-top:20px;">

        <p>
          <strong>AI Score:</strong>
          ${aiPercentage.toFixed(2)}%
        </p>

        <p>
          <strong>Human Score:</strong>
          ${humanPercentage.toFixed(2)}%
        </p>

        <p>
          <strong>Confidence:</strong>
          ${confidence.toFixed(2)}%
        </p>

        <p>
          <strong>File:</strong>
          ${escapeHTML(
            result.filename ||
            'Unknown'
          )}
        </p>

        <p>
          <strong>Timestamp:</strong>
          ${timestamp}
        </p>

        <p>
          <strong>Location:</strong>
          ${locationText}
        </p>

      </div>

      ${audioHTML}

      <button
        id="shareResult"
        class="secondary-btn"
        style="margin-top:20px;"
      >
        📤 Share Result
      </button>

    </div>
  `


  const shareButton =
    document.querySelector(
      '#shareResult'
    )


  if (shareButton) {

    shareButton.addEventListener(
      'click',
      () => {

        shareResult(result)

      }
    )

  }

}


// ============================================================
// SHARE RESULT
// ============================================================

async function shareResult(result) {

  const text = `
VoiceGuard Analysis Result

Verdict:
${
  result.verdict === 'synthetic'
    ? 'Likely AI-Generated Voice'
    : 'Likely Human Voice'
}

AI Score:
${Number(result.aiPercentage ?? 0).toFixed(2)}%

Human Score:
${Number(result.humanPercentage ?? 0).toFixed(2)}%

Confidence:
${Number(result.confidence ?? 0).toFixed(2)}%

File:
${result.filename || 'Unknown'}
  `.trim()


  try {

    if (navigator.share) {

      await navigator.share({
        title:
          'VoiceGuard Analysis Result',
        text
      })

    } else if (
      navigator.clipboard
    ) {

      await navigator.clipboard.writeText(
        text
      )

      alert(
        'Result copied to clipboard.'
      )

    } else {

      alert(text)

    }

  } catch (error) {

    console.error(
      'Share result error:',
      error
    )

  }

}


// ============================================================
// LOCATION
// ============================================================

document
  .querySelector('#shareLocation')
  .addEventListener(
    'click',
    () => {

      const status =
        document.querySelector(
          '#locationStatus'
        )


      if (!navigator.geolocation) {

        status.textContent =
          '❌ Geolocation is not supported.'

        return

      }


      status.textContent =
        '📍 Getting your location...'


      navigator.geolocation.getCurrentPosition(
        (position) => {

          currentLocation =
            position.coords


          status.textContent =
            `✅ Location saved: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`

        },
        (error) => {

          console.error(
            'Location error:',
            error
          )

          status.textContent =
            '❌ Could not get location. Please allow location permission.'

        }
      )

    }
  )


// ============================================================
// DASHBOARD
// ============================================================

async function loadDashboard() {

  try {

    const records =
      await getAllVoiceRecords()


    const total =
      records.length


    const aiCount =
      records.filter(
        (record) =>
          Number(
            record.aiPercentage
          ) >= 50
      ).length


    const humanCount =
      records.filter(
        (record) =>
          Number(
            record.aiPercentage
          ) < 50
      ).length


    const averageConfidence =
      total > 0
        ? records.reduce(
            (
              totalConfidence,
              record
            ) =>
              totalConfidence +
              Number(
                record.confidence || 0
              ),
            0
          ) / total
        : 0


    const aiDistribution =
      total > 0
        ? (
            aiCount /
            total
          ) * 100
        : 0


    const humanDistribution =
      total > 0
        ? (
            humanCount /
            total
          ) * 100
        : 0


    document.querySelector(
      '#totalRecordings'
    ).textContent =
      total


    document.querySelector(
      '#aiRecordings'
    ).textContent =
      aiCount


    document.querySelector(
      '#humanRecordings'
    ).textContent =
      humanCount


    document.querySelector(
      '#averageConfidence'
    ).textContent =
      `${averageConfidence.toFixed(2)}%`


    document.querySelector(
      '#dashboardAiBar'
    ).style.width =
      `${aiDistribution}%`


    document.querySelector(
      '#dashboardHumanBar'
    ).style.width =
      `${humanDistribution}%`


    document.querySelector(
      '#dashboardAiText'
    ).textContent =
      `${aiDistribution.toFixed(1)}%`


    document.querySelector(
      '#dashboardHumanText'
    ).textContent =
      `${humanDistribution.toFixed(1)}%`

  } catch (error) {

    console.error(
      'Dashboard error:',
      error
    )

  }

}


// ============================================================
// VOICE HISTORY
// ============================================================

async function loadHistory() {

  const container =
    document.querySelector(
      '#historyList'
    )


  try {

    const records =
      await getAllVoiceRecords()


    if (!records.length) {

      container.innerHTML = `
        <div class="analysis-card">
          <p>No saved voice analysis history.</p>
        </div>
      `

      return

    }


    container.innerHTML =
      records
        .map(
          (record) => {

            const ai =
              Number(
                record.aiPercentage ?? 0
              )

            const human =
              Number(
                record.humanPercentage ?? 0
              )

            const confidence =
              Number(
                record.confidence ?? 0
              )

            const date =
              record.timestamp
                ? new Date(
                    record.timestamp
                  ).toLocaleString()
                : 'Unknown'


            let audioHTML = ''

            if (record.audioBlob) {

              const url =
                URL.createObjectURL(
                  record.audioBlob
                )

              audioHTML = `
                <audio
                  controls
                  src="${url}"
                  style="width:100%;margin-top:10px;"
                ></audio>
              `

            }


            return `

              <div
                class="analysis-card"
                style="margin-top:15px;"
              >

                <h3>
                  ${
                    record.verdict ===
                    'synthetic'
                      ? '🤖'
                      : '👤'
                  }

                  ${
                    record.verdict ===
                    'synthetic'
                      ? 'Likely AI Voice'
                      : 'Likely Human Voice'
                  }
                </h3>

                <p>
                  <strong>File:</strong>
                  ${escapeHTML(
                    record.filename ||
                    'Unknown'
                  )}
                </p>

                <p>
                  <strong>AI:</strong>
                  ${ai.toFixed(2)}%
                </p>

                <p>
                  <strong>Human:</strong>
                  ${human.toFixed(2)}%
                </p>

                <p>
                  <strong>Confidence:</strong>
                  ${confidence.toFixed(2)}%
                </p>

                <p>
                  <strong>Date:</strong>
                  ${date}
                </p>

                ${audioHTML}

              </div>

            `

          }
        )
        .join('')

  } catch (error) {

    console.error(
      'History error:',
      error
    )

    container.innerHTML = `
      <div class="analysis-card">
        <p>❌ Could not load history.</p>
      </div>
    `

  }

}


// ============================================================
// CLEAR VOICE HISTORY
// ============================================================

document
  .querySelector('#clearHistory')
  .addEventListener(
    'click',
    async () => {

      const confirmed =
        confirm(
          'Are you sure you want to clear all voice analysis history?'
        )

      if (!confirmed) return

      try {

        await clearVoiceRecords()

        loadHistory()

        loadDashboard()

      } catch (error) {

        console.error(
          'Clear history error:',
          error
        )

      }

    }
  )


// ============================================================
// VOICE COMPARISON INPUTS
// ============================================================

const realVoiceInput =
  document.querySelector(
    '#realVoiceInput'
  )

const aiVoiceInput =
  document.querySelector(
    '#aiVoiceInput'
  )

const realVoiceInfo =
  document.querySelector(
    '#realVoiceInfo'
  )

const aiVoiceInfo =
  document.querySelector(
    '#aiVoiceInfo'
  )

const realVoicePlayer =
  document.querySelector(
    '#realVoicePlayer'
  )

const aiVoicePlayer =
  document.querySelector(
    '#aiVoicePlayer'
  )

const compareVoicesButton =
  document.querySelector(
    '#compareVoices'
  )

const comparisonMessage =
  document.querySelector(
    '#comparisonMessage'
  )


realVoiceInput.addEventListener(
  'change',
  (event) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    realVoiceFile = file
    realVoiceBlob = file

    realVoiceInfo.innerHTML = `
      <strong>Selected:</strong>
      ${escapeHTML(file.name)}
      <br>
      <strong>Size:</strong>
      ${formatFileSize(file.size)}
    `


    const url =
      URL.createObjectURL(file)

    realVoicePlayer.innerHTML = `
      <audio
        controls
        src="${url}"
        style="width:100%;"
      ></audio>
    `


    updateCompareButton()

  }
)


aiVoiceInput.addEventListener(
  'change',
  (event) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    aiVoiceFile = file
    aiVoiceBlob = file

    aiVoiceInfo.innerHTML = `
      <strong>Selected:</strong>
      ${escapeHTML(file.name)}
      <br>
      <strong>Size:</strong>
      ${formatFileSize(file.size)}
    `


    const url =
      URL.createObjectURL(file)

    aiVoicePlayer.innerHTML = `
      <audio
        controls
        src="${url}"
        style="width:100%;"
      ></audio>
    `


    updateCompareButton()

  }
)


function updateCompareButton() {

  compareVoicesButton.disabled =
    !realVoiceFile ||
    !aiVoiceFile

}


// ============================================================
// AUDIO FEATURE EXTRACTION
// Acoustic similarity estimate
// ============================================================

async function extractAudioFeatures(file) {

  const arrayBuffer =
    await file.arrayBuffer()


  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext


  if (!AudioContextClass) {

    throw new Error(
      'Web Audio API is not supported in this browser.'
    )

  }


  const context =
    new AudioContextClass()


  try {

    const audioBuffer =
      await context.decodeAudioData(
        arrayBuffer.slice(0)
      )


    const channelCount =
      audioBuffer.numberOfChannels


    const sampleRate =
      audioBuffer.sampleRate


    const length =
      audioBuffer.length


    const samples = new Float32Array(
      length
    )


    for (
      let channel = 0;
      channel < channelCount;
      channel++
    ) {

      const data =
        audioBuffer.getChannelData(
          channel
        )

      for (
        let i = 0;
        i < length;
        i++
      ) {

        samples[i] +=
          data[i] /
          channelCount

      }

    }


    let sumSquares = 0
    let zeroCrossings = 0

    let previous =
      samples[0] || 0


    const maxSamples =
      Math.min(
        samples.length,
        sampleRate * 30
      )


    for (
      let i = 0;
      i < maxSamples;
      i++
    ) {

      const value =
        samples[i]


      sumSquares +=
        value * value


      if (
        (value >= 0 &&
          previous < 0) ||
        (value < 0 &&
          previous >= 0)
      ) {

        zeroCrossings++

      }


      previous =
        value

    }


    const usedDuration =
      maxSamples /
      sampleRate


    const rms =
      Math.sqrt(
        sumSquares /
        Math.max(
          1,
          maxSamples
        )
      )


    const zeroCrossingRate =
      zeroCrossings /
      Math.max(
        1,
        maxSamples
      )


    // Simple spectral centroid
    const fftSize =
      2048

    const analyser =
      context.createAnalyser()

    analyser.fftSize =
      fftSize

    const source =
      context.createBufferSource()

    source.buffer =
      audioBuffer

    source.connect(
      analyser
    )

    analyser.connect(
      context.destination
    )


    const frequencyData =
      new Float32Array(
        analyser.frequencyBinCount
      )


    try {

      source.start(0)

      await new Promise(
        (resolve) => {

          setTimeout(
            resolve,
            50
          )

        }
      )

      analyser.getFloatFrequencyData(
        frequencyData
      )

    } catch {

      // Continue with basic features

    }


    let weightedFrequency = 0
    let totalPower = 0


    for (
      let i = 0;
      i < frequencyData.length;
      i++
    ) {

      const db =
        frequencyData[i]


      if (
        Number.isFinite(db)
      ) {

        const power =
          Math.pow(
            10,
            db / 10
          )


        const frequency =
          (
            i /
            frequencyData.length
          ) *
          (sampleRate / 2)


        weightedFrequency +=
          frequency *
          power


        totalPower +=
          power

      }

    }


    const spectralCentroid =
      totalPower > 0
        ? weightedFrequency /
          totalPower
        : 0


    return {

      duration:
        audioBuffer.duration,

      rms,

      zeroCrossingRate,

      spectralCentroid,

      sampleRate,

      usedDuration

    }

  } finally {

    try {

      await context.close()

    } catch {

      // Ignore close errors

    }

  }

}


// ============================================================
// SIMILARITY CALCULATION
// ============================================================

function calculateAcousticSimilarity(
  realFeatures,
  aiFeatures
) {

  // Normalize feature differences.
  // This is an acoustic similarity estimate,
  // NOT speaker identity verification.

  const durationSimilarity =
    similarityFromDifference(
      realFeatures.duration,
      aiFeatures.duration,
      Math.max(
        realFeatures.duration,
        aiFeatures.duration,
        1
      )
    )


  const rmsSimilarity =
    similarityFromDifference(
      realFeatures.rms,
      aiFeatures.rms,
      Math.max(
        realFeatures.rms,
        aiFeatures.rms,
        0.001
      )
    )


  const zcrSimilarity =
    similarityFromDifference(
      realFeatures.zeroCrossingRate,
      aiFeatures.zeroCrossingRate,
      Math.max(
        realFeatures.zeroCrossingRate,
        aiFeatures.zeroCrossingRate,
        0.001
      )
    )


  const centroidSimilarity =
    similarityFromDifference(
      realFeatures.spectralCentroid,
      aiFeatures.spectralCentroid,
      Math.max(
        realFeatures.spectralCentroid,
        aiFeatures.spectralCentroid,
        1
      )
    )


  const score =
    (
      durationSimilarity * 0.15 +
      rmsSimilarity * 0.25 +
      zcrSimilarity * 0.25 +
      centroidSimilarity * 0.35
    )


  return Number(
    Math.max(
      0,
      Math.min(
        100,
        score * 100
      )
    ).toFixed(2)
  )

}


function similarityFromDifference(
  valueA,
  valueB,
  scale
) {

  const difference =
    Math.abs(
      valueA -
      valueB
    )


  const normalized =
    difference /
    Math.max(
      scale,
      0.000001
    )


  return Math.max(
    0,
    1 -
      Math.min(
        normalized,
        1
      )
  )

}


// ============================================================
// VOICE DIFFERENCES
// ============================================================

function generateVoiceDifferences(
  realFeatures,
  aiFeatures
) {

  const differences = []


  const durationDifference =
    Math.abs(
      realFeatures.duration -
      aiFeatures.duration
    )


  if (
    durationDifference >
    Math.max(
      realFeatures.duration,
      aiFeatures.duration,
      1
    ) * 0.20
  ) {

    differences.push(
      `Recording duration differs by ${durationDifference.toFixed(2)} seconds.`
    )

  }


  const rmsDifference =
    Math.abs(
      realFeatures.rms -
      aiFeatures.rms
    )


  if (
    rmsDifference >
    Math.max(
      realFeatures.rms,
      aiFeatures.rms,
      0.001
    ) * 0.25
  ) {

    differences.push(
      'Overall signal energy/loudness characteristics are noticeably different.'
    )

  }


  const zcrDifference =
    Math.abs(
      realFeatures.zeroCrossingRate -
      aiFeatures.zeroCrossingRate
    )


  if (
    zcrDifference >
    Math.max(
      realFeatures.zeroCrossingRate,
      aiFeatures.zeroCrossingRate,
      0.001
    ) * 0.25
  ) {

    differences.push(
      'Voice texture/frequency-change characteristics differ.'
    )

  }


  const centroidDifference =
    Math.abs(
      realFeatures.spectralCentroid -
      aiFeatures.spectralCentroid
    )


  if (
    centroidDifference >
    Math.max(
      realFeatures.spectralCentroid,
      aiFeatures.spectralCentroid,
      1
    ) * 0.20
  ) {

    differences.push(
      'Spectral characteristics are noticeably different.'
    )

  }


  if (!differences.length) {

    differences.push(
      'No large difference was detected in the basic acoustic features used for this estimate.'
    )

  }


  return differences

}


// ============================================================
// COMPARE VOICES
// ============================================================

compareVoicesButton.addEventListener(
  'click',
  async () => {

    if (
      !realVoiceFile ||
      !aiVoiceFile
    ) {

      comparisonMessage.textContent =
        '❌ Please select both voice files.'

      return

    }


    compareVoicesButton.disabled =
      true


    comparisonMessage.textContent =
      '⏳ Extracting voice features and checking both recordings...'


    try {

      // Run acoustic feature extraction
      const [
        realFeatures,
        aiFeatures
      ] =
        await Promise.all([
          extractAudioFeatures(
            realVoiceFile
          ),
          extractAudioFeatures(
            aiVoiceFile
          )
        ])


      comparisonMessage.textContent =
        '⏳ Checking AI-generated voice detection...'


      // Reuse existing working Modulate backend
      const [
        realAnalysis,
        aiAnalysis
      ] =
        await Promise.all([
          analyzeAudioWithServer(
            realVoiceFile
          ),
          analyzeAudioWithServer(
            aiVoiceFile
          )
        ])


      const similarity =
        calculateAcousticSimilarity(
          realFeatures,
          aiFeatures
        )


      const differences =
        generateVoiceDifferences(
          realFeatures,
          aiFeatures
        )


      const comparison = {

        id:
          Date.now(),

        timestamp:
          new Date().toISOString(),

        realFilename:
          realVoiceFile.name,

        aiFilename:
          aiVoiceFile.name,

        similarity,

        realAiPercentage:
          realAnalysis.aiPercentage,

        realHumanPercentage:
          realAnalysis.humanPercentage,

        realConfidence:
          realAnalysis.confidence,

        aiVoiceAiPercentage:
          aiAnalysis.aiPercentage,

        aiVoiceHumanPercentage:
          aiAnalysis.humanPercentage,

        aiVoiceConfidence:
          aiAnalysis.confidence,

        realVerdict:
          realAnalysis.verdict,

        aiVoiceVerdict:
          aiAnalysis.verdict,

        differences,

        realFeatures,

        aiFeatures,

        realAudioBlob:
          realVoiceBlob,

        aiAudioBlob:
          aiVoiceBlob

      }


      currentComparison =
        comparison


      await saveComparisonRecord(
        comparison
      )


      displayComparisonReport(
        comparison
      )


      comparisonMessage.textContent =
        '✅ Voice comparison completed and saved.'


      await loadComparisonHistory()

    } catch (error) {

      console.error(
        'Voice comparison error:',
        error
      )

      comparisonMessage.textContent =
        `❌ Voice comparison failed: ${error.message}`

    } finally {

      compareVoicesButton.disabled =
        false

      updateCompareButton()

    }

  }
)


// ============================================================
// COMPARISON REPORT
// ============================================================

function displayComparisonReport(
  comparison
) {

  const report =
    document.querySelector(
      '#comparisonReport'
    )

  const content =
    document.querySelector(
      '#comparisonReportContent'
    )


  const similarity =
    Number(
      comparison.similarity ?? 0
    )


  const realAI =
    Number(
      comparison.realAiPercentage ?? 0
    )


  const realHuman =
    Number(
      comparison.realHumanPercentage ?? 0
    )


  const aiAI =
    Number(
      comparison.aiVoiceAiPercentage ?? 0
    )


  const aiHuman =
    Number(
      comparison.aiVoiceHumanPercentage ?? 0
    )


  const realConfidence =
    Number(
      comparison.realConfidence ?? 0
    )


  const aiConfidence =
    Number(
      comparison.aiVoiceConfidence ?? 0
    )


  const differences =
    Array.isArray(
      comparison.differences
    )
      ? comparison.differences
      : []


  content.innerHTML = `

    <div
      style="
        display:grid;
        grid-template-columns:
          repeat(auto-fit,minmax(220px,1fr));
        gap:15px;
      "
    >

      <div
        style="
          padding:20px;
          border-radius:12px;
          background:#f3f4f6;
        "
      >

        <h4>🎙️ Acoustic Similarity</h4>

        <div
          style="
            font-size:32px;
            font-weight:bold;
            margin-top:10px;
          "
        >
          ${similarity.toFixed(2)}%
        </div>

        <p>
          Acoustic similarity estimate
        </p>

      </div>


      <div
        style="
          padding:20px;
          border-radius:12px;
          background:#f3f4f6;
        "
      >

        <h4>👤 Real Voice</h4>

        <p>
          AI Score:
          <strong>
            ${realAI.toFixed(2)}%
          </strong>
        </p>

        <p>
          Human Score:
          <strong>
            ${realHuman.toFixed(2)}%
          </strong>
        </p>

        <p>
          Confidence:
          <strong>
            ${realConfidence.toFixed(2)}%
          </strong>
        </p>

        <p>
          Verdict:
          <strong>
            ${
              comparison.realVerdict ===
              'synthetic'
                ? 'Likely Synthetic'
                : 'Likely Non-Synthetic'
            }
          </strong>
        </p>

      </div>


      <div
        style="
          padding:20px;
          border-radius:12px;
          background:#f3f4f6;
        "
      >

        <h4>🤖 Imitated / AI Voice</h4>

        <p>
          AI Score:
          <strong>
            ${aiAI.toFixed(2)}%
          </strong>
        </p>

        <p>
          Human Score:
          <strong>
            ${aiHuman.toFixed(2)}%
          </strong>
        </p>

        <p>
          Confidence:
          <strong>
            ${aiConfidence.toFixed(2)}%
          </strong>
        </p>

        <p>
          Verdict:
          <strong>
            ${
              comparison.aiVoiceVerdict ===
              'synthetic'
                ? 'Likely Synthetic'
                : 'Likely Non-Synthetic'
            }
          </strong>
        </p>

      </div>

    </div>


    <div style="margin-top:25px;">

      <h4>📌 Detected Differences</h4>

      <ul>

        ${differences
          .map(
            (difference) =>
              `<li style="margin:8px 0;">
                ${escapeHTML(difference)}
              </li>`
          )
          .join('')}

      </ul>

    </div>


    <div
      style="
        margin-top:25px;
        padding:15px;
        border-left:4px solid #f59e0b;
        background:#fffbeb;
      "
    >

      <strong>⚠️ Important:</strong>

      <p>
        The similarity value is an acoustic similarity estimate.
        It does not prove that both recordings belong to the
        same person. Voice similarity can change because of
        microphone, noise, speaking content, pitch, and recording
        conditions.
      </p>

    </div>

  `


  report.style.display =
    'block'


  const shareButton =
    document.querySelector(
      '#shareComparison'
    )


  shareButton.onclick =
    () => {

      shareComparisonReport(
        comparison
      )

    }

}


// ============================================================
// SHARE COMPARISON REPORT
// ============================================================

async function shareComparisonReport(
  comparison
) {

  const text = `
VoiceGuard Voice Comparison Report

Real Voice:
${comparison.realFilename}

Imitated / AI Voice:
${comparison.aiFilename}

Acoustic Similarity Estimate:
${Number(comparison.similarity).toFixed(2)}%

Real Voice AI Score:
${Number(comparison.realAiPercentage).toFixed(2)}%

Real Voice Human Score:
${Number(comparison.realHumanPercentage).toFixed(2)}%

Imitated Voice AI Score:
${Number(comparison.aiVoiceAiPercentage).toFixed(2)}%

Imitated Voice Human Score:
${Number(comparison.aiVoiceHumanPercentage).toFixed(2)}%

Real Voice Verdict:
${
  comparison.realVerdict === 'synthetic'
    ? 'Likely Synthetic'
    : 'Likely Non-Synthetic'
}

Imitated Voice Verdict:
${
  comparison.aiVoiceVerdict === 'synthetic'
    ? 'Likely Synthetic'
    : 'Likely Non-Synthetic'
}

Detected Differences:
${comparison.differences.join('\n')}

Note:
The similarity value is an acoustic similarity estimate and
does not prove speaker identity.
  `.trim()


  try {

    if (navigator.share) {

      await navigator.share({
        title:
          'VoiceGuard Comparison Report',
        text
      })

    } else if (
      navigator.clipboard
    ) {

      await navigator.clipboard.writeText(
        text
      )

      alert(
        'Comparison report copied to clipboard.'
      )

    } else {

      alert(text)

    }

  } catch (error) {

    console.error(
      'Share comparison error:',
      error
    )

  }

}


// ============================================================
// COMPARISON HISTORY
// ============================================================

async function loadComparisonHistory() {

  const container =
    document.querySelector(
      '#comparisonHistoryList'
    )


  if (!container) return


  try {

    const records =
      await getAllComparisonRecords()


    if (!records.length) {

      container.innerHTML = `
        <p>
          No saved comparison history yet.
        </p>
      `

      return

    }


    container.innerHTML =
      records
        .map(
          (record) => {

            const date =
              record.timestamp
                ? new Date(
                    record.timestamp
                  ).toLocaleString()
                : 'Unknown'


            let realAudioHTML = ''

            let aiAudioHTML = ''


            if (
              record.realAudioBlob
            ) {

              const url =
                URL.createObjectURL(
                  record.realAudioBlob
                )

              realAudioHTML = `
                <audio
                  controls
                  src="${url}"
                  style="width:100%;"
                ></audio>
              `

            }


            if (
              record.aiAudioBlob
            ) {

              const url =
                URL.createObjectURL(
                  record.aiAudioBlob
                )

              aiAudioHTML = `
                <audio
                  controls
                  src="${url}"
                  style="width:100%;"
                ></audio>
              `

            }


            return `

              <div
                class="analysis-card"
                style="
                  margin-top:15px;
                "
              >

                <h3>
                  🔍 Comparison
                </h3>

                <p>
                  <strong>Date:</strong>
                  ${date}
                </p>

                <p>
                  <strong>Real Voice:</strong>
                  ${escapeHTML(
                    record.realFilename ||
                    'Unknown'
                  )}
                </p>

                <p>
                  <strong>AI / Imitated Voice:</strong>
                  ${escapeHTML(
                    record.aiFilename ||
                    'Unknown'
                  )}
                </p>

                <p>
                  <strong>
                    Acoustic Similarity Estimate:
                  </strong>
                  ${Number(
                    record.similarity || 0
                  ).toFixed(2)}%
                </p>

                <p>
                  <strong>
                    AI Voice AI Score:
                  </strong>
                  ${Number(
                    record.aiVoiceAiPercentage ||
                    0
                  ).toFixed(2)}%
                </p>

                <p>
                  <strong>
                    AI Voice Confidence:
                  </strong>
                  ${Number(
                    record.aiVoiceConfidence ||
                    0
                  ).toFixed(2)}%
                </p>

                <div style="margin-top:15px;">

                  <strong>
                    Real Voice Recording
                  </strong>

                  ${realAudioHTML}

                </div>

                <div style="margin-top:15px;">

                  <strong>
                    AI / Imitated Recording
                  </strong>

                  ${aiAudioHTML}

                </div>

                <button
                  class="secondary-btn comparison-share-history"
                  data-id="${record.id}"
                  style="margin-top:15px;"
                >
                  📤 Share Report
                </button>

              </div>

            `

          }
        )
        .join('')


    document
      .querySelectorAll(
        '.comparison-share-history'
      )
      .forEach(
        (button) => {

          button.addEventListener(
            'click',
            async () => {

              const id =
                Number(
                  button.dataset.id
                )

              const selected =
                records.find(
                  (record) =>
                    record.id === id
                )

              if (selected) {

                await shareComparisonReport(
                  selected
                )

              }

            }
          )

        }
      )

  } catch (error) {

    console.error(
      'Comparison history error:',
      error
    )

    container.innerHTML = `
      <p>
        ❌ Could not load comparison history.
      </p>
    `

  }

}


// ============================================================
// CLEAR COMPARISON HISTORY
// ============================================================

document
  .querySelector(
    '#clearComparisonHistory'
  )
  .addEventListener(
    'click',
    async () => {

      const confirmed =
        confirm(
          'Are you sure you want to clear comparison history?'
        )

      if (!confirmed) return


      try {

        await clearComparisonRecords()

        await loadComparisonHistory()

      } catch (error) {

        console.error(
          'Clear comparison history error:',
          error
        )

      }

    }
  )


// ============================================================
// UTILITIES
// ============================================================

function escapeHTML(value) {

  return String(
    value ?? ''
  )
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    )

}


function formatFileSize(bytes) {

  if (!bytes) return '0 Bytes'

  const units = [
    'Bytes',
    'KB',
    'MB',
    'GB'
  ]

  const index =
    Math.floor(
      Math.log(bytes) /
      Math.log(1024)
    )

  return (
    `${(
      bytes /
      Math.pow(
        1024,
        index
      )
    ).toFixed(2)} ${units[index]}`
  )

}


// ============================================================
// INITIALIZE
// ============================================================

showPage('home')

loadDashboard()

console.log(
  '🛡️ VoiceGuard initialized successfully.'
)