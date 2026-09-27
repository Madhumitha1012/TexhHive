package com.texhive.api.controller;

import com.texhive.api.model.User;
import com.texhive.api.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://texhive-delta.vercel.app"
})

public class AuthController {

    private static final String ADMIN_EMAIL = "admin@texhive.com";
    private static final String ADMIN_PASSWORD = "Admin@12345";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> data) {
        String email = data.getOrDefault("email","").trim().toLowerCase();
        String password = data.getOrDefault("password","");

        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {
            return ResponseEntity.ok(admin());
        }

        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty() || !passwordEncoder.matches(password, opt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message","Invalid email or password"));
        }

        User u = opt.get();

        if ("SUPPLIER".equalsIgnoreCase(u.getRole()) && !"ACTIVE".equalsIgnoreCase(u.getStatus())) {
            String msg = "REJECTED".equalsIgnoreCase(u.getStatus())
                    ? "Supplier account was rejected by Admin."
                    : "Supplier account is awaiting Admin verification.";
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message",msg));
        }

        Map<String,Object> out = new LinkedHashMap<>();
        out.put("login", true);
        out.put("id", u.getId());
        out.put("name", u.getName());
        out.put("companyName", u.getCompanyName());
        out.put("email", u.getEmail());
        out.put("phone", u.getPhone());
        out.put("address", u.getAddress());
        out.put("role", u.getRole());
        out.put("status", u.getStatus());
        return ResponseEntity.ok(out);
    }

    private Map<String,Object> admin() {
        Map<String,Object> a = new LinkedHashMap<>();
        a.put("login", true);
        a.put("id", "ADMIN-001");
        a.put("name", "Administrator");
        a.put("companyName", "TexHive");
        a.put("email", ADMIN_EMAIL);
        a.put("role", "ADMIN");
        a.put("status", "ACTIVE");
        return a;
    }
}
