
package be.kzen.ergorr.persist.dao;

import be.kzen.ergorr.model.rim.IdentifiableType;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

/**
 *
 * @author Yaman Ustuntas
 */
public abstract class GenericComposedObjectDAO<T, P extends IdentifiableType> extends GenericDAO<T> {
    protected P parent;

    public GenericComposedObjectDAO(P parent) {
        this.parent = parent;
    }
    
    public void update() throws SQLException {
        delete();
        insert();
    }

    public void delete() throws SQLException {
        Statement stmt = connection.createStatement();
        stmt.execute(createDeleteStatement());
    }

    /**
     * Condition to get compesed objects by parent.
     *
     * @return SQL condition.
     */
    @Override
    protected String getFetchCondition() {
        return "parent='" + parent.getId() + "'";
    }
    
    public abstract void addComposedObjects() throws SQLException;
    public abstract void insert() throws SQLException;
}