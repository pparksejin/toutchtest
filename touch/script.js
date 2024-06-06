const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'asset/image.jpg'; // 배경 이미지 경로

const overlayImage = new Image();
overlayImage.src = 'asset/image3.png'; // 오버레이 이미지 경로

let ripples = [];
let animationFrame;
let overlayY = 0;

backgroundImage.onload = () => {
    resizeCanvas();
    animate();
};

window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ripples.push({ x, y, radius: 0 });
});

canvas.addEventListener('touchstart', (event) => {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ripples.push({ x, y, radius: 0 });
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ripples.forEach((ripple, index) => {
        ripple.radius += 2;
        drawRipple(ripple.x, ripple.y, ripple.radius);

        if (ripple.radius >= canvas.width) {
            ripples.splice(index, 1); // 파동이 완전히 사라지면 해당 파동 삭제
        }
    });

    drawOverlayImage();
    animationFrame = requestAnimationFrame(animate);
}

function drawRipple(x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.clip();

    // 파동이 증가할 때 투명도가 서서히 감소하도록 계산
    const transparency = 1 - (radius / canvas.width);
    ctx.globalAlpha = transparency;
    
    ctx.filter = 'blur(10px) saturate(6)';
    ctx.drawImage(backgroundImage, 10, 20, canvas.width, canvas.height);
    
    const rippleAreaSize = radius * 2;
    const imageData = ctx.getImageData(x - radius, y - radius, rippleAreaSize, rippleAreaSize);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 50; // 노이즈 값 (-25 ~ 25)
        data[i] += noise; // R 값에 노이즈 추가
        data[i + 1] += noise; // G 값에 노이즈 추가
        data[i + 2] += noise; // B 값에 노이즈 추가
    }

    ctx.putImageData(imageData, x - radius, y - radius);
    ctx.restore();
}

function drawOverlayImage() {
    const aspectRatio = overlayImage.width / overlayImage.height;
    const overlayWidth = canvas.height * aspectRatio; // 캔버스 높이에 맞춘 오버레이 너비
    overlayY += 1;
    if (overlayY > canvas.height) overlayY = 0;

    ctx.globalAlpha = 0.5;
    ctx.drawImage(overlayImage, (canvas.width - overlayWidth) / 2, overlayY - canvas.height, overlayWidth, canvas.height);
    ctx.drawImage(overlayImage, (canvas.width - overlayWidth) / 2, overlayY, overlayWidth, canvas.height);
    ctx.globalAlpha = 1.0;
}





