package com.tf2113.backend.controllers;

import com.tf2113.backend.domain.dto.ReadingDto;
import com.tf2113.backend.domain.entities.Reading;
import com.tf2113.backend.repositories.ReadingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://tombuilds.tech"}, allowCredentials = "true")
@RequestMapping("/readings")
public class ReadingController {

    private final ReadingRepository readingRepository;

    @Value("${ESP_API_KEY}")
    private String ESP_API_KEY;

    public ReadingController(ReadingRepository readingRepository) {
        this.readingRepository = readingRepository;
    }

    @PostMapping("/submitReading")
    public ResponseEntity<?> saveReading(
            @RequestBody Reading reading,
            @RequestHeader(value = "X-API-KEY", required = false) String apiKey) {

        if(apiKey == null || !apiKey.equals(ESP_API_KEY)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid API key");
        }

        if(reading.getTimestamp() == null){
            reading.setTimestamp(LocalDateTime.now());
        }

        Reading saved = readingRepository.save(reading);
        return ResponseEntity.ok(saved);
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

    @GetMapping("/readingsSince")
    public List<ReadingDto> getReadingsFromStart(@RequestParam("period") String period) {
        LocalDateTime start = calculateStartTime(period);
        return readingRepository.getReadingsFromStart(start);
    }

    @GetMapping("/monthlyReadings")
    public List<ReadingDto> getMonthlyReadings() {
        LocalDateTime start = calculateStartTime("month");
        List<ReadingDto> allReadings = readingRepository.getMonthlyReadings(start);

        int step = 5;
        List<ReadingDto> condensed = new ArrayList<>();
        for (int i = 0; i < allReadings.size(); i += step) {
            condensed.add(allReadings.get(i));
        }
        return condensed;
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