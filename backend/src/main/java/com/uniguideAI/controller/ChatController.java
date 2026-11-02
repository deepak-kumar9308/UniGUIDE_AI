package com.uniguideAI.controller;

import com.uniguideAI.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiService geminiService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        Long studentId = null;
        if (request.containsKey("studentId") && request.get("studentId") != null) {
            studentId = Long.valueOf(request.get("studentId").toString());
        }

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("reply", "Please provide a message."));
        }
        
        String reply = geminiService.getChatResponse(message, studentId);
        
        Map<String, String> response = new HashMap<>();
        response.put("reply", reply);
        return ResponseEntity.ok(response);
    }
}
