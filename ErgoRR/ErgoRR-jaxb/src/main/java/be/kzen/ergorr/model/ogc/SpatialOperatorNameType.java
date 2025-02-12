
package be.kzen.ergorr.model.ogc;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SpatialOperatorNameType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="SpatialOperatorNameType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="BBOX"/>
 *     &lt;enumeration value="Equals"/>
 *     &lt;enumeration value="Disjoint"/>
 *     &lt;enumeration value="Intersects"/>
 *     &lt;enumeration value="Touches"/>
 *     &lt;enumeration value="Crosses"/>
 *     &lt;enumeration value="Within"/>
 *     &lt;enumeration value="Contains"/>
 *     &lt;enumeration value="Overlaps"/>
 *     &lt;enumeration value="Beyond"/>
 *     &lt;enumeration value="DWithin"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "SpatialOperatorNameType")
@XmlEnum
public enum SpatialOperatorNameType {

    BBOX("BBOX"),
    @XmlEnumValue("Equals")
    EQUALS("Equals"),
    @XmlEnumValue("Disjoint")
    DISJOINT("Disjoint"),
    @XmlEnumValue("Intersects")
    INTERSECTS("Intersects"),
    @XmlEnumValue("Touches")
    TOUCHES("Touches"),
    @XmlEnumValue("Crosses")
    CROSSES("Crosses"),
    @XmlEnumValue("Within")
    WITHIN("Within"),
    @XmlEnumValue("Contains")
    CONTAINS("Contains"),
    @XmlEnumValue("Overlaps")
    OVERLAPS("Overlaps"),
    @XmlEnumValue("Beyond")
    BEYOND("Beyond"),
    @XmlEnumValue("DWithin")
    D_WITHIN("DWithin");
    private final String value;

    SpatialOperatorNameType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static SpatialOperatorNameType fromValue(String v) {
        for (SpatialOperatorNameType c: SpatialOperatorNameType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
