package com.bikemarket.dto;

import java.util.List;

public class CreateOrderRequest {
    private Long buyerId;
    private Long sellerId;
    private String paymentMethod;
    private List<OrderDetailRequest> items;

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<OrderDetailRequest> getItems() { return items; }
    public void setItems(List<OrderDetailRequest> items) { this.items = items; }
}