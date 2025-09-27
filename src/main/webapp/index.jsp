<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="org.astro.models.Point" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Лабораторная работа №2 - Проверка попадания точки в область</title>
    <link rel="stylesheet" type="text/css" href="css/style.css?v=<%= System.currentTimeMillis() %>">
    <script src="js/script.js?v=<%= System.currentTimeMillis() %>"></script>
</head>
<body>

    <header class="page-header">
        <h1 class="header-text">Старченко Александр Николаевич</h1>
        <h2 class="header-text">Группа P3231</h2>
        <h2 class="header-text">Вариант 467586</h2>
    </header>

    <div class="container">
        <h1>Проверка попадания точки в область</h1>

        <main class="main-content">
            <section class="form-container" aria-label="Ввод координат">
                <form id="pointForm" action="controller" method="POST" onsubmit="return validateForm()">
                    <div class="input-group">
                        <label for="x">Координата X (0 .. 1200):</label>
                        <input type="text"
                               id="x"
                               name="x"
                               placeholder="Введите X"
                               aria-describedby="x-error"
                               autocomplete="off">
                        <span id="x-error" class="error" role="alert"></span>
                    </div>

                    <div class="input-group">
                        <label for="y">Координата Y (0 .. 900):</label>
                        <input type="text"
                               id="y"
                               name="y"
                               placeholder="Введите Y"
                               aria-describedby="y-error"
                               autocomplete="off">
                        <span id="y-error" class="error" role="alert"></span>
                    </div>

                    <div class="input-group">
                        <label>Радиус R:</label>
                        <div class="r-options" role="group" aria-label="Выбор радиуса R">
                            <label><input type="radio" name="r" value="1" checked="checked"><span>1</span></label>
                            <label><input type="radio" name="r" value="1.5"><span>1.5</span></label>
                            <label><input type="radio" name="r" value="2"><span>2</span></label>
                            <label><input type="radio" name="r" value="2.5"><span>2.5</span></label>
                            <label><input type="radio" name="r" value="3"><span>3</span></label>
                        </div>
                        <span id="r-error" class="error" role="alert"></span>
                    </div>

                    <input type="hidden" id="blyat" name="action" value="check">

                    <div class="form-actions">
                        <button type="submit">Проверить</button>
                        <button type="button" onclick="clearResults()">Очистить результаты</button>
                    </div>

                </form>
            </section>

            <section class="canvas-container" aria-label="Координатная плоскость">
                <canvas id="coordinatePlane"
                        width="1200"
                        height="900"
                        onclick="canvasClick(event)"
                        aria-label="Интерактивная координатная плоскость для выбора точек"></canvas>
            </section>
        </main>

        <section class="results-container" aria-label="Результаты проверки">
            <h2>Результаты проверки</h2>
            <%
                List<Point> points = (List<Point>) session.getAttribute("points");
                if (points != null && !points.isEmpty()) {
            %>
            <table id="resultsTable" aria-label="Таблица результатов проверки точек">
                <thead>
                    <tr>
                        <th scope="col">X</th>
                        <th scope="col">Y</th>
                        <th scope="col">Результат</th>
                        <th scope="col">Время</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                        for (Point point : points) {
                    %>
                    <tr class="<%= point.isHit() ? "hit" : "miss" %>">
                        <td><%= point.getX() %></td>
                        <td><%= point.getY() %></td>
                        <td><%= point.isHit() ? "Попадание" : "Промах" %></td>
                        <td><%= point.getTimestamp() %></td>
                    </tr>
                    <%
                        }
                    %>
                </tbody>
            </table>
            <%
                } else {
            %>
            <p class="no-results">Результатов пока нет. Введите координаты и нажмите "Проверить".</p>
            <%
                }
            %>
    </div>
</body>
</html>