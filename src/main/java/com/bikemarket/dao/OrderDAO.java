package com.bikemarket.dao;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
// import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import com.bikemarket.entity.Order;

public class OrderDAO {

  private SessionFactory sessionFactory = null;
  private Configuration cf = null;

  public OrderDAO(String persistenceUnitname) {
    this.cf = new Configuration();
    this.cf = this.cf.configure(persistenceUnitname);
    this.sessionFactory = this.cf.buildSessionFactory();
  }

  public void saveOrder(Order order) {
    Session session = this.sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();

    try {
      session.save(order);
      transaction.commit();
      System.out.println("Saved order: " + order.getId() + " (Status: " + order.getOrderStatus() + ")");

    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while saving order: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }

  public Order getOrderById(long id) {
    Session session = sessionFactory.openSession();
    try {
      return (Order) session.get(Order.class, id);
    } catch (Exception e) {
      System.out.println("Error occurred while fetching order by ID: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public List<Order> getAllOrders() {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM Order", Order.class).list();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching all orders: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public void deleteOrder(Order order) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.delete(order);
      transaction.commit();
      System.out.println("Deleted order: " + order.getId());
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while deleting order: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }

  public void updateOrder(Order order) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.update(order);
      transaction.commit();
      System.out.println("Updated order: " + order.getId());
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while updating order: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }

}
