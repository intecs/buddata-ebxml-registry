package be.kzen.ergorr.interfaces.soap;

import be.kzen.ergorr.commons.CommonProperties;
import be.kzen.ergorr.commons.InternalConstants;
import be.kzen.ergorr.commons.NamespaceConstants;
import be.kzen.ergorr.commons.RequestContext;
import be.kzen.ergorr.exceptions.ServiceException;
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
import be.kzen.ergorr.model.util.JAXBUtil;
import be.kzen.ergorr.persist.InternalSlotTypes;
import be.kzen.ergorr.persist.service.DbConnectionParams;
import be.kzen.ergorr.persist.service.SqlPersistence;
import be.kzen.ergorr.query.QueryManager;
import be.kzen.ergorr.service.HarvestService;
import be.kzen.ergorr.service.TransactionService;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import be.kzen.ergorr.interfaces.soap.csw.CswClient;
import be.kzen.ergorr.interfaces.soap.csw.ServiceExceptionReport;
import be.kzen.ergorr.model.csw.SchemaComponentType;
import be.kzen.ergorr.model.ows.ExceptionReport;
import be.kzen.ergorr.model.ows.ExceptionType;
import be.kzen.ergorr.service.CapabilitiesReader;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;

/**
 *
 * @author Yaman Ustuntas
 */
public class CswBackendClient implements CswClient {

    private static Logger logger = Logger.getLogger(CswBackendClient.class.getName());
    private InternalSlotTypes slotTypes;
    private DbConnectionParams dbConnParams;

    public CswBackendClient(DbConnectionParams dbConnParams, String serviceUrl) {
        this.dbConnParams = dbConnParams;
        init();
    }

    public CswBackendClient(DbConnectionParams dbConnParams) {
        this(dbConnParams, "");
    }

    /**
     * {@inheritDoc}
     */
    public CapabilitiesType getCapabilities(GetCapabilitiesType getCapabilitiesReq) throws ServiceExceptionReport {
        try {
            CapabilitiesReader capReader = new CapabilitiesReader(newRequestContext());
            return capReader.getCapabilities("").getValue();
        } catch (JAXBException ex) {
            throw new ServiceExceptionReport("Could not load capabilities document from file.", ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    public GetRecordsResponseType getRecords(GetRecordsType getRecordsReq) throws ServiceExceptionReport {
        RequestContext requestContext = newRequestContext();
        requestContext.setRequest(getRecordsReq);

        QueryManager qm = new QueryManager(requestContext);

        try {
            return qm.query();
        } catch (ServiceException ex) {
            throw createExceptionReport(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    public GetRecordByIdResponseType getRecordById(GetRecordByIdType getRecordByIdReq) throws ServiceExceptionReport {
        RequestContext requestContext = newRequestContext();
        requestContext.setRequest(getRecordByIdReq);
        GetRecordByIdResponseType response = new GetRecordByIdResponseType();

        try {
            List<JAXBElement<? extends IdentifiableType>> idents = new QueryManager(requestContext).getByIds();
            response.getAny().addAll(idents);
        } catch (ServiceException ex) {
            throw createExceptionReport(ex);
        }

        return response;
    }

    /**
     * {@inheritDoc}
     */
    public GetDomainResponseType getDomain(GetDomainType getDomainReq) throws ServiceExceptionReport {
        throw new ServiceExceptionReport("Not supported");
    }

    /**
     * {@inheritDoc}
     */
    public HarvestResponseType harvest(HarvestType body) throws ServiceExceptionReport {
        RequestContext requestContext = newRequestContext();
        requestContext.putParam(InternalConstants.DEPLOY_NAME, dbConnParams.getDbName());
        requestContext.setRequest(body);

        try {
            return new HarvestService(requestContext).process();
        } catch (ServiceException ex) {
            throw createExceptionReport(ex);
        }
    }

    /**
     * {@inheritDoc}
     */
    public TransactionResponseType transact(TransactionType transactionReq) throws ServiceExceptionReport {
        RequestContext requestContext = newRequestContext();
        requestContext.putParam(InternalConstants.DEPLOY_NAME, dbConnParams.getDbName());
        requestContext.setRequest(transactionReq);

        try {
            return new TransactionService(requestContext).process();
        } catch (ServiceException ex) {
            throw createExceptionReport(ex);
        }
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
        return new ServiceExceptionReport(ex.getCode(), exRep, ex);
    }

    /**
     * {@inheritDoc}
     */
    public DescribeRecordResponseType getRecordDescription(DescribeRecordType describeRecordReq) throws ServiceExceptionReport {
        long time = System.currentTimeMillis();
        DescribeRecordResponseType response = new DescribeRecordResponseType();
        SchemaComponentType schemaComp = new SchemaComponentType();
        schemaComp.setTargetNamespace(NamespaceConstants.RIM);
        schemaComp.setSchemaLanguage(NamespaceConstants.SCHEMA);

        try {
            DocumentBuilder docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = docBuilder.parse(this.getClass().getResourceAsStream("/resources/rim.xsd"));
            schemaComp.getContent().add(doc.getDocumentElement());
        } catch (Exception ex) {
            logger.log(Level.WARNING, "Could not load RIM schema", ex);
            throw new ServiceExceptionReport("Could not load RIM schema", ex);
        }

        response.getSchemaComponent().add(schemaComp);
        logger.log(Level.FINE, "Request processed in " + (System.currentTimeMillis() - time) + " milliseconds");
        return response;
    }

    /**
     * Initialize the backend client.
     */
    private void init() {
        slotTypes = InternalSlotTypes.getInstance();

        if (slotTypes.getSlotTypeSize() == 0) {
            SqlPersistence persistence = new SqlPersistence(newRequestContext());

            try {
                slotTypes.loadSlots(persistence);
            } catch (Exception ex) {
                logger.log(Level.SEVERE, "Could not load slot types", ex);
            }
        }
    }

    /**
     * Create a new RequestContext with default values.
     *
     * @return New RequestContext.
     */
    private RequestContext newRequestContext() {
        RequestContext rc = new RequestContext();

        if (dbConnParams != null) {
            rc.putParam(InternalConstants.DB_CONNECTION_PARAMS, dbConnParams);
        }
        
        return rc;
    }
}
