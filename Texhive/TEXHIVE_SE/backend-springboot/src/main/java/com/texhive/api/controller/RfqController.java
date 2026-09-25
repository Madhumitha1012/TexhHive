package com.texhive.api.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/rfqs")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class RfqController {
    private final JdbcTemplate db;
    public RfqController(JdbcTemplate db) { this.db=db; }

    private final String SELECT = """
        select id,buyer_id as buyerId,product_id as productId,supplier_id as supplierId,
        product_name as productName,quantity,unit,required_delivery_date as requiredDeliveryDate,
        delivery_location as deliveryLocation,requirements,status,created_at as createdAt
        from rfqs
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
    public Map<String,Object> create(@RequestBody Map<String,Object> r) {
        db.update("""
            insert into rfqs(id,buyer_id,product_id,supplier_id,product_name,quantity,unit,
            required_delivery_date,delivery_location,requirements,status)
            values(?,?,?,?,?,?,?,?,?,?,?)
            """,
            String.valueOf(r.get("id")),r.get("buyerId"),r.get("productId"),r.get("supplierId"),
            r.get("productName"),r.get("quantity"),r.get("unit"),r.get("requiredDeliveryDate"),
            r.get("deliveryLocation"),r.get("requirements"),r.getOrDefault("status","PENDING"));
        return Map.of("saved",true,"id",r.get("id"));
    }

    @PatchMapping("/{id}/status")
    public Map<String,Object> status(@PathVariable String id,@RequestBody Map<String,Object> body) {
        db.update("update rfqs set status=? where id=?",body.get("status"),id);
        return Map.of("updated",true);
    }
}
