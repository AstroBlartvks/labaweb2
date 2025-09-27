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
            <h2><%= currentPoint.title() %></h2>
            <p><strong><%= currentPoint.text() %></strong> </p>
            <p><strong>Координаты:</strong> (x=<%= currentPoint.getX() %>, y=<%= currentPoint.getY() %>)</p>
            <p><strong>Время:</strong> <%= currentPoint.getTimestamp() %></p>
            <div style = "display:inline-block;">
                <audio loop autoplay hidden="true" src=<%= currentPoint.sound() %>></audio>
            </div>
            <div style = "display:inline-block; width: 500px; height: 30px;">
                <img style="width: 100%; height: auto;" src=<%= currentPoint.srcImage() %>>
            </div>
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