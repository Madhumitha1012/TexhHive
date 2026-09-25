package com.texhive.api.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class OrderController {
    private final JdbcTemplate db;
    public OrderController(JdbcTemplate db) { this.db=db; }

    private final String SELECT = """
        select id,buyer_id as buyerId,buyer_name as buyerName,buyer_company as buyerCompany,
        buyer_phone as buyerPhone,supplier_id as supplierId,supplier_name as supplierName,
        supplier_company as supplierCompany,supplier_location as supplierLocation,quotation_id as quotationId,
        product_id as productId,product_name as productName,category,quantity,unit,moq,
        unit_price as unitPrice,total_amount as totalAmount,delivery_days as deliveryDays,
        payment_terms as paymentTerms,required_delivery_date as requiredDeliveryDate,
        delivery_location as deliveryLocation,expected_date as expectedDate,status,created_at as createdAt
        from orders
        """;

    @GetMapping("/buyer/{id}")
    public List<Map<String,Object>> buyer(@PathVariable String id) {
        return db.queryForList(SELECT+" where buyer_id=? order by created_at desc",id);
    }

    @GetMapping("/supplier/{id}")
    public List<Map<String,Object>> supplier(@PathVariable String id) {
        return db.queryForList(SELECT+" where supplier_id=? order by created_at desc",id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> one(@PathVariable String id) {
        List<Map<String,Object>> r=db.queryForList(SELECT+" where id=?",id);
        return r.isEmpty()?ResponseEntity.notFound().build():ResponseEntity.ok(r.get(0));
    }

    @PostMapping
    public Map<String,Object> create(@RequestBody Map<String,Object> o) {
        db.update("""
            insert into orders(id,buyer_id,buyer_name,buyer_company,buyer_phone,supplier_id,supplier_name,
            supplier_company,supplier_location,quotation_id,product_id,product_name,category,quantity,unit,
            moq,unit_price,total_amount,delivery_days,payment_terms,required_delivery_date,
            delivery_location,expected_date,status)
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            String.valueOf(o.get("id")),o.get("buyerId"),o.get("buyerName"),o.get("buyerCompany"),
            o.get("buyerPhone"),o.get("supplierId"),o.get("supplierName"),o.get("supplierCompany"),
            o.get("supplierLocation"),o.get("quotationId"),o.get("productId"),o.get("productName"),
            o.get("category"),o.get("quantity"),o.get("unit"),o.get("moq"),o.get("unitPrice"),
            o.get("totalAmount"),o.get("deliveryDays"),o.get("paymentTerms"),o.get("requiredDeliveryDate"),
            o.get("deliveryLocation"),o.get("expectedDate"),o.getOrDefault("status","CONFIRMED"));
        return Map.of("saved",true,"id",o.get("id"));
    }

    @PatchMapping("/{id}/status")
    public Map<String,Object> status(@PathVariable String id,@RequestBody Map<String,Object> body) {
        db.update("update orders set status=? where id=?",body.get("status"),id);
        return Map.of("updated",true,"id",id);
    }
}
