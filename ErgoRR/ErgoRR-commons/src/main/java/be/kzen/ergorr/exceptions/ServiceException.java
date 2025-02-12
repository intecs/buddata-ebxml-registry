/*
 * Project: Buddata ebXML RegRep
 * Class: ServiceException.java
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
 * High level exception which can be used by any service to wrap
 * other exceptions.
 * 
 * @author Yaman Ustuntas
 */
public class ServiceException extends Exception {
    private String code;

    public ServiceException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public ServiceException(String code, String message) {
        super(message);
        this.code = code;
    }

    public ServiceException(Throwable cause) {
        this("", "", cause);
    }

    public ServiceException(String message, Throwable cause) {
        this("", message, cause);
    }

    public ServiceException(String message) {
        this("", message);
    }

    public String getCode() {
        return code;
    }
}
