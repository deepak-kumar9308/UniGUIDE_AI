package com.uniguideAI.service;

import com.uniguideAI.entity.AdmissionData;
import com.uniguideAI.repository.AdmissionDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdmissionDataService {

    private final AdmissionDataRepository admissionDataRepository;

    public List<AdmissionData> getAllAdmissionData() {
        return admissionDataRepository.findAll();
    }
}
