/**
 * ============================================
 * КОНСТАНТЫ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
 * ============================================
 */
const CANVAS_CONFIG = {
    SIZE: 400,
    CENTER_X: 200,
    CENTER_Y: 200,
    SCALE: 30
};

const VALIDATION_RULES = {
    X: { MIN: -3, MAX: 3 },
    Y: { MIN: -5, MAX: 3 },
    R: { VALID_VALUES: [1, 1.5, 2, 2.5, 3] }
};

let canvas, ctx;

/**
 * ============================================
 * РИСОВАНИЕ КООРДИНАТНОЙ ПЛОСКОСТИ
 * ============================================
 */

/**
 * Инициализация и отрисовка координатной плоскости
 */
function drawCoordinatePlane() {
    canvas = document.getElementById('coordinatePlane');
    ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, CANVAS_CONFIG.SIZE, CANVAS_CONFIG.SIZE);

    drawGrid();
    drawAxes();
    drawArea();
    drawPoints();
}

/**
 * Рисование сетки
 */
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let i = 0; i <= CANVAS_CONFIG.SIZE; i += CANVAS_CONFIG.SCALE) {
        // Вертикальные линии
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_CONFIG.SIZE);
        // Горизонтальные линии
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_CONFIG.SIZE, i);
    }
    ctx.stroke();
}

/**
 * Рисование осей координат
 */
function drawAxes() {
    // Рисуем оси
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Ось X
    ctx.moveTo(0, CANVAS_CONFIG.CENTER_Y);
    ctx.lineTo(CANVAS_CONFIG.SIZE, CANVAS_CONFIG.CENTER_Y);

    // Ось Y
    ctx.moveTo(CANVAS_CONFIG.CENTER_X, 0);
    ctx.lineTo(CANVAS_CONFIG.CENTER_X, CANVAS_CONFIG.SIZE);

    ctx.stroke();

    // Подписи осей
    drawAxisLabels();
}

/**
 * Рисование подписей на осях
 */
function drawAxisLabels() {
    ctx.fillStyle = '#000000';
    ctx.font = '10px Arial';

    // Подписи на оси X
    for (let i = -6; i <= 6; i++) {
        if (i !== 0) {
            const x = CANVAS_CONFIG.CENTER_X + i * CANVAS_CONFIG.SCALE;
            ctx.fillText(i.toString(), x - 5, CANVAS_CONFIG.CENTER_Y + 15);
        }
    }

    // Подписи на оси Y
    for (let i = -6; i <= 6; i++) {
        if (i !== 0) {
            const y = CANVAS_CONFIG.CENTER_Y - i * CANVAS_CONFIG.SCALE;
            ctx.fillText(i.toString(), CANVAS_CONFIG.CENTER_X + 5, y + 5);
        }
    }

    // Подписи осей
    ctx.fillText('0', CANVAS_CONFIG.CENTER_X + 5, CANVAS_CONFIG.CENTER_Y + 15);
    ctx.fillText('X', CANVAS_CONFIG.SIZE - 15, CANVAS_CONFIG.CENTER_Y + 15);
    ctx.fillText('Y', CANVAS_CONFIG.CENTER_X + 5, 15);
}

/**
 * Рисование области попадания
 */
