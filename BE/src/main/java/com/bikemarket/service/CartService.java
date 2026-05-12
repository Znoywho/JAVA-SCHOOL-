package com.bikemarket.service;

import com.bikemarket.dto.CartDTO;
import com.bikemarket.dto.CartItemDTO;
import com.bikemarket.entity.Cart;
import com.bikemarket.entity.Item;
import com.bikemarket.entity.Product;
import com.bikemarket.entity.User;
import com.bikemarket.exception.ResourceNotFoundException;
import com.bikemarket.repository.ICartRepository;
import com.bikemarket.repository.IItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CartService implements ICartService {

    @Autowired
    private ICartRepository cartRepository;

    @Autowired
    private IItemRepository itemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Override
    public CartDTO addToCart(long buyerId, long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }

        Cart cart = getOrCreateCart(buyerId);
        Product product = productService.findProductById(productId);

        Item item = itemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseGet(() -> new Item(cart, 0, 1, product));
        item.setQuantity(item.getQuantity() + quantity);
        itemRepository.save(item);

        return toCartDTO(cart);
    }

    @Override
    public CartDTO getCart(long buyerId) {
        Cart cart = getOrCreateCart(buyerId);
        return toCartDTO(cart);
    }

    @Override
    public CartDTO updateQuantity(long buyerId, long productId, int quantity) {
        Cart cart = getOrCreateCart(buyerId);
        Item item = itemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            itemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            itemRepository.save(item);
        }

        return toCartDTO(cart);
    }

    @Override
    public void removeFromCart(long buyerId, long productId) {
        Cart cart = getOrCreateCart(buyerId);
        itemRepository.deleteByCartIdAndProductId(cart.getId(), productId);
    }

    @Override
    public void clearCart(long buyerId) {
        Cart cart = getOrCreateCart(buyerId);
        itemRepository.deleteAll(itemRepository.findByCartId(cart.getId()));
    }

    @Override
    public int getCartCount(long buyerId) {
        Cart cart = getOrCreateCart(buyerId);
        return itemRepository.findByCartId(cart.getId()).stream()
                .mapToInt(Item::getQuantity)
                .sum();
    }

    private Cart getOrCreateCart(long buyerId) {
        User buyer = userService.findUserById(buyerId);
        if (buyer == null) {
            throw new ResourceNotFoundException("Buyer not found with id: " + buyerId);
        }

        return cartRepository.findByBuyerId(buyerId)
                .orElseGet(() -> cartRepository.save(new Cart(buyer)));
    }

    private CartDTO toCartDTO(Cart cart) {
        List<CartItemDTO> items = itemRepository.findByCartId(cart.getId()).stream()
                .map(this::toCartItemDTO)
                .toList();

        int totalQuantity = items.stream().mapToInt(CartItemDTO::getQuantity).sum();
        double totalPrice = items.stream().mapToDouble(CartItemDTO::getTotalPrice).sum();

        return CartDTO.builder()
                .cartId(cart.getId())
                .buyerId(cart.getBuyer().getId())
                .items(items)
                .totalQuantity(totalQuantity)
                .totalPrice(totalPrice)
                .build();
    }

    private CartItemDTO toCartItemDTO(Item item) {
        return CartItemDTO.builder()
                .itemId(item.getId())
                .productId(item.getProduct().getId())
                .sellerId(item.getProduct().getSellerId().getId())
                .sellerName(item.getProduct().getSellerId().getName())
                .productTitle(item.getProduct().getTitle())
                .productPrice(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getProduct().getPrice() * item.getQuantity())
                .build();
    }
}
