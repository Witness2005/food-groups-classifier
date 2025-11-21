document.addEventListener("DOMContentLoaded", () => {
    // --- Selectores ---
    const btnTabUpload = document.getElementById('btn-tab-upload');
    const btnTabCamera = document.getElementById('btn-tab-camera');
    const uploadSection = document.getElementById('upload-section');
    const cameraSection = document.getElementById('camera-section');
    const video = document.getElementById('camera-view');
    const canvas = document.getElementById('camera-canvas');
    const btnSnapshot = document.getElementById('btn-snapshot');
    const fileUpload = document.getElementById('file-upload');
    const imgPreviewUpload = document.getElementById('image-preview-upload');
    const imgPreviewCamera = document.getElementById('image-preview-camera');
    const btnClassify = document.getElementById('btn-classify');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btn-text');

    // --- Selectores del Nuevo Overlay ---
    const winnerOverlay = document.getElementById('winner-overlay');
    const winnerIcon = document.getElementById('winner-icon');
    const winnerLabel = document.getElementById('winner-label');
    const winnerConfidence = document.getElementById('winner-confidence');
    const btnReset = document.getElementById('btn-reset');

    // --- CONFIGURACIÓN DE ACTIVOS (TUS NOMBRES EXACTOS) ---
    const assets = {
        fruta:  ['fruta-1.png', 'fruta-2.webp', 'fruta-3.png'],
        lacteo: ['lacteo-1.png', 'lacteo-2.webp', 'lacteo-3.png'],
        grano:  ['cereal-1.png', 'cereal-2.png', 'cereal-3.webp'] // Mapeamos 'grano' a tus archivos 'cereal'
    };

    let currentStream = null;
    let currentMode = 'upload'; 
    let snapshotDataUrl = null;

    // --- Lógica de Pestañas ---
    btnTabUpload.addEventListener('click', () => { setMode('upload'); btnTabUpload.classList.add('active'); btnTabCamera.classList.remove('active'); });
    btnTabCamera.addEventListener('click', () => { setMode('camera'); btnTabCamera.classList.add('active'); btnTabUpload.classList.remove('active'); });

    function setMode(mode) {
        currentMode = mode;
        if (mode === 'upload') {
            uploadSection.classList.remove('d-none');
            cameraSection.classList.add('d-none');
            stopCamera();
        } else {
            uploadSection.classList.add('d-none');
            cameraSection.classList.remove('d-none');
            startCamera();
        }
    }

    // --- Cámara ---
    async function startCamera() {
        if (currentStream) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            currentStream = stream;
            video.srcObject = stream;
        } catch (err) { alert("No se pudo acceder a la cámara."); }
    }
    function stopCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
            video.srcObject = null;
        }
    }
    btnSnapshot.addEventListener('click', () => {
        if (!currentStream) {
            startCamera().then(() => {
                video.play();
                imgPreviewCamera.classList.add('d-none');
                video.classList.remove('d-none');
                btnSnapshot.innerHTML = '<i class="bi bi-circle-fill text-danger"></i> Capturar';
            });
            return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        snapshotDataUrl = canvas.toDataURL('image/jpeg');
        imgPreviewCamera.src = snapshotDataUrl;
        imgPreviewCamera.classList.remove('d-none');
        video.classList.add('d-none'); 
        stopCamera();
        btnSnapshot.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Retomar';
    });

    // --- Subida Archivo ---
    fileUpload.addEventListener('change', () => {
        const file = fileUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imgPreviewUpload.src = e.target.result;
                imgPreviewUpload.classList.remove('d-none');
            }
            reader.readAsDataURL(file);
        }
    });

    // --- Botón de Reinicio (Overlay) ---
    btnReset.addEventListener('click', () => {
        winnerOverlay.classList.add('d-none'); // Ocultar overlay
        // Limpiar clases de colores previos
        winnerLabel.classList.remove('text-fruta', 'text-lacteo', 'text-grano');
    });

    // --- Clasificación ---
    btnClassify.addEventListener('click', async () => {
        let blob = null;
        if (currentMode === 'upload') {
            if (!fileUpload.files[0]) return alert("Selecciona un archivo.");
            blob = fileUpload.files[0];
        } else {
            if (!snapshotDataUrl) return alert("Toma una foto primero.");
            const res = await fetch(snapshotDataUrl);
            blob = await res.blob();
        }

        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');

        showLoading(true);

        try {
            const response = await fetch('/predict', { method: 'POST', body: formData });
            if (!response.ok) throw new Error("Error en servidor");
            const data = await response.json();
            
            handleSuccess(data);

        } catch (error) {
            console.error(error);
            alert("Error al clasificar");
        } finally {
            showLoading(false);
        }
    });

    function showLoading(isLoading) {
        if (isLoading) {
            spinner.classList.remove('d-none');
            btnText.innerText = "Pensando...";
            btnClassify.disabled = true;
        } else {
            spinner.classList.add('d-none');
            btnText.innerText = "Analizar Alimento";
            btnClassify.disabled = false;
        }
    }

    // --- LÓGICA DE RESULTADO "GAME WINNER" ---
    function handleSuccess(data) {
        const label = data.label.toLowerCase(); 
        const confidence = (data.confidence * 100).toFixed(1);

        // 1. Configurar textos del Overlay
        winnerLabel.innerText = label.toUpperCase();
        winnerConfidence.innerText = `${confidence}%`;

        // 2. Limpiar clases anteriores
        winnerLabel.className = 'winner-title'; // Reset

        // 3. Lógica específica por tipo
        if (label === 'fruta') {
            winnerLabel.classList.add('text-fruta');
            winnerIcon.innerText = "🍎";
            playSound('sound-fruta');
            triggerFloatingImages(assets.fruta); 
        } 
        else if (label === 'lacteo') {
            winnerLabel.classList.add('text-lacteo');
            winnerIcon.innerText = "🥛";
            playSound('sound-lacteo');
            triggerFloatingImages(assets.lacteo);
        } 
        else if (label === 'grano') {
            winnerLabel.classList.add('text-grano');
            winnerIcon.innerText = "🌾";
            playSound('sound-grano');
            triggerFloatingImages(assets.grano);
        }

        // 4. Mostrar el Overlay (¡Boom!)
        winnerOverlay.classList.remove('d-none');
    }

    function playSound(elementId) {
        const audio = document.getElementById(elementId);
        if(audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Navegador bloqueó autoplay: ", e));
        }
    }

    // --- LLUVIA DE IMÁGENES (UPDATED) ---
    function triggerFloatingImages(imageList) {
        const container = document.getElementById('effects-container');
        
        // Crear 20 imágenes para más impacto
        for (let i = 0; i < 20; i++) {
            const img = document.createElement('img');
            
            // Elegir imagen aleatoria de la lista disponible
            const randomImageName = imageList[Math.floor(Math.random() * imageList.length)];
            img.src = `/static/img/${randomImageName}`;
            
            img.classList.add('floating-img');
            
            // Posición aleatoria
            img.style.left = Math.random() * 100 + 'vw';
            
            // Duración variada (3s a 5s)
            img.style.animationDuration = (Math.random() * 2 + 3) + 's'; 

            // Tamaño variado (50px a 100px base, luego crece con zoom)
            const randomSize = Math.random() * 50 + 50; 
            img.style.width = randomSize + 'px';

            container.appendChild(img);

            setTimeout(() => {
                img.remove();
            }, 5000);
        }
    }
});
