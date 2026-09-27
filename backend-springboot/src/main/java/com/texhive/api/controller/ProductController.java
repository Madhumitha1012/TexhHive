package com.texhive.api.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ProductController {
    private final JdbcTemplate db;
    public ProductController(JdbcTemplate db) { this.db = db; }

    private final String SELECT = """
        select id,name,category,material,product_type as type,price,unit,moq,
        available_qty as availableQty,location,color,gsm,width,weave,finish,
        description,image,supplier_id as supplierId,status,created_at as createdAt
        from products
        """;

    @GetMapping
    public List<Map<String,Object>> all() {
        return db.queryForList(SELECT + " order by created_at desc");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> one(@PathVariable String id) {
        List<Map<String,Object>> rows = db.queryForList(SELECT + " where id=?", id);
        return rows.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(rows.get(0));
    }

    @GetMapping("/supplier/{supplierId}")
    public List<Map<String,Object>> bySupplier(@PathVariable String supplierId) {
        return db.queryForList(SELECT + " where supplier_id=? order by created_at desc", supplierId);
    }

    @PostMapping
    public Map<String,Object> create(@RequestBody Map<String,Object> p) {
        db.update("""
            insert into products(id,name,category,material,product_type,price,unit,moq,
            available_qty,location,color,gsm,width,weave,finish,description,image,supplier_id,status)
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            String.valueOf(p.get("id")), p.get("name"), p.get("category"), p.get("material"),
            p.get("type"), p.get("price"), p.get("unit"), p.get("moq"), p.get("availableQty"),
            p.get("location"), p.get("color"), p.get("gsm"), p.get("width"), p.get("weave"),
            p.get("finish"), p.get("description"), p.get("image"), p.get("supplierId"),
            p.getOrDefault("status","PENDING"));
        return Map.of("saved",true,"id",p.get("id"));
    }

    @PutMapping("/{id}")
    public Map<String,Object> update(@PathVariable String id, @RequestBody Map<String,Object> p) {
        db.update("""
            update products set name=?,category=?,material=?,product_type=?,price=?,unit=?,
            moq=?,available_qty=?,location=?,color=?,gsm=?,width=?,weave=?,finish=?,description=?,image=?
            where id=? and supplier_id=?
            """,
            p.get("name"),p.get("category"),p.get("material"),p.get("type"),p.get("price"),
            p.get("unit"),p.get("moq"),p.get("availableQty"),p.get("location"),p.get("color"),
            p.get("gsm"),p.get("width"),p.get("weave"),p.get("finish"),p.get("description"),
            p.get("image"),id,p.get("supplierId"));
        return Map.of("updated",true,"id",id);
    }

    @PatchMapping("/{id}/status")
    public Map<String,Object> status(@PathVariable String id, @RequestBody Map<String,Object> body) {
        db.update("update products set status=? where id=?", body.get("status"), id);
        return Map.of("updated",true,"id",id);
    }

    @PatchMapping("/supplier/{supplierId}/status")
    public Map<String,Object> supplierStatus(@PathVariable String supplierId, @RequestBody Map<String,Object> body) {
        db.update("update products set status=? where supplier_id=?", body.get("status"), supplierId);
        return Map.of("updated",true,"supplierId",supplierId);
    }
}
