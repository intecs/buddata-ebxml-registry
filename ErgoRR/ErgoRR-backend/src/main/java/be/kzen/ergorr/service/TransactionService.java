/*
 * Project: Buddata ebXML RegRep
 * Class: TransactionService.java
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
package be.kzen.ergorr.service;

import be.kzen.ergorr.commons.CommonFunctions;
import be.kzen.ergorr.commons.InternalConstants;
import be.kzen.ergorr.commons.NamespaceConstants;
import be.kzen.ergorr.commons.RequestContext;
import be.kzen.ergorr.exceptions.ErrorCodes;
import be.kzen.ergorr.exceptions.ServiceException;
import be.kzen.ergorr.model.csw.BriefRecordType;
import be.kzen.ergorr.model.csw.DeleteType;
import be.kzen.ergorr.model.csw.ElementSetNameType;
import be.kzen.ergorr.model.csw.ElementSetType;
import be.kzen.ergorr.model.csw.GetRecordsResponseType;
import be.kzen.ergorr.model.csw.GetRecordsType;
import be.kzen.ergorr.model.csw.InsertResultType;
import be.kzen.ergorr.model.csw.InsertType;
import be.kzen.ergorr.model.csw.QueryType;
import be.kzen.ergorr.model.csw.ResultType;
import be.kzen.ergorr.model.csw.TransactionResponseType;
import be.kzen.ergorr.model.csw.TransactionSummaryType;
import be.kzen.ergorr.model.csw.TransactionType;
import be.kzen.ergorr.model.csw.UpdateType;
import be.kzen.ergorr.model.purl.elements.SimpleLiteral;
import be.kzen.ergorr.model.rim.IdentifiableType;
import be.kzen.ergorr.model.rim.RegistryObjectListType;
import be.kzen.ergorr.model.rim.RegistryObjectType;
import be.kzen.ergorr.model.util.OFactory;
import be.kzen.ergorr.query.QueryManager;
import be.kzen.ergorr.service.translator.TranslationException;
import be.kzen.ergorr.service.translator.TranslatorFactory;
import be.kzen.ergorr.service.translator.Translator;
import it.intecs.pisa.ergorr.saxon.SaxonDocument;
import java.math.BigInteger;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.bind.JAXBElement;
import javax.xml.namespace.QName;
import org.w3c.dom.Node;

/**
 * Manages transaction insert/update/delete actions.
 *
 * @author Yaman Ustuntas
 */
public class TransactionService {

    private static final Logger logger = Logger.getLogger(TransactionService.class.getName());
    private RequestContext requestContext;
    private InsertResultType insertResult;
    private int insertsCount;
    private int updatesCount;
    private int deletesCount;

    public TransactionService() {
        insertResult = new InsertResultType();
        insertsCount = 0;
        updatesCount = 0;
        deletesCount = 0;
    }

    /**
     * Constructor.
     *
     * @param requestContext Request context.
     */
    public TransactionService(RequestContext requestContext) {
        this();
        this.requestContext = requestContext;
    }

    /**
     * Start processing the transaction request.
     *
     * @return Transaction response.
     * @throws be.kzen.ergorr.exceptions.ServiceException
     */
    public TransactionResponseType process() throws ServiceException {
        List<Object> actions = ((TransactionType) requestContext.getRequest()).getInsertOrUpdateOrDelete();

        for (Object action : actions) {
            if (action instanceof InsertType) {
                doInsert((InsertType) action);
            } else if (action instanceof UpdateType) {
                doUpdate((UpdateType) action);
            } else if (action instanceof DeleteType) {
                doDelete((DeleteType) action);
            } else {
                logger.warning("Transaction request not an Insert, Update or Delete");
            }
        }

        return buildResponse();
    }

    /**
     * Builds the transaction response from data collection from insert/update/delete.
     *
     * @return Transaction response.
     */
    private TransactionResponseType buildResponse() {
        TransactionResponseType response = new TransactionResponseType();
        TransactionSummaryType summary = new TransactionSummaryType();

        if (!insertResult.getBriefRecord().isEmpty()) {
            response.getInsertResult().add(insertResult);
        }
        if (insertsCount > 0) {
            summary.setTotalInserted(BigInteger.valueOf(insertsCount));
        }
        if (updatesCount > 0) {
            summary.setTotalUpdated(BigInteger.valueOf(updatesCount));
        }
        if (deletesCount > 0) {
            summary.setTotalDeleted(BigInteger.valueOf(deletesCount));
        }

        response.setTransactionSummary(summary);
        return response;
    }

