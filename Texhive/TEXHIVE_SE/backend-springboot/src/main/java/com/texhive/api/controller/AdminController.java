package com.texhive.api.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AdminController {
    private final JdbcTemplate db;
    public AdminController(JdbcTemplate db) { this.db = db; }

    @GetMapping("/rfqs")
    public List<Map<String,Object>> rfqs() {
        return db.queryForList("""
            select id,buyer_id as buyerId,product_id as productId,supplier_id as supplierId,
            product_name as productName,quantity,unit,required_delivery_date as requiredDeliveryDate,
            delivery_location as deliveryLocation,requirements,status,created_at as createdAt
            from rfqs order by created_at desc
        """);
    }

    @GetMapping("/orders")
    public List<Map<String,Object>> orders() {
        return db.queryForList("""
            select id,buyer_id as buyerId,buyer_name as buyerName,buyer_company as buyerCompany,
            supplier_id as supplierId,supplier_name as supplierName,supplier_company as supplierCompany,
            quotation_id as quotationId,product_id as productId,product_name as productName,
            category,quantity,unit,moq,unit_price as unitPrice,total_amount as totalAmount,
            delivery_days as deliveryDays,payment_terms as paymentTerms,expected_date as expectedDate,
            delivery_location as deliveryLocation,status,created_at as createdAt
            from orders order by created_at desc
        """);
    }
}
