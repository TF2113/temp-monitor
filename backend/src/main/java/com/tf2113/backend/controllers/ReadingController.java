package com.tf2113.backend.controllers;

import com.tf2113.backend.domain.entities.Reading;
import com.tf2113.backend.repositories.ReadingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://tombuilds.tech"}, allowCredentials = "true")
@RequestMapping("/readings")
public class ReadingController {

    private final ReadingRepository readingRepository;

    public ReadingController(ReadingRepository readingRepository) {
        this.readingRepository = readingRepository;
    }

    @PostMapping("/submitReading")
    public Reading saveReading(@RequestBody Reading reading){
        if(reading.getTimestamp() == null){
            reading.setTimestamp(LocalDateTime.now());
        }
        return readingRepository.save(reading);
    }

    @GetMapping("/recentReading")
    public ResponseEntity<Reading> getRecentReading() {
        return readingRepository.findFirstByOrderByTimestampDesc().map(ResponseEntity::ok).orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/averageTemp")
    public Double getAverageTemp(@RequestParam("period") String period) {
        LocalDateTime start = calculateStartTime(period);
        return readingRepository.findAverageTempSince(start);
    }

    @GetMapping("/averageHum")
    public Double getAverageHum(@RequestParam("period") String period) {
        LocalDateTime start = calculateStartTime(period);
        return readingRepository.findAverageHumSince(start);
    }

    @GetMapping("/averagePressure")
    public Double getAveragePressure(@RequestParam("period") String period) {
        LocalDateTime start = calculateStartTime(period);
        return readingRepository.findAveragePressureSince(start);
    }

    private LocalDateTime calculateStartTime(String period) {
        LocalDateTime now = LocalDateTime.now();
        return switch (period.toLowerCase()) {
            case "day" -> now.minusDays(1);
            case "week" -> now.minusDays(7);
            case "month" -> now.withDayOfMonth(1)
                    .withHour(0)
                    .withMinute(0)
                    .withSecond(0)
                    .withNano(0);
            default -> throw new IllegalArgumentException("Invalid period: " + period);
        };
    }
}