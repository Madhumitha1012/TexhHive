package com.texhive.api.controller;

import com.texhive.api.model.User;
import com.texhive.api.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private Map<String,Object> view(User u) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("name", u.getName());
        m.put("companyName", u.getCompanyName());
        m.put("email", u.getEmail());
        m.put("phone", u.getPhone());
        m.put("role", u.getRole());
        m.put("status", u.getStatus());
        m.put("address", u.getAddress());
        m.put("createdAt", u.getCreatedAt());
        return m;
    }

    @GetMapping
    public List<Map<String,Object>> all() {
        List<Map<String,Object>> result = new ArrayList<>();
        for (User u : userRepository.findAll()) result.add(view(u));
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> one(@PathVariable Long id) {
        return userRepository.findById(id)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(view(u)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message","User not found")));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message","Name, email and password are required"));
        }
        String email = user.getEmail().trim().toLowerCase();
        if ("admin@texhive.com".equals(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message","This email is reserved for the administrator."));
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message","Email already registered."));
        }
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isBlank()) user.setRole("BUYER");
        user.setRole(user.getRole().toUpperCase());
        if (user.getStatus() == null || user.getStatus().isBlank()) {
            user.setStatus("SUPPLIER".equals(user.getRole()) ? "PENDING" : "ACTIVE");
        }
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(view(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message","User not found"));
        User u = opt.get();
        if (body.containsKey("name")) u.setName((String) body.get("name"));
        if (body.containsKey("companyName")) u.setCompanyName((String) body.get("companyName"));
        if (body.containsKey("phone")) u.setPhone((String) body.get("phone"));
        if (body.containsKey("address")) u.setAddress((String) body.get("address"));
        User saved = userRepository.save(u);
        return ResponseEntity.ok(view(saved));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> status(@PathVariable Long id, @RequestBody Map<String,String> body) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message","User not found"));
        User u = opt.get();
        u.setStatus(body.getOrDefault("status","ACTIVE"));
        User saved = userRepository.save(u);
        return ResponseEntity.ok(view(saved));
    }
}
