package org.astro.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.astro.models.Point;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AreaCheckServlet extends HttpServlet {

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

    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            String xParam = request.getParameter("x");
            String yParam = request.getParameter("y");
            String rParam = request.getParameter("r");

            if (xParam == null || yParam == null || rParam == null) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing required parameters");
                return;
            }

            double x = Double.parseDouble(xParam);
            double y = Double.parseDouble(yParam);
            double r = Double.parseDouble(rParam);

            if (r <= 0 || r > 5) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Radius must be between 0 and 5");
                return;
            }

            if (x < -5 || x > 5 || y < -5 || y > 5) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Coordinates out of valid range");
                return;
            }

            Point point = new Point(x, y, r);

            HttpSession session = request.getSession();
            @SuppressWarnings("unchecked")
            List<Point> points = (List<Point>) session.getAttribute("points");
            if (points == null) {
                points = new ArrayList<>();
            }
            points.add(point);
            session.setAttribute("points", points);

            request.setAttribute("currentPoint", point);
            request.getRequestDispatcher("/result.jsp").forward(request, response);

        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid number format");
        }
    }
}