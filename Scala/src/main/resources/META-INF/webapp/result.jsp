<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.astro.models.Point" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Результат проверки</title>
    <link rel="stylesheet" type="text/css" href="css/style.css?v=<%= System.currentTimeMillis() %>">
</head>
<body>
    <div class="container">
        <h1>Результат проверки</h1>

        <%
            Point currentPoint = (Point) request.getAttribute("currentPoint");
            if (currentPoint != null) {
        %>
        <div class="result-info <%= currentPoint.isHit() ? "hit" : "miss" %>">
            <h2><%= currentPoint.isHit() ? "Попадание!" : "Промах!" %></h2>
            <p><strong>Координаты:</strong> (x=<%= currentPoint.getX() %>, y=<%= currentPoint.getY() %>)</p>
            <p><strong>Радиус:</strong> <%= currentPoint.getR() %></p>
            <p><strong>Время:</strong> <%= currentPoint.getTimestamp() %></p>
        </div>
        <%
            }
        %>

        <div class="navigation">
            <a href="controller">Вернуться к форме</a>
        </div>
    </div>
</body>
</html>