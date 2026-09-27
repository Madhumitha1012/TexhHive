package com.texhive.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://texhive-delta.vercel.app"
})
public class TexHiveApplication {
    public static void main(String[] args) { SpringApplication.run(TexHiveApplication.class, args); }
}
