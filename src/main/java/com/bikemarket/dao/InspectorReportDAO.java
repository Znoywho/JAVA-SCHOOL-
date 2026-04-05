package com.bikemarket.dao;



import com.bikemarket.entity.User;
import com.bikemarket.entity.InspectorReport;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
// import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

public class InspectorReportDAO {
    private SessionFactory sessionFactory = null;
    private Configuration cf = null;

    public InspectorReportDAO(String persistenceUnitName) {
        this.cf = new Configuration();
        this.cf = this.cf.configure(persistenceUnitName);
        this.sessionFactory = this.cf.buildSessionFactory();
    }

    public void saveReport(InspectorReport report) {
        Session session = this.sessionFactory.openSession();
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();
            session.save(report);
            transaction.commit();
            System.out.println("Saved inspector report for product ID: " + report.getProduct().getId() + " (Status: " + report.getStatus() + ")");
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.out.println("Error occurred while saving inspector report: " + e.getMessage());
        } finally {
            sessionFactory.close();
            session.close();
        }
    }

    public InspectorReport getReportById(long id) {
        Session session = sessionFactory.openSession();
        try {
            return (InspectorReport) session.get(InspectorReport.class, id);
        } catch (Exception e) {
            System.out.println("Error occurred while fetching inspector report by ID: " + e.getMessage());
            return null;
        } finally {
            session.close();
        }
    }

    public List<InspectorReport> getAllReports() {
        Session session = sessionFactory.openSession();
        try {
            return session.createQuery("FROM InspectorReport", InspectorReport.class).list();
        } catch (Exception e) {
            System.out.println("Error occurred while fetching all inspector reports: " + e.getMessage());
            return null;
        } finally {
            session.close();
        }
    }

    public List<InspectorReport> getReportsByProductId(long productId) {
        Session session = sessionFactory.openSession();
        try {
            return session.createQuery("FROM InspectorReport WHERE product.id = :productId", InspectorReport.class)
                    .setParameter("productId", productId)
                    .list();
        } catch (Exception e) {
            System.out.println("Error occurred while fetching inspector reports by product ID: " + e.getMessage());
            return null;
        } finally {
            session.close();
        }
    }

    public void deleteReport(InspectorReport report) {
        Session session = sessionFactory.openSession();
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();
            session.delete(report);
            transaction.commit();
            System.out.println("Deleted inspector report for product ID: " + report.getProduct().getId());
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.out.println("Error occurred while deleting inspector report: " + e.getMessage());
        } finally {
            sessionFactory.close();
            session.close();
        }
    }

    public void updateReport(InspectorReport report) {
        Session session = sessionFactory.openSession();
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();
            session.update(report);
            transaction.commit();
            System.out.println("Updated inspector report for product ID: " + report.getProduct().getId() + " (Status: " + report.getStatus() + ")");
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.out.println("Error occurred while updating inspector report: " + e.getMessage());
        } finally {
            sessionFactory.close();
            session.close();
        }

        
    }

    public User getUserById(long id) {
        Session session = sessionFactory.openSession();
        try {
            return (User) session.get(User.class, id);
        } catch (Exception e) {
            System.out.println("Error occurred while fetching user by ID: " + e.getMessage());
            return null;
        } finally {
            session.close();
        }
    }
}
