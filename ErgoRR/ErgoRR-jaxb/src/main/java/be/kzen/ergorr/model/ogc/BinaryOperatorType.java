
package be.kzen.ergorr.model.ogc;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BinaryOperatorType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="BinaryOperatorType">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.opengis.net/ogc}ExpressionType">
 *       &lt;sequence>
 *         &lt;element ref="{http://www.opengis.net/ogc}expression" maxOccurs="2" minOccurs="2"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "BinaryOperatorType", propOrder = {
    "expression"
})
public class BinaryOperatorType
    extends ExpressionType
{

    @XmlElementRef(name = "expression", namespace = "http://www.opengis.net/ogc", type = JAXBElement.class)
    protected List<JAXBElement<?>> expression;

    /**
     * Gets the value of the expression property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the expression property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getExpression().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link JAXBElement }{@code <}{@link BinaryOperatorType }{@code >}
     * {@link JAXBElement }{@code <}{@link LiteralType }{@code >}
     * {@link JAXBElement }{@code <}{@link BinaryOperatorType }{@code >}
     * {@link JAXBElement }{@code <}{@link PropertyNameType }{@code >}
     * {@link JAXBElement }{@code <}{@link BinaryOperatorType }{@code >}
     * {@link JAXBElement }{@code <}{@link BinaryOperatorType }{@code >}
     * {@link JAXBElement }{@code <}{@link ExpressionType }{@code >}
     * {@link JAXBElement }{@code <}{@link FunctionType }{@code >}
     * 
     * 
     */
    public List<JAXBElement<?>> getExpression() {
        if (expression == null) {
            expression = new ArrayList<JAXBElement<?>>();
        }
        return this.expression;
    }

    public boolean isSetExpression() {
        return ((this.expression!= null)&&(!this.expression.isEmpty()));
    }

    public void unsetExpression() {
        this.expression = null;
    }

}
