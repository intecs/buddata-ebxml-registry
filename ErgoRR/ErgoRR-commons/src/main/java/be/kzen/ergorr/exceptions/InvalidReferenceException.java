/*
 * Project: Buddata ebXML RegRep
 * Class: InvalidReferenceException.java
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
package be.kzen.ergorr.exceptions;

/**
 * Invalid reference exception.
 * Should be used if an invalid reference to or from an object is detected.
 * 
 * @author Yaman Ustuntas
 */
public class InvalidReferenceException extends Exception {

    public InvalidReferenceException(Throwable cause) {
        super(cause);
    }

    public InvalidReferenceException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidReferenceException(String message) {
        super(message);
    }

    public InvalidReferenceException() {
    }
}
