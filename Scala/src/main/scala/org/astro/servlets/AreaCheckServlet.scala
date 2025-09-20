package org.astro.servlets

import jakarta.servlet.http.{HttpServlet, HttpServletRequest, HttpServletResponse, HttpSession}
import org.astro.models.Point

class AreaCheckServlet extends HttpServlet {

  private val X_MIN = -3.0
  private val X_MAX = 3.0
  private val Y_MIN = -5.0
  private val Y_MAX = 3.0
  private val VALID_R_VALUES = List(1.0, 1.5, 2.0, 2.5, 3.0)

  private val POINTS_SESSION_KEY = "points"
  private val CURRENT_POINT_ATTR = "currentPoint"

  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response)
  }

  override def doPost(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response)
  }

  private def processRequest(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    try {
      val params = extractAndValidateParams(request)
      val point = new Point(params.x, params.y, params.r)

      savePointToSession(request.getSession, point)

      request.setAttribute(CURRENT_POINT_ATTR, point)
      request.getRequestDispatcher("/result.jsp").forward(request, response)

    } catch {
      case e: ValidationException =>
        response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage)
      case e: NumberFormatException =>
        response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid number format")
    }
  }

  private def extractAndValidateParams(request: HttpServletRequest): CoordinateParams = {
    val xParam = request.getParameter("x")
    val yParam = request.getParameter("y")
    val rParam = request.getParameter("r")

    if (xParam == null || yParam == null || rParam == null) {
      throw new ValidationException("Missing required parameters")
    }

    val x = xParam.toDouble
    val y = yParam.toDouble
    val r = rParam.toDouble

    validateCoordinate("X", x, X_MIN, X_MAX)
    validateCoordinate("Y", y, Y_MIN, Y_MAX)
    validateRadius(r)

    CoordinateParams(x, y, r)
  }

  private def validateCoordinate(name: String, value: Double, min: Double, max: Double): Unit = {
    if (value < min || value > max) {
      throw new ValidationException(s"$name coordinate must be between $min and $max")
    }
  }

  private def validateRadius(r: Double): Unit = {
    if (!VALID_R_VALUES.contains(r)) {
      throw new ValidationException(s"Radius must be one of: ${VALID_R_VALUES.mkString(", ")}")
    }
  }

  private def savePointToSession(session: HttpSession, point: Point): Unit = {
    val points = Option(session.getAttribute(POINTS_SESSION_KEY))
      .map(_.asInstanceOf[java.util.List[Point]])
      .getOrElse(new java.util.ArrayList[Point]())

    points.add(point)
    session.setAttribute(POINTS_SESSION_KEY, points)
  }

  private case class CoordinateParams(x: Double, y: Double, r: Double)

  private class ValidationException(message: String) extends Exception(message)
}