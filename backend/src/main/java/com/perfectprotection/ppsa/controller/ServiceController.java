package com.perfectprotection.ppsa.controller;

import com.perfectprotection.ppsa.dto.ApiResponse;
import com.perfectprotection.ppsa.entity.Service;
import com.perfectprotection.ppsa.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public ResponseEntity<?> getAllServices(
            @RequestParam(required = false) String category) {
        List<Service> services;
        if (category != null && !category.equals("All")) {
            try {
                Service.Category cat = Service.Category.valueOf(category);
                services = serviceRepository.findByCategoryAndStatus(cat, Service.ServiceStatus.Active);
            } catch (Exception e) {
                services = serviceRepository.findByStatus(Service.ServiceStatus.Active);
            }
        } else {
            services = serviceRepository.findByStatus(Service.ServiceStatus.Active);
        }
        return ResponseEntity.ok(ApiResponse.ok(services));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getService(@PathVariable String id) {
        return serviceRepository.findById(id)
                .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createService(@RequestBody Service service) {
        long count = serviceRepository.count();
        if (service.getCategory() == Service.Category.Security) {
            service.setServiceId("SRV-" + (101 + count));
        } else {
            service.setServiceId("SRV-" + (201 + count));
        }
        return ResponseEntity.ok(ApiResponse.ok("Service created", serviceRepository.save(service)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateService(@PathVariable String id, @RequestBody Service updated) {
        return serviceRepository.findById(id).map(s -> {
            s.setServiceName(updated.getServiceName());
            s.setDescription(updated.getDescription());
            s.setResponsibilities(updated.getResponsibilities());
            s.setAvailableShifts(updated.getAvailableShifts());
            s.setMinimumStaff(updated.getMinimumStaff());
            s.setDurationOptions(updated.getDurationOptions());
            s.setStatus(updated.getStatus());
            return ResponseEntity.ok(ApiResponse.ok("Service updated", serviceRepository.save(s)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(@PathVariable String id) {
        if (!serviceRepository.existsById(id)) return ResponseEntity.notFound().build();
        serviceRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Service deleted", null));
    }
}
