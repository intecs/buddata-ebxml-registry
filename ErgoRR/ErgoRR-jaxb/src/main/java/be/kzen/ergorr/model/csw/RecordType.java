
package be.kzen.ergorr.model.csw;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlType;
import be.kzen.ergorr.model.ows.BoundingBoxType;
import be.kzen.ergorr.model.ows.WGS84BoundingBoxType;


/**
 * 
 *             This type extends DCMIRecordType to add ows:BoundingBox;
 *             it may be used to specify a spatial envelope for the
 *             catalogued resource.
 *          
 * 
 * <p>Java class for RecordType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="RecordType">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.opengis.net/cat/csw/2.0.2}DCMIRecordType">
 *       &lt;sequence>
 *         &lt;element name="AnyText" type="{http://www.opengis.net/cat/csw/2.0.2}EmptyType" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element ref="{http://www.opengis.net/ows}BoundingBox" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "RecordType", propOrder = {
    "anyText",
    "boundingBox"
})
public class RecordType
    extends DCMIRecordType
{

    @XmlElement(name = "AnyText")
    protected List<EmptyType> anyText;
    @XmlElementRef(name = "BoundingBox", namespace = "http://www.opengis.net/ows", type = JAXBElement.class)
    protected List<JAXBElement<? extends BoundingBoxType>> boundingBox;

    /**
     * Gets the value of the anyText property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the anyText property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAnyText().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link EmptyType }
     * 
     * 
     */
    public List<EmptyType> getAnyText() {
        if (anyText == null) {
            anyText = new ArrayList<EmptyType>();
        }
        return this.anyText;
    }

    public boolean isSetAnyText() {
        return ((this.anyText!= null)&&(!this.anyText.isEmpty()));
    }

    public void unsetAnyText() {
        this.anyText = null;
    }

    /**
     * Gets the value of the boundingBox property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the boundingBox property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getBoundingBox().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link JAXBElement }{@code <}{@link WGS84BoundingBoxType }{@code >}
     * {@link JAXBElement }{@code <}{@link BoundingBoxType }{@code >}
     * 
     * 
     */
    public List<JAXBElement<? extends BoundingBoxType>> getBoundingBox() {
        if (boundingBox == null) {
            boundingBox = new ArrayList<JAXBElement<? extends BoundingBoxType>>();
        }
        return this.boundingBox;
    }

    public boolean isSetBoundingBox() {
        return ((this.boundingBox!= null)&&(!this.boundingBox.isEmpty()));
    }

    public void unsetBoundingBox() {
        this.boundingBox = null;
    }

}
