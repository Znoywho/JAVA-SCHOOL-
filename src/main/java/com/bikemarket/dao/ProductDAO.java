package com.bikemarket.dao;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
// import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import com.bikemarket.entity.Product;

public class ProductDAO {
  private SessionFactory sessionFactory = null;
  private Configuration cf = null;

  public ProductDAO(String persistenceUnitName) {

    this.cf = new Configuration();
    this.cf = this.cf.configure(persistenceUnitName);
    this.sessionFactory = this.cf.buildSessionFactory();

  }

  public void saveProduct(Product product) {
    Session session = this.sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.save(product);
      transaction.commit();
      System.out.println("Saved product: " + product.getTitle() + " (ID: " + product.getId() + ")");
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while saving product: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }

  public Product getProductById(long id) {
    Session session = sessionFactory.openSession();
    try {
      return (Product) session.get(Product.class, id);
    } catch (Exception e) {
      System.out.println("Error occurred while fetching product by ID: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public List<Product> getAllProducts() {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM Product", Product.class).list();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching all products: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public void deleteProduct(Product product) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.delete(product);
      transaction.commit();
      System.out.println("Deleted product: " + product.getTitle() + " (ID: " + product.getId() + ")");
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while deleting product: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }

  public void updateProduct(Product product) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.update(product);
      transaction.commit();
      System.out.println("Updated product: " + product.getTitle() + " (ID: " + product.getId() + ")");
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while updating product: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }
}
