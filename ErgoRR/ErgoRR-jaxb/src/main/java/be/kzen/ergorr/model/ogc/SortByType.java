
package be.kzen.ergorr.model.ogc;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SortByType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="SortByType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="SortProperty" type="{http://www.opengis.net/ogc}SortPropertyType" maxOccurs="unbounded"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "SortByType", propOrder = {
    "sortProperty"
})
public class SortByType {

    @XmlElement(name = "SortProperty", required = true)
    protected List<SortPropertyType> sortProperty;

    /**
     * Gets the value of the sortProperty property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the sortProperty property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getSortProperty().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link SortPropertyType }
     * 
     * 
     */
    public List<SortPropertyType> getSortProperty() {
        if (sortProperty == null) {
            sortProperty = new ArrayList<SortPropertyType>();
        }
        return this.sortProperty;
    }

    public boolean isSetSortProperty() {
        return ((this.sortProperty!= null)&&(!this.sortProperty.isEmpty()));
    }

    public void unsetSortProperty() {
        this.sortProperty = null;
    }

}
