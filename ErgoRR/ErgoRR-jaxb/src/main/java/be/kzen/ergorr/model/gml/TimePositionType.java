
package be.kzen.ergorr.model.gml;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;


/**
 * Direct representation of a temporal position. 
 *       Indeterminate time values are also allowed, as described in ISO 19108. The indeterminatePosition 
 *       attribute can be used alone or it can qualify a specific value for temporal position (e.g. before 
 *       2002-12, after 1019624400). 
 *       For time values that identify position within a calendar, the calendarEraName attribute provides 
 *       the name of the calendar era to which the date is referenced (e.g. the Meiji era of the Japanese calendar).
 * 
 * <p>Java class for TimePositionType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="TimePositionType">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.opengis.net/gml>TimePositionUnion">
 *       &lt;attribute name="frame" type="{http://www.w3.org/2001/XMLSchema}anyURI" default="#ISO-8601" />
 *       &lt;attribute name="calendarEraName" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="indeterminatePosition" type="{http://www.opengis.net/gml}TimeIndeterminateValueType" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TimePositionType", propOrder = {
    "value"
})
public class TimePositionType {

    @XmlValue
    protected List<String> value;
    @XmlAttribute
    @XmlSchemaType(name = "anyURI")
    protected String frame;
    @XmlAttribute
    protected String calendarEraName;
    @XmlAttribute
    protected TimeIndeterminateValueType indeterminatePosition;

    /**
     * The ISO 19108:2002 hierarchy of subtypes for temporal position are collapsed 
     *       by defining a union of XML Schema simple types for indicating temporal position relative 
     *       to a specific reference system. 
     *       
     *       Dates and dateTime may be indicated with varying degrees of precision.  
     *       dateTime by itself does not allow right-truncation, except for fractions of seconds. 
     *       When used with non-Gregorian calendars based on years, months, days, 
     *       the same lexical representation should still be used, with leading zeros added if the 
     *       year value would otherwise have fewer than four digits.  
     *       
     *       An ordinal position may be referenced via URI identifying the definition of an ordinal era.  
     *       
     *       A time coordinate value is indicated as a decimal (e.g. UNIX time, GPS calendar).Gets the value of the value property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the value property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getValue().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getValue() {
        if (value == null) {
            value = new ArrayList<String>();
        }
        return this.value;
    }

    public boolean isSetValue() {
        return ((this.value!= null)&&(!this.value.isEmpty()));
    }

    public void unsetValue() {
        this.value = null;
    }

    /**
     * Gets the value of the frame property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFrame() {
        if (frame == null) {
            return "#ISO-8601";
        } else {
            return frame;
        }
    }

    /**
     * Sets the value of the frame property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFrame(String value) {
        this.frame = value;
    }

    public boolean isSetFrame() {
        return (this.frame!= null);
    }

    /**
     * Gets the value of the calendarEraName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCalendarEraName() {
        return calendarEraName;
    }

    /**
     * Sets the value of the calendarEraName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCalendarEraName(String value) {
        this.calendarEraName = value;
    }

    public boolean isSetCalendarEraName() {
        return (this.calendarEraName!= null);
    }

    /**
     * Gets the value of the indeterminatePosition property.
     * 
     * @return
     *     possible object is
     *     {@link TimeIndeterminateValueType }
     *     
     */
    public TimeIndeterminateValueType getIndeterminatePosition() {
        return indeterminatePosition;
    }

    /**
     * Sets the value of the indeterminatePosition property.
     * 
     * @param value
     *     allowed object is
     *     {@link TimeIndeterminateValueType }
     *     
     */
    public void setIndeterminatePosition(TimeIndeterminateValueType value) {
        this.indeterminatePosition = value;
    }

    public boolean isSetIndeterminatePosition() {
        return (this.indeterminatePosition!= null);
    }

}
