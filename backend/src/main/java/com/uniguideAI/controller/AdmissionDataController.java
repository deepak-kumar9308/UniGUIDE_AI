package com.uniguideAI.controller;

import com.uniguideAI.entity.AdmissionData;
import com.uniguideAI.service.AdmissionDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admission-data")
@RequiredArgsConstructor
public class AdmissionDataController {

    private final AdmissionDataService admissionDataService;

    @GetMapping
    public ResponseEntity<List<AdmissionData>> getAllAdmissionData() {
        return ResponseEntity.ok(admissionDataService.getAllAdmissionData());
    }
}
