
package be.kzen.ergorr.model.csw;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;
import javax.xml.namespace.QName;


/**
 * <p>Java class for ElementSetNameType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ElementSetNameType">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.opengis.net/cat/csw/2.0.2>ElementSetType">
 *       &lt;attribute name="typeNames" type="{http://www.opengis.net/cat/csw/2.0.2}TypeNameListType" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ElementSetNameType", propOrder = {
    "value"
})
public class ElementSetNameType {

    @XmlValue
    protected ElementSetType value;
    @XmlAttribute
    protected List<QName> typeNames;

    /**
     * Named subsets of catalogue object properties; these
     *          views are mapped to a specific information model and
     *          are defined in an application profile.
     * 
     * @return
     *     possible object is
     *     {@link ElementSetType }
     *     
     */
    public ElementSetType getValue() {
        return value;
    }

    /**
     * Sets the value of the value property.
     * 
     * @param value
     *     allowed object is
     *     {@link ElementSetType }
     *     
     */
    public void setValue(ElementSetType value) {
        this.value = value;
    }

    public boolean isSetValue() {
        return (this.value!= null);
    }

    /**
     * Gets the value of the typeNames property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the typeNames property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getTypeNames().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link QName }
     * 
     * 
     */
    public List<QName> getTypeNames() {
        if (typeNames == null) {
            typeNames = new ArrayList<QName>();
        }
        return this.typeNames;
    }

    public boolean isSetTypeNames() {
        return ((this.typeNames!= null)&&(!this.typeNames.isEmpty()));
    }

    public void unsetTypeNames() {
        this.typeNames = null;
    }

}
