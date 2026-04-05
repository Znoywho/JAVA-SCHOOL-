package com.bikemarket.dao;

import com.bikemarket.entity.Cart;
import com.bikemarket.entity.Item;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
// import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

public class CartDAO {
    SessionFactory sessionFactory = null;
    Configuration cf = null;

    public CartDAO(String persistenceUnitName) {
        this.cf = new Configuration();
        this.cf = this.cf.configure(persistenceUnitName);
        this.sessionFactory = this.cf.buildSessionFactory();
    }

    public void saveCart(Cart cart) {
        Session session = this.sessionFactory.openSession();
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();
            session.save(cart);
            transaction.commit();
            System.out.println("Saved cart for user ID: " + cart.getBuyer().getId());
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.out.println("Error occurred while saving cart: " + e.getMessage());
        } finally {
            sessionFactory.close();
            session.close();
        }
    }

    public Cart getCartById(long id) {
        Session session = sessionFactory.openSession();
        try {
            return (Cart) session.get(Cart.class, id);
        } catch (Exception e) {
            System.out.println("Error occurred while fetching cart by ID: " + e.getMessage());
            return null;
        } finally {
            session.close();
        }
    }

    public List<Cart> getAllCarts() {
        Session session = sessionFactory.openSession();
        try {
            return session.createQuery("FROM Cart", Cart.class).list();
        } catch (Exception e) {
            System.out.println("Error occurred while fetching all carts: " + e.getMessage());
            return null;
        } finally {
            session.close();
        }
    }

    public List<Cart> getCartsByUserId(long userId) {
        Session session = sessionFactory.openSession();
        try {
            return session.createQuery("FROM Cart WHERE buyer.id = :userId", Cart.class)
                    .setParameter("userId", userId)
                    .list();
        } catch (Exception e) {
            System.out.println("Error occurred while fetching carts by user ID: " + e.getMessage());
            return null;
        } finally {
            session.close();
        }
    }

    public void deleteCart(Cart cart) {
        Session session = sessionFactory.openSession();
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();
            session.delete(cart);
            transaction.commit();
            System.out.println("Deleted cart for user ID: " + cart.getBuyer().getId());
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.out.println("Error occurred while deleting cart: " + e.getMessage());
        } finally {
            sessionFactory.close();
            session.close();
        }
    }

    public void updateCart(Cart cart) {
        Session session = sessionFactory.openSession();
        Transaction transaction = null;
        try {
            transaction = session.beginTransaction();
            session.update(cart);
            transaction.commit();
            System.out.println("Updated cart for user ID: " + cart.getBuyer().getId());
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.out.println("Error occurred while updating cart: " + e.getMessage());
        }
    }
        public List<Item> getItemsByCartId(long cartId) {
            Session session = sessionFactory.openSession();
            try {
                return session.createQuery("FROM Item WHERE cart.id = :cartId", Item.class)
                        .setParameter("cartId", cartId)
                        .list();
            } catch (Exception e) {
                System.out.println("Error occurred while fetching items by cart ID: " + e.getMessage());
                return null;
            } finally {
                session.close();
            }
        }


}
