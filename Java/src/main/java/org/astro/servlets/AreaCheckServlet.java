package org.astro.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.astro.models.Point;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Сервлет для проверки попадания точки в заданную область
 */
public class AreaCheckServlet extends HttpServlet {

    // Константы валидации
    private static final double X_MIN = -3.0;
    private static final double X_MAX = 3.0;
    private static final double Y_MIN = -5.0;
    private static final double Y_MAX = 3.0;
    private static final List<Double> VALID_R_VALUES = Arrays.asList(1.0, 1.5, 2.0, 2.5, 3.0);

    private static final String POINTS_SESSION_KEY = "points";
    private static final String CURRENT_POINT_ATTR = "currentPoint";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Обработка запроса на проверку точки
     */
    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            // Извлечение и валидация параметров
            CoordinateParams params = extractAndValidateParams(request);

            // Создание точки
            Point point = new Point(params.x, params.y, params.r);

            // Сохранение в сессию
            savePointToSession(request.getSession(), point);

            // Подготовка ответа
            request.setAttribute(CURRENT_POINT_ATTR, point);
            request.getRequestDispatcher("/result.jsp").forward(request, response);

        } catch (ValidationException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid number format");
        }
    }

    /**
     * Извлечение и валидация параметров запроса
     */
    private CoordinateParams extractAndValidateParams(HttpServletRequest request) throws ValidationException {
        String xParam = request.getParameter("x");
        String yParam = request.getParameter("y");
        String rParam = request.getParameter("r");

        // Проверка наличия параметров
        if (xParam == null || yParam == null || rParam == null) {
            throw new ValidationException("Missing required parameters");
        }

        // Парсинг значений
        double x = Double.parseDouble(xParam);
        double y = Double.parseDouble(yParam);
        double r = Double.parseDouble(rParam);

        // Валидация координат
        validateCoordinate("X", x, X_MIN, X_MAX);
        validateCoordinate("Y", y, Y_MIN, Y_MAX);
        validateRadius(r);

        return new CoordinateParams(x, y, r);
    }

    /**
     * Валидация координаты
     */
    private void validateCoordinate(String name, double value, double min, double max) throws ValidationException {
        if (value < min || value > max) {
            throw new ValidationException(String.format("%s coordinate must be between %.1f and %.1f", name, min, max));
        }
    }

    /**
     * Валидация радиуса
     */
    private void validateRadius(double r) throws ValidationException {
        if (!VALID_R_VALUES.contains(r)) {
            throw new ValidationException("Radius must be one of: " + VALID_R_VALUES);
        }
    }

    /**
     * Сохранение точки в сессию
     */
    private void savePointToSession(HttpSession session, Point point) {
        @SuppressWarnings("unchecked")
        List<Point> points = (List<Point>) session.getAttribute(POINTS_SESSION_KEY);

        if (points == null) {
            points = new ArrayList<>();
        }

        points.add(point);
        session.setAttribute(POINTS_SESSION_KEY, points);
    }

    /**
     * Класс для хранения параметров координат
     */
    private static class CoordinateParams {
        final double x, y, r;

        CoordinateParams(double x, double y, double r) {
            this.x = x;
            this.y = y;
            this.r = r;
        }
    }

    /**
     * Исключение валидации
     */
    private static class ValidationException extends Exception {
        ValidationException(String message) {
            super(message);
        }
    }
}