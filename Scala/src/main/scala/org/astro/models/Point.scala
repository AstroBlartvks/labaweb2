package org.astro.models

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class Point(val x: Double, val y: Double, val r: Double) extends Serializable {

  val hit: Boolean = checkHit()
  val timestamp: String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"))

  private def checkHit(): Boolean = {
    if (x >= 0 && y >= 0) {
      x <= r && y <= r
    } else if (x >= 0 && y <= 0) {
      x * x + y * y <= (r / 2) * (r / 2)
    } else if (x <= 0 && y <= 0) {
      y >= -2 * x - r
    } else {
      false
    }
  }

  def getX: Double = x
  def getY: Double = y
  def getR: Double = r
  def isHit: Boolean = hit
  def getTimestamp: String = timestamp
}