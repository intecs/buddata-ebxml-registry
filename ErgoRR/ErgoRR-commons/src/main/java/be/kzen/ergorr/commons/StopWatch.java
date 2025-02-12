/*
 * Project: Buddata ebXML RegRep
 * Class: StopWatch.java
 * Copyright (C) 2008 Yaman Ustuntas
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package be.kzen.ergorr.commons;

/**
 * Helper class to keep track of a processing time.
 * 
 * @author yamanustuntas
 */
public class StopWatch {
    private long startTime;

    /**
     * Starts the stop watch on initialization.
     */
    public StopWatch() {
        start();
    }

    /**
     * Start/reset stop watch.
     */
    public void start() {
        startTime = System.currentTimeMillis();
    }

    /**
     * Get the duration in milliseconds from the time the
     * stop watch was started.
     *
     * @return Duration in milliseconds.
     */
    public long getDurationAsMillis() {
        return (System.currentTimeMillis() - startTime);
    }
}
