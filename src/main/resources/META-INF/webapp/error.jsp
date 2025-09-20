<%@ page contentType="text/html;charset=UTF-8" language="java" isErrorPage="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ошибка</title>
    <link rel="stylesheet" type="text/css" href="css/style.css?v=<%= System.currentTimeMillis() %>">
</head>
<body>
    <div class="container">
        <h1>Ошибка</h1>

        <div class="result-info miss">
            <h2>Произошла ошибка</h2>
            <p><strong>Код ошибки:</strong> <%= response.getStatus() %></p>
            <% if (exception != null) { %>
            <p><strong>Сообщение:</strong> <%= exception.getMessage() %></p>
            <% } %>
        </div>

        <div class="navigation">
            <a href="controller">Вернуться на главную</a>
        </div>
    </div>
</body>
</html>