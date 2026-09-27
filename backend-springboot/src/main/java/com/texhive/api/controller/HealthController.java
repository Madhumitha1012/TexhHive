package com.texhive.api.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://texhive-delta.vercel.app"
})
public class HealthController {
    private final JdbcTemplate jdbc;
    public HealthController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @GetMapping("/health")
    public Map<String,Object> health() {
        try {
            jdbc.queryForObject("select 1", Integer.class);
            return Map.of("status","UP","database","MYSQL_CONNECTED");
        } catch(Exception e) {
            return Map.of("status","DOWN","database","MYSQL_NOT_CONNECTED","message",String.valueOf(e.getMessage()));
        }
    }
}
