
package be.kzen.ergorr.model.ogc;

import javax.xml.bind.JAXBElement;
import javax.xml.namespace.QName;

public class PropertyIsGreaterThanOrEqualTo
    extends JAXBElement<BinaryComparisonOpType>
{

    protected final static QName NAME = new QName("http://www.opengis.net/ogc", "PropertyIsGreaterThanOrEqualTo");

    public PropertyIsGreaterThanOrEqualTo(BinaryComparisonOpType value) {
        super(NAME, ((Class) BinaryComparisonOpType.class), null, value);
    }

}
