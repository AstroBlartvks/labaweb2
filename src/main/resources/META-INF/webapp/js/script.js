let canvas;
let ctx;
const CANVAS_SIZE = 400;
const CENTER_X = CANVAS_SIZE / 2;
const CENTER_Y = CANVAS_SIZE / 2;
const SCALE = 30;

function drawCoordinatePlane() {
    canvas = document.getElementById('coordinatePlane');
    ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawGrid();
    drawAxes();
    drawArea();
    drawPoints();
}

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let i = 0; i <= CANVAS_SIZE; i += SCALE) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
    }
    ctx.stroke();
}

function drawAxes() {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();

    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(CANVAS_SIZE, CENTER_Y);

    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, CANVAS_SIZE);

    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';

    for (let i = -6; i <= 6; i++) {
        if (i !== 0) {
            const x = CENTER_X + i * SCALE;
            ctx.fillText(i.toString(), x - 5, CENTER_Y + 15);
        }
    }

    for (let i = -6; i <= 6; i++) {
        if (i !== 0) {
            const y = CENTER_Y - i * SCALE;
            ctx.fillText(i.toString(), CENTER_X + 5, y + 5);
        }
    }

    ctx.fillText('0', CENTER_X + 5, CENTER_Y + 15);
    ctx.fillText('X', CANVAS_SIZE - 15, CENTER_Y + 15);
    ctx.fillText('Y', CENTER_X + 5, 15);
}

function drawArea() {
    const rSelect = document.getElementById('r');
    const r = parseFloat(rSelect.value);

    if (!r || r <= 0) return;

    ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    ctx.beginPath();

    const r2 = r / 2;

    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(CENTER_X + r2 * SCALE, CENTER_Y);
    ctx.lineTo(CENTER_X + r2 * SCALE, CENTER_Y - r * SCALE);
    ctx.lineTo(CENTER_X, CENTER_Y - r * SCALE);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, r2 * SCALE, Math.PI / 2, Math.PI);
    ctx.lineTo(CENTER_X, CENTER_Y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(CENTER_X - r2 * SCALE, CENTER_Y - r2 * SCALE);
    ctx.lineTo(CENTER_X, CENTER_Y - r2 * SCALE);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawPoints() {
    const table = document.getElementById('resultsTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 4) {
            const x = parseFloat(cells[0].textContent);
            const y = parseFloat(cells[1].textContent);
            const isHit = cells[3].textContent === 'Попадание';

            drawPoint(x, y, isHit);
        }
    }
}

function drawPoint(x, y, isHit) {
    const canvasX = CENTER_X + x * SCALE;
    const canvasY = CENTER_Y - y * SCALE;

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = isHit ? 'green' : 'red';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function canvasClick(event) {
    const rSelect = document.getElementById('r');
    const r = rSelect.value;

    if (!r || r === '') {
        alert('Сначала выберите радиус R!');
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    const x = (canvasX - CENTER_X) / SCALE;
    const y = -(canvasY - CENTER_Y) / SCALE;

    if (x < -5 || x > 3 || y < -3 || y > 5) {
        alert('Точка находится вне допустимого диапазона!');
        return;
    }

    document.getElementById('y').value = y.toFixed(2);

    const xRadios = document.getElementsByName('x');
    let closestRadio = xRadios[0];
    let minDistance = Math.abs(parseFloat(xRadios[0].value) - x);

    for (let i = 1; i < xRadios.length; i++) {
        const distance = Math.abs(parseFloat(xRadios[i].value) - x);
        if (distance < minDistance) {
            minDistance = distance;
            closestRadio = xRadios[i];
        }
    }

    closestRadio.checked = true;

    document.getElementById('pointForm').submit();
}

function validateForm() {
    const xRadios = document.getElementsByName('x');
    const yInput = document.getElementById('y');
    const rSelect = document.getElementById('r');

    let isValid = true;

    let xSelected = false;
    for (let radio of xRadios) {
        if (radio.checked) {
            xSelected = true;
            break;
        }
    }

    if (!xSelected) {
        alert('Выберите координату X');
        isValid = false;
    }

    const yValue = yInput.value.trim();
    const yError = document.getElementById('y-error');

    if (yValue === '') {
        yError.textContent = 'Введите значение Y';
        isValid = false;
    } else {
        const y = parseFloat(yValue);
        if (isNaN(y) || y < -3 || y > 5) {
            yError.textContent = 'Y должен быть числом от -3 до 5';
            isValid = false;
        } else {
            yError.textContent = '';
        }
    }

    const rError = document.getElementById('r-error');
    if (rSelect.value === '') {
        rError.textContent = 'Выберите радиус R';
        isValid = false;
    } else {
        rError.textContent = '';
    }

    return isValid;
}

function clearResults() {
    fetch('controller?action=clear', {
        method: 'POST'
    }).then(() => {
        location.reload();
    });
}

function restoreFormData() {
    const urlParams = new URLSearchParams(window.location.search);

    const x = urlParams.get('x');
    if (x) {
        const radio = document.querySelector(`input[name="x"][value="${x}"]`);
        if (radio) radio.checked = true;
    }

    const y = urlParams.get('y');
    if (y) {
        document.getElementById('y').value = y;
    }

    const r = urlParams.get('r');
    if (r) {
        document.getElementById('r').value = r;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pointForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
            }
        });
    }

    const rSelect = document.getElementById('r');
    if (rSelect) {
        rSelect.addEventListener('change', drawCoordinatePlane);
    }
});