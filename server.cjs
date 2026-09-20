require('dotenv').config()

const fs = require('fs')
const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()

const upload = multer({
  dest: 'uploads/'
})

app.use(cors())

// Test backend
app.get('/', (req, res) => {
  res.json({
    message: 'VoiceGuard backend is running!'
  })
})

// Analyze voice
app.post('/api/analyze', upload.single('audio'), async (req, res) => {
  console.log('🔥 ANALYZE ROUTE HIT')

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file received'
      })
    }

    console.log('🎙️ File received:', req.file.originalname)
    console.log('📦 File type:', req.file.mimetype)

    if (!process.env.MODULATE_API_KEY) {
      console.error('❌ MODULATE_API_KEY missing')

      return res.status(500).json({
        success: false,
        message: 'Modulate API key is missing'
      })
    }

    const audioBuffer = fs.readFileSync(req.file.path)

    console.log('🚀 Sending audio to Modulate...')

    const formData = new FormData()

    const blob = new Blob([audioBuffer], {
      type: req.file.mimetype || 'audio/mpeg'
    })

    // IMPORTANT:
    // Modulate batch API expects "upload_file"
    formData.append(
      'upload_file',
      blob,
      req.file.originalname || 'recording.mp3'
    )

    const response = await fetch(
      'https://modulate-developer-apis.com/api/velma-2-synthetic-voice-detection-batch',
      {
        method: 'POST',
        headers: {
          'X-API-Key': process.env.MODULATE_API_KEY
        },
        body: formData
      }
    )

    const responseText = await response.text()

    console.log('Modulate status:', response.status)
    console.log('Modulate response:', responseText)

    // Delete temporary uploaded file
    fs.unlink(req.file.path, () => {})

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Modulate API error',
        status: response.status,
        details: responseText
      })
    }

    let result

    try {
      result = JSON.parse(responseText)
    } catch {
      result = {
        raw: responseText
      }
    }

    console.log('✅ Modulate result:', result)

    // Extract useful result for VoiceGuard
    let verdict = 'unknown'
    let confidence = null

    if (result.frames && result.frames.length > 0) {
      const frames = result.frames

      // Average confidence across all frames
      const totalConfidence = frames.reduce(
        (sum, frame) => sum + Number(frame.confidence || 0),
        0
      )

      confidence = totalConfidence / frames.length

      // Majority verdict
      const syntheticCount = frames.filter(
        frame => frame.verdict === 'synthetic'
      ).length

      const humanCount = frames.filter(
        frame => frame.verdict === 'non-synthetic'
      ).length

      if (syntheticCount > humanCount) {
        verdict = 'synthetic'
      } else if (humanCount > syntheticCount) {
        verdict = 'non-synthetic'
      } else {
        verdict = frames[0].verdict || 'unknown'
      }
    }

    return res.json({
      success: true,
      verdict,
      confidence,
      result
    })

  } catch (error) {
    console.error('❌ Analyze error:', error)

    if (req.file?.path) {
      fs.unlink(req.file.path, () => {})
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
})

app.listen(3000, () => {
  console.log('🛡️ VoiceGuard backend running on http://localhost:3000')
})