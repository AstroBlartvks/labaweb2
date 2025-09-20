package org.astro.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Основной контроллер приложения
 */
public class ControllerServlet extends HttpServlet {

    private static final String ACTION_CLEAR = "clear";
    private static final String POINTS_SESSION_KEY = "points";
    private static final String AREA_CHECK_PATH = "/area-check";
    private static final String INDEX_PATH = "/index.jsp";

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
     * Обработка запроса
     */
    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");

        // Обработка действия очистки результатов
        if (ACTION_CLEAR.equals(action)) {
            clearResults(request, response);
            return;
        }

        // Проверка наличия координат для обработки
        if (hasCoordinateParameters(request)) {
            // Перенаправление на проверку области
            request.getRequestDispatcher(AREA_CHECK_PATH).forward(request, response);
        } else {
            // Отображение главной страницы
            request.getRequestDispatcher(INDEX_PATH).forward(request, response);
        }
    }

    /**
     * Очистка результатов
     */
    private void clearResults(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.getSession().removeAttribute(POINTS_SESSION_KEY);
        response.sendRedirect("controller");
    }

    /**
     * Проверка наличия всех необходимых параметров координат
     */
    private boolean hasCoordinateParameters(HttpServletRequest request) {
        String xParam = request.getParameter("x");
        String yParam = request.getParameter("y");
        String rParam = request.getParameter("r");

        return isParameterValid(xParam) && isParameterValid(yParam) && isParameterValid(rParam);
    }

    /**
     * Проверка валидности параметра
     */
    private boolean isParameterValid(String parameter) {
        return parameter != null && !parameter.trim().isEmpty();
    }
}