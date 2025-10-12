package com.tf2113.backend.domain.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReadingDto(
        UUID id,
        Double temperature,
        Double humidity,
        Double pressure,
        LocalDateTime timestamp
){}

