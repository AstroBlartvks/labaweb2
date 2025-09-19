<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="org.astro.models.Point" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Лабораторная работа №2</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="js/script.js"></script>
</head>
<body>
    <div class="container">
        <h1>Проверка попадания точки в область</h1>

        <div class="main-content">
            <div class="form-container">
                <form id="pointForm" action="controller" method="POST">
                    <div class="input-group">
                        <label>Координата X:</label>
                        <div class="x-options">
                            <input type="radio" name="x" value="-2" id="x-2"> <label for="x-2">-2</label>
                            <input type="radio" name="x" value="-1.5" id="x-1.5"> <label for="x-1.5">-1.5</label>
                            <input type="radio" name="x" value="-1" id="x-1"> <label for="x-1">-1</label>
                            <input type="radio" name="x" value="-0.5" id="x-0.5"> <label for="x-0.5">-0.5</label>
                            <input type="radio" name="x" value="0" id="x0"> <label for="x0">0</label>
                            <input type="radio" name="x" value="0.5" id="x0.5"> <label for="x0.5">0.5</label>
                            <input type="radio" name="x" value="1" id="x1"> <label for="x1">1</label>
                            <input type="radio" name="x" value="1.5" id="x1.5"> <label for="x1.5">1.5</label>
                            <input type="radio" name="x" value="2" id="x2"> <label for="x2">2</label>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="y">Координата Y (-3 .. 5):</label>
                        <input type="text" id="y" name="y" placeholder="Введите Y">
                        <span id="y-error" class="error"></span>
                    </div>

                    <div class="input-group">
                        <label for="r">Радиус R (1 .. 5):</label>
                        <select id="r" name="r">
                            <option value="">Выберите R</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <span id="r-error" class="error"></span>
                    </div>

                    <button type="submit">Проверить</button>
                    <button type="button" onclick="clearResults()">Очистить</button>
                </form>
            </div>

            <div class="canvas-container">
                <canvas id="coordinatePlane" width="400" height="400" onclick="canvasClick(event)"></canvas>
            </div>
        </div>

        <div class="results-container">
            <h2>Результаты</h2>
            <table id="resultsTable">
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Результат</th>
                        <th>Время</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                        List<Point> points = (List<Point>) session.getAttribute("points");
                        if (points != null) {
                            for (Point point : points) {
                    %>
                    <tr class="<%= point.isHit() ? "hit" : "miss" %>">
                        <td><%= point.getX() %></td>
                        <td><%= point.getY() %></td>
                        <td><%= point.getR() %></td>
                        <td><%= point.isHit() ? "Попадание" : "Промах" %></td>
                        <td><%= point.getTimestamp() %></td>
                    </tr>
                    <%
                            }
                        }
                    %>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        window.onload = function() {
            drawCoordinatePlane();
            restoreFormData();
        };
    </script>
</body>
</html>