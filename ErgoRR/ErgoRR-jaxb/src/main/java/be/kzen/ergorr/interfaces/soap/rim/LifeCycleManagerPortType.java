
package be.kzen.ergorr.interfaces.soap.rim;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.ws.Holder;
import be.kzen.ergorr.model.lcm.ApproveObjectsRequest;
import be.kzen.ergorr.model.lcm.DeprecateObjectsRequest;
import be.kzen.ergorr.model.lcm.RemoveObjectsRequest;
import be.kzen.ergorr.model.lcm.SubmitObjectsRequest;
import be.kzen.ergorr.model.lcm.UndeprecateObjectsRequest;
import be.kzen.ergorr.model.lcm.UpdateObjectsRequest;
import be.kzen.ergorr.model.rs.RegistryResponseType;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.1.4-hudson-208-
 * Generated source version: 2.1
 * 
 */
@WebService(name = "LifeCycleManagerPortType", targetNamespace = "http://www.kzen.be/ergorr/interfaces/soap/rim")
@SOAPBinding(parameterStyle = SOAPBinding.ParameterStyle.BARE)
@XmlSeeAlso({
    be.kzen.ergorr.model.eo.opt.ObjectFactory.class,
    be.kzen.ergorr.model.wrs.ObjectFactory.class,
    be.kzen.ergorr.model.eo.sar.ObjectFactory.class,
    be.kzen.ergorr.model.ows.ObjectFactory.class,
    be.kzen.ergorr.model.eo.atm.ObjectFactory.class,
    be.kzen.ergorr.model.rim.ObjectFactory.class,
    be.kzen.ergorr.model.csw.ObjectFactory.class,
    be.kzen.ergorr.model.eo.eop.ObjectFactory.class,
    be.kzen.ergorr.model.rs.ObjectFactory.class,
    be.kzen.ergorr.model.lcm.ObjectFactory.class,
    be.kzen.ergorr.model.query.ObjectFactory.class,
    be.kzen.ergorr.model.purl.elements.ObjectFactory.class,
    be.kzen.ergorr.model.purl.terms.ObjectFactory.class,
    be.kzen.ergorr.model.gml.ObjectFactory.class,
    be.kzen.ergorr.model.ogc.ObjectFactory.class
})
public interface LifeCycleManagerPortType {


    /**
     * 
     * @param partApproveObjectsRequest
     * @return
     *     returns be.kzen.ergorr.model.rs.RegistryResponseType
     */
    @WebMethod(action = "urn:oasis:names:tc:ebxml-regrep:wsdl:registry:bindings:3.0:LifeCycleManagerPortType#approveObjects")
    @WebResult(name = "RegistryResponse", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:rs:3.0", partName = "partRegistryResponse")
    public RegistryResponseType approveObjects(
        @WebParam(name = "ApproveObjectsRequest", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:lcm:3.0", partName = "partApproveObjectsRequest")
        ApproveObjectsRequest partApproveObjectsRequest);

    /**
     * 
     * @param partDeprecateObjectsRequest
     * @return
     *     returns be.kzen.ergorr.model.rs.RegistryResponseType
     */
    @WebMethod(action = "urn:oasis:names:tc:ebxml-regrep:wsdl:registry:bindings:3.0:LifeCycleManagerPortType#deprecateObjects")
    @WebResult(name = "RegistryResponse", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:rs:3.0", partName = "partRegistryResponse")
    public RegistryResponseType deprecateObjects(
        @WebParam(name = "DeprecateObjectsRequest", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:lcm:3.0", partName = "partDeprecateObjectsRequest")
        DeprecateObjectsRequest partDeprecateObjectsRequest);

    /**
     * 
     * @param partUndeprecateObjectsRequest
     * @return
     *     returns be.kzen.ergorr.model.rs.RegistryResponseType
     */
    @WebMethod(action = "urn:oasis:names:tc:ebxml-regrep:wsdl:registry:bindings:3.0:LifeCycleManagerPortType#undeprecateObjects")
    @WebResult(name = "RegistryResponse", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:rs:3.0", partName = "partRegistryResponse")
    public RegistryResponseType undeprecateObjects(
        @WebParam(name = "UndeprecateObjectsRequest", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:lcm:3.0", partName = "partUndeprecateObjectsRequest")
        UndeprecateObjectsRequest partUndeprecateObjectsRequest);

    /**
     * 
     * @param partRemoveObjectsRequest
     * @return
     *     returns be.kzen.ergorr.model.rs.RegistryResponseType
     */
    @WebMethod(action = "urn:oasis:names:tc:ebxml-regrep:wsdl:registry:bindings:3.0:LifeCycleManagerPortType#removeObjects")
    @WebResult(name = "RegistryResponse", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:rs:3.0", partName = "partRegistryResponse")
    public RegistryResponseType removeObjects(
        @WebParam(name = "RemoveObjectsRequest", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:lcm:3.0", partName = "partRemoveObjectsRequest")
        RemoveObjectsRequest partRemoveObjectsRequest);

    /**
     * 
     * @param partSubmitObjectsRequest
     * @return
     *     returns be.kzen.ergorr.model.rs.RegistryResponseType
     */
    @WebMethod(action = "urn:oasis:names:tc:ebxml-regrep:wsdl:registry:bindings:3.0:LifeCycleManagerPortType#submitObjects")
    @WebResult(name = "RegistryResponse", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:rs:3.0", partName = "partRegistryResponse")
    public RegistryResponseType submitObjects(
        @WebParam(name = "SubmitObjectsRequest", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:lcm:3.0", partName = "partSubmitObjectsRequest")
        SubmitObjectsRequest partSubmitObjectsRequest);

    /**
     * 
     * @param partUpdateObjectsRequest
     */
    @WebMethod(action = "urn:oasis:names:tc:ebxml-regrep:wsdl:registry:bindings:3.0:LifeCycleManagerPortType#updateObjects")
    public void updateObjects(
        @WebParam(name = "UpdateObjectsRequest", targetNamespace = "urn:oasis:names:tc:ebxml-regrep:xsd:lcm:3.0", mode = WebParam.Mode.INOUT, partName = "partUpdateObjectsRequest")
        Holder<UpdateObjectsRequest> partUpdateObjectsRequest);

}
