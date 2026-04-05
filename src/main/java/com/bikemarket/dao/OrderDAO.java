package com.bikemarket.dao;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
// import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import com.bikemarket.entity.Item;

import com.bikemarket.entity.Order;
import com.bikemarket.entity.OrderDetail;

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

  public List<Item> getItemsByOrderId(long orderId) {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM Item WHERE order.id = :orderId", Item.class)
              .setParameter("orderId", orderId)
              .list();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching items by order ID: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public List<Order> getOrdersByBuyerId(long buyerId) {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM Order WHERE buyer.id = :buyerId", Order.class)
              .setParameter("buyerId", buyerId)
              .list();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching orders by buyer ID: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public List<Order> getOrdersBySellerId(long sellerId) {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM Order WHERE seller.id = :sellerId", Order.class)
              .setParameter("sellerId", sellerId)
              .list();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching orders by seller ID: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public List<Order> getOrdersByStatus(String status) {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM Order WHERE orderStatus = :status", Order.class)
              .setParameter("status", status)
              .list();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching orders by status: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public void addOrderDetail(OrderDetail detail) {
    Session session = this.sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();

    try {
      session.save(detail);
      transaction.commit();
      System.out.println("Saved order detail: " + detail.getId() + " for order ID: " + detail.getOrder().getId());

    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while saving order detail: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }

  public void addOrderDetailByItems(List<Item> items, Order order) {
    Session session = this.sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();

    try {
      for (Item item : items) {
        OrderDetail detail = new OrderDetail(
                order,
                item.getQuantity(),
                item.getProduct(),
                item.getQuantity(),
                item.getTotalPrice()
        );
        System.out.println("Saved order detail for product ID: " + item.getProduct().getId() + " in order ID: " + order.getId());
      }
      transaction.commit();
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while saving order details by items: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }


  public List<OrderDetail> getOrderDetailsByOrderId(long orderId) {
    Session session = sessionFactory.openSession();
    try {
      return session.createQuery("FROM OrderDetail WHERE order.id = :orderId", OrderDetail.class)
              .setParameter("orderId", orderId)
              .list();
    } catch (Exception e) {
      System.out.println("Error occurred while fetching order details by order ID: " + e.getMessage());
      return null;
    } finally {
      session.close();
    }
  }

  public void deleteOrderDetailsByOrderId(long orderId) {
    Session session = sessionFactory.openSession();
    Transaction transaction = session.beginTransaction();
    try {
      List<OrderDetail> detailsToDelete = session.createQuery("FROM OrderDetail WHERE order.id = :orderId", OrderDetail.class)
              .setParameter("orderId", orderId)
              .list();
      for (OrderDetail detail : detailsToDelete) {
        session.delete(detail);
        System.out.println("Deleted order detail: " + detail.getId() + " from order ID: " + orderId);
      }
      transaction.commit();
    } catch (Exception e) {
      transaction.rollback();
      System.out.println("Error occurred while deleting order details by order ID: " + e.getMessage());
    } finally {
      sessionFactory.close();
      session.close();
    }
  }
}
