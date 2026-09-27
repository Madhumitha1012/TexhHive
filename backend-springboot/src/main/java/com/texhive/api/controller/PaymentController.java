package com.texhive.api.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://texhive-delta.vercel.app"
})
public class PaymentController {
    private final JdbcTemplate db;
    public PaymentController(JdbcTemplate db) { this.db=db; }

    @GetMapping("/buyer/{id}")
    public List<Map<String,Object>> buyer(@PathVariable String id) {
        return db.queryForList("select id,buyer_id as buyerId,order_id as orderId,amount,method,status,created_at as createdAt from payments where buyer_id=? order by created_at desc",id);
    }

    @PostMapping
    public Map<String,Object> create(@RequestBody Map<String,Object> p) {
        db.update("insert into payments(id,buyer_id,order_id,amount,method,status) values(?,?,?,?,?,?)",
                String.valueOf(p.get("id")),p.get("buyerId"),p.get("orderId"),p.get("amount"),p.get("method"),
                p.getOrDefault("status","PENDING"));
        return Map.of("saved",true,"id",p.get("id"));
    }
}
