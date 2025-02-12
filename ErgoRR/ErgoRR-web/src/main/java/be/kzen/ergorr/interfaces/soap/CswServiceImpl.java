/*
 * Project: Buddata ebXML RegRep
 * Class: CswServiceImpl.java
 * Copyright (C) 2008 Yaman Ustuntas
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package be.kzen.ergorr.interfaces.soap;

import be.kzen.ergorr.commons.CommonProperties;
import be.kzen.ergorr.commons.RequestContext;
import be.kzen.ergorr.commons.NamespaceConstants;
import be.kzen.ergorr.commons.StopWatch;
import be.kzen.ergorr.exceptions.ServiceException;
import be.kzen.ergorr.interfaces.soap.csw.CswPortType;
import be.kzen.ergorr.interfaces.soap.csw.ServiceExceptionReport;
import be.kzen.ergorr.model.csw.CapabilitiesType;
import be.kzen.ergorr.model.csw.DescribeRecordResponseType;
import be.kzen.ergorr.model.csw.DescribeRecordType;
import be.kzen.ergorr.model.csw.GetCapabilitiesType;
import be.kzen.ergorr.model.csw.GetDomainResponseType;
import be.kzen.ergorr.model.csw.GetDomainType;
import be.kzen.ergorr.model.csw.GetRecordByIdResponseType;
import be.kzen.ergorr.model.csw.GetRecordByIdType;
import be.kzen.ergorr.model.csw.GetRecordsResponseType;
import be.kzen.ergorr.model.csw.GetRecordsType;
import be.kzen.ergorr.model.csw.HarvestResponseType;
import be.kzen.ergorr.model.csw.HarvestType;
import be.kzen.ergorr.model.csw.TransactionResponseType;
import be.kzen.ergorr.model.csw.TransactionType;
import be.kzen.ergorr.model.rim.IdentifiableType;
import be.kzen.ergorr.query.QueryManager;
import be.kzen.ergorr.service.HarvestService;
import be.kzen.ergorr.service.TransactionService;
import be.kzen.ergorr.persist.InternalSlotTypes;
import be.kzen.ergorr.model.csw.SchemaComponentType;
import be.kzen.ergorr.model.ows.ExceptionReport;
import be.kzen.ergorr.model.ows.ExceptionType;
import be.kzen.ergorr.service.CapabilitiesReader;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.jws.WebService;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.ws.WebServiceContext;
import javax.xml.ws.handler.MessageContext;
import org.w3c.dom.Document;

/**
 * SOAP service implementation for CSW.
 * 
 * @author Yaman Ustuntas
 */
//@SchemaValidation
@WebService(serviceName = "webservice", portName = "CswPort",
targetNamespace = "http://www.kzen.be/ergorr/interfaces/soap",
endpointInterface = "be.kzen.ergorr.interfaces.soap.csw.CswPortType")
public class CswServiceImpl implements CswPortType {

    private static Logger logger = Logger.getLogger(CswServiceImpl.class.getName());
    private InternalSlotTypes slotTypes;
    @Resource
    private WebServiceContext wsContext;

