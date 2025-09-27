/**
 * ============================================
 * КОНСТАНТЫ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
 * ============================================
 */
const CANVAS_CONFIG = {
    SIZE_WIDTH: 1200,
    SIZE_HEIGHT: 900,
    CENTER_X: 600,
    CENTER_Y: 450,
    SCALE: 100
};

const VALIDATION_RULES = {
    X: { MIN: 0, MAX: 1200 },
    Y: { MIN: 0, MAX: 900 }
};

let canvas, ctx, mapImage;

/**
 * ============================================
 * РИСОВАНИЕ КООРДИНАТНОЙ ПЛОСКОСТИ
 * ============================================
 */

/**
 * Инициализация и отрисовка координатной плоскости
 */
function drawCoordinatePlane() {
    console.log('drawCoordinatePlane function called');
    canvas = document.getElementById('coordinatePlane');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    ctx = canvas.getContext('2d');
    console.log('Canvas found, size:', canvas.width, 'x', canvas.height);

    // Очищаем canvas и перерисовываем все заново
    ctx.clearRect(0, 0, CANVAS_CONFIG.SIZE_WIDTH, CANVAS_CONFIG.SIZE_HEIGHT);

    // Рисуем белый фон
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_CONFIG.SIZE_WIDTH, CANVAS_CONFIG.SIZE_HEIGHT);

    // Рисуем фоновое изображение, если загружено
    if (mapImage && mapImage.complete) {
        console.log('Drawing background image');
        ctx.drawImage(mapImage, 0, 0, CANVAS_CONFIG.SIZE_WIDTH, CANVAS_CONFIG.SIZE_HEIGHT);
    } else {
        console.log('No background image available, using white background');
    }

    drawGrid();
    drawAxes();
    drawPoints();
}

/**
 * Загрузка фонового изображения карты
 */
function loadMapImage() {
    console.log('loadMapImage function called');

    mapImage = new Image();
    mapImage.crossOrigin = 'anonymous';

    mapImage.onload = function() {
        console.log('Map image loaded successfully from:', mapImage.src);
        drawCoordinatePlane();
    };

    mapImage.onerror = function(e) {
        console.error('Failed to load map image:', mapImage.src);
        console.error('Error details:', e);

        // Пробуем альтернативные пути
        tryAlternativePaths();
    };

    // Начинаем с контекстного пути для WildFly
    const contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
    const imagePath = contextPath + '/images/map.png';
    console.log('Attempting to load:', imagePath);
    mapImage.src = imagePath;
}

function tryAlternativePaths() {
    const contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
    const paths = [
        'images/map.png',
        './images/map.png',
        contextPath + '/images/map.png',
        '/images/map.png',
        '../images/map.png'
    ];

    let currentIndex = 0;

    function tryNext() {
        if (currentIndex >= paths.length) {
            console.error('All paths failed, creating fallback');
            createFallbackImage();
            return;
        }

        const path = paths[currentIndex];
        console.log('Trying alternative path:', path);

        const testImg = new Image();
        testImg.onload = function() {
            console.log('Success with path:', path);
            mapImage.src = path;
        };
        testImg.onerror = function() {
            console.log('Failed path:', path);
            currentIndex++;
            tryNext();
        };
        testImg.src = path;
    }

    tryNext();
}

function createFallbackImage() {
    // Создаем простую замену если map.png не загружается
    console.log('Creating fallback image');

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_CONFIG.SIZE_WIDTH;
    canvas.height = CANVAS_CONFIG.SIZE_HEIGHT;
    const ctx = canvas.getContext('2d');

    // Простой градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_CONFIG.SIZE_WIDTH, CANVAS_CONFIG.SIZE_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#90EE90');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_CONFIG.SIZE_WIDTH, CANVAS_CONFIG.SIZE_HEIGHT);

    mapImage = new Image();
    mapImage.onload = function() {
        console.log('Fallback image created');
        drawCoordinatePlane();
    };
    mapImage.src = canvas.toDataURL();
}

// Функция для обновления только динамических элементов
function redrawDynamicElements() {
    // Очищаем только области с динамическими элементами при необходимости
    drawPoints();
}

/**
 * Рисование сетки
 */
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let i = 0; i <= CANVAS_CONFIG.SIZE_WIDTH; i += CANVAS_CONFIG.SCALE) {
        // Вертикальные линии
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_CONFIG.SIZE_HEIGHT);
    }

    for (let i = 0; i <= CANVAS_CONFIG.SIZE_HEIGHT; i += CANVAS_CONFIG.SCALE) {
        // Горизонтальные линии
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_CONFIG.SIZE_WIDTH, i);
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
    ctx.lineTo(CANVAS_CONFIG.SIZE_WIDTH, CANVAS_CONFIG.CENTER_Y);

    // Ось Y
    ctx.moveTo(CANVAS_CONFIG.CENTER_X, 0);
    ctx.lineTo(CANVAS_CONFIG.CENTER_X, CANVAS_CONFIG.SIZE_HEIGHT);

    ctx.stroke();

    // Подписи осей
    drawAxisLabels();
}