function drawArea() {
    const r = getCurrentRadius();
    if (!r) return;

    ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    const r2 = r / 2;

    // Прямоугольник (первая четверть)
    ctx.beginPath();
    ctx.moveTo(CANVAS_CONFIG.CENTER_X, CANVAS_CONFIG.CENTER_Y);
    ctx.lineTo(CANVAS_CONFIG.CENTER_X + r * CANVAS_CONFIG.SCALE, CANVAS_CONFIG.CENTER_Y);
    ctx.lineTo(CANVAS_CONFIG.CENTER_X + r * CANVAS_CONFIG.SCALE, CANVAS_CONFIG.CENTER_Y - r * CANVAS_CONFIG.SCALE);
    ctx.lineTo(CANVAS_CONFIG.CENTER_X, CANVAS_CONFIG.CENTER_Y - r * CANVAS_CONFIG.SCALE);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Четверть круга (вторая четверть)
    ctx.beginPath();
    ctx.arc(CANVAS_CONFIG.CENTER_X, CANVAS_CONFIG.CENTER_Y, r2 * CANVAS_CONFIG.SCALE, 0, Math.PI / 2);
    ctx.lineTo(CANVAS_CONFIG.CENTER_X, CANVAS_CONFIG.CENTER_Y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Треугольник (третья четверть)
    ctx.beginPath();
    ctx.moveTo(CANVAS_CONFIG.CENTER_X, CANVAS_CONFIG.CENTER_Y);
    ctx.lineTo(CANVAS_CONFIG.CENTER_X, CANVAS_CONFIG.CENTER_Y + r * CANVAS_CONFIG.SCALE);
    ctx.lineTo(CANVAS_CONFIG.CENTER_X - r2 * CANVAS_CONFIG.SCALE, CANVAS_CONFIG.CENTER_Y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

/**
 * Рисование всех точек из таблицы результатов
 */
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

/**
 * Рисование одной точки
 */
function drawPoint(x, y, isHit) {
    const canvasX = CANVAS_CONFIG.CENTER_X + x * CANVAS_CONFIG.SCALE;
    const canvasY = CANVAS_CONFIG.CENTER_Y - y * CANVAS_CONFIG.SCALE;

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = isHit ? 'green' : 'red';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}

/**
 * ============================================
 * ВАЛИДАЦИЯ ФОРМЫ
 * ============================================
 */

/**
 * Проверка корректности числа
 */
function isValidNumber(value) {
    const numberPattern = /^-?\d+(\.\d+)?$/;
    return numberPattern.test(value) && !isNaN(parseFloat(value));
}

/**
 * Валидация координаты X
 */
function validateX() {
    const xInput = document.getElementById('x');
    const xError = document.getElementById('x-error');
    const xValue = xInput.value.trim();

    if (xValue === '') {
        xError.textContent = 'Введите значение X';
        return false;
    }

    if (!isValidNumber(xValue)) {
        xError.textContent = 'X должен быть числом (например: 2.5, -1.3)';
        return false;
    }

    const x = parseFloat(xValue);
    if (x < VALIDATION_RULES.X.MIN || x > VALIDATION_RULES.X.MAX) {
        xError.textContent = `X должен быть числом от ${VALIDATION_RULES.X.MIN} до ${VALIDATION_RULES.X.MAX}`;
        return false;
    }

    xError.textContent = '';
    return true;
}

/**
 * Валидация координаты Y
 */
function validateY() {
    const yHidden = document.getElementById('y-hidden');
    const yError = document.getElementById('y-error');
    const yValue = yHidden.value;

    if (yValue === '') {
        yError.textContent = 'Выберите значение Y';
        return false;
    }

    const y = parseFloat(yValue);
    if (isNaN(y) || y < VALIDATION_RULES.Y.MIN || y > VALIDATION_RULES.Y.MAX) {
        yError.textContent = `Y должен быть числом от ${VALIDATION_RULES.Y.MIN} до ${VALIDATION_RULES.Y.MAX}`;
        return false;
    }

    yError.textContent = '';
    return true;
}

/**
 * Валидация радиуса R
 */
function validateR() {
    const rError = document.getElementById('r-error');
    const checkedRRadio = document.querySelector('input[name="r"]:checked');

    if (!checkedRRadio) {
        rError.textContent = 'Выберите радиус R';
        return false;
    }

    const r = parseFloat(checkedRRadio.value);
    if (!VALIDATION_RULES.R.VALID_VALUES.includes(r)) {
        rError.textContent = 'Выберите валидный радиус R';
        return false;
    }

    rError.textContent = '';
    return true;
}

/**
 * Основная функция валидации формы
 */
function validateForm() {
    const isXValid = validateX();
    const isYValid = validateY();
    const isRValid = validateR();

    return isXValid && isYValid && isRValid;
}

/**
 * ============================================
 * ОБРАБОТКА КЛИКОВ ПО ХОЛСТУ
 * ============================================
 */

/**
 * Обработка клика по координатной плоскости
 */
function canvasClick(event) {
    if (!getCurrentRadius()) {
        alert('Сначала выберите радиус R!');
        return;
    }

    const coords = getClickCoordinates(event);

    if (!isCoordinateInRange(coords.x, VALIDATION_RULES.X) ||
        !isCoordinateInRange(coords.y, VALIDATION_RULES.Y)) {
        alert('Точка находится вне допустимого диапазона!');
        return;
    }

    setFormValues(coords.x, coords.y);
    submitForm();
}

/**
 * Получение координат клика
 */
function getClickCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    const x = (canvasX - CANVAS_CONFIG.CENTER_X) / CANVAS_CONFIG.SCALE;
    const y = -(canvasY - CANVAS_CONFIG.CENTER_Y) / CANVAS_CONFIG.SCALE;

    return { x, y };
}

/**
 * Проверка, находится ли координата в допустимом диапазоне
 */
function isCoordinateInRange(value, rule) {
    return value >= rule.MIN && value <= rule.MAX;
}

/**
 * Установка значений в форму
 */
function setFormValues(x, y) {
    document.getElementById('x').value = x.toFixed(2);
    document.getElementById('y-hidden').value = y.toFixed(2);
//    selectYButton(Math.round(y));
}

///** Стоит ли, главное не забыть
// * Выбор кнопки Y
// */
//function selectYButton(yValue) {
//    const yButtons = document.querySelectorAll('.y-btn');
//    yButtons.forEach(btn => btn.classList.remove('selected'));
//
//    const targetButton = document.querySelector(`.y-btn[data-value="${yValue}"]`);
//    if (targetButton) {
//        targetButton.classList.add('selected');
//        document.getElementById('y-hidden').value = yValue;
//    }
//}

/**
 * Отправка формы
 */
function submitForm() {
    const form = document.getElementById('pointForm');
    if (form.requestSubmit) {
        form.requestSubmit();
    } else {
        if (validateForm()) {
            form.submit();
        }
    }
}

/**
 * ============================================
 * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
 * ============================================
 */

/**
 * Получение текущего значения радиуса
 */
function getCurrentRadius() {
    const checkedRRadio = document.querySelector('input[name="r"]:checked');
    return checkedRRadio ? parseFloat(checkedRRadio.value) : null;
}

/**
 * Очистка результатов
 */
function clearResults() {
    fetch('controller?action=clear', {
        method: 'POST'
    }).then(() => {
        location.reload();
    });
}

/**
 * Восстановление данных формы из URL параметров
 */
function restoreFormData() {
    const urlParams = new URLSearchParams(window.location.search);

    // Восстановление X
    const x = urlParams.get('x');
    if (x) {
        document.getElementById('x').value = x;
    }

    // Восстановление Y
    const y = urlParams.get('y');
    if (y) {
        selectYButton(y);
    }

    // Восстановление R
    const r = urlParams.get('r');
    if (r) {
        const radio = document.querySelector(`input[name="r"][value="${r}"]`);
        if (radio) radio.checked = true;
    }
}

/**
 * ============================================
 * ИНИЦИАЛИЗАЦИЯ
 * ============================================
 */

/**
 * Инициализация обработчиков событий
 */
function initEventListeners() {
    // Обработчик отправки формы
    const form = document.getElementById('pointForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
            }
        });
    }

    // Обработчики для кнопок Y
    const yButtons = document.querySelectorAll('.y-btn');
    yButtons.forEach(button => {
        button.addEventListener('click', function() {
            yButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('y-hidden').value = this.dataset.value;
            drawCoordinatePlane();
        });
    });

    // Обработчики для радио-кнопок R
    const rRadios = document.querySelectorAll('input[name="r"]');
    rRadios.forEach(radio => {
        radio.addEventListener('change', drawCoordinatePlane);
    });
}

/**
 * Инициализация приложения
 */
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
});

/**
 * Инициализация при загрузке страницы
 */
window.onload = function() {
    drawCoordinatePlane();
    restoreFormData();
};