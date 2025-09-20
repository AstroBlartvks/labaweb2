package org.astro.servlets

import jakarta.servlet.http.{HttpServlet, HttpServletRequest, HttpServletResponse}

class ControllerServlet extends HttpServlet {

  private val ACTION_CLEAR = "clear"
  private val POINTS_SESSION_KEY = "points"
  private val AREA_CHECK_PATH = "/area-check"
  private val INDEX_PATH = "/index.jsp"

  override def doGet(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response)
  }

  override def doPost(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    processRequest(request, response)
  }

  private def processRequest(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    val action = request.getParameter("action")

    action match {
      case ACTION_CLEAR =>
        clearResults(request, response)
      case _ =>
        if (hasCoordinateParameters(request)) {
          request.getRequestDispatcher(AREA_CHECK_PATH).forward(request, response)
        } else {
          request.getRequestDispatcher(INDEX_PATH).forward(request, response)
        }
    }
  }

  private def clearResults(request: HttpServletRequest, response: HttpServletResponse): Unit = {
    request.getSession.removeAttribute(POINTS_SESSION_KEY)
    response.sendRedirect("controller")
  }

  private def hasCoordinateParameters(request: HttpServletRequest): Boolean = {
    val xParam = request.getParameter("x")
    val yParam = request.getParameter("y")
    val rParam = request.getParameter("r")

    isParameterValid(xParam) && isParameterValid(yParam) && isParameterValid(rParam)
  }

  private def isParameterValid(parameter: String): Boolean = {
    parameter != null && !parameter.trim.isEmpty
  }
}