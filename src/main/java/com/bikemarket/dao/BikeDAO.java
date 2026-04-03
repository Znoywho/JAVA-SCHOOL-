package com.bikemarket.dao;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
// import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import com.bikemarket.entity.Bike;

public class BikeDAO {
  private SessionFactory sessionFactory = null;
  private Configuration cf = null;

  public BikeDAO(String persistenceUnitName) {

    this.cf = new Configuration();
    this.cf = this.cf.configure(persistenceUnitName);
    this.sessionFactory = this.cf.buildSessionFactory();

  }

  public void saveBike(Bike bike) {
    Session session = this.sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.save(bike);
      transaction.commit();
      System.out.println("Saved bike: " + bike.getTitle() + " (ID: " + bike.getId() + ")");
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while saving bike: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }

  public Bike getBikeById(long id) {
    Session session = sessionFactory.openSession();
    try {
      return (Bike) session.get(Bike.class, id);
    } catch (Exception e) {
      System.out.println("Error occurred while fetching bike by ID: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public List<Bike> getAllBikes() {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM Bike", Bike.class).list();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching all bikes: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public void deleteBike(Bike bike) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.delete(bike);
      transaction.commit();
      System.out.println("Deleted bike: " + bike.getTitle() + " (ID: " + bike.getId() + ")");
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while deleting bike: " + e.getMessage());
    } finally {
      session.close();
    }
  }

  public void updateBike(Bike bike) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.update(bike);
      transaction.commit();
      System.out.println("Updated bike: " + bike.getTitle() + " (ID: " + bike.getId() + ")");
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while updating bike: " + e.getMessage());
    } finally {
      session.close();
    }
  }
}
