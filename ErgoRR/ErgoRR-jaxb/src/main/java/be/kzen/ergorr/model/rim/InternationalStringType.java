package be.kzen.ergorr.model.rim;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

/**
 * <p>Java class for InternationalStringType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="InternationalStringType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence maxOccurs="unbounded" minOccurs="0">
 *         &lt;element ref="{urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0}LocalizedString"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "InternationalStringType", propOrder = {
    "localizedString"
})
public class InternationalStringType {

    @XmlElement(name = "LocalizedString")
    protected List<LocalizedStringType> localizedString;

    /**
     * Gets the value of the localizedString property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the localizedString property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getLocalizedString().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link LocalizedStringType }
     * 
     * 
     */
    public List<LocalizedStringType> getLocalizedString() {
        if (localizedString == null) {
            localizedString = new ArrayList<LocalizedStringType>();
        }
        return this.localizedString;
    }

    public boolean isSetLocalizedString() {
        return ((this.localizedString != null) && (!this.localizedString.isEmpty()));
    }

    public void unsetLocalizedString() {
        this.localizedString = null;
    }
}
