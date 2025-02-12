
package be.kzen.ergorr.model.csw;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import javax.xml.namespace.QName;
import be.kzen.ergorr.model.ogc.SortByType;


/**
 * Specifies a query to execute against instances of one or
 *          more object types. A set of ElementName elements may be included 
 *          to specify an adhoc view of the csw:Record instances in the result 
 *          set. Otherwise, use ElementSetName to specify a predefined view. 
 *          The Constraint element contains a query filter expressed in a 
 *          supported query language. A sorting criterion that specifies a 
 *          property to sort by may be included.
 * 
 *          typeNames - a list of object types to query.
 * 
 * <p>Java class for QueryType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="QueryType">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.opengis.net/cat/csw/2.0.2}AbstractQueryType">
 *       &lt;sequence>
 *         &lt;choice>
 *           &lt;element ref="{http://www.opengis.net/cat/csw/2.0.2}ElementSetName"/>
 *           &lt;element name="ElementName" type="{http://www.w3.org/2001/XMLSchema}QName" maxOccurs="unbounded"/>
 *         &lt;/choice>
 *         &lt;element ref="{http://www.opengis.net/cat/csw/2.0.2}Constraint" minOccurs="0"/>
 *         &lt;element ref="{http://www.opengis.net/ogc}SortBy" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attribute name="typeNames" use="required" type="{http://www.opengis.net/cat/csw/2.0.2}TypeNameListType" />
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "QueryType", propOrder = {
    "elementSetName",
    "elementName",
    "constraint",
    "sortBy"
})
public class QueryType
    extends AbstractQueryType
{

    @XmlElement(name = "ElementSetName", defaultValue = "summary")
    protected ElementSetNameType elementSetName;
    @XmlElement(name = "ElementName")
    protected List<QName> elementName;
    @XmlElement(name = "Constraint")
    protected QueryConstraintType constraint;
    @XmlElement(name = "SortBy", namespace = "http://www.opengis.net/ogc")
    protected SortByType sortBy;
    @XmlAttribute(required = true)
    protected List<QName> typeNames;

    /**
     * Gets the value of the elementSetName property.
     * 
     * @return
     *     possible object is
     *     {@link ElementSetNameType }
     *     
     */
    public ElementSetNameType getElementSetName() {
        return elementSetName;
    }

    /**
     * Sets the value of the elementSetName property.
     * 
     * @param value
     *     allowed object is
     *     {@link ElementSetNameType }
     *     
     */
    public void setElementSetName(ElementSetNameType value) {
        this.elementSetName = value;
    }

    public boolean isSetElementSetName() {
        return (this.elementSetName!= null);
    }

    /**
     * Gets the value of the elementName property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the elementName property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getElementName().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link QName }
     * 
     * 
     */
    public List<QName> getElementName() {
        if (elementName == null) {
            elementName = new ArrayList<QName>();
        }
        return this.elementName;
    }

    public boolean isSetElementName() {
        return ((this.elementName!= null)&&(!this.elementName.isEmpty()));
    }

    public void unsetElementName() {
        this.elementName = null;
    }

    /**
     * Gets the value of the constraint property.
     * 
     * @return
     *     possible object is
     *     {@link QueryConstraintType }
     *     
     */
    public QueryConstraintType getConstraint() {
        return constraint;
    }

    /**
     * Sets the value of the constraint property.
     * 
     * @param value
     *     allowed object is
     *     {@link QueryConstraintType }
     *     
     */
    public void setConstraint(QueryConstraintType value) {
        this.constraint = value;
    }

    public boolean isSetConstraint() {
        return (this.constraint!= null);
    }

    /**
     * Gets the value of the sortBy property.
     * 
     * @return
     *     possible object is
     *     {@link SortByType }
     *     
     */
    public SortByType getSortBy() {
        return sortBy;
    }

    /**
     * Sets the value of the sortBy property.
     * 
     * @param value
     *     allowed object is
     *     {@link SortByType }
     *     
     */
    public void setSortBy(SortByType value) {
        this.sortBy = value;
    }

    public boolean isSetSortBy() {
        return (this.sortBy!= null);
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
