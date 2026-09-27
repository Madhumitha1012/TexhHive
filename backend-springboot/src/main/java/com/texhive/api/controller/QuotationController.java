package com.texhive.api.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://texhive-delta.vercel.app"
})
public class QuotationController {
    private final JdbcTemplate db;
    public QuotationController(JdbcTemplate db) { this.db=db; }

    private final String SELECT = """
        select id,rfq_id as rfqId,buyer_id as buyerId,supplier_id as supplierId,
        product_id as productId,product_name as productName,quantity,unit,unit_price as unitPrice,
        moq,delivery_days as deliveryDays,payment_terms as paymentTerms,total_price as totalPrice,
        status,created_at as createdAt
        from quotations
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
    public Map<String,Object> create(@RequestBody Map<String,Object> q) {
        db.update("""
            insert into quotations(id,rfq_id,buyer_id,supplier_id,product_id,product_name,quantity,unit,
            unit_price,moq,delivery_days,payment_terms,total_price,status)
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            String.valueOf(q.get("id")),q.get("rfqId"),q.get("buyerId"),q.get("supplierId"),
            q.get("productId"),q.get("productName"),q.get("quantity"),q.get("unit"),q.get("unitPrice"),
            q.get("moq"),q.get("deliveryDays"),q.get("paymentTerms"),q.get("totalPrice"),
            q.getOrDefault("status","SENT"));
        return Map.of("saved",true,"id",q.get("id"));
    }

    @PatchMapping("/{id}/status")
    public Map<String,Object> status(@PathVariable String id,@RequestBody Map<String,Object> body) {
        db.update("update quotations set status=? where id=?",body.get("status"),id);
        return Map.of("updated",true);
    }
}