    /**
     * {@inheritDoc}
     */
    public CapabilitiesType cswGetCapabilities(GetCapabilitiesType getCapabilitiesReq) throws ServiceExceptionReport {
        StopWatch sw = new StopWatch();
        MessageContext mc = wsContext.getMessageContext();
        HttpServletRequest request = (HttpServletRequest)mc.get(MessageContext.SERVLET_REQUEST);
        
        try {
            String servletUrl = request.getRequestURL().substring(0, (request.getRequestURL().length() - request.getServletPath().length()));
            JAXBElement capabilitiesEl = new CapabilitiesReader().getCapabilities(servletUrl);

            if (logger.isLoggable(Level.FINE)) {
                logger.log(Level.FINE, "Request processed in " + sw.getDurationAsMillis() + " milliseconds");
            }
            return (CapabilitiesType) capabilitiesEl.getValue();
        } catch (JAXBException ex) {
            String err = "Could not load Capabilities document";
            logger.log(Level.WARNING, err, ex);
            throw new ServiceExceptionReport(err, ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    public GetRecordsResponseType cswGetRecords(GetRecordsType getRecordsReq) throws ServiceExceptionReport {
        StopWatch sw = new StopWatch();
        RequestContext requestContext = new RequestContext();
        requestContext.setRequest(getRecordsReq);

        QueryManager qm = new QueryManager(requestContext);

        try {
            GetRecordsResponseType response = qm.query();

            if (logger.isLoggable(Level.FINE)) {
                logger.log(Level.FINE, "Request processed in " + sw.getDurationAsMillis() + " milliseconds");
            }

            return response;
        } catch (ServiceException ex) {
            throw createExceptionReport(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    public GetRecordByIdResponseType cswGetRecordById(GetRecordByIdType getRecordByIdReq) throws ServiceExceptionReport {
        StopWatch sw = new StopWatch();
        RequestContext requestContext = new RequestContext();
        requestContext.setRequest(getRecordByIdReq);

        GetRecordByIdResponseType response = new GetRecordByIdResponseType();

        try {
            List<JAXBElement<? extends IdentifiableType>> idents = new QueryManager(requestContext).getByIds();
            response.getAny().addAll(idents);

            if (logger.isLoggable(Level.FINE)) {
                logger.log(Level.FINE, "Request processed in " + sw.getDurationAsMillis() + " milliseconds");
            }
            return response;
        } catch (ServiceException ex) {
            throw createExceptionReport(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    public GetDomainResponseType cswGetDomain(GetDomainType getDomainReq) throws ServiceExceptionReport {
        throw new ServiceExceptionReport("Not supported");
    }

    /**
     * {@inheritDoc}
     */
    public HarvestResponseType cswHarvest(HarvestType body) throws ServiceExceptionReport {
        StopWatch sw = new StopWatch();
        HarvestResponseType response;
        RequestContext requestContext = new RequestContext();
        requestContext.setRequest(body);

        try {
            response = new HarvestService(requestContext).process();
            
            if (logger.isLoggable(Level.FINE)) {
                logger.log(Level.FINE, "Request processed in " + sw.getDurationAsMillis() + " milliseconds");
            }
            return response;
        } catch (ServiceException ex) {
            throw createExceptionReport(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    public TransactionResponseType cswTransaction(TransactionType transactionReq) throws ServiceExceptionReport {
        StopWatch sw = new StopWatch();
        TransactionResponseType response;
        RequestContext requestContext = new RequestContext();
        requestContext.setRequest(transactionReq);

        try {
            response = new TransactionService(requestContext).process();

            if (logger.isLoggable(Level.FINE)) {
                logger.log(Level.FINE, "Request processed in " + sw.getDurationAsMillis() + " milliseconds");
            }
            return response;
        } catch (ServiceException ex) {
            throw createExceptionReport(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    public DescribeRecordResponseType cswDescribeRecord(DescribeRecordType describeRecordReq) throws ServiceExceptionReport {
        StopWatch sw = new StopWatch();
        DescribeRecordResponseType response = new DescribeRecordResponseType();
        SchemaComponentType schemaComp = new SchemaComponentType();
        schemaComp.setTargetNamespace(NamespaceConstants.RIM);
        schemaComp.setSchemaLanguage(NamespaceConstants.SCHEMA);

        try {
            DocumentBuilder docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = docBuilder.parse(this.getClass().getResourceAsStream("/resources/rim.xsd"));
            schemaComp.getContent().add(doc.getDocumentElement());
        } catch (Exception ex) {
            String err = "Could not load RIM schema";
            logger.log(Level.WARNING, err, ex);
            throw new ServiceExceptionReport(err, ex);
        }

        response.getSchemaComponent().add(schemaComp);
        
        if (logger.isLoggable(Level.FINE)) {
            logger.log(Level.FINE, "Request processed in " + sw.getDurationAsMillis() + " milliseconds");
        }
        return response;
    }

    /**
     * Create a SOAP exception report from a service exception.
     * @param ex Service exception.
     * @return SOAP exception report.
     */
    private static ServiceExceptionReport createExceptionReport(ServiceException ex) {
        ExceptionReport exRep = new ExceptionReport();
        exRep.setLanguage(CommonProperties.getInstance().get("lang"));
        ExceptionType exType = new ExceptionType();
        exType.setExceptionCode(ex.getCode());
        exRep.getException().add(exType);
        return new ServiceExceptionReport(ex.getMessage(), exRep, ex);
    }

    /**
     * Put stuff here which should be initialized once.
     */
    @PostConstruct
    protected void init() {
        if (!CommonProperties.getInstance().getBoolean("showExceptionsInSoap")) {
            System.setProperty("com.sun.xml.ws.fault.SOAPFaultBuilder.disableCaptureStackTrace","false");
        }
        
        logger.info("init slot types");
        slotTypes = InternalSlotTypes.getInstance();
        try {
            slotTypes.loadSlots();
        } catch (Exception ex) {
            logger.log(Level.SEVERE, "Could not initialize slots", ex);
        }
    }
}