    /**
     * Handles the Insert transaction.
     *
     * @param insert Insert data.
     * @throws be.kzen.ergorr.exceptions.ServiceException
     */
    private void doInsert(InsertType insert) throws ServiceException{
        logger.fine("Transtaction.doInsert");
        RegistryObjectListType regObjList = new RegistryObjectListType();

        for (Object o : insert.getAny()) {

            if (!(o instanceof JAXBElement)) {
                
                if(!(o instanceof Node))
                 throw new ServiceException(ErrorCodes.TRANSACTION_FAILED, "Content not recognized as a JAXBElement :" + o.getClass().getName());
                else{
                    String objectType=null;
                    SaxonDocument sx=null;
                    
                    try {
                        sx = new SaxonDocument((Node) o);
                        objectType = sx.getRootNameSpace();
                    } catch (Exception ex) {
                        String err = "Could not recognized Element: " + ((Node)o).getNodeName() + "[namespace: " + ((Node)o).getNamespaceURI()+"]";
                        logger.log(Level.WARNING, err, ex);
                        throw new ServiceException(ErrorCodes.INVALID_REQUEST, err, ex);
                    }
                    try {
                        Translator translator = TranslatorFactory.getInstance(sx.getXMLDocumentString(), objectType);
                        regObjList.getIdentifiable().addAll(translator.translate().getIdentifiable());
                    } catch (TranslationException ex) {
                        String err = "Translation failed";
                        logger.log(Level.WARNING, err, ex);
                        throw new ServiceException(ErrorCodes.INVALID_REQUEST, err, ex);
                    } catch (Exception ex) {
                        String err = "Could not invoke translator for namespace: " + objectType;
                        logger.log(Level.SEVERE, err, ex);
                        throw new ServiceException(err, ex);
                    }
                
                }  
            }else{
                JAXBElement jaxbEl = (JAXBElement) o;
                Object obj = jaxbEl.getValue();

                if (logger.isLoggable(Level.FINE)) {
                    logger.log(Level.FINE, "Translation root object: {0}", obj.getClass().toString());
                }
                if (obj instanceof IdentifiableType) {
                    regObjList.getIdentifiable().add((JAXBElement<? extends IdentifiableType>) o);
                } else if (obj instanceof RegistryObjectListType) {
                    RegistryObjectListType reqList = (RegistryObjectListType) obj;
                    regObjList.getIdentifiable().addAll(reqList.getIdentifiable());
                } else {
                    try {
                        Translator translator = TranslatorFactory.getInstance(jaxbEl);
                        regObjList.getIdentifiable().addAll(translator.translate().getIdentifiable());
                    } catch (TranslationException ex) {
                        logger.log(Level.WARNING, "Translation error", ex);
                        throw new ServiceException(ErrorCodes.TRANSACTION_FAILED, "Transaction error", ex);
                    }
                }
            }    
        }

        if (logger.isLoggable(Level.FINE)) {
            logger.log(Level.FINE, "Got {0} translated objects", regObjList.getIdentifiable().size());
        }
        LCManager lcm = new LCManager(requestContext);
        lcm.submit(regObjList);

        insertsCount += regObjList.getIdentifiable().size();
        appendBriefRecords(regObjList);
    }

