package org.astro.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.astro.imageHandler.PixelReader;
import org.astro.models.StrikeConfigService;

import java.io.IOException;

/**
 * Основной контроллер приложения
 */
public class ControllerServlet extends HttpServlet {
    private static final String ACTION_CHECK = "check";
    private static final String ACTION_CLEAR = "clear";
    private static final String POINTS_SESSION_KEY = "points";
    private static final String AREA_CHECK_PATH = "/area-check";
    private static final String INDEX_PATH = "/index.jsp";

    @Override
    public void init() throws ServletException {
        super.init();
        try {
            PixelReader.init(getServletContext());
            StrikeConfigService.init(getServletContext());
        } catch (IOException e) {
            throw new ServletException("Failed to initialize services", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher(INDEX_PATH).forward(request, response);
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
        } else if (ACTION_CHECK.equals(action)) {
            request.getRequestDispatcher(AREA_CHECK_PATH).forward(request, response);
        } else {
            request.setAttribute("Message", "Not allowed action");
            request.getRequestDispatcher("/error.jsp").forward(request, response);
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

        return isParameterValid(xParam) && isParameterValid(yParam);
    }

    /**
     * Проверка валидности параметра
     */
    private boolean isParameterValid(String parameter) {
        return parameter != null && !parameter.trim().isEmpty();
    }
}