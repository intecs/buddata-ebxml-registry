
package be.kzen.ergorr.model.ows;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * Telephone numbers for contacting the responsible individual or organization. 
 * 
 * <p>Java class for TelephoneType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="TelephoneType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Voice" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="Facsimile" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TelephoneType", propOrder = {
    "voice",
    "facsimile"
})
public class TelephoneType {

    @XmlElement(name = "Voice")
    protected List<String> voice;
    @XmlElement(name = "Facsimile")
    protected List<String> facsimile;

    /**
     * Gets the value of the voice property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the voice property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getVoice().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getVoice() {
        if (voice == null) {
            voice = new ArrayList<String>();
        }
        return this.voice;
    }

    public boolean isSetVoice() {
        return ((this.voice!= null)&&(!this.voice.isEmpty()));
    }

    public void unsetVoice() {
        this.voice = null;
    }

    /**
     * Gets the value of the facsimile property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the facsimile property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getFacsimile().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getFacsimile() {
        if (facsimile == null) {
            facsimile = new ArrayList<String>();
        }
        return this.facsimile;
    }

    public boolean isSetFacsimile() {
        return ((this.facsimile!= null)&&(!this.facsimile.isEmpty()));
    }

    public void unsetFacsimile() {
        this.facsimile = null;
    }

}