    /**
     * Handles the Update transaction.
     *
     * @param update Update data.
     * @throws be.kzen.ergorr.exceptions.ServiceException
     */
    private void doUpdate(UpdateType update) throws ServiceException {

        if (update.isSetAny() && update.getAny() instanceof JAXBElement) {
            Object updateObj = ((JAXBElement) update.getAny()).getValue();

            RegistryObjectListType regObjList = null;

            if (updateObj instanceof RegistryObjectListType) {
                regObjList = (RegistryObjectListType) updateObj;
            } else if (updateObj instanceof RegistryObjectType) {
                regObjList = new RegistryObjectListType();
                JAXBElement<RegistryObjectType> regObjEl = OFactory.rim.createRegistryObject((RegistryObjectType) updateObj);
                regObjList.getIdentifiable().add(regObjEl);
            } else {
                throw new ServiceException(ErrorCodes.INVALID_REQUEST, "Expected RegistryObjectList or any RegistryObject sub type");
            }

            LCManager lcm = new LCManager(requestContext);
            lcm.update(regObjList);

            int updateCount = 0;
            int insertCount = 0;

            for (JAXBElement<? extends IdentifiableType> identEl : regObjList.getIdentifiable()) {
                IdentifiableType ident = identEl.getValue();

                if (ident.isNewObject()) {
                    insertCount++;
                    appendBriefRecord(ident);
                } else {
                    updateCount++;
                }
            }

            insertsCount += insertCount;
            updatesCount += updateCount;
        } else {
            throw new ServiceException(ErrorCodes.INVALID_REQUEST, "No rim:RegistryObject or rim:RegistryObjectList specified for updating");
        }
    }

    /**
     * Handles the Delete transactions.
     * 
     * @param delete Delete request.
     * @throws be.kzen.ergorr.exceptions.ServiceException
     */
    private void doDelete(DeleteType delete) throws ServiceException {
        GetRecordsType getRecords = new GetRecordsType();
        
        getRecords.setResultType(ResultType.RESULTS);
        getRecords.setMaxRecords(new BigInteger("-1"));
        
        QueryType query = new QueryType();
        String typeName = CommonFunctions.removePrefix(delete.getTypeName());
        QName objQNameToDelete = new QName(NamespaceConstants.RIM, typeName, "rim");
        query.getTypeNames().add(objQNameToDelete);

        ElementSetNameType elSetName = new ElementSetNameType();
        elSetName.getTypeNames().add(objQNameToDelete);
        elSetName.setValue(ElementSetType.BRIEF);
        query.setElementSetName(elSetName);

        query.setConstraint(delete.getConstraint());
        JAXBElement<QueryType> queryEl = OFactory.csw.createQuery(query);
        getRecords.setAbstractQuery(queryEl);

        RequestContext rq = new RequestContext();
        rq.setRequest(getRecords);
        rq.putParam(InternalConstants.DB_CONNECTION_PARAMS, requestContext.getParam(InternalConstants.DB_CONNECTION_PARAMS));

        QueryManager qm = new QueryManager(rq);

        GetRecordsResponseType queryResponse = qm.query();
        List<Object> objsToDelete = queryResponse.getSearchResults().getAny();

        RegistryObjectListType regObjList = new RegistryObjectListType();

        for (Object objToDelete : objsToDelete) {
            JAXBElement<? extends IdentifiableType> elToDelete = (JAXBElement<? extends IdentifiableType>) objToDelete;
            regObjList.getIdentifiable().add(elToDelete);
        }

        LCManager lcm = new LCManager(requestContext);
        List<IdentifiableType> deletedIdents = lcm.delete(regObjList);

        deletesCount = deletedIdents.size();
    }

    /**
     * Create an <code>BriefRecordType</code> from the <code> and
     * and appends it to the response.
     *
     * @param ident Identifiable to append.
     */
    private void appendBriefRecord(IdentifiableType ident) {
        BriefRecordType briefRecord = new BriefRecordType();

        SimpleLiteral identifier = new SimpleLiteral();
        identifier.getContent().add(ident.getId());
        briefRecord.getIdentifier().add(OFactory.purl_elements.createIdentifier(identifier));

        SimpleLiteral title = new SimpleLiteral();
        title.getContent().add("-");
        briefRecord.getTitle().add(OFactory.purl_elements.createTitle(title));

        if (ident instanceof RegistryObjectType) {
            SimpleLiteral type = new SimpleLiteral();
            type.getContent().add(((RegistryObjectType) ident).getObjectType());
            briefRecord.setType(type);
        }
        insertResult.getBriefRecord().add(briefRecord);
    }

    /**
     * Append a list of registry objects as
     * <code>BriefRecordType</code> to the response.
     *
     * @param regObjList Objects to append.
     */
    private void appendBriefRecords(RegistryObjectListType regObjList) {
        for (JAXBElement<? extends IdentifiableType> identEl : regObjList.getIdentifiable()) {
            appendBriefRecord(identEl.getValue());
        }
    }
}
