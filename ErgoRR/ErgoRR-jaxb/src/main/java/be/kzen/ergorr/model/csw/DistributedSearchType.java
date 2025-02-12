
package be.kzen.ergorr.model.csw;

import java.math.BigInteger;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * Governs the behaviour of a distributed search.
 *          hopCount     - the maximum number of message hops before
 *                         the search is terminated. Each catalogue node 
 *                         decrements this value when the request is received, 
 *                         and must not forward the request if hopCount=0.
 * 
 * <p>Java class for DistributedSearchType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DistributedSearchType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;attribute name="hopCount" type="{http://www.w3.org/2001/XMLSchema}positiveInteger" default="2" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DistributedSearchType")
public class DistributedSearchType {

    @XmlAttribute
    @XmlSchemaType(name = "positiveInteger")
    protected BigInteger hopCount;

    /**
     * Gets the value of the hopCount property.
     * 
     * @return
     *     possible object is
     *     {@link BigInteger }
     *     
     */
    public BigInteger getHopCount() {
        if (hopCount == null) {
            return new BigInteger("2");
        } else {
            return hopCount;
        }
    }

    /**
     * Sets the value of the hopCount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigInteger }
     *     
     */
    public void setHopCount(BigInteger value) {
        this.hopCount = value;
    }

    public boolean isSetHopCount() {
        return (this.hopCount!= null);
    }

}