/**
 * Рисование подписей на осях
 */
function drawAxisLabels() {
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';

    // Подписи на оси X (каждые 100 пикселей)
    for (let i = 0; i <= CANVAS_CONFIG.SIZE_WIDTH; i += CANVAS_CONFIG.SCALE) {
        if (i !== CANVAS_CONFIG.CENTER_X) {
            ctx.fillText(i.toString(), i - 10, CANVAS_CONFIG.CENTER_Y + 20);
        }
    }

    // Подписи на оси Y (каждые 100 пикселей)
    for (let i = 0; i <= CANVAS_CONFIG.SIZE_HEIGHT; i += CANVAS_CONFIG.SCALE) {
        if (i !== CANVAS_CONFIG.CENTER_Y) {
            ctx.fillText(i.toString(), CANVAS_CONFIG.CENTER_X + 10, i + 5);
        }
    }

    // Подписи осей и центра
    ctx.fillText('0', CANVAS_CONFIG.CENTER_X + 5, CANVAS_CONFIG.CENTER_Y + 15);
    ctx.fillText('X (px)', CANVAS_CONFIG.SIZE_WIDTH - 40, CANVAS_CONFIG.CENTER_Y + 20);
    ctx.fillText('Y (px)', CANVAS_CONFIG.CENTER_X + 10, 15);
}


/**
 * Рисование всех точек из таблицы результатов
 */
function drawPoints() {
    const table = document.getElementById('resultsTable');
    if (!table) return; // Если таблицы нет, выходим

    const tbody = table.getElementsByTagName('tbody')[0];
    if (!tbody) return; // Если tbody нет, выходим

    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 3) {
            const x = parseFloat(cells[0].textContent);
            const y = parseFloat(cells[1].textContent);
            const isHit = cells[2].textContent === 'Попадание';

            drawPoint(x, y, isHit);
        }
    }
}

/**
 * Рисование одной точки (в пиксельных координатах)
 */
function drawPoint(x, y, isHit) {
    const canvasX = x;
    const canvasY = y;
    const radius = getCurrentRadius();

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = isHit ? 'green' : 'red';
    ctx.fill();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = radius;
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
    const yInput = document.getElementById('y');
    const yError = document.getElementById('y-error');
    const yValue = yInput.value.trim();

    if (yValue === '') {
        yError.textContent = 'Введите значение Y';
        return false;
    }

    if (!isValidNumber(yValue)) {
        yError.textContent = 'Y должен быть числом (например: 450, 120)';
        return false;
    }

    const y = parseFloat(yValue);
    if (y < VALIDATION_RULES.Y.MIN || y > VALIDATION_RULES.Y.MAX) {
        yError.textContent = `Y должен быть числом от ${VALIDATION_RULES.Y.MIN} до ${VALIDATION_RULES.Y.MAX}`;
        return false;
    }

    yError.textContent = '';
    return true;
}

/**
 * Основная функция валидации формы
 */
function validateForm() {
    const isXValid = validateX();
    const isYValid = validateY();

    return isXValid && isYValid;
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
    const coords = getClickCoordinates(event);

    // Логируем координаты в консоль браузера
    console.log('Клик по координатам:', coords);
    console.log('X:', coords.x, 'Y:', coords.y);
    console.log('Отправляем на сервер для проверки...');

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

    // Возвращаем пиксельные координаты напрямую
    return { x: Math.round(canvasX), y: Math.round(canvasY) };
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
    document.getElementById('y').value = y.toFixed(2);
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
            // Перерисовываем только если карта уже загружена
            if (mapImage && mapImage.complete) {
                drawCoordinatePlane();
            }
        });
    });

    // Обработчики для радио-кнопок R
    const rRadios = document.querySelectorAll('input[name="r"]');
    rRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Перерисовываем только если карта уже загружена
            if (mapImage && mapImage.complete) {
                drawCoordinatePlane();
            }
        });
    });
}

/**
 * Инициализация приложения
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered');
    initEventListeners();
});

/**
 * Инициализация при загрузке страницы
 */
window.onload = function() {
    console.log('Window loaded, starting initialization');

    // Загружаем изображение и рисуем canvas только после его загрузки
    loadMapImage();
    restoreFormData();
};

// Дополнительная проверка - убираем любые другие вызовы drawCoordinatePlane
console.log('Script loaded, functions defined');