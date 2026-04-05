package com.bikemarket.dao;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import org.hibernate.cfg.Configuration;

import com.bikemarket.entity.User;


public class UserDAO {
  private SessionFactory sessionFactory = null;
  private Configuration cf = null;

  public UserDAO(String persistenceUnitName) {

    this.cf = new Configuration();
    this.cf = this.cf.configure(persistenceUnitName);
    this.sessionFactory = this.cf.buildSessionFactory();

  }

  public User getUserByEmail(String email) {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM User WHERE email = :email", User.class)
          .setParameter("email", email)
          .uniqueResult();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching user by email: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }



  public void saveUser(User user) {
    Session session = this.sessionFactory.openSession();
    Transaction transaction = null;
    try {
      transaction = session.beginTransaction();
      session.save(user);
      transaction.commit();
      System.out.println("Saved user role: " + user.getRole() + " (" + user.getEmail() + ")");

    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while saving user: " + e.getMessage());
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

  public List<User> getAllUsers() {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      transaction.commit();
      return session.createQuery("FROM User", User.class).list();
    } catch (Exception e) {
      if (transaction != null)
        transaction.rollback();
      System.out.println("Error occurred while fetching all users: " + e.getMessage());
      return null;
    } finally {
      sessionFactory.close();
      session.close();
    }
  }

  public void updateUser(User user) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      session.update(user);
      transaction.commit();
      System.out.println("Updated user role: " + user.getRole() + " (" + user.getEmail() + ")");
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while updating user: " + e.getMessage());
    } finally {
      this.sessionFactory.close();
      session.close();
    }
  }

  public void deleteUser(User user) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      transaction.begin();
      User userToDelete = session.get(User.class, user.getId());
      session.delete(user);
      transaction.commit();
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while deleting user: " + e.getMessage());
    } finally {
      session.close();
    }
  }
}
