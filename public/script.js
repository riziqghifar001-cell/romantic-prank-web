let stream = null;
let capturedImage = null;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const cameraPermissionScreen = document.getElementById('camera-permission');
const romanticMessageScreen = document.getElementById('romantic-message');
const photoRevealScreen = document.getElementById('photo-reveal');

const revealBtn = document.getElementById('reveal-btn');
const retryBtn = document.getElementById('retry-btn');

// Minta akses kamera saat halaman dibuka
window.addEventListener('load', () => {
    requestCameraAccess();
});

// Fungsi meminta akses kamera
async function requestCameraAccess() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        // Set video stream
        video.srcObject = stream;

        // Tunggu video siap, lalu capture otomatis
        video.onloadedmetadata = () => {
            video.play();
            
            // Capture setelah video siap (delay 500ms)
            setTimeout(() => {
                capturePhoto();
            }, 500);
        };

    } catch (error) {
        console.error('Error akses kamera:', error);
        alert('Izinkan akses kamera untuk melanjutkan!');
    }
}

// Fungsi capture foto
function capturePhoto() {
    // Set canvas ukuran sesuai video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video ke canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simpan image data
    capturedImage = canvas.toDataURL('image/jpeg');

    // Hentikan stream kamera
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    // Tampilkan pesan romantis
    showRomanticMessage();
}

// Fungsi tampilkan pesan romantis
function showRomanticMessage() {
    cameraPermissionScreen.classList.add('hidden');
    romanticMessageScreen.classList.remove('hidden');
}

// Event listener tombol "Pencet ini sayang"
revealBtn.addEventListener('click', () => {
    showPhotoReveal();
});

// Fungsi tampilkan foto
function showPhotoReveal() {
    romanticMessageScreen.classList.add('hidden');
    photoRevealScreen.classList.remove('hidden');

    // Tampilkan foto yang sudah di-capture
    const img = new Image();
    img.src = capturedImage;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };
}

// Event listener tombol "Ulangi"
retryBtn.addEventListener('click', () => {
    // Reset semua
    capturedImage = null;
    cameraPermissionScreen.classList.remove('hidden');
    romanticMessageScreen.classList.add('hidden');
    photoRevealScreen.classList.add('hidden');

    // Minta akses kamera lagi
    requestCameraAccess();
});
